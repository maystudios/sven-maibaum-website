"""Seam metrics from two rendered frames (system Python + ffmpeg, no extra packages).

  python scripts/measure_seam.py 2b renders/x/f_0142.png renders/x/f_0143.png
  python scripts/measure_seam.py 2c renders/x/f_0160.png renders/x/f_0161.png

2b: the pulse blob (pixels above 0.85 of max luma): area-equivalent diameter, centroid offset
    from frame centre, and the mean luma of the frame outside the blob (darkness match).
2c: the dark disc inside the whiteout: diameter along the centre row/column (luma below the
    midpoint between disc centre and the bright rim) and the mean luma of the disc centre.
"""
import subprocess
import sys

FF = r"C:\ffmpeg\bin\ffmpeg.exe"
FP = r"C:\ffmpeg\bin\ffprobe.exe"


def gray(path):
    wh = subprocess.run([FP, "-v", "error", "-select_streams", "v:0", "-show_entries",
                         "stream=width,height", "-of", "csv=p=0", path],
                        capture_output=True, text=True).stdout.strip().split(",")
    w, h = int(wh[0]), int(wh[1])
    raw = subprocess.run([FF, "-v", "error", "-i", path, "-f", "rawvideo", "-pix_fmt", "gray", "-"],
                         capture_output=True).stdout
    return w, h, raw


def m2b(path):
    w, h, px = gray(path)
    mx = max(px)
    thr = 0.85 * mx
    n = sx = sy = 0
    rest = rn = 0
    for y in range(h):
        row = px[y * w:(y + 1) * w]
        for x, v in enumerate(row):
            if v >= thr:
                n += 1
                sx += x
                sy += y
            else:
                rest += v
                rn += 1
    d = 2 * (n / 3.14159) ** 0.5
    return dict(diam_px=d, diam_rel=d / h, off_x=(sx / max(n, 1) - w / 2) / h,
                off_y=(sy / max(n, 1) - h / 2) / h, bg_mean=rest / max(rn, 1))


def m2c(path):
    w, h, px = gray(path)
    cy, cx = h // 2, w // 2
    centre = sum(px[(cy + dy) * w + cx + dx] for dy in range(-6, 7) for dx in range(-6, 7)) / 169.0
    rim = max(px)
    mid = (centre + rim) / 2.0
    row = px[cy * w:(cy + 1) * w]
    xs = [x for x, v in enumerate(row) if v < mid]
    col = [px[y * w + cx] for y in range(h)]
    ys = [y for y, v in enumerate(col) if v < mid]
    dx = (max(xs) - min(xs) + 1) if xs else 0
    dy = (max(ys) - min(ys) + 1) if ys else 0
    # tone: mean luma inside a radius of 0.25 frame heights (the disc interior)
    r2 = (0.25 * h) ** 2
    vals = [px[y * w + x] for y in range(cy - h // 4, cy + h // 4) for x in range(cx - h // 4, cx + h // 4)
            if (x - cx) ** 2 + (y - cy) ** 2 <= r2]
    # size: radius where the azimuthal mean luma first exceeds 0.6 of the rim (robust to features)
    import math
    prof = []
    for k in range(0, h // 2):
        ring = [px[int(cy + k * math.sin(a)) * w + int(cx + k * math.cos(a))]
                for a in [i * 2 * math.pi / 64 for i in range(64)]
                if 0 <= int(cy + k * math.sin(a)) < h and 0 <= int(cx + k * math.cos(a)) < w]
        prof.append(sum(ring) / len(ring))
    rr = next((k for k, v in enumerate(prof) if v > 0.6 * rim + 0.4 * (sum(vals) / len(vals))), h // 2)
    return dict(disc_diam_rel=2.0 * rr / h, disc_mean=sum(vals) / len(vals), centre_luma=centre,
                rim_luma=rim)


if __name__ == "__main__":
    kind, a, b = sys.argv[1], sys.argv[2], sys.argv[3]
    f = m2b if kind == "2b" else m2c
    ra, rb = f(a), f(b)
    for k in ra:
        va, vb = ra[k], rb[k]
        rel = (vb / va) if va else float("nan")
        print("%s %-12s A %9.4f   B %9.4f   B/A %.3f" % (kind, k, va, vb, rel))
