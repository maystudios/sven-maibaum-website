"""Board set (Klein -> Mittel, part 2). Owner: board agent. Seam contracts: 2a, 2b.

Film-grade pass. A phone mainboard at macro scale (1 unit ~ 5 mm), laid out 'north-up' so the
dive after seam 2a is a pure pitch forward:
  - solder-mask PCB with orange-peel micro-texture, rounded outline, mounting holes, fiducials;
  - copper routed with 45-degree bends, pad to pad; stitching and field vias;
  - tinned pads with a solder fillet on every pad (BGA pads carry their balls);
  - non-readable silkscreen (corner brackets, pin-1 marks, abstract bar glyphs);
  - two shielding cans (fence on a pad ring, vented lid), BGA SoC on its substrate with the
    code-card marks (seam 2a), two RAM packages, a QFN PMIC, small ICs (SOT, TSSOP, QFN),
    rows of chip passives, electrolytics, molded inductors, a crystal, test pads and a
    board-to-board connector;
  - a stadium USB-C receptacle (shell, insulator with the pin slot, tongue with contacts, rear
    legs, shell legs) with the plug, overmold, strain relief and cable inserted (seam 2b).
The pulse leaves the SoC on the hero trace (x = 0), lights the copper behind it (a decaying
glow), drags a tapered trail, climbs the receptacle leg and enters the slot above the tongue.
check(D) lists physical-logic violations; it must return [].
"""
import math
import random

import bmesh
import bpy
from mathutils import Matrix, Vector

import build_scene as BS
from build_scene import MB
from sets.common import (B0, new_coll, ob_place, CARD_W, CARD_H, card_bars, clamp, smooth, lerp,
                         window)

# --------------------------------------------------------------------------- constants
BD = {}
S_BOARD = 4.0            # board scale relative to the phone screen: code card 0.62 -> SoC 2.48
TOP = 0.12               # board top (solder mask)
PAD_T = 0.012            # tinned pads 0.120 -> 0.132
PAD_TOP = TOP + PAD_T
TR_TOP = TOP + 0.010     # copper traces 0.120 -> 0.130 (pads stand 2 microns proud: no z-fight)
SOC = Vector((0.0, -1.4))
SOC_W, SOC_H = CARD_W * S_BOARD, CARD_H * S_BOARD
SUB = (-SOC_W / 2 - 0.12, SOC.y - SOC_H / 2 - 0.12, SOC_W / 2 + 0.12, SOC.y + SOC_H / 2 + 0.12)
SOC_TOP = 0.42           # contract 2a
PCB = (-3.7, -4.0, 3.7, 5.25)
CORR = 0.5               # contract 2b: |x| < 0.5 between SoC and USB-C stays free of tall parts
Y_SLOT, ZC = 4.45, TOP + 0.17     # contract 2b: rear plate centre (0, 4.45, 0.29)
SLOT_X, SLOT_Z = 0.30, 0.07
A0, A1 = SUB[3], Y_SLOT  # trace_a0 / trace_a1
PULSE_R = 0.035          # contract 2b
PULSE_END = 0.215        # contract 2b (lead integration 2026-10-17: was 0.16; equal angular size to frame 143 with the level camera, see POLISH.md) (see POLISH.md, contract request: 0.24 matches the tunnel)
BALL = 0.075             # BGA pitch
GLOW_DECAY, GLOW_LEAD, GLOW_FLOOR = 0.42, 0.015, 0.05
GLOW_GAIN = 0.26         # x ACCENT["accent"] strength at the pulse head
TRAIL = 0.45

PARTS, PADS, TRACES, VIAS, FILLETS, OCC = [], [], [], [], [], []


# --------------------------------------------------------------------------- materials
def _look():
    import look as LB
    return LB


def _tier(tier, f):
    return tuple(min(0.9, c * f) for c in _look().CLAY_TIERS[BS.ARGS.theme][tier])


def _mat(name, tier, f, rough, noise, bump=0.05, var=0.07, bevel=0.004, metallic=0.0):
    if name in BS.M:
        return bpy.data.materials[name]
    LB = _look()
    m = LB.clay_material(name, tier, BS.ARGS.theme, rough=rough, bevel=bevel, noise=noise,
                         bump=bump, var=var, color=_tier(tier, f), metallic=metallic)
    return LB.register(m)


def _m(nt, op, a, b=None, c=None):
    nd = nt.nodes.new("ShaderNodeMath")
    nd.operation = op
    for i, v in enumerate((a, b, c)):
        if v is None:
            continue
        if isinstance(v, (int, float)):
            nd.inputs[i].default_value = v
        else:
            nt.links.new(v, nd.inputs[i])
    return nd.outputs[0]


def _bsdf(m):
    return next(x for x in m.node_tree.nodes if x.bl_idname == "ShaderNodeBsdfPrincipled")


def materials():
    LB = _look()
    dark = BS.ARGS.theme == "dark"
    mk = _mat("bd_mask", "dark", 1.05, 0.40, 70.0, bump=0.18, var=0.10, bevel=0.006)  # mask
    _bsdf(mk).inputs["Specular IOR Level"].default_value = 0.35
    _mat("bd_fr4", "mid", 0.9, 0.7, 40.0, bump=0.05, var=0.12, bevel=0.004)      # board edge
    _bsdf(_mat("bd_ic", "dark", 0.72, 0.66, 45.0, bump=0.06, var=0.06, bevel=0.005)).inputs[
        "Specular IOR Level"].default_value = 0.2                                   # epoxy mould
    _bsdf(_mat("bd_mold", "dark", 1.25, 0.62, 40.0, bump=0.05, var=0.07, bevel=0.005)).inputs[
        "Specular IOR Level"].default_value = 0.3                                   # moulded
    _mat("bd_sub", "dark", 0.95, 0.5, 60.0, bump=0.05, var=0.08, bevel=0.003)     # substrate
    _bsdf(_mat("bd_cer", "mid", 1.05, 0.8, 80.0, bump=0.04, var=0.08, bevel=0.003)).inputs[
        "Specular IOR Level"].default_value = 0.15                                  # ceramic
    _mat("bd_silk", "light", 1.05, 0.75, 90.0, bump=0.02, var=0.05, bevel=0.0005)
    _mat("bd_solder", "light", 1.2, 0.4, 90.0, bump=0.06, var=0.05, bevel=0.003, metallic=0.8)
    _mat("bd_term", "mid", 1.25, 0.72, 90.0, bump=0.04, var=0.05, bevel=0.002, metallic=0.3)
    _mat("bd_copper", "light", 1.9, 0.34, 50.0, bump=0.04, var=0.06, bevel=0.002, metallic=0.45)
    _mat("bd_can", "light", 1.0, 0.62, 25.0, bump=0.05, var=0.06, bevel=0.004, metallic=0.4)
    _mat("bd_alu", "light", 1.1, 0.55, 25.0, bump=0.04, var=0.05, bevel=0.012, metallic=0.45)
    _mat("bd_hole", "dark", 0.12, 0.9, 20.0, bump=0.0, var=0.02, bevel=0.0005)
    _mat("bd_ground", "dark", 0.30, 0.6, 2.0, bump=0.02, var=0.15, bevel=0.002)
    # hero copper: same copper + a blue glow that trails the pulse (head / gain set per frame)
    m = _mat("bd_hero", "light", 1.9, 0.34, 50.0, bump=0.04, var=0.06, bevel=0.002, metallic=0.45)
    nt = m.node_tree
    b = _bsdf(m)
    col, sd, sl = LB.ACCENT["accent"]
    b.inputs["Emission Color"].default_value = (*col, 1)
    tc = nt.nodes.new("ShaderNodeTexCoord")
    sp = nt.nodes.new("ShaderNodeSeparateXYZ")
    nt.links.new(tc.outputs["Object"], sp.inputs[0])
    head = nt.nodes.new("ShaderNodeValue")
    head.name = "head"
    head.outputs[0].default_value = -10.0
    gain = nt.nodes.new("ShaderNodeValue")
    gain.name = "gain"
    gain.outputs[0].default_value = 0.0
    d = _m(nt, "SUBTRACT", head.outputs[0], sp.outputs["Y"])
    a = _m(nt, "EXPONENT", _m(nt, "MULTIPLY", _m(nt, "MAXIMUM", d, 0.0), -1.0 / GLOW_DECAY))
    lead = _m(nt, "EXPONENT", _m(nt, "MULTIPLY", _m(nt, "MINIMUM", d, 0.0), 1.0 / GLOW_LEAD))
    g = _m(nt, "MULTIPLY", lead, _m(nt, "MULTIPLY_ADD", a, 1.0 - GLOW_FLOOR, GLOW_FLOOR))
    s = _m(nt, "MULTIPLY", g, _m(nt, "MULTIPLY", gain.outputs[0], GLOW_GAIN * (sd if dark else sl)))
    nt.links.new(s, b.inputs["Emission Strength"])
    BD["hero_nodes"] = (head, gain)
    # trail: the pulse's own white-blue at a fraction of its strength
    if "bd_trail" not in BS.M:
        t = LB.emission_material("bd_trail", "pulse", BS.ARGS.theme)
        _bsdf(t).inputs["Emission Strength"].default_value *= 0.12
        LB.register(t)


# --------------------------------------------------------------------------- geometry helpers
def P_xy(u, v, w):
    return (u, v, w)


def P_usb(u, v, w):
    return (u, w, ZC + v)


