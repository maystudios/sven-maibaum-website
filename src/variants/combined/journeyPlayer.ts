import { SCENE_BASE, parseManifest, sceneUrl } from "./sceneManifest";
import type { SceneManifest, SceneTheme } from "./sceneManifest";

/**
 * Plays the size scene: one camera journey across scales.
 *
 * Moving up plays the forward video from the current position to the target
 * level time, moving down plays the reverse video (reverse time = duration -
 * forward time). Jumps over several levels raise the playback rate (at most
 * 2x) so a move stays under about 2.5 s; changing direction mid-move maps the
 * position onto the other video. On arrival the level's idle loop cross-fades
 * in. Stills paint first and are all that shows under reduced motion or when
 * the videos fail. Loops pause while the panel or the tab is hidden.
 *
 * Layers, bottom to top: still (back), still (front, for cross-fades),
 * forward video, reverse video, loop video.
 */

const FADE_MS = 280;
const MAX_RATE = 2;
const MAX_MOVE_SECONDS = 2.5;

export type JourneyElements = {
  stillBack: HTMLImageElement;
  stillFront: HTMLImageElement;
  forward: HTMLVideoElement;
  reverse: HTMLVideoElement;
  loop: HTMLVideoElement;
};

export type JourneyPlayerOptions = JourneyElements & {
  theme: SceneTheme;
  level: number;
  reduced: boolean;
  onReady: () => void;
  onError: (error: unknown) => void;
};

type Move = { dir: 1 | -1; target: number; level: number; running: boolean };

function setOpacity(el: HTMLElement, value: number, fade: boolean) {
  el.style.transition = fade ? `opacity ${FADE_MS}ms ease` : "none";
  el.style.opacity = String(value);
}

function waitFor(target: EventTarget, event: string) {
  return new Promise<void>((resolve) => target.addEventListener(event, () => resolve(), { once: true }));
}

export class JourneyPlayer {
  private readonly el: JourneyElements;
  private readonly options: JourneyPlayerOptions;
  private manifest: SceneManifest | null = null;
  private theme: SceneTheme;
  private level: number;
  private reduced: boolean;
  private panelVisible = false;
  private pos = 0;
  private move: Move | null = null;
  private token = 0;
  private sourceToken = 0;
  private raf = 0;
  private videosReady = false;
  private videosFailed = false;
  private loopLevel: number | null = null;
  private loopReady = false;
  private loopShown = false;
  private stillToken = 0;
  private readonly stillCache = new Map<string, HTMLImageElement>();
  private ready = false;
  private disposed = false;
  private readonly cleanups: (() => void)[] = [];

  constructor(options: JourneyPlayerOptions) {
    this.options = options;
    this.el = options;
    this.theme = options.theme;
    this.level = options.level;
    this.reduced = options.reduced;
    for (const video of [options.forward, options.reverse, options.loop]) {
      video.muted = true;
      video.playsInline = true;
      setOpacity(video, 0, false);
    }
    setOpacity(options.stillFront, 0, false);
    this.listen(document, "visibilitychange", () => this.updatePlayback());
    this.listen(options.loop, "canplay", () => {
      this.loopReady = true;
      this.updatePlayback();
    });
    for (const video of [options.forward, options.reverse, options.loop]) {
      this.listen(video, "error", () => this.handleVideoError(video));
    }
  }

  // ── Public API ──────────────────────────────────────────────────────────

