"""GPU-safe render launcher for the size journey. Run with the system Python from the run folder.

Every Blender GPU run goes through here: it takes an exclusive OS lock on renders/gpu.lock
(msvcrt.locking), so several agents queue on the single RTX 5080 instead of running out of VRAM.

  python scripts/render_shot.py --set phone --shot hold --preset review --out renders/hero/phone.png
  python scripts/render_shot.py --frames 110-116,238,239 --preset draft --out renders/review/f_####.png
  python scripts/render_shot.py --player --frames 30-450 --preset web --out renders/final/dark/player/f_####.png
  python scripts/render_shot.py --animatic --preset draft --out renders/anim/f_####.png --encode out.mp4
  python scripts/render_shot.py --set phone --shot hold --set-override phone=sets.phone_wip ...
  python scripts/render_shot.py --validate        (exterior validator, also takes the lock)

Options
  --frames LIST       e.g. "26,48,86-90" (story frames, 24 fps, 0..395)
  --player            --frames are player frames (the V4 videos, 30..450; see timeline.py)
  --set S --shot K    hero still: the journey camera at that set's shot (see HERO in journey.py:
                      phone hold|mini|seam, board hold|seam|slot, tunnel hold|mouth|end,
                      hall hold|port|server, ext hold|roof|max)
  --animatic          all 396 frames
  --preset P          draft | review | final | legacy (legacy = the old animatic settings)
  --look L            bible (default) | legacy
  --set-override k=m  load set k from module m (repeatable), e.g. phone=sets.phone_wip
  --theme T           dark (default) | light
  --res WxH           override the preset resolution
  --out PATH          output file; "####" is replaced by the frame number
  --encode MP4        after --animatic: H.264 yuv420p 24 fps from the written frames
  --lock-wait S       give up after S seconds waiting for the GPU (default: wait forever)
"""
import argparse
import msvcrt
import os
import subprocess
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
BLENDER = r"C:\Program Files\Blender Foundation\Blender 5.2\blender.exe"
FFMPEG = r"C:\ffmpeg\bin\ffmpeg.exe"
LOCK = os.path.join(ROOT, "renders", "gpu.lock")


class GpuLock:
    """Exclusive lock on one byte of renders/gpu.lock; released when the process exits."""

    def __init__(self, label, wait=None):
        self.label, self.wait, self.fh = label, wait, None

    def __enter__(self):
        os.makedirs(os.path.dirname(LOCK), exist_ok=True)
        self.fh = open(LOCK, "a+b")
        t0 = time.time()
        said = False
        while True:
            try:
                self.fh.seek(0)
                msvcrt.locking(self.fh.fileno(), msvcrt.LK_NBLCK, 1)
                break
            except OSError:
                if not said:
                    holder = ""
                    try:
                        holder = open(LOCK + ".info", encoding="utf-8").read().strip()
                    except OSError:
                        pass
                    print("GPU busy (%s) - queued: %s" % (holder or "unknown", self.label), flush=True)
                    said = True
                if self.wait is not None and time.time() - t0 > self.wait:
                    raise SystemExit("gave up waiting for the GPU lock")
                time.sleep(2.0)
        with open(LOCK + ".info", "w", encoding="utf-8") as fh:
            fh.write("pid %d since %s: %s" % (os.getpid(), time.strftime("%H:%M:%S"), self.label))
        print("GPU lock acquired after %.0fs: %s" % (time.time() - t0, self.label), flush=True)
        return self

    def __exit__(self, *exc):
        try:
            self.fh.seek(0)
            msvcrt.locking(self.fh.fileno(), msvcrt.LK_UNLCK, 1)
        finally:
            self.fh.close()


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--frames")
    p.add_argument("--set")
    p.add_argument("--shot", default="hold")
    p.add_argument("--animatic", action="store_true")
    p.add_argument("--player", action="store_true", help="--frames are player frames (timeline.py)")
    p.add_argument("--loop", type=int, help="idle loop of level 1..5 (camera at the level pose)")
    p.add_argument("--validate", action="store_true")
    p.add_argument("--preset", default="draft")
    p.add_argument("--look", default="bible")
    p.add_argument("--set-override", action="append", default=[])
    p.add_argument("--theme", default="dark")
    p.add_argument("--res")
    p.add_argument("--out")
    p.add_argument("--encode")
    p.add_argument("--lock-wait", type=float)
    a = p.parse_args()

    if a.validate:
        cmd = [BLENDER, "-b", "--factory-startup", "-P", os.path.join(HERE, "build_scene.py"), "--",
               "--theme", a.theme, "--validate", "--out", a.out or "renders/validate-campus.txt"]
        label = "validate"
    else:
        if not a.out:
            p.error("--out is required")
        mode = "hero" if a.set else ("animatic" if a.animatic else ("loop" if a.loop else
                                                                    ("player" if a.player else "frames")))
        if mode in ("frames", "player") and not a.frames:
            p.error("give --frames, --set/--shot or --animatic")
        cmd = [BLENDER, "-b", "--factory-startup", "-P", os.path.join(HERE, "journey.py"), "--",
               "--theme", a.theme, "--mode", mode, "--preset", a.preset, "--look", a.look,
               "--out", a.out]
        if a.preset == "legacy":
            cmd += ["--res", a.res or "960x720", "--samples", "24"]
        elif a.res:
            cmd += ["--res", a.res]
        if mode in ("frames", "player"):
            cmd += ["--frames", a.frames]
        if mode == "hero":
            cmd += ["--set", a.set, "--shot", a.shot]
        if mode == "loop":
            cmd += ["--level", str(a.loop)]
        for ov in a.set_override:
            cmd += ["--set-override", ov]
        label = "%s %s preset=%s out=%s" % (mode, a.frames or a.set or "", a.preset, a.out)
    with GpuLock(label, a.lock_wait):
        t0 = time.time()
        proc = subprocess.run(cmd, cwd=ROOT, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                              text=True, errors="replace")
        keep = [ln for ln in proc.stdout.splitlines()
                if any(k in ln for k in ("RENDER", "Error", "Traceback", "File \"", "LEVEL", "TOTAL",
                                         "VALIDATION", "Exception", "line "))]
        print("\n".join(keep))
        print("blender exit %d in %.1fs" % (proc.returncode, time.time() - t0), flush=True)
    if proc.returncode != 0 or "Traceback" in proc.stdout:
        sys.exit(1)
    if a.encode and a.animatic:
        pattern = a.out.replace("####", "%04d")
        subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-framerate", "24", "-start_number", "0",
                        "-i", pattern, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "17",
                        "-preset", "slow", "-movflags", "+faststart", a.encode], cwd=ROOT, check=True)
        print("encoded", a.encode)


if __name__ == "__main__":
    main()