def _face(bm, vs, mat, smooth=False):
    f = bm.faces.new(vs)
    f.material_index = BS.M[mat]
    f.smooth = smooth
    return f


def rrect(cx, cy, w, h, r, m=3):
    """Rounded rectangle, CCW, starting at the bottom-right corner (-90 deg); 4(m+1) points."""
    r = max(1e-4, min(r, w / 2 - 1e-4, h / 2 - 1e-4))
    pts = []
    for (sx, sy, a0) in ((1, -1, -90), (1, 1, 0), (-1, 1, 90), (-1, -1, 180)):
        ccx, ccy = cx + sx * (w / 2 - r), cy + sy * (h / 2 - r)
        for k in range(m + 1):
            a = math.radians(a0 + 90.0 * k / m)
            pts.append((ccx + r * math.cos(a), ccy + r * math.sin(a)))
    return pts


def stadium(hw, hh, m=5):
    """Stadium (USB-C outline), CCW from -90 deg, 4(m+1) points (matches rrect(..., m))."""
    c, n = hw - hh, 2 * m + 1
    pts = []
    for a0, cx in ((-90.0, c), (90.0, -c)):
        for k in range(n + 1):
            a = math.radians(a0 + 180.0 * k / n)
            pts.append((cx + hh * math.cos(a), hh * math.sin(a)))
    return pts


def ext(mb, pts, w0, w1, mat, P=P_xy, smooth=False, side=None):
    """Solid prism of a CCW outline from w0 to w1 (P maps (u, v, w) to board space)."""
    bm = mb.bm
    a = [bm.verts.new(P(u, v, w0)) for u, v in pts]
    b = [bm.verts.new(P(u, v, w1)) for u, v in pts]
    _face(bm, a[::-1], mat)
    _face(bm, b, mat)
    n = len(pts)
    for i in range(n):
        j = (i + 1) % n
        _face(bm, (a[i], a[j], b[j], b[i]), side or mat, smooth)


def ring(mb, outer, inner, w0, w1, mat, P=P_xy, smooth=False):
    """Hollow prism between two matched CCW outlines."""
    bm = mb.bm
    ao = [bm.verts.new(P(u, v, w0)) for u, v in outer]
    bo = [bm.verts.new(P(u, v, w1)) for u, v in outer]
    ai = [bm.verts.new(P(u, v, w0)) for u, v in inner]
    bi = [bm.verts.new(P(u, v, w1)) for u, v in inner]
    n = len(outer)
    for i in range(n):
        j = (i + 1) % n
        _face(bm, (ao[i], ao[j], bo[j], bo[i]), mat, smooth)
        _face(bm, (ai[j], ai[i], bi[i], bi[j]), mat, smooth)
        _face(bm, (ao[j], ao[i], ai[i], ai[j]), mat)
        _face(bm, (bo[i], bo[j], bi[j], bi[i]), mat)


def strip(mb, pts, w, z0, z1, mat):
    """Copper trace: a mitred ribbon along a 2D polyline, extruded z0..z1."""
    bm = mb.bm
    P = [Vector(p) for p in pts]
    L, R = [], []
    for i, p in enumerate(P):
        if i == 0 or i == len(P) - 1:
            d = (P[1] - P[0]) if i == 0 else (P[-1] - P[-2])
            d.normalize()
            nrm, k = Vector((-d.y, d.x)), 1.0
        else:
            d0, d1 = (p - P[i - 1]).normalized(), (P[i + 1] - p).normalized()
            n0, n1 = Vector((-d0.y, d0.x)), Vector((-d1.y, d1.x))
            nrm = (n0 + n1).normalized()
            k = 1.0 / max(0.3, nrm.dot(n0))
        L.append(p + nrm * (w / 2) * k)
        R.append(p - nrm * (w / 2) * k)
    lt = [bm.verts.new((v.x, v.y, z1)) for v in L]
    rt = [bm.verts.new((v.x, v.y, z1)) for v in R]
    lb = [bm.verts.new((v.x, v.y, z0)) for v in L]
    rb = [bm.verts.new((v.x, v.y, z0)) for v in R]
    for i in range(len(P) - 1):
        _face(bm, (rt[i], rt[i + 1], lt[i + 1], lt[i]), mat)
        _face(bm, (rb[i], lb[i], lb[i + 1], rb[i + 1]), mat)
        _face(bm, (lb[i], lt[i], lt[i + 1], lb[i + 1]), mat)
        _face(bm, (rb[i], rb[i + 1], rt[i + 1], rt[i]), mat)
    _face(bm, (lb[0], rb[0], rt[0], lt[0]), mat)
    _face(bm, (rb[-1], lb[-1], lt[-1], rt[-1]), mat)


def _fillet_geo(mb, base, d, w, ext_, hf, mat="bd_solder", n=4):
    """Concave solder meniscus from a terminal face (base = foot centre) out along d."""
    bm = mb.bm
    d = Vector((d[0], d[1], 0.0)).normalized()
    l = Vector((-d.y, d.x, 0.0))
    base = Vector(base)
    prof = [(0.0, 0.0)] + [(ext_ * (1 - k / n), hf * (k / n) ** 2) for k in range(n + 1)]
    A = [bm.verts.new(base + l * (w / 2) + d * u + Vector((0, 0, v))) for u, v in prof]
    B = [bm.verts.new(base - l * (w / 2) + d * u + Vector((0, 0, v))) for u, v in prof]
    _face(bm, A, mat)
    _face(bm, B[::-1], mat)
    m = len(prof)
    for i in range(m):
        j = (i + 1) % m
        _face(bm, (A[i], B[i], B[j], A[j]), mat, smooth=0 < i < m - 1)


def finish(mb, name, bevel=0.0):
    bmesh.ops.recalc_face_normals(mb.bm, faces=mb.bm.faces[:])
    return ob_place(mb, name, B0, bevel=bevel)


# --------------------------------------------------------------------------- registry
def occ(x0, y0, x1, y1, tag):
    OCC.append((min(x0, x1), min(y0, y1), max(x0, x1), max(y0, y1), tag))


def free(x0, y0, x1, y1, m=0.015):
    if x0 - m < PCB[0] + 0.08 or x1 + m > PCB[2] - 0.08 or y0 - m < PCB[1] + 0.08 or \
            y1 + m > PCB[3] - 0.08:
        return False
    for (a0, b0, a1, b1, _t) in OCC:
        if x0 - m < a1 and x1 + m > a0 and y0 - m < b1 and y1 + m > b0:
            return False
    return True


def pad(G, x0, y0, x1, y1, part, net=None, kind="smd", zb=TOP, t=PAD_T):
    G["solder"].box(x0, y0, zb, x1, y1, zb + t, "bd_solder")
    PADS.append(dict(r=(min(x0, x1), min(y0, y1), max(x0, x1), max(y0, y1)), z=(zb, zb + t),
                     part=part, net=net, kind=kind, fil=0))
    if zb == TOP:
        occ(x0, y0, x1, y1, "pad")
    return len(PADS) - 1


def fillet(G, pi, base, d, w, ext_, hf):
    _fillet_geo(G["solder"], base, d, w, ext_, hf)
    PADS[pi]["fil"] += 1
    FILLETS.append(dict(pad=pi, foot=(base[0] + d[0] * ext_ * 0.5, base[1] + d[1] * ext_ * 0.5),
                        z=base[2]))


def part(name, kind, boxes, seat, support, pads=(), tall_ok=False, offboard=False, zb=TOP):
    x0 = min(b[0] for b in boxes)
    y0 = min(b[1] for b in boxes)
    x1 = max(b[3] for b in boxes)
    y1 = max(b[4] for b in boxes)
    PARTS.append(dict(name=name, kind=kind, boxes=[tuple(b) for b in boxes], seat=seat,
                      support=support, pads=list(pads), tall_ok=tall_ok, offboard=offboard,
                      bbox=(x0, y0, x1, y1), top=max(b[5] for b in boxes), zb=zb))
    if zb == TOP and not offboard:
        occ(x0, y0, x1, y1, "part")


def silk_brackets(G, x0, y0, x1, y1, off=0.035, L=0.07, w=0.012, pin1=False):
    x0, y0, x1, y1 = x0 - off, y0 - off, x1 + off, y1 + off
    z0, z1 = TOP, TOP + 0.0012
    for (cx, cy, sx, sy) in ((x0, y0, 1, 1), (x1, y0, -1, 1), (x1, y1, -1, -1), (x0, y1, 1, -1)):
        for (a, b, c, d) in ((cx, cy, cx + sx * L, cy + sy * w), (cx, cy, cx + sx * w, cy + sy * L)):
            if free(min(a, c), min(b, d), max(a, c), max(b, d), 0.004):
                G["silk"].box(a, b, z0, c, d, z1, "bd_silk")
    if pin1 and free(x0 - 0.05, y1 - 0.01, x0 - 0.02, y1 + 0.02, 0.004):
        G["silk"].cyl(x0 - 0.035, y1 + 0.005, z0, 0.014, 0.0012, "bd_silk", seg=12, smooth=False)


def silk_glyph(G, x, y, rr, vertical=False):
    """Abstract, non-readable bar cluster (like reference designators without letters)."""
    n = rr.randint(2, 4)
    bars, u = [], 0.0
    for _ in range(n):
        L = rr.choice((0.018, 0.03, 0.045, 0.06))
        bars.append((u, u + L))
        u += L + 0.014
    h = 0.024
    x1, y1 = (x + h, y + u) if vertical else (x + u, y + h)
    if not free(x, y, x1, y1, 0.012):
        return
    for (a, b) in bars:
        if vertical:
            G["silk"].box(x, y + a, TOP, x + h, y + b, TOP + 0.0012, "bd_silk")
        else:
            G["silk"].box(x + a, y, TOP, x + b, y + h, TOP + 0.0012, "bd_silk")
    occ(x, y, x1, y1, "silk")