  async start() {
    try {
      const res = await fetch(`${SCENE_BASE}manifest.json`, { cache: "no-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${SCENE_BASE}manifest.json`);
      const manifest = parseManifest(await res.json());
      if (this.disposed) return;
      this.manifest = manifest;
      this.pos = this.levelTime(this.level);
      await this.showStill(this.level, false);
      if (this.disposed) return;
      this.ready = true;
      this.options.onReady();
      this.preloadStills();
      this.loadVideos();
    } catch (error) {
      if (!this.disposed) this.options.onError(error);
    }
  }

  setLevel(next: number) {
    const level = Math.min(5, Math.max(1, Math.round(next)));
    if (level === this.level && !this.move) return;
    this.level = level;
    if (!this.manifest || !this.ready) return;
    const target = this.levelTime(level);

    if (this.reduced || !this.videosReady || this.videosFailed) {
      this.pos = target;
      void this.showStill(level, !this.reduced);
      return;
    }

    const current = this.currentPosition();
    if (Math.abs(target - current) < 0.5 / this.manifest.fps) {
      this.cancelMove();
      this.arrive(level);
      return;
    }
    const dir: 1 | -1 = target > current ? 1 : -1;
    const rate = Math.min(MAX_RATE, Math.max(1, Math.abs(target - current) / MAX_MOVE_SECONDS));
    if (this.move && this.move.dir === dir) {
      // Same direction: retarget the running move
      this.move.target = target;
      this.move.level = level;
      this.video(dir).playbackRate = rate;
      return;
    }
    void this.startMove(dir, current, target, level, rate);
  }

  setTheme(theme: SceneTheme) {
    if (theme === this.theme) return;
    this.theme = theme;
    if (!this.manifest || !this.ready) return;
    this.cancelMove();
    this.pos = this.levelTime(this.level);
    // Old-theme video frames must not stay on screen
    for (const video of [this.el.forward, this.el.reverse, this.el.loop]) {
      video.pause();
      setOpacity(video, 0, false);
    }
    this.loopShown = false;
    this.loopLevel = null;
    this.loopReady = false;
    void this.showStill(this.level, !this.reduced);
    this.preloadStills();
    this.loadVideos();
  }

  setReducedMotion(reduced: boolean) {
    if (reduced === this.reduced) return;
    this.reduced = reduced;
    if (!this.manifest || !this.ready) return;
    if (reduced) {
      this.cancelMove();
      for (const video of [this.el.forward, this.el.reverse, this.el.loop]) {
        video.pause();
        setOpacity(video, 0, false);
      }
      this.loopShown = false;
      this.pos = this.levelTime(this.level);
      void this.showStill(this.level, false);
    } else {
      this.loadVideos();
    }
  }

  setPanelVisible(visible: boolean) {
    this.panelVisible = visible;
    this.updatePlayback();
  }

  dispose() {
    this.disposed = true;
    this.token++;
    cancelAnimationFrame(this.raf);
    this.cleanups.forEach((cleanup) => cleanup());
    for (const video of [this.el.forward, this.el.reverse, this.el.loop]) {
      video.pause();
      video.removeAttribute("src");
      video.load();
    }
  }

  // ── Helpers ─────────────────────────────────────────────────────────────

  private listen(target: EventTarget, event: string, handler: () => void) {
    target.addEventListener(event, handler);
    this.cleanups.push(() => target.removeEventListener(event, handler));
  }

  private levelTime(level: number) {
    return this.manifest!.journey.levelTimes[level - 1];
  }

  private video(dir: 1 | -1) {
    return dir > 0 ? this.el.forward : this.el.reverse;
  }

  /** Position on the forward timeline, wherever the picture currently comes from. */
  private currentPosition() {
    if (this.move?.running) {
      const video = this.video(this.move.dir);
      return this.move.dir > 0 ? video.currentTime : this.manifest!.journey.duration - video.currentTime;
    }
    return this.pos;
  }

  private canAnimate() {
    return !this.reduced && this.panelVisible && document.visibilityState === "visible";
  }

  private handleVideoError(video: HTMLVideoElement) {
    if (!video.getAttribute("src") || this.disposed) return;
    if (video === this.el.loop) {
      console.error(`Size scene: loop of level ${this.loopLevel} could not be played; showing the still.`, video.error);
      this.loopReady = false;
      return;
    }
    if (!this.videosFailed) {
      console.error("Size scene: journey video could not be played; levels cross-fade between stills.", video.error);
    }
    this.videosFailed = true;
    this.cancelMove();
    setOpacity(this.el.forward, 0, false);
    setOpacity(this.el.reverse, 0, false);
    this.pos = this.levelTime(this.level);
    void this.showStill(this.level, false);
  }

  // ── Stills ──────────────────────────────────────────────────────────────

  private stillUrl(level: number) {
    return sceneUrl(this.manifest!.stills.pattern, this.theme, level);
  }

  private preloadStills() {
    for (let level = 1; level <= 5; level++) {
      const url = this.stillUrl(level);
      if (this.stillCache.has(url)) continue;
      const img = new Image();
      img.src = url;
      this.stillCache.set(url, img);
    }
  }

  /** Shows a level still on the back layer, optionally cross-fading via the front layer. */
  private async showStill(level: number, fade: boolean) {
    const url = this.stillUrl(level);
    const token = ++this.stillToken;
    const { stillBack, stillFront } = this.el;
    try {
      const probe = this.stillCache.get(url) ?? new Image();
      if (!probe.src) probe.src = url;
      this.stillCache.set(url, probe);
      await probe.decode();
    } catch (error) {
      console.error(`Size scene: still of level ${level} (${this.theme}) could not be loaded.`, error);
    }
    if (token !== this.stillToken || this.disposed) return;
    if (!fade) {
      stillBack.src = url;
      setOpacity(stillFront, 0, false);
      return;
    }
    stillFront.src = url;
    setOpacity(stillFront, 0, false);
    // Next frame, so the transition starts from 0
    requestAnimationFrame(() => {
      if (token !== this.stillToken) return;
      setOpacity(stillFront, 1, true);
      window.setTimeout(() => {
        if (token !== this.stillToken) return;
        stillBack.src = url;
        setOpacity(stillFront, 0, false);
      }, FADE_MS + 40);
    });
  }

  // ── Videos ──────────────────────────────────────────────────────────────

  private loadVideos() {
    if (this.reduced || !this.manifest) return;
    const { forward, reverse } = this.el;
    const journey = this.manifest.journey;
    const forwardUrl = sceneUrl(journey.forward, this.theme);
    const reverseUrl = sceneUrl(journey.reverse, this.theme);
    this.videosFailed = false;
    if (forward.getAttribute("src") !== forwardUrl) {
      this.videosReady = false;
      forward.preload = "auto";
      reverse.preload = "auto";
      forward.src = forwardUrl;
      reverse.src = reverseUrl;
      const sourceToken = ++this.sourceToken;
      Promise.all([waitFor(forward, "canplay"), waitFor(reverse, "canplay")]).then(() => {
        if (this.disposed || sourceToken !== this.sourceToken) return;
        this.videosReady = true;
        // Park the forward video on the current level, so the first move starts from there
        forward.currentTime = this.pos;
      });
    }
    this.prepareLoop(this.level);
  }

  private prepareLoop(level: number) {
    if (this.reduced || !this.manifest || this.loopLevel === level) return;
    const { loop } = this.el;
    this.loopLevel = level;
    this.loopReady = false;
    loop.pause();
    setOpacity(loop, 0, false);
    this.loopShown = false;
    loop.loop = true;
    loop.preload = "auto";
    loop.src = sceneUrl(this.manifest.loops.pattern, this.theme, level);
  }

  private seekTo(video: HTMLVideoElement, time: number) {
    if (Math.abs(video.currentTime - time) < 0.5 / this.manifest!.fps && video.readyState >= 2) return Promise.resolve();
    const seeked = waitFor(video, "seeked");
    video.currentTime = time;
    return seeked;
  }

  private cancelMove() {
    this.token++;
    cancelAnimationFrame(this.raf);
    if (this.move) {
      this.pos = this.currentPosition();
      this.video(this.move.dir).pause();
      this.move = null;
    }
  }

  private async startMove(dir: 1 | -1, from: number, target: number, level: number, rate: number) {
    this.cancelMove();
    const token = this.token;
    const duration = this.manifest!.journey.duration;
    const video = this.video(dir);
    const other = this.video(dir > 0 ? -1 : 1);
    const move: Move = { dir, target, level, running: false };
    this.move = move;
    this.pos = from;
    await this.seekTo(video, dir > 0 ? from : duration - from);
    if (token !== this.token || this.disposed) return;
    // The journey frame now matches what is on screen: show it, then let the loop go
    setOpacity(video, 1, false);
    setOpacity(other, 0, false);
    other.pause();
    // Fade the idle loop out, then point the loop element at the target level
    // so it is buffered by the time the move arrives
    if (this.loopShown) {
      setOpacity(this.el.loop, 0, true);
      this.loopShown = false;
      window.setTimeout(() => {
        if (this.loopShown || this.disposed) return;
        this.el.loop.pause();
        if (this.move) this.prepareLoop(this.move.level);
      }, FADE_MS + 40);
    } else {
      this.prepareLoop(level);
    }
    video.playbackRate = rate;
    move.running = true;
    try {
      await video.play();
    } catch (error) {
      if (token === this.token) this.handleVideoError(video);
      console.error("Size scene: journey playback was blocked.", error);
      return;
    }
    this.tick(token);
  }

  private tick(token: number) {
    const step = () => {
      const move = this.move;
      if (!move || token !== this.token || this.disposed) return;
      const video = this.video(move.dir);
      const duration = this.manifest!.journey.duration;
      const position = move.dir > 0 ? video.currentTime : duration - video.currentTime;
      this.pos = position;
      const frame = 1 / this.manifest!.fps;
      if ((move.target - position) * move.dir <= frame * video.playbackRate * 0.75 || video.ended) {
        video.pause();
        video.currentTime = move.dir > 0 ? move.target : duration - move.target;
        this.pos = move.target;
        this.move = null;
        this.arrive(move.level);
        return;
      }
      this.raf = requestAnimationFrame(step);
    };
    this.raf = requestAnimationFrame(step);
  }

  /** At a level: keep its still underneath and fade its loop in when possible. */
  private arrive(level: number) {
    void this.showStill(level, false);
    this.prepareLoop(level);
    this.updatePlayback();
  }

  /** Starts, pauses or resumes video according to visibility and state. */
  private updatePlayback() {
    if (this.disposed || !this.manifest) return;
    const { loop } = this.el;
    const animate = this.canAnimate();
    if (this.move) {
      const video = this.video(this.move.dir);
      if (!animate && this.move.running) {
        video.pause();
        cancelAnimationFrame(this.raf);
      } else if (animate && this.move.running && video.paused) {
        video.play().catch(() => undefined);
        this.tick(this.token);
      }
      return;
    }
    if (!animate) {
      loop.pause();
      return;
    }
    if (this.loopLevel !== this.level || !this.loopReady) return;
    if (this.loopShown) {
      if (loop.paused) loop.play().catch(() => undefined);
      return;
    }
    loop.currentTime = 0;
    loop
      .play()
      .then(() => {
        if (this.move || this.loopLevel !== this.level || this.disposed) return;
        setOpacity(loop, 1, true);
        this.loopShown = true;
        // Once the loop covers them, the journey layers can go
        window.setTimeout(() => {
          if (!this.loopShown) return;
          setOpacity(this.el.forward, 0, false);
          setOpacity(this.el.reverse, 0, false);
        }, FADE_MS + 40);
      })
      .catch(() => undefined);
  }
}
