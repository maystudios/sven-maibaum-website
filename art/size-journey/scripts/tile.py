"""Tile images into a grid with an optional label strip under each cell (outside the image).

Usage: python tile.py <out.png> <cols> <cellW>x<cellH> [--labels "a|b|c"] img1 img2 ...
"""
import subprocess
import sys

FF = r"C:\ffmpeg\bin\ffmpeg.exe"
FONT = "C\\:/Windows/Fonts/segoeui.ttf"
out, cols, cell = sys.argv[1], int(sys.argv[2]), sys.argv[3]
rest = sys.argv[4:]
labels = None
if rest and rest[0] == "--labels":
    labels = rest[1].split("|")
    rest = rest[2:]
w, h = (int(v) for v in cell.split("x"))
lab_h = 34 if labels else 0
gap = 6
n = len(rest)
rows = (n + cols - 1) // cols
cmd = [FF, "-y", "-loglevel", "error"]
for p in rest:
    cmd += ["-i", p]
parts = []
for i in range(n):
    f = "[%d:v]scale=%d:%d,pad=%d:%d:0:0:color=0x0b0c0f" % (i, w, h, w + gap, h + lab_h + gap)
    if labels:
        txt = labels[i].replace(":", "\\:").replace("'", "")
        f += (",drawtext=fontfile='%s':text='%s':fontcolor=0xd8dce4:fontsize=17:x=8:y=%d"
              % (FONT, txt, h + 8))
    parts.append(f + "[c%d]" % i)
layout = "|".join("%d_%d" % ((i % cols) * (w + gap), (i // cols) * (h + lab_h + gap)) for i in range(n))
filt = ";".join(parts) + ";" + "".join("[c%d]" % i for i in range(n))
filt += "xstack=inputs=%d:layout=%s:fill=0x0b0c0f" % (n, layout) if n > 1 else "copy"
cmd += ["-filter_complex", filt, "-frames:v", "1", out]
subprocess.run(cmd, check=True)
print("wrote", out)