# --------------------------------------------------------------------------- components
def chip(G, name, cx, cy, L, W, H, axis="x", body="bd_cer", zb=TOP, pt=PAD_T):
    """Chip passive (0201/0402/0603): tinned end caps on pads, a fillet on each pad."""
    tl, ex = 0.2 * L, 0.28 * H + 0.012
    e = (1.0, 0.0) if axis == "x" else (0.0, 1.0)
    zt = zb + pt

    def rect(a0, a1, b0, b1):
        if axis == "x":
            return (cx + a0, cy + b0, cx + a1, cy + b1)
        return (cx + b0, cy + a0, cx + b1, cy + a1)
    pis = []
    for s in (-1, 1):
        a0, a1 = sorted((s * (L / 2 - tl * 1.3), s * (L / 2 + ex)))
        pis.append(pad(G, *rect(a0, a1, -W * 0.6, W * 0.6), name, zb=zb, t=pt))
    x0, y0, x1, y1 = rect(-L / 2 + tl, L / 2 - tl, -W / 2, W / 2)
    G["parts"].box(x0, y0, zt, x1, y1, zt + H, body)
    for k, s in enumerate((-1, 1)):
        a0, a1 = sorted((s * (L / 2 - tl), s * L / 2))
        x0, y0, x1, y1 = rect(a0, a1, -W * 0.51, W * 0.51)
        G["solder"].box(x0, y0, zt, x1, y1, zt + H * 1.02, "bd_term")
        base = (cx + e[0] * s * L / 2, cy + e[1] * s * L / 2, zt)
        fillet(G, pis[k], base, (e[0] * s, e[1] * s), W * 0.92, ex * 0.92, H * 0.55)
    bb = rect(-L / 2, L / 2, -W * 0.51, W * 0.51)
    part(name, "chip", [(bb[0], bb[1], zt, bb[2], bb[3], zt + H * 1.02)], zt, "pads", pis,
         zb=zb)


SIZES = {"0201": (0.12, 0.06, 0.05), "0402": (0.2, 0.1, 0.07), "0603": (0.32, 0.16, 0.09)}


def chip_row(G, name, x0, y, x1, rr, axis="y", step=None, sizes=("0402", "0201", "0402", "0603")):
    x, k = x0, 0
    while x <= x1:
        sz = SIZES[rr.choice(sizes)]
        body = "bd_cer" if rr.random() < 0.7 else "bd_ic"
        L, W, H = sz
        hx = (W * 0.6 if axis == "y" else L / 2 + 0.28 * H + 0.012)
        hy = (L / 2 + 0.28 * H + 0.012 if axis == "y" else W * 0.6)
        if free(x - hx, y - hy, x + hx, y + hy, 0.02):
            chip(G, "%s%d" % (name, k), x, y, L, W, H, axis, body)
            k += 1
        x += step or (2 * hx + rr.uniform(0.05, 0.11))


def gull(G, name, cx, cy, bx, by, bh, n, pitch):
    """SOT / TSSOP: moulded body on gull-wing legs along +-x, a pad and fillets per leg."""
    lw, lt, so = pitch * 0.42, 0.012, 0.014
    z0 = PAD_TOP + so
    zm = z0 + bh * 0.42
    boxes, pis = [(cx - bx / 2, cy - by / 2, z0, cx + bx / 2, cy + by / 2, z0 + bh)], []
    G["parts"].box(cx - bx / 2, cy - by / 2, z0, cx + bx / 2, cy + by / 2, z0 + bh, "bd_ic")
    for s in (-1, 1):
        for i in range(n):
            y = cy + (i - (n - 1) / 2) * pitch
            xb = cx + s * bx / 2
            xs, xd, xf = xb + s * 0.03, xb + s * (0.03 + lt), xb + s * 0.085
            G["solder"].box(xb - s * 0.004, y - lw / 2, zm - lt / 2, xs, y + lw / 2, zm + lt / 2,
                            "bd_term")
            G["solder"].box(xs, y - lw / 2, PAD_TOP, xd, y + lw / 2, zm + lt / 2, "bd_term")
            G["solder"].box(xs, y - lw / 2, PAD_TOP, xf, y + lw / 2, PAD_TOP + lt, "bd_term")
            pi = pad(G, xb + s * 0.02, y - lw * 0.75, xf + s * 0.03, y + lw * 0.75, name)
            pis.append(pi)
            fillet(G, pi, (xf, y, PAD_TOP), (s, 0), lw * 0.95, 0.026, lt * 1.5)
            fillet(G, pi, (xs, y, PAD_TOP), (-s, 0), lw * 0.95, 0.009, lt * 1.2)
            boxes.append((min(xb, xf), y - lw / 2, PAD_TOP, max(xb, xf), y + lw / 2, zm + lt / 2))
    G["silk"].cyl(cx - bx / 2 + 0.035, cy + by / 2 - 0.035, z0 + bh, 0.012, 0.0008, "bd_hole",
                  seg=12, smooth=False)                                     # pin-1 dimple
    part(name, "gull", boxes, z0, "legs", pis)
    silk_brackets(G, cx - bx / 2 - 0.09, cy - by / 2, cx + bx / 2 + 0.09, cy + by / 2, pin1=True)


def qfn(G, name, cx, cy, s, h, n):
    """QFN: body on an exposed pad, perimeter pads with toe fillets climbing the flank."""
    pitch = s * 0.78 / n
    pis = []
    pis.append(pad(G, cx - s * 0.3, cy - s * 0.3, cx + s * 0.3, cy + s * 0.3, name,
                   kind="thermal"))
    PADS[pis[-1]]["fil"] += 1               # soldered under the body (hidden joint)
    for ax in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        for i in range(n):
            o = (i - (n - 1) / 2) * pitch
            lx, ly = ax[0] * s / 2, ax[1] * s / 2
            px, py = cx + lx + (o if ax[0] == 0 else 0), cy + ly + (o if ax[1] == 0 else 0)
            a, b = 0.045, pitch * 0.3
            if ax[0] != 0:
                x0, x1 = sorted((px - ax[0] * 0.035, px + ax[0] * 0.04))
                r = (x0, py - b, x1, py + b)
            else:
                y0, y1 = sorted((py - ax[1] * 0.035, py + ax[1] * 0.04))
                r = (px - b, y0, px + b, y1)
            pi = pad(G, *r, name)
            pis.append(pi)
            fillet(G, pi, (px, py, PAD_TOP), ax, pitch * 0.42, 0.034, h * 0.33)
    G["parts"].box(cx - s / 2, cy - s / 2, PAD_TOP, cx + s / 2, cy + s / 2, PAD_TOP + h, "bd_ic")
    G["silk"].cyl(cx - s / 2 + 0.06, cy + s / 2 - 0.06, PAD_TOP + h, 0.018, 0.0008, "bd_hole",
                  seg=12, smooth=False)
    part(name, "qfn", [(cx - s / 2, cy - s / 2, PAD_TOP, cx + s / 2, cy + s / 2, PAD_TOP + h)],
         PAD_TOP, "pads", pis)
    silk_brackets(G, cx - s / 2 - 0.04, cy - s / 2 - 0.04, cx + s / 2 + 0.04, cy + s / 2 + 0.04,
                  pin1=True)


BALL_R, BALL_SZ = 0.017, 0.8
BALL_TOP = PAD_TOP + 2 * BALL_R * BALL_SZ


def bga(G, name, cx, cy, w, h, rows=2, margin=0.06):
    """BGA balls on pads (the two visible perimeter rows); returns the substrate seat z."""
    pis, pts = [], set()
    ix, iy = int((w / 2 - margin) / BALL), int((h / 2 - margin) / BALL)
    for r in range(rows):
        for i in range(-ix + r, ix - r + 1):
            pts.add((i, iy - r))
            pts.add((i, -iy + r))
        for j in range(-iy + r, iy - r + 1):
            pts.add((ix - r, j))
            pts.add((-ix + r, j))
    for (i, j) in sorted(pts):
        x, y = cx + i * BALL, cy + j * BALL
        pi = pad(G, x - 0.013, y - 0.013, x + 0.013, y + 0.013, name, kind="ball")
        pis.append(pi)
        G["solder"].sphere((x, y, PAD_TOP + BALL_R * BALL_SZ), BALL_R, "bd_solder",
                           scale=(1, 1, BALL_SZ), sub=2)
        PADS[pi]["fil"] += 1                    # the ball is the joint
    BD.setdefault("balls", {})[name] = (ix, iy)
    return pis


