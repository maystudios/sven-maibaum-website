"""Encode the rendered finals for the V4 size-scene player (system Python + ffmpeg).

  python scripts/encode_v4.py --theme dark --journey renders/final/dark/journey \
      --loops renders/final/dark/loop --out <worktree>/public/assets/size-scene

Inputs (written by render_shot.py):
  <journey>/f_0030.png ... f_0450.png     player frames (render_shot.py --player), 1280x960 (web)
  <loops>L/f_<TL-8>.png ... f_<TL+29>.png idle loop of level L (camera frozen at the level pose;
                                          TL = the level's story frame)
Outputs per theme (<out>/<theme>/):
  journey-fwd.mp4 / journey-rev.mp4   H.264 yuv420p 1280x960 24 fps, faststart, keyframes forced at
                                      every level time (and the mirrored times in reverse); player
                                      frames 30..450 (timeline.py)
  loop-1..5.mp4                       30 frames; the last 8 crossfade into the pre-roll so the wrap is
                                      seamless; frame 0 == the journey's level frame (same PNG)
  level-1..5.avif                     the level frame as a still (10-bit AV1)
and <out>/manifest.json (version 2) when --manifest is given.
"""
import argparse
import json
import os
import shutil
import subprocess
import tempfile

from timeline import END, FPS, LEVELS, START, STORY_LEVELS, story

FF = r"C:\ffmpeg\bin\ffmpeg.exe"
LOOP_N, LOOP_K = 30, 8
# seam 2c (review N1), story frames: soften the port edge on the first hall frames like the tunnel's 160
# dark also lifts the midtones of the first hall frames: the closer port camera (N1 growth fix)
# shows darker rack fronts than the tunnel's exit disc (measured: disc mean 0.65 -> 0.95)
POST = {"dark": {161: "gblur=sigma=5,eq=gamma=1.75", 162: "gblur=sigma=2.5,eq=gamma=1.3"},
        "light": {161: "gblur=sigma=5", 162: "gblur=sigma=2.5"}}


def run(cmd):
    subprocess.run([FF, "-y", "-loglevel", "error"] + cmd, check=True)


def h264(seq_pattern, n, out, keytimes, gop):
    run(["-framerate", str(FPS), "-i", seq_pattern, "-frames:v", str(n), "-c:v", "libx264",
         "-pix_fmt", "yuv420p", "-crf", "20", "-preset", "slow", "-g", str(gop),
         "-force_key_frames", ",".join("%.4f" % k for k in keytimes),
         "-movflags", "+faststart", out])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--theme", required=True)
    ap.add_argument("--journey", required=True)
    ap.add_argument("--loops", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--manifest", action="store_true")
    ap.add_argument("--themes", default="dark", help="themes listed in manifest.json (comma-separated)")
    a = ap.parse_args()
    dst = os.path.join(a.out, a.theme)
    os.makedirs(dst, exist_ok=True)
    tmp = tempfile.mkdtemp(prefix="v4enc_")
    # ---- journey: level frames come from the loop renders (exact equality with loop frame 0);
    # the journey folder holds player frames, the loop folders story frames
    seq = []
    for f in range(START, END + 1):
        lv = next((k for k, v in LEVELS.items() if v == f), None)
        src = os.path.join(a.loops + str(lv), "f_%04d.png" % STORY_LEVELS[lv]) if lv else \
            os.path.join(a.journey, "f_%04d.png" % f)
        if not os.path.exists(src):
            raise SystemExit("missing %s" % src)
        seq.append(src)
    n = len(seq)
    fw, rv = os.path.join(tmp, "fwd"), os.path.join(tmp, "rev")
    os.makedirs(fw)
    os.makedirs(rv)
    for i, src in enumerate(seq):
        s = story(START + i)
        dst_f = os.path.join(fw, "%04d.png" % i)
        post = POST.get(a.theme, {})
        if s in post:
            run(["-i", src, "-vf", post[s], "-frames:v", "1", dst_f])
        else:
            shutil.copyfile(src, dst_f)
        shutil.copyfile(dst_f, os.path.join(rv, "%04d.png" % (n - 1 - i)))
    level_times = [(LEVELS[k] - START) / FPS for k in sorted(LEVELS)]
    duration = n / FPS
    h264(os.path.join(fw, "%04d.png"), n, os.path.join(dst, "journey-fwd.mp4"), level_times, 48)
    rev_times = sorted((n - 1) / FPS - t for t in level_times)
    h264(os.path.join(rv, "%04d.png"), n, os.path.join(dst, "journey-rev.mp4"), rev_times, 48)
    # ---- loops: frames TL..TL+N-1; the tail crossfades into TL-K..TL-1 so frame N-1 -> 0 is seamless
    for lv, tl in sorted(STORY_LEVELS.items()):
        ld = os.path.join(tmp, "loop%d" % lv)
        os.makedirs(ld)
        src = lambda f: os.path.join(a.loops + str(lv), "f_%04d.png" % f)  # noqa: E731
        for j in range(LOOP_N):
            o = os.path.join(ld, "%04d.png" % j)
            if j < LOOP_N - LOOP_K:
                shutil.copyfile(src(tl + j), o)
            else:
                w = (j - (LOOP_N - LOOP_K) + 1) / (LOOP_K + 1.0)
                run(["-i", src(tl + j), "-i", src(tl + j - LOOP_N), "-filter_complex",
                     "blend=all_expr='A*(1-%.4f)+B*%.4f'" % (w, w), "-frames:v", "1", o])
        h264(os.path.join(ld, "%04d.png"), LOOP_N, os.path.join(dst, "loop-%d.mp4" % lv), [0.0], LOOP_N)
        # still = the level frame
        run(["-i", src(tl), "-c:v", "libaom-av1", "-still-picture", "1", "-crf", "24", "-cpu-used", "4",
             "-pix_fmt", "yuv420p10le", os.path.join(dst, "level-%d.avif" % lv)])
    shutil.rmtree(tmp, ignore_errors=True)
    if a.manifest:
        man = {"version": 2, "width": 1280, "height": 960, "fps": FPS, "themes": a.themes.split(","),
               "journey": {"forward": "{theme}/journey-fwd.mp4", "reverse": "{theme}/journey-rev.mp4",
                           "levelTimes": [round(t, 4) for t in level_times],
                           "duration": round(duration, 4)},
               "loops": {"pattern": "{theme}/loop-{level}.mp4"},
               "stills": {"pattern": "{theme}/level-{level}.avif"}}
        with open(os.path.join(a.out, "manifest.json"), "w", encoding="utf-8") as fh:
            json.dump(man, fh, separators=(",", ":"))
            fh.write("\n")
    for fn in sorted(os.listdir(dst)):
        print("SIZE %s/%-16s %8.1f KB" % (a.theme, fn, os.path.getsize(os.path.join(dst, fn)) / 1024))
    print("levelTimes", [round(t, 4) for t in level_times], "duration", round(duration, 4))


if __name__ == "__main__":
    main()
