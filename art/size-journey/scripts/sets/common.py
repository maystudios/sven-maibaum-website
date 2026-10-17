"""Shared helpers for the size-journey sets (owned by the lead, see POLISH.md).

Every set lives at its own world position and scale; the seams between them:

  code card on the phone screen  ==  SoC package top on the board      (same bar layout, x4)
  USB-C rear slot (dark, pulse)  ==  fibre tunnel mouth (dark, pulse)
  ferrule bore at tunnel end     ==  patch-panel port bore in the hall  (same r : distance)
  server fan modules (1/30)      ==  HA1 rooftop chillers               (same layout, x30)
"""
import math
import random

import bpy
from mathutils import Matrix, Vector

import build_scene as BS
from build_scene import MB

P0 = Vector((-5000.0, 0.0, 0.0))      # phone set (units = 10 cm: phone 0.76 x 1.56)
B0 = Vector((-5000.0, 3000.0, 0.0))   # board set (x4 the phone screen scale)
T0 = Vector((-5000.0, 6000.0, 0.0))   # fibre tunnel
H0 = Vector((-5000.0, 9000.0, 0.0))   # data hall (metres)
SETS = {}


def new_coll(name):
    c = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(c)
    BS.COLL = c
    SETS[name] = c
    return c


def add_mat(name, color, rough, emit=None, strength=0.0):
    m = BS.principled(name, color, rough, emit=emit, strength=strength)
    BS.MATS.append(m)
    BS.M[name] = len(BS.MATS) - 1
    return m


def materials():
    add_mat("screen", (0.004, 0.005, 0.008), 0.12)
    add_mat("copper", (0.12, 0.12, 0.13), 0.35)
    add_mat("lamp", (1, 1, 1), 0.5, emit=(0.9, 0.95, 1.0), strength=6.0)
    add_mat("bore", (1, 1, 1), 0.5, emit=(0.75, 0.85, 1.0), strength=14.0)
    add_mat("haze", (0.0, 0.0, 0.0), 0.9, emit=(0.55, 0.6, 0.7), strength=0.45)
    for n in ("svc_api", "svc_db", "svc_q"):
        add_mat(n, (0.01, 0.03, 0.12), 0.3, emit=BS.BLUE, strength=4.0)


def ob_place(mb, name, loc=(0, 0, 0), rot=0.0, bevel=0.0, cat="set", **meta):
    return BS.place(mb.mesh(name), name, tuple(loc), rot, 1.0, bevel, cat=cat, **meta)


def tube_curve(name, pts, r, mat):
    return BS.curve(name, pts, r, mat, cat="set")


def catmull(ctrl, n=10):
    pts = []
    c = [ctrl[0]] + ctrl + [ctrl[-1]]
    for i in range(1, len(c) - 2):
        p0, p1, p2, p3 = (Vector(v) for v in c[i - 1:i + 3])
        for k in range(n):
            t = k / n
            pts.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t +
                              (-p0 + 3 * p1 - 3 * p2 + p3) * t ** 3))
    pts.append(Vector(ctrl[-1]))
    return pts


# --------------------------------------------------------------------------- code card layout
# Abstract code (seam-2a contract, lead): per line a list of (x0, x1, material) in card-normalised
# coords. Fixed table (phone fix pass, approved 2026-10-17): the mass reaches x 0.74 on the middle
# and lower lines, one blue token next to the caret (line 7 -> lower-right third).
CODE_TABLE = [
    [(.10, .22), (.245, .44)],
    [(.17, .39), (.415, .52)],
    [(.24, .40), (.425, .66)],
    [(.24, .47), (.495, .60)],
    [(.17, .42), (.445, .74)],
    [(.24, .46), (.485, .62)],
    [(.31, .50), (.525, .60), (.625, .74, "line")],
    [(.31, .47), (.495, .64)],
    [(.24, .45), (.475, .58)],
    [(.17, .38)],
]


def code_lines():
    return [[(sg[0], sg[1], sg[2] if len(sg) > 2 else "mark") for sg in ln] for ln in CODE_TABLE]


# card materials (seam 2a: phone tile == SoC package, gutter on both): darker card, brighter bars
CARD_TILE, CARD_GUTTER = "clay2", "clay"


CODE = code_lines()
CARD_W, CARD_H = 0.62, 0.40
CURSOR_LINE = 7


def line_y(i):
    return 0.88 - i * 0.082


def card_bars(mb, cx, cy, ztop, s, lines=None, gutter=True, cursor=True, bar_h=0.032, rise=0.0012):
    """Adds the code bars of the card (scale s: card W*s x H*s) to mb, centred at (cx, cy)."""
    W, H = CARD_W * s, CARD_H * s
    x0, y0 = cx - W / 2, cy - H / 2
    for i, segs in enumerate(CODE if lines is None else lines):
        yc = y0 + line_y(i) * H
        for (a, b, mat) in segs:
            mb.box(x0 + a * W, yc - bar_h * H / 2, ztop, x0 + b * W, yc + bar_h * H / 2,
                   ztop + rise * s, mat)
        if gutter:
            mb.box(x0 + 0.035 * W, yc - bar_h * H / 2, ztop, x0 + 0.06 * W, yc + bar_h * H / 2,
                   ztop + rise * s, CARD_GUTTER)
    if cursor:
        segs = CODE[CURSOR_LINE]
        xe = segs[-1][1] + 0.02
        yc = y0 + line_y(CURSOR_LINE) * H
        mb.box(x0 + xe * W, yc - 0.045 * H, ztop, x0 + (xe + 0.025) * W, yc + 0.045 * H,
               ztop + rise * s * 1.2, "line")


# --------------------------------------------------------------------------- animation helpers
def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def smooth(u):
    u = clamp(u)
    return u * u * (3 - 2 * u)


def lerp(a, b, u):
    return a + (b - a) * u


EMIT0 = {}


def emit(mat_name, k):
    """Scale a material's emission strength relative to its build-time value."""
    m = bpy.data.materials[mat_name]
    b = m.node_tree.nodes.get("Principled BSDF")
    if mat_name not in EMIT0:
        EMIT0[mat_name] = b.inputs["Emission Strength"].default_value
    b.inputs["Emission Strength"].default_value = EMIT0[mat_name] * k


def window(ob, head, L=0.12):
    """Light window [head-L, head] on a curve via its bevel factors (pulses with a trail)."""
    ob.data.bevel_factor_start = clamp(head - L, 0.0, 0.999)
    ob.data.bevel_factor_end = clamp(head, 0.001, 1.0)
    ob.hide_render = head <= 0.0 or head - L >= 1.0