def can(G, name, x0, y0, x1, y1, h, rr):
    """Shielding can: drawn fence soldered on a pad ring, vented lid, foot fillets."""
    cx, cy, w, hh = (x0 + x1) / 2, (y0 + y1) / 2, x1 - x0, y1 - y0
    t = 0.012
    outer = rrect(cx, cy, w + 0.03, hh + 0.03, 0.06, 3)
    inner = rrect(cx, cy, w - 0.03, hh - 0.03, 0.03, 3)
    ring(G["solder"], outer, inner, TOP, PAD_TOP, "bd_solder")
    PADS.append(dict(r=(x0 - 0.015, y0 - 0.015, x1 + 0.015, y1 + 0.015), z=(TOP, PAD_TOP),
                     part=name, net="gnd", kind="ring", fil=0))
    pi = len(PADS) - 1
    occ(x0 - 0.015, y0 - 0.015, x1 + 0.015, y1 + 0.015, "part")
    fo = rrect(cx, cy, w, hh, 0.05, 3)
    fi = rrect(cx, cy, w - 2 * t, hh - 2 * t, 0.04, 3)
    ring(G["can"], fo, fi, PAD_TOP, PAD_TOP + h - t, "bd_can")
    ext(G["can"], rrect(cx, cy, w, hh, 0.05, 3), PAD_TOP + h - t, PAD_TOP + h, "bd_can")
    zl = PAD_TOP + h
    # foot fillets along the four straight sides
    for (bx, by, d, L) in ((cx, y0, (0, -1), w - 0.12), (cx, y1, (0, 1), w - 0.12),
                           (x0, cy, (-1, 0), hh - 0.12), (x1, cy, (1, 0), hh - 0.12)):
        fillet(G, pi, (bx, by, PAD_TOP), d, L, 0.014, 0.02)
    # vent holes (dark, flush) around a plain pick-up area; stamped stiffening ribs
    nx, ny = int((w - 0.24) / 0.11), int((hh - 0.24) / 0.11)
    for i in range(nx + 1):
        for j in range(ny + 1):
            x = x0 + 0.12 + i * (w - 0.24) / max(nx, 1)
            y = y0 + 0.12 + j * (hh - 0.24) / max(ny, 1)
            if abs(x - cx) < w * 0.22 and abs(y - cy) < hh * 0.22:
                continue
            G["silk"].cyl(x, y, zl, 0.017, 0.0008, "bd_hole", seg=10, smooth=False)
    G["can"].box(x0 + 0.05, cy - 0.006, zl, x0 + 0.09, cy + 0.006, zl + 0.004, "bd_can")
    G["can"].box(x1 - 0.09, cy - 0.006, zl, x1 - 0.05, cy + 0.006, zl + 0.004, "bd_can")
    part(name, "can", [(x0, y0, PAD_TOP, x1, y1, zl + 0.004)], PAD_TOP, "pads", [pi])


def elco(G, name, cx, cy, r=0.19, h=0.38, rr=None):
    """SMD aluminium electrolytic: plastic seat on two flat leads, can with vent cross."""
    b, sh = r + 0.03, 0.04
    pis = []
    for s in (-1, 1):
        y0, y1 = sorted((cy + s * (b - 0.06), cy + s * (b + 0.1)))
        pi = pad(G, cx - 0.07, y0, cx + 0.07, y1, name)
        pis.append(pi)
        ya, yb = sorted((cy + s * (b - 0.08), cy + s * (b + 0.06)))
        G["solder"].box(cx - 0.045, ya, PAD_TOP, cx + 0.045, yb, PAD_TOP + 0.01, "bd_term")
        fillet(G, pi, (cx, cy + s * (b + 0.06), PAD_TOP), (0, s), 0.085, 0.035, 0.012)
    z0 = PAD_TOP + 0.01
    ext(G["parts"], rrect(cx, cy, 2 * b, 2 * b, 0.05, 2), z0, z0 + sh, "bd_mold")
    zc = z0 + sh
    G["alu"].cyl(cx, cy, zc, r, h * 0.12, "bd_alu", seg=40)
    G["alu"].cyl(cx, cy, zc + h * 0.12, r * 0.94, h * 0.06, "bd_alu", seg=40)    # crimp groove
    G["alu"].cyl(cx, cy, zc + h * 0.18, r, h * 0.82, "bd_alu", seg=40)
    zt = zc + h
    for a in (0.0, math.pi / 2):
        d = Vector((math.cos(a), math.sin(a), 0)) * r * 0.62
        G["silk"].beam(Vector((cx, cy, zt + 0.0004)) - d, Vector((cx, cy, zt + 0.0004)) + d, 0.012,
                       "bd_hole")
    G["silk"].box(cx - r * 0.8, cy + r * 0.66, zt, cx + r * 0.8, cy + r * 0.74, zt + 0.0008,
                  "bd_hole")                                                  # polarity band
    part(name, "elco", [(cx - b, cy - b, z0, cx + b, cy + b, zt)], z0, "legs", pis)
    silk_brackets(G, cx - b, cy - b, cx + b, cy + b, off=0.03)


def inductor(G, name, cx, cy, s=0.42, h=0.2):
    """Moulded power inductor: wrapped end terminals on two pads with fillets."""
    pis = []
    for k, sgn in enumerate((-1, 1)):
        x0, x1 = sorted((cx + sgn * (s / 2 - 0.1), cx + sgn * (s / 2 + 0.06)))
        pis.append(pad(G, x0, cy - s * 0.4, x1, cy + s * 0.4, name))
    ext(G["parts"], rrect(cx, cy, s, s, 0.04, 2), PAD_TOP, PAD_TOP + h, "bd_mold")
    for k, sgn in enumerate((-1, 1)):
        x0, x1 = sorted((cx + sgn * s / 2, cx + sgn * (s / 2 + 0.008)))
        G["solder"].box(x0, cy - s * 0.32, PAD_TOP, x1, cy + s * 0.32, PAD_TOP + h * 0.55, "bd_term")
        fillet(G, pis[k], (cx + sgn * (s / 2 + 0.008), cy, PAD_TOP), (sgn, 0), s * 0.6, 0.045,
               h * 0.3)
    part(name, "inductor", [(cx - s / 2 - 0.008, cy - s / 2, PAD_TOP, cx + s / 2 + 0.008,
                             cy + s / 2, PAD_TOP + h)], PAD_TOP, "pads", pis)
    silk_brackets(G, cx - s / 2 - 0.06, cy - s / 2, cx + s / 2 + 0.06, cy + s / 2, off=0.03)


def crystal(G, name, cx, cy, w=0.5, h=0.4):
    """Ceramic crystal package with seam-welded lid on four corner pads."""
    pis = []
    for sx in (-1, 1):
        for sy in (-1, 1):
            x0, x1 = sorted((cx + sx * (w / 2 - 0.11), cx + sx * (w / 2 + 0.035)))
            y0, y1 = sorted((cy + sy * (h / 2 - 0.12), cy + sy * (h / 2 - 0.01)))
            pi = pad(G, x0, y0, x1, y1, name)
            pis.append(pi)
            fillet(G, pi, (cx + sx * w / 2, cy + sy * (h / 2 - 0.065), PAD_TOP), (sx, 0), 0.09,
                   0.03, 0.022)
    ext(G["parts"], rrect(cx, cy, w, h, 0.02, 2), PAD_TOP, PAD_TOP + 0.035, "bd_cer")
    ext(G["can"], rrect(cx, cy, w - 0.05, h - 0.05, 0.04, 3), PAD_TOP + 0.035, PAD_TOP + 0.075,
        "bd_can")
    part(name, "crystal", [(cx - w / 2, cy - h / 2, PAD_TOP, cx + w / 2, cy + h / 2,
                            PAD_TOP + 0.075)], PAD_TOP, "pads", pis)
    silk_brackets(G, cx - w / 2 - 0.035, cy - h / 2, cx + w / 2 + 0.035, cy + h / 2, pin1=True)


def b2b(G, name, cx, cy, w=1.0, h=0.32, n=11, pitch=0.08):
    """Board-to-board receptacle: housing with a slot, two pin rows, metal hold-downs."""
    pis = []
    z0 = PAD_TOP
    for s in (-1, 1):
        for i in range(n):
            x = cx + (i - (n - 1) / 2) * pitch
            ye = cy + s * h / 2
            y0, y1 = sorted((ye - s * 0.02, ye + s * 0.09))
            pi = pad(G, x - 0.018, y0, x + 0.018, y1, name)
            pis.append(pi)
            ya, yb = sorted((ye - s * 0.03, ye + s * 0.06))
            G["solder"].box(x - 0.012, ya, PAD_TOP, x + 0.012, yb, PAD_TOP + 0.01, "bd_term")
            G["solder"].box(x - 0.012, min(ye, ye - s * 0.005), PAD_TOP, x + 0.012,
                            max(ye, ye - s * 0.005), z0 + 0.09, "bd_term")
            fillet(G, pi, (x, ye + s * 0.06, PAD_TOP), (0, s), 0.022, 0.025, 0.012)
    for s in (-1, 1):
        x = cx + s * (w / 2 + 0.03)
        x0, x1 = sorted((x - s * 0.05, x + s * 0.06))
        pi = pad(G, x0, cy - 0.1, x1, cy + 0.1, name)
        pis.append(pi)
        xa, xb = sorted((x - s * 0.035, x + s * 0.035))
        G["solder"].box(xa, cy - 0.07, PAD_TOP, xb, cy + 0.07, PAD_TOP + 0.08, "bd_can")
        fillet(G, pi, (x + s * 0.035, cy, PAD_TOP), (s, 0), 0.12, 0.022, 0.025)
    ext(G["parts"], rrect(cx, cy, w, h, 0.03, 2), z0, z0 + 0.1, "bd_mold")
    ext(G["parts"], rrect(cx, cy, w - 0.14, h * 0.42, 0.02, 2), z0 + 0.1, z0 + 0.1015, "bd_hole")
    ext(G["parts"], rrect(cx, cy, w - 0.26, h * 0.16, 0.01, 2), z0 + 0.1015, z0 + 0.115, "bd_mold")
    part(name, "b2b", [(cx - w / 2 - 0.065, cy - h / 2 - 0.06, PAD_TOP, cx + w / 2 + 0.065,
                        cy + h / 2 + 0.06, z0 + 0.115)], PAD_TOP, "pads", pis)


def via(G, x, y, r=0.026, force=False):
    if not force and not free(x - r, y - r, x + r, y + r, 0.012):
        return False
    G["copper"].cyl(x, y, TOP, r, 0.006, "bd_copper", seg=14, smooth=False)
    G["copper"].cyl(x, y, TOP, r * 0.45, 0.0065, "bd_hole", seg=10, smooth=False)
    VIAS.append((x, y, r))
    occ(x - r, y - r, x + r, y + r, "via")
    return True


def test_pad(G, name, x, y, r=0.05):
    G["copper"].cyl(x, y, TOP, r, 0.008, "bd_copper", seg=24, smooth=False)
    G["solder"].sphere((x, y, TOP + 0.008), r * 0.82, "bd_solder", scale=(1, 1, 0.22), sub=2)
    PADS.append(dict(r=(x - r, y - r, x + r, y + r), z=(TOP, TOP + 0.008), part=name, net=None,
                     kind="test", fil=1))
    occ(x - r - 0.03, y - r - 0.03, x + r + 0.03, y + r + 0.03, "pad")
    pts = [(x + (r + 0.03) * math.cos(a), y + (r + 0.03) * math.sin(a))
           for a in [2 * math.pi * k / 24 for k in range(24)]]
    inn = [(x + (r + 0.018) * math.cos(a), y + (r + 0.018) * math.sin(a))
           for a in [2 * math.pi * k / 24 for k in range(24)]]
    ring(G["silk"], pts, inn, TOP, TOP + 0.0012, "bd_silk")


def trace(G, name, pts, w=0.05, net=None, mb=None):
    strip(mb or G["copper"], pts, w, TOP, TR_TOP, "bd_hero" if mb is not None else "bd_copper")
    TRACES.append(dict(name=name, pts=[tuple(p) for p in pts], w=w))
    for a, b in zip(pts[:-1], pts[1:]):
        occ(min(a[0], b[0]) - w / 2, min(a[1], b[1]) - w / 2, max(a[0], b[0]) + w / 2,
            max(a[1], b[1]) + w / 2, "trace")


# --------------------------------------------------------------------------- USB-C
def usbc(G, mb):
    """Stadium receptacle at the north edge (rear plate = contract 2b slot), plug inserted."""
    y0, y1 = Y_SLOT, 5.2
    hw, hh, t = 0.45, 0.17, 0.03
    so, si = stadium(hw, hh, 5), stadium(hw - t, hh - t, 5)
    ring(mb, so, si, y0, y1, "bd_can", P_usb, smooth=True)                       # shell
    ring(mb, si, rrect(0, 0, 2 * SLOT_X, 2 * SLOT_Z, 0.012, 5), y0, y0 + 0.06, "bd_ic", P_usb)
    # shell details: spring tabs on top, a seam line
    for x in (-0.14, 0.14):
        mb.box(x - 0.05, 4.9, ZC + hh - 0.002, x + 0.05, 5.0, ZC + hh + 0.004, "bd_can")
    mb.box(-0.003, y0 + 0.08, ZC + hh - 0.001, 0.003, y1 - 0.05, ZC + hh + 0.001, "bd_hole")
    # tongue with contacts (the pulse rides just above it into the cavity)
    zt0, zt1 = ZC - 0.012, ZC + 0.012
    mb.box(-0.26, y0 + 0.06, zt0, 0.26, 4.93, zt1, "bd_ic")
    for i in range(6):
        x = (i - 2.5) * 0.08
        mb.box(x - 0.017, 4.56, zt1, x + 0.017, 4.92, zt1 + 0.0015, "bd_solder")
        mb.box(x - 0.017, 4.56, zt0 - 0.0015, x + 0.017, 4.92, zt0, "bd_solder")
    # plug: shell inside the receptacle, face with the tongue slot, body, overmold, relief, cable
    po, pi_ = stadium(hw - t - 0.005, hh - t - 0.005, 5), stadium(hw - t - 0.025, hh - t - 0.025, 5)
    ring(mb, po, pi_, 4.9, 5.33, "bd_can", P_usb, smooth=True)
    ring(mb, pi_, rrect(0, 0, 0.56, 0.06, 0.01, 5), 4.9, 4.95, "bd_ic", P_usb)
    mb.box(-0.28, 4.95, ZC - 0.03, 0.28, 4.96, ZC + 0.03, "bd_hole")
    ext(mb, pi_, 4.96, 5.33, "bd_ic", P_usb)
    ext(mb, stadium(0.55, 0.2, 5), 5.33, 5.86, "clay", P_usb, smooth=True)
    mb._cyl(Matrix.Translation((0, 6.06, ZC)) @ Matrix.Rotation(-math.pi / 2, 4, "X"), 0.15, 0.1,
            0.4, "clay2", 24, True)
    # rear signal legs (one per hero-bundle trace) and shell legs, each on a pad with a fillet
    pis = []
    for x in (-0.3, -0.15, 0.0, 0.15, 0.3):
        G["solder"].box(x - 0.02, 4.43, PAD_TOP, x + 0.02, y0, ZC - SLOT_Z, "bd_term")
        G["solder"].box(x - 0.02, 4.33, PAD_TOP, x + 0.02, 4.43, PAD_TOP + 0.012, "bd_term")
        pi = pad(G, x - 0.034, 4.30, x + 0.034, 4.44, "usbc")
        pis.append(pi)
        fillet(G, pi, (x, 4.33, PAD_TOP), (0, -1), 0.036, 0.026, 0.02)
    boxes = [(-hw, y0, TOP, hw, y1, ZC + hh), (-0.3 - 0.02, 4.33, PAD_TOP, 0.3 + 0.02, y0, ZC)]
    for sx in (-1, 1):
        for y in (4.6, 5.0):
            xa, xb = sorted((sx * 0.45, sx * 0.465))
            G["solder"].box(xa, y - 0.04, PAD_TOP, xb, y + 0.04, ZC - 0.02, "bd_can")
            xa, xb = sorted((sx * 0.45, sx * 0.53))
            G["solder"].box(xa, y - 0.04, PAD_TOP, xb, y + 0.04, PAD_TOP + 0.012, "bd_can")
            xa, xb = sorted((sx * 0.44, sx * 0.56))
            pi = pad(G, xa, y - 0.055, xb, y + 0.055, "usbc")
            pis.append(pi)
            fillet(G, pi, (sx * 0.53, y, PAD_TOP), (sx, 0), 0.075, 0.026, 0.02)
            boxes.append((min(sx * 0.45, sx * 0.53), y - 0.04, PAD_TOP, max(sx * 0.45, sx * 0.53),
                          y + 0.04, ZC - 0.02))
    part("usbc", "usbc", boxes, PAD_TOP, "legs", pis, tall_ok=True)
    part("usbc_plug", "plug", [(-0.55, 5.33, ZC - 0.2, 0.55, 5.86, ZC + 0.2),
                               (-0.15, 5.86, ZC - 0.15, 0.15, 6.26, ZC + 0.15)], ZC - 0.2,
         "receptacle", tall_ok=True, offboard=True)
    # silkscreen: connector outline and a board-edge marker
    silk_brackets(G, -0.56, 4.3, 0.56, 5.18, off=0.04, L=0.1)


# --------------------------------------------------------------------------- build
def build_board():
    for L in (PARTS, PADS, TRACES, VIAS, FILLETS, OCC):
        L.clear()
    new_coll("SET_board")
    materials()
    o = B0
    rr = random.Random(11)
    G = {k: MB() for k in ("solder", "parts", "copper", "silk", "can", "alu")}
    # ground and PCB (mask top, FR4 edges, rounded outline)
    mb = MB()
    mb.box(-30, -30, -0.5, 30, 30, 0.0, "bd_ground")
    ob_place(mb, "board_ground", o)
    mb = MB()
    ext(mb, rrect((PCB[0] + PCB[2]) / 2, (PCB[1] + PCB[3]) / 2, PCB[2] - PCB[0], PCB[3] - PCB[1],
                  0.22, 4), 0.0, TOP, "bd_mask", side="bd_fr4")
    finish(mb, "pcb")

    # ---- SoC: substrate on BGA balls, package top = code card x4 (seam 2a)
    zs = BALL_TOP
    zl = zs + 0.04
    pis = bga(G, "soc", SOC.x, SOC.y, SUB[2] - SUB[0], SUB[3] - SUB[1])
    mb = MB()
    ext(mb, rrect(SOC.x, SOC.y, SUB[2] - SUB[0], SUB[3] - SUB[1], 0.03, 2), zs, zl, "bd_sub")
    finish(mb, "soc_sub")
    mb = MB()
    mb.box(SOC.x - SOC_W / 2, SOC.y - SOC_H / 2, zl, SOC.x + SOC_W / 2, SOC.y + SOC_H / 2, SOC_TOP,
           "clay")
    ob_place(mb, "soc", o, bevel=0.02)
    mb = MB()
    card_bars(mb, SOC.x, SOC.y, SOC_TOP, S_BOARD, bar_h=0.032)
    ob_place(mb, "soc_marks", o)
    BD["soc_top"] = o + Vector((SOC.x, SOC.y, SOC_TOP))
    part("soc", "bga", [(SUB[0], SUB[1], zs, SUB[2], SUB[3], zl),
                        (SOC.x - SOC_W / 2, SOC.y - SOC_H / 2, zl, SOC.x + SOC_W / 2,
                         SOC.y + SOC_H / 2, SOC_TOP)], zs, "balls", pis, tall_ok=True)
    # land-side caps on the substrate margin (north and south rows)
    for (y, xs) in ((SUB[3] - 0.06, (-1.15, -0.85, -0.6, 0.6, 0.85, 1.15)),
                    (SUB[1] + 0.06, (-1.0, -0.6, -0.2, 0.2, 0.6, 1.0))):
        for x in xs:
            chip(G, "soc_c%.2f_%.2f" % (x, y), x, y, 0.09, 0.045, 0.03, "x", "bd_cer", zb=zl,
                 pt=0.004)

    # ---- RAM west / east (BGA)
    for nm, cx in (("ram_w", -2.45), ("ram_e", 2.45)):
        w, h = 0.8, 2.2
        pis = bga(G, nm, cx, SOC.y, w, h)
        ext(G["parts"], rrect(cx, SOC.y, w, h, 0.02, 2), BALL_TOP, BALL_TOP + 0.03, "bd_sub")
        ext(G["parts"], rrect(cx, SOC.y, w - 0.04, h - 0.04, 0.03, 2), BALL_TOP + 0.03,
            BALL_TOP + 0.15, "bd_ic")
        G["silk"].cyl(cx - w / 2 + 0.08, SOC.y + h / 2 - 0.08, BALL_TOP + 0.15, 0.02, 0.0008,
                      "bd_hole", seg=12, smooth=False)
        part(nm, "bga", [(cx - w / 2, SOC.y - h / 2, BALL_TOP, cx + w / 2, SOC.y + h / 2,
                          BALL_TOP + 0.15)], BALL_TOP, "balls", pis)
        silk_brackets(G, cx - w / 2, SOC.y - h / 2, cx + w / 2, SOC.y + h / 2, pin1=True)
    silk_brackets(G, SUB[0], SUB[1], SUB[2], SUB[3], off=0.05, L=0.14, pin1=True)

    # ---- traces. Hero bundle: SoC north ball row -> USB-C rear legs (+y, pure pitch dive)
    yb = SOC.y + int((SUB[3] - SUB[1]) / 2 / BALL - 0.06 / BALL) * BALL      # outer ball row
    yb = SOC.y + int(((SUB[3] - SUB[1]) / 2 - 0.06) / BALL) * BALL
    BD["ball_row"] = yb
    hero = MB()
    trace(G, "hero", [(0.0, yb), (0.0, 4.37)], 0.05, mb=hero)
    for s in (-1, 1):
        trace(G, "bus%d_1" % s, [(s * 3 * BALL, yb), (s * 3 * BALL, -0.42), (s * 0.15, -0.345),
                                 (s * 0.15, 4.37)], 0.05)
        trace(G, "bus%d_2" % s, [(s * 6 * BALL, yb), (s * 6 * BALL, -0.40), (s * 0.30, -0.25),
                                 (s * 0.30, 4.37)], 0.05)
    # RAM buses (straight, ball to ball)
    for s in (-1, 1):
        x_soc = s * int(((SUB[2] - SUB[0]) / 2 - 0.06) / BALL) * BALL
        x_ram = s * 2.45 - s * int((0.4 - 0.06) / BALL) * BALL
        for k in range(6):
            y = SOC.y + (-10 + 4 * k) * BALL
            trace(G, "ram%d_%d" % (s, k), [(x_soc, y), (x_ram, y)], 0.04)

    # ---- PMIC (QFN) east and its four power traces into the SoC (45-degree bends)
    pm = (2.2, 1.25)
    qfn(G, "pmic", pm[0], pm[1], 0.9, 0.1, 6)
    pitch = 0.9 * 0.78 / 6
    for k, xv in enumerate((1.2, 1.05, 0.9, 0.75)):
        y = pm[1] + (k - 1.5) * pitch
        c = 0.1
        trace(G, "pwr%d" % k, [(pm[0] - 0.45 - 0.02, y), (xv + c, y), (xv, y - c), (xv, yb)], 0.06)

    # ---- USB-C receptacle + plug
    usb = MB()
    usbc(G, usb)
    finish(usb, "usbc", bevel=0.004)
    cab = BS.curve("usbc_cable", [o + Vector(p) for p in
                                  [(0, 6.25, ZC), (0, 6.6, ZC - 0.03), (0, 7.0, 0.16),
                                   (0, 7.6, 0.096), (0, 9.0, 0.095), (0, 16.0, 0.095)]],
                   0.095, "cable", cat="set")
    cab.data.splines[0].type = "POLY"
    PARTS.append(dict(name="cable", kind="cable", boxes=[], seat=0.0, support="ground", pads=[],
                      tall_ok=True, offboard=True, bbox=(-0.1, 6.25, 0.1, 16.0), top=ZC, zb=0.0))

    # ---- shielding cans
    can(G, "can_w", -3.45, 0.62, -1.42, 3.38, 0.2, rr)
    can(G, "can_e", 1.3, 2.95, 3.45, 4.3, 0.18, rr)

    # ---- east column: inductors, SOT, small QFN
    inductor(G, "l1", 1.75, 2.4)
    inductor(G, "l2", 2.45, 2.4)
    inductor(G, "l3", 3.2, 1.25)
    gull(G, "u_sot_e", 0.98, 2.0, 0.26, 0.58, 0.1, 3, 0.19)
    qfn(G, "u_qfn_e", 0.98, 3.3, 0.44, 0.08, 4)
    # ---- west column: SOT, TSSOP, crystal
    gull(G, "u_sot_w", -1.0, 0.95, 0.26, 0.58, 0.1, 3, 0.19)
    gull(G, "u_tssop", -1.0, 2.45, 0.3, 0.62, 0.09, 4, 0.13)
    crystal(G, "xtal", -0.98, 3.75)
    trace(G, "xtal_a", [(-1.19, 3.6), (-1.19, 3.2), (-1.24, 3.15), (-1.24, 2.645)], 0.03)
    # ---- north: electrolytics, B2B connector
    elco(G, "c_elco1", -1.5, 4.72)
    elco(G, "c_elco2", -2.08, 4.72)
    elco(G, "c_elco3", 1.6, 4.72)
    b2b(G, "j_b2b", -2.75, 3.9)
    # ---- south: inductors, QFN, B2B-side passives
    inductor(G, "l4", -0.95, -3.35)
    inductor(G, "l5", -0.3, -3.35)
    qfn(G, "u_qfn_s", 0.55, -3.35, 0.56, 0.08, 5)
    gull(G, "u_sot_s", 1.55, -3.35, 0.26, 0.58, 0.1, 3, 0.19)

    # ---- passives: decoupling columns along the corridor, rows elsewhere
    for y in (0.1, 0.42, 0.74, 1.06, 1.8, 2.12, 2.5, 2.82, 3.14, 3.46, 3.78, 4.1):
        for x in (-0.63, 0.63):
            sz = SIZES["0402"] if rr.random() < 0.7 else SIZES["0201"]
            hx, hy = sz[1] * 0.6, sz[0] / 2 + 0.28 * sz[2] + 0.012
            if free(x - hx, y - hy, x + hx, y + hy, 0.02):
                chip(G, "cd%.2f_%.2f" % (x, y), x, y, *sz, "y", "bd_cer")
    chip_row(G, "cr_n_e", 1.45, 0.35, 3.3, rr, axis="y")
    chip_row(G, "cr_n_w", -3.3, 0.35, -1.5, rr, axis="y")
    chip_row(G, "cr_s", -2.9, -2.75, 2.9, rr, axis="y")
    chip_row(G, "cr_s2", -3.2, -3.8, -1.5, rr, axis="x")
    chip_row(G, "cr_s3", 2.0, -3.8, 3.0, rr, axis="x")
    chip_row(G, "cr_ne", 2.1, 4.65, 2.9, rr, axis="y")
    chip_row(G, "cr_nw", -3.35, 4.65, -2.55, rr, axis="y")
    chip_row(G, "cr_w2", -3.3, 0.0, -1.6, rr, axis="x")
    for (x, y) in ((-1.42, 4.2), (-1.42, 3.95), (1.05, 4.15), (1.05, 3.9), (1.1, 1.7),
                   (-1.25, 1.7), (-1.25, 1.45)):
        sz = SIZES["0402"]
        if free(x - 0.13, y - 0.07, x + 0.13, y + 0.07, 0.02):
            chip(G, "cx%.2f_%.2f" % (x, y), x, y, *sz, "x", "bd_cer")

    # ---- test pads, fiducials, mounting holes
    for i, (x, y) in enumerate(((-0.63, 1.43), (0.63, 1.43), (-0.63, 2.3), (1.0, -3.85),
                                (-1.6, -3.8), (2.4, 4.05))):
        if free(x - 0.09, y - 0.09, x + 0.09, y + 0.09, 0.01):
            test_pad(G, "tp%d" % i, x, y)
    for (x, y) in ((-3.38, 4.95), (3.38, -3.7), (-3.38, -2.9)):
        if free(x - 0.07, y - 0.07, x + 0.07, y + 0.07, 0.01):
            G["copper"].cyl(x, y, TOP, 0.032, 0.008, "bd_solder", seg=20, smooth=False)
            ext(G["silk"], [(x + 0.07 * math.cos(a), y + 0.07 * math.sin(a))
                            for a in [2 * math.pi * k / 24 for k in range(24)]], TOP - 0.0, TOP + 0.0004,
                "bd_fr4")
            occ(x - 0.07, y - 0.07, x + 0.07, y + 0.07, "fid")
    for (x, y) in ((-3.3, -3.6), (3.3, -3.25), (3.3, 4.85)):
        if not free(x - 0.22, y - 0.22, x + 0.22, y + 0.22, 0.0):
            continue
        G["copper"].cyl(x, y, TOP, 0.2, 0.01, "bd_solder", seg=40, smooth=False)
        G["copper"].cyl(x, y, TOP, 0.11, 0.0105, "bd_hole", seg=32, smooth=False)
        occ(x - 0.22, y - 0.22, x + 0.22, y + 0.22, "hole")
        for k in range(8):
            a = 2 * math.pi * k / 8
            via(G, x + 0.27 * math.cos(a), y + 0.27 * math.sin(a), 0.022)

    # ---- vias: stitching along the corridor, fan-out at the SoC, field vias
    for y in [0.0 + 0.25 * k for k in range(17)]:
        for x in (-0.45, 0.45):
            via(G, x, y)
    for k in range(-14, 15, 2):
        via(G, k * BALL, SUB[3] + 0.17, 0.02)
    for _ in range(900):
        x, y = rr.uniform(PCB[0] + 0.2, PCB[2] - 0.2), rr.uniform(PCB[1] + 0.2, PCB[3] - 0.2)
        if abs(x) < CORR and A0 < y < A1:
            continue
        via(G, x, y, rr.choice((0.02, 0.026, 0.026, 0.032)))

    # ---- silkscreen glyph clusters (abstract, non-readable)
    for _ in range(240):
        x, y = rr.uniform(PCB[0] + 0.2, PCB[2] - 0.4), rr.uniform(PCB[1] + 0.2, PCB[3] - 0.3)
        if abs(x) < CORR + 0.05 and A0 < y < A1:
            continue
        silk_glyph(G, x, y, rr, vertical=rr.random() < 0.3)
    # board-edge frame line (dashed)
    for (x0, y0, x1, y1) in ((PCB[0] + 0.1, PCB[1] + 0.1, PCB[2] - 0.1, PCB[1] + 0.114),
                             (PCB[0] + 0.1, PCB[3] - 0.114, PCB[2] - 0.1, PCB[3] - 0.1)):
        x = x0
        while x < x1:
            if free(x, y0, x + 0.12, y1, 0.005):
                G["silk"].box(x, y0, TOP, x + 0.12, y1, TOP + 0.0012, "bd_silk")
            x += 0.2

    for k, mb in G.items():
        finish(mb, "board_" + k, bevel={"parts": 0.006, "can": 0.003, "alu": 0.0}.get(k, 0.0))
    BD["hero_trace"] = finish(hero, "board_hero")

    # ---- pulse, trail
    pm_ = MB()
    pm_.sphere((0, 0, 0), PULSE_R, "pulse", sub=3)
    BD["pulse"] = ob_place(pm_, "board_pulse", o)
    path = pulse_path()
    BD["path"] = path
    tp = BS.curve("trace_pulse", [o + p for p in path], 0.014, "bd_trail", cat="set")
    tcu = bpy.data.curves.new("bd_taper", "CURVE")
    tcu.dimensions = "2D"
    sp = tcu.splines.new("POLY")
    sp.points.add(3)
    for i, (x, y) in enumerate(((0.0, 0.0), (0.45, 0.18), (0.85, 0.6), (1.0, 1.0))):
        sp.points[i].co = (x, y, 0, 1)
    tob = bpy.data.objects.new("bd_taper", tcu)
    SETS_COLL = bpy.data.collections["SET_board"]
    SETS_COLL.objects.link(tob)
    tob.hide_render = True
    tp.data.taper_object = tob
    try:
        tp.data.use_map_taper = True
    except AttributeError:
        pass
    tp.data.bevel_resolution = 4
    BD["trace_pulse"] = tp
    BD["trace_x"] = 0.0
    BD["trace_a0"], BD["trace_a1"] = A0, A1
    BD["slot"] = o + Vector((0.0, Y_SLOT, ZC))
    return BD


# --------------------------------------------------------------------------- pulse motion
def pulse_path():
    """Board-local polyline: hero trace -> climbs the rear leg -> through the slot above the
    tongue -> contract end point (0, 4.87, 0.33)."""
    from sets.common import catmull
    ctrl = [(4.30, 0.16), (4.39, 0.163), (4.425, 0.205), (4.443, 0.262), (4.47, 0.305),
            (4.51, 0.322), (4.62, 0.329), (4.75, 0.33), (4.87, 0.33)]
    tail = catmull([Vector((0.0, y, z)) for y, z in ctrl], 6)
    return [Vector((0.0, A0, 0.16))] + tail


def _cum(path):
    c = [0.0]
    for a, b in zip(path[:-1], path[1:]):
        c.append(c[-1] + (b - a).length)
    return c


def _at(path, cum, s):
    s = clamp(s, 0.0, cum[-1])
    for i in range(len(path) - 1):
        if s <= cum[i + 1] or i == len(path) - 2:
            u = (s - cum[i]) / max(cum[i + 1] - cum[i], 1e-9)
            return path[i].lerp(path[i + 1], clamp(u))
    return path[-1]


def _pulse(t, cam_pos, path, cum):
    """(board-local position, scale factor, arc length) of the pulse at time t."""
    S_END = cum[-1]
    S_LEG = 4.30 - A0
    k = 0.45

    def sm(a):
        return (a + S_END - math.sqrt((a - S_END) ** 2 + k * k)) / 2

    def sf(tt):
        return (cam_pos(min(max(tt, 113.0), 142.0)) - B0).y + 0.9 - A0
    s = S_END if t >= 142 else sm(sf(t)) * S_END / sm(sf(142.0))
    e = BS.ease_out_back(clamp((t - 115.0) / 2.0), 1.4) if t < 117 else 1.0
    sc = e * lerp(1.0, PULSE_END, smooth((s - S_LEG) / (S_END - S_LEG)))
    return _at(path, cum, s), sc, s


def _linear(ob):
    act = ob.animation_data.action if ob.animation_data else None
    if act is None:
        return
    fcs = list(act.fcurves) if hasattr(act, "fcurves") else         [fc for ly in act.layers for st in ly.strips for cb in st.channelbags for fc in cb.fcurves]
    for fc in fcs:
        for kp in fc.keyframe_points:
            kp.interpolation = "LINEAR"


def key_at(ob, keys):
    """keys: [(frame, location, scale)] -> linear keys (motion blur follows them)."""
    ob.animation_data_clear()
    for (f, loc, sc) in keys:
        ob.location, ob.scale = loc, (sc,) * 3
        ob.keyframe_insert("location", frame=f)
        ob.keyframe_insert("scale", frame=f)
    _linear(ob)
    ob.location, ob.scale = keys[0][1], (keys[0][2],) * 3
    # matrix_world is read right after state() (journey.focus_at); keep it current, not a frame late
    ob.matrix_world = Matrix.LocRotScale(keys[0][1], None, (keys[0][2],) * 3)


def state(t, D, cam_pos):
    """The pulse leaves the SoC on the hero trace, climbs the rear leg and enters the USB-C slot.
    cam_pos(t) -> world position of the journey camera in the board shot. Position and scale are
    keyed at t and t + 0.5 so motion blur sees the pulse travel with the camera."""
    path = D["path"]
    cum = D.setdefault("cum", _cum(path))
    vis = t >= 115.0
    ob = D["pulse"]
    ob.hide_render = not vis
    p0, sc0, s0 = _pulse(t, cam_pos, path, cum)
    p1, sc1, _ = _pulse(t + 0.5, cam_pos, path, cum)
    key_at(ob, [(t, B0 + p0, max(sc0, 1e-3)), (t + 0.5, B0 + p1, max(sc1, 1e-3))])
    # trail: tapered window behind the pulse, shrinking with it
    k_end = max(sc0, 1e-3) / max(1.0, 1e-3)
    L = TRAIL * clamp(k_end, 0.15, 1.0)
    window(D["trace_pulse"], s0 / cum[-1] if vis else 0.0, L / cum[-1])
    D["trace_pulse"].data.bevel_depth = 0.014 * clamp(k_end, 0.2, 1.0)
    # hero copper glow trailing the pulse
    head, gain = D["hero_nodes"]
    head.outputs[0].default_value = p0.y
    gain.outputs[0].default_value = clamp((t - 115.0) / 2.0) if vis else 0.0


build = build_board


# --------------------------------------------------------------------------- physical logic
def _seg_dist(p, a, b):
    ab = (b[0] - a[0], b[1] - a[1])
    L2 = ab[0] ** 2 + ab[1] ** 2
    u = 0.0 if L2 == 0 else clamp(((p[0] - a[0]) * ab[0] + (p[1] - a[1]) * ab[1]) / L2)
    q = (a[0] + u * ab[0], a[1] + u * ab[1])
    return math.hypot(p[0] - q[0], p[1] - q[1])


def _segseg(a, b, c, d):
    def ccw(p, q, r):
        return (r[1] - p[1]) * (q[0] - p[0]) - (q[1] - p[1]) * (r[0] - p[0])
    d1, d2, d3, d4 = ccw(c, d, a), ccw(c, d, b), ccw(a, b, c), ccw(a, b, d)
    if ((d1 > 0) != (d2 > 0)) and ((d3 > 0) != (d4 > 0)):
        return 0.0
    return min(_seg_dist(a, c, d), _seg_dist(b, c, d), _seg_dist(c, a, b), _seg_dist(d, a, b))


def _rect_seg(r, a, b, w):
    """True if a trace segment of width w overlaps rect r."""
    if r[0] > max(a[0], b[0]) + w or r[2] < min(a[0], b[0]) - w or             r[1] > max(a[1], b[1]) + w or r[3] < min(a[1], b[1]) - w:
        return False
    n = max(2, int(math.hypot(b[0] - a[0], b[1] - a[1]) / 0.005))
    for i in range(n + 1):
        u = i / n
        x, y = a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u
        dx = max(r[0] - x, 0, x - r[2])
        dy = max(r[1] - y, 0, y - r[3])
        if math.hypot(dx, dy) < w / 2 - 1e-6:
            return True
    return False


def _in(r, x, y, e=1e-6):
    return r[0] - e <= x <= r[2] + e and r[1] - e <= y <= r[3] + e


def check(D=None):
    """Physical-logic violations of the board set (empty list = clean)."""
    v = []
    e = 1e-5
    # contract 2a / 2b geometry
    if abs(SOC_W - CARD_W * 4) > e or abs(SOC_H - CARD_H * 4) > e or SOC.length > e + 1.4 + 1e-9 \
            or abs(SOC.x) > e or abs(SOC.y + 1.4) > e:
        v.append("contract 2a: SoC footprint/centre changed")
    if D is not None:
        if (D["soc_top"] - B0 - Vector((0, -1.4, SOC_TOP))).length > 2e-3 or                 abs(SOC_TOP - 0.42) > e:
            v.append("contract 2a: soc_top must be board-local (0, -1.4, 0.42)")
        if (D["slot"] - B0 - Vector((0, 4.45, 0.29))).length > 2e-3:
            v.append("contract 2b: slot must be board-local (0, 4.45, 0.29)")
        if abs(D["trace_x"]) > e or abs(D["trace_a1"] - 4.45) > e:
            v.append("contract 2b: trace axis changed")
        end = D["path"][-1]
        if (end - Vector((0, 4.87, 0.33))).length > e:
            v.append("contract 2b: pulse end point changed")
    # parts rest on their supports
    ptops = {}
    for i, p in enumerate(PADS):
        ptops.setdefault(p["part"], []).append(p["z"][1])
        if p["kind"] != "ring" and abs(p["z"][0] - TOP) > e and p["z"][0] < TOP:
            v.append("pad %d of %s below the board top" % (i, p["part"]))
    for p in PARTS:
        nm, sup = p["name"], p["support"]
        if sup == "pads":
            tops = [PADS[i]["z"][1] for i in p["pads"]]
            if not tops or any(abs(z - p["seat"]) > e for z in tops):
                v.append("%s: body seat %.4f not on its pads %s" % (nm, p["seat"], tops[:3]))
            for i in p["pads"]:
                r = PADS[i]["r"]
                bb = p["bbox"]
                if not (r[0] < bb[2] + 0.12 and r[2] > bb[0] - 0.12 and r[1] < bb[3] + 0.12 and
                        r[3] > bb[1] - 0.12):
                    v.append("%s: pad %d not under the part" % (nm, i))
        elif sup == "balls":
            if abs(p["seat"] - BALL_TOP) > e:
                v.append("%s: substrate not seated on the balls" % nm)
        elif sup == "legs":
            if not p["pads"]:
                v.append("%s: legs without pads" % nm)
            if p["kind"] == "usbc" and abs(p["boxes"][0][2] - TOP) > e:
                v.append("usbc shell not resting on the board top")
        elif sup == "receptacle":
            if p["bbox"][1] < PCB[3] + 0.05 - 1e-6 or min(b[2] for b in p["boxes"]) < 0.0:
                v.append("%s: plug body must sit beyond the board edge and above the ground" % nm)
        elif sup == "ground":
            pass
        if p["zb"] == TOP and not p["offboard"]:
            bb = p["bbox"]
            if bb[0] < PCB[0] or bb[2] > PCB[2] or bb[1] < PCB[1] or bb[3] > PCB[3]:
                v.append("%s: footprint leaves the board" % nm)
        if p["zb"] > TOP + e:    # parts on the SoC substrate
            bb = p["bbox"]
            if not (SUB[0] <= bb[0] and bb[2] <= SUB[2] and SUB[1] <= bb[1] and bb[3] <= SUB[3]):
                v.append("%s: off the substrate" % nm)
            if abs(bb[0]) < SOC_W / 2 and abs(bb[2]) < SOC_W / 2 and \
                    SOC.y - SOC_H / 2 < (bb[1] + bb[3]) / 2 < SOC.y + SOC_H / 2:
                v.append("%s: under the SoC lid" % nm)
    # a fillet on every pad, and every fillet foot on its pad at the pad top
    for i, p in enumerate(PADS):
        if p["fil"] < 1:
            v.append("pad %d of %s has no solder fillet" % (i, p["part"]))
    for f in FILLETS:
        p = PADS[f["pad"]]
        if not _in(p["r"], *f["foot"], e=0.004) or abs(f["z"] - p["z"][1]) > e:
            v.append("fillet off its pad (%s)" % p["part"])
    # no intersections between parts (3D boxes), no shorts between pads of different parts
    for i in range(len(PARTS)):
        for j in range(i + 1, len(PARTS)):
            a, b = PARTS[i], PARTS[j]
            for ba in a["boxes"]:
                for bb in b["boxes"]:
                    if all(ba[k] < bb[k + 3] - 1e-4 and bb[k] < ba[k + 3] - 1e-4 for k in range(3)):
                        v.append("intersection: %s x %s" % (a["name"], b["name"]))
                        break
                else:
                    continue
                break
    board_pads = [p for p in PADS if abs(p["z"][0] - TOP) < e]
    for i in range(len(board_pads)):
        for j in range(i + 1, len(board_pads)):
            a, b = board_pads[i], board_pads[j]
            if a["part"] == b["part"]:
                continue
            ra, rb = a["r"], b["r"]
            if ra[0] < rb[2] and rb[0] < ra[2] and ra[1] < rb[3] and rb[1] < ra[3]:
                v.append("pads short: %s x %s" % (a["part"], b["part"]))
    # traces: 45-degree routing, pad to pad, no shorts
    term = [p["r"] for p in board_pads] + [(x - r, y - r, x + r, y + r) for (x, y, r) in VIAS]
    for tr in TRACES:
        pts = tr["pts"]
        for a, b in zip(pts[:-1], pts[1:]):
            ang = math.degrees(math.atan2(b[1] - a[1], b[0] - a[0])) % 45.0
            if min(ang, 45.0 - ang) > 0.05:
                v.append("%s: segment not on a 45-degree grid" % tr["name"])
        ends = []
        for q in (pts[0], pts[-1]):
            hit = [k for k, r in enumerate(term) if _in(r, *q)]
            if not hit:
                v.append("%s: end %s not on a pad or via" % (tr["name"], q))
            ends += hit
        for k, r in enumerate(term[:len(board_pads)]):
            if k in ends:
                continue
            for a, b in zip(pts[:-1], pts[1:]):
                if _rect_seg(r, a, b, tr["w"] + 0.01):
                    v.append("%s: crosses a foreign pad (%s)" % (tr["name"], board_pads[k]["part"]))
                    break
        for (x, y, r) in VIAS:
            for a, b in zip(pts[:-1], pts[1:]):
                if _seg_dist((x, y), a, b) < r + tr["w"] / 2 + 0.005:
                    v.append("%s: crosses a via at (%.2f, %.2f)" % (tr["name"], x, y))
                    break
        for p in PARTS:
            if p["offboard"] or p["seat"] > TR_TOP - e:
                continue
            for bx in p["boxes"]:
                if bx[2] >= TR_TOP - e:
                    continue
                r = bx[:2] + bx[3:5]
                if any(_rect_seg(r, a, b, tr["w"]) for a, b in zip(pts[:-1], pts[1:])):
                    v.append("%s: runs into %s" % (tr["name"], p["name"]))
    for i in range(len(TRACES)):
        for j in range(i + 1, len(TRACES)):
            A, B = TRACES[i], TRACES[j]
            for a, b in zip(A["pts"][:-1], A["pts"][1:]):
                for c, d in zip(B["pts"][:-1], B["pts"][1:]):
                    if _segseg(a, b, c, d) < (A["w"] + B["w"]) / 2 + 0.01:
                        v.append("traces short: %s x %s" % (A["name"], B["name"]))
    # vias clear of each other
    for i in range(len(VIAS)):
        for j in range(i + 1, len(VIAS)):
            a, b = VIAS[i], VIAS[j]
            if math.hypot(a[0] - b[0], a[1] - b[1]) < a[2] + b[2] + 0.005:
                v.append("vias overlap at (%.2f, %.2f)" % a[:2])
    # flight corridor (contract 2b): nothing tall in |x| < 0.5 between the SoC and the USB-C
    for p in PARTS:
        if p["tall_ok"] or p["offboard"]:
            continue
        bb = p["bbox"]
        if bb[0] < CORR and bb[2] > -CORR and bb[1] < A1 and bb[3] > A0 and p["top"] > TOP + 0.06:
            v.append("%s: tall part in the flight corridor" % p["name"])
    return sorted(set(v))
