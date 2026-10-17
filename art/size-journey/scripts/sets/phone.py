"""Phone set (Mini + Klein). Owner: phone agent. Seam contract: POLISH.md (2a, T1).

Phone-local layout (units = 10 cm, desk top z = 0, phone at P0 with yaw 0):
  desk mat   z 0 .. H_MAT under the lower part of the phone and the whole cable/router area;
             its north edge (y = MAT_EDGE) runs under the phone.
  phone      back z = H_MAT rests on the mat; the camera bump (top right seen from the front)
             lies past the mat edge and rests on the desk with its lens rings -> the phone lies
             level, glass top 0.0815, UI tile tops 0.0845 (seam 2a).
  UI         status bar, header (title, avatar + notification ring), filter chips, the code card
             (primary card == SoC top x4), two list cards, a floating tab bar, home indicator.
  cable      USB-C plug in the phone's port -> cable resting on the mat -> plug in the router's
             side port. The pulse runs inside the cable (phone -> router).
Idle loops (journey frames): Mini 0..30 and Klein 66..96 are seamless (state(a) == state(b)).
check(D) reports contact / overlap problems (physical logic, POLISH.md section 3).
"""
import math

import bmesh
import bpy
from mathutils import Matrix, Vector
from mathutils.bvhtree import BVHTree

import build_scene as BS
from build_scene import MB
import look as LB
from sets.common import (P0, SETS, new_coll, ob_place, CODE, CARD_W, CARD_H, CURSOR_LINE, line_y,
                         clamp, smooth, lerp, emit, window)

PH = {}

# --------------------------------------------------------------------------- dimensions
H_MAT = 0.008           # thin desk-mat thickness == camera-bump height (phone lies level)
MAT_EDGE = 0.40         # mat north edge (phone-local y), under the phone, south of the bump
MAT_RECT = (-3.0, -3.4, 4.0, MAT_EDGE)
PW, PL, PR = 0.38, 0.78, 0.10          # phone half width / half length / plan corner radius
Z_BACK = H_MAT
Z_GL0 = 0.0785          # frame top == glass bottom
Z_GLASS = 0.0815        # glass top (UI sits on it)
ZT = 0.0845             # UI tile top (seam 2a)
PORT_Z = 0.5 * (Z_BACK + Z_GLASS)
GLASS_IN = 0.009        # glass inset from the outline (metal rim visible around it)
DISP_IN = 0.035         # display inset from the outline (bezel = DISP_IN - GLASS_IN)
CARD_C = (0.0, 0.26)
# seam 2a materials (contract: tile `clay`, gutter `clay2`). The lead may set these before build
# (together with the SoC side) if the Mini contrast proposal in POLISH.md is accepted.
CARD_TILE, CARD_GUTTER = "clay", "clay2"
CABLE_R = 0.016
# router (travel router), placed on the mat
RC = Vector((1.12, -0.72, 0.0))
RY = math.radians(22.0)
RW, RD, RH = 0.32, 0.24, 0.20
R_FEET = 0.007
R_ZB = H_MAT + R_FEET
R_PORT = (-RW, -0.06, R_ZB + 0.06)     # router-local port centre (west face)
PLUG_LEN = 0.27                         # port face -> strain-relief end

# timing (journey frames)
DEL0, DEL1 = 11.0, 14.0                 # Mini loop: lines 5-7 are selected and deleted ...
TYPE0 = 14.6                            # ... and typed again (token by token)
RETYPE = (5, 6, 7)
TYPE_V = 0.095                          # card units per frame
RING_T = 70.0
PULSE_T0, PULSE_T1 = 74.0, 90.0


# --------------------------------------------------------------------------- geometry helpers
def rr_loop(x0, y0, x1, y1, r, n=8, sup=0.2):
    """CCW rounded rectangle with support points next to every arc (clean smooth shading)."""
    r = max(1e-4, min(r, (x1 - x0) / 2, (y1 - y0) / 2))
    cs = ((x1 - r, y0 + r, -90.0), (x1 - r, y1 - r, 0.0), (x0 + r, y1 - r, 90.0),
          (x0 + r, y0 + r, 180.0))
    arcs = []
    for cx, cy, a0 in cs:
        arcs.append([(cx + r * math.cos(math.radians(a0 + 90.0 * k / n)),
                      cy + r * math.sin(math.radians(a0 + 90.0 * k / n))) for k in range(n + 1)])
    pts = []
    for i, arc in enumerate(arcs):
        nxt = arcs[(i + 1) % 4][0]
        e = arc[-1]
        d = Vector((nxt[0] - e[0], nxt[1] - e[1]))
        L = d.length
        pts += arc
        if L > 0.8 * r:
            s = sup * r
            dn = d / L
            pts.append((e[0] + dn.x * s, e[1] + dn.y * s))
            pts.append((nxt[0] - dn.x * s, nxt[1] - dn.y * s))
    out = []                                  # pills: arcs meet, drop coincident points
    for p in pts:
        if not out or (p[0] - out[-1][0]) ** 2 + (p[1] - out[-1][1]) ** 2 > 1e-12:
            out.append(p)
    if (out[0][0] - out[-1][0]) ** 2 + (out[0][1] - out[-1][1]) ** 2 <= 1e-12:
        out.pop()
    return out


def prism_f(mb, loop, w0, w1, O=(0, 0, 0), U=(1, 0, 0), V=(0, 1, 0), W=(0, 0, 1), mat="clay",
            top=None, inner=None, inner_mat=None, smooth=True):
    """Extrude a CCW loop (u, v) from w0 to w1 in the right-handed frame (U, V, W) at O.
    inner: optional inset loop (same point count) on the top cap with its own material."""
    O, U, V, W = Vector(O), Vector(U), Vector(V), Vector(W)
    bm = mb.bm
    n = len(loop)

    def P(u, v, w):
        return O + U * u + V * v + W * w
    vb = [bm.verts.new(P(u, v, w0)) for u, v in loop]
    vt = [bm.verts.new(P(u, v, w1)) for u, v in loop]
    mi = BS.M[mat]
    for i in range(n):
        j = (i + 1) % n
        f = bm.faces.new((vb[i], vb[j], vt[j], vt[i]))
        f.material_index = mi
        f.smooth = smooth
    f = bm.faces.new(list(reversed(vb)))
    f.material_index = mi
    tm = BS.M[top or mat]
    if inner is None:
        f = bm.faces.new(vt)
        f.material_index = tm
    else:
        vi = [bm.verts.new(P(u, v, w1)) for u, v in inner]
        for i in range(n):
            j = (i + 1) % n
            f = bm.faces.new((vt[i], vt[j], vi[j], vi[i]))
            f.material_index = tm
        f = bm.faces.new(vi)
        f.material_index = BS.M[inner_mat]


def rbox(mb, x0, y0, x1, y1, z0, z1, r, mat, n=6, top=None):
    prism_f(mb, rr_loop(x0, y0, x1, y1, r, n), z0, z1, mat=mat, top=top)


def disc(mb, cx, cy, z0, h, r, mat, seg=32):
    mb.cyl(cx, cy, z0, r, h, mat, seg=seg, smooth=False)


def annulus(mb, cx, cy, z0, z1, ri, ro, mat, seg=56):
    bm = mb.bm
    mi = BS.M[mat]

    def ring(r, z):
        return [bm.verts.new((cx + r * math.cos(2 * math.pi * k / seg),
                              cy + r * math.sin(2 * math.pi * k / seg), z)) for k in range(seg)]
    ob_, ot, ib, it = ring(ro, z0), ring(ro, z1), ring(ri, z0), ring(ri, z1)
    for k in range(seg):
        j = (k + 1) % seg
        for q in ((ob_[k], ob_[j], ot[j], ot[k]), (ib[j], ib[k], it[k], it[j]),
                  (ot[k], ot[j], it[j], it[k]), (ob_[j], ob_[k], ib[k], ib[j])):
            f = bm.faces.new(q)
            f.material_index = mi


def band(mb, loop_in, loop_out, z0, z1, mat):
    """Closed band between two loops of equal length (e.g. a parting line around a body)."""
    bm = mb.bm
    mi = BS.M[mat]
    ib = [bm.verts.new((x, y, z0)) for x, y in loop_in]
    it = [bm.verts.new((x, y, z1)) for x, y in loop_in]
    ob_ = [bm.verts.new((x, y, z0)) for x, y in loop_out]
    ot = [bm.verts.new((x, y, z1)) for x, y in loop_out]
    n = len(loop_in)
    for k in range(n):
        j = (k + 1) % n
        for q in ((ob_[k], ob_[j], ot[j], ot[k]), (ib[j], ib[k], it[k], it[j]),
                  (ot[k], ot[j], it[j], it[k]), (ob_[j], ob_[k], ib[k], ib[j])):
            f = bm.faces.new(q)
            f.material_index = mi
            f.smooth = True


def place(mb, name, loc=(0, 0, 0), rot=0.0, bevel=0.0, segs=3, lit=True, glint=False,
          pivot=False):
    """Bake loc/rot into the mesh so the object sits exactly at P0 (float32 at x = -5000 has a
    0.0005 ulp; baked parts stay exact relative to each other). pivot=True keeps the offset as
    the object origin (for scale animation)."""
    if not pivot and (tuple(loc) != (0, 0, 0) or rot):
        M = Matrix.Translation(Vector(loc)) @ Matrix.Rotation(rot, 4, "Z")
        bmesh.ops.transform(mb.bm, matrix=M, verts=mb.bm.verts)
        loc, rot = (0, 0, 0), 0.0
    ob = ob_place(mb, name, P0 + Vector(loc), rot, bevel=bevel)
    if bevel:
        ob.modifiers["Bevel"].segments = segs
    if lit:
        PH["_lit"].append(ob)
    if glint:
        PH["_glint"].append(ob)
    return ob


# --------------------------------------------------------------------------- materials
def _vary(m, scale, val, rough):
    """Low-frequency value (+-val) and roughness (+-rough) variation on a look clay material."""
    nt = m.node_tree
    n, l = nt.nodes, nt.links
    b = n.get("Principled BSDF")
    tc = n.new("ShaderNodeTexCoord")
    nz = n.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = scale
    nz.inputs["Detail"].default_value = 4.0
    nz.inputs["Roughness"].default_value = 0.6
    l.new(tc.outputs["Object"], nz.inputs["Vector"])

    def rng(lo, hi):
        mr = n.new("ShaderNodeMapRange")
        mr.inputs["From Min"].default_value = 0.32
        mr.inputs["From Max"].default_value = 0.68
        mr.inputs["To Min"].default_value = lo
        mr.inputs["To Max"].default_value = hi
        l.new(nz.outputs["Fac"], mr.inputs["Value"])
        return mr.outputs["Result"]
    src = b.inputs["Base Color"].links[0].from_socket
    vm = n.new("ShaderNodeVectorMath")
    vm.operation = "SCALE"
    l.new(src, vm.inputs[0])
    l.new(rng(1.0 - val, 1.0 + val), vm.inputs["Scale"])
    l.new(vm.outputs["Vector"], b.inputs["Base Color"])
    rs = b.inputs["Roughness"].links[0].from_socket
    ad = n.new("ShaderNodeMath")
    ad.operation = "ADD"
    l.new(rs, ad.inputs[0])
    l.new(rng(-rough, rough), ad.inputs[1])
    l.new(ad.outputs[0], b.inputs["Roughness"])
    return m


def _glass(name, theme, base_mul=1.0):
    m = LB.glass_material(name, theme)
    nt = m.node_tree
    b = nt.nodes.get("Principled BSDF")
    c = b.inputs["Base Color"].default_value
    b.inputs["Base Color"].default_value = (c[0] * base_mul, c[1] * base_mul, c[2] * base_mul, 1)
    # faint wipe marks: coat roughness varies 0.015 .. 0.06 (subtle, breaks the CG-perfect mirror)
    tc = nt.nodes.new("ShaderNodeTexCoord")
    nz = nt.nodes.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = 3.5
    nz.inputs["Detail"].default_value = 3.0
    nt.links.new(tc.outputs["Object"], nz.inputs["Vector"])
    mr = nt.nodes.new("ShaderNodeMapRange")
    mr.inputs["From Min"].default_value = 0.4
    mr.inputs["From Max"].default_value = 0.7
    mr.inputs["To Min"].default_value = 0.015
    mr.inputs["To Max"].default_value = 0.06
    nt.links.new(nz.outputs["Fac"], mr.inputs["Value"])
    nt.links.new(mr.outputs["Result"], b.inputs["Coat Roughness"])
    return m


def materials(theme):
    T = LB.CLAY_TIERS[theme]
    sc = LB.NOISE_SCALE["phone"]
    reg = LB.register
    mats = {}
    d = T["dark"]
    mats["desk"] = reg(_vary(LB.clay_material("ph_desk", "dark", theme, rough=0.78, noise=sc * 0.5,
                                              bump=0.03, var=0.05, color=tuple(c * 0.9 for c in d)),
                             0.9, 0.16, 0.1))
    mid = tuple(0.82 * b for b in T["mid"])
    mats["mat"] = reg(_vary(LB.clay_material("ph_mat", "mid", theme, rough=0.86, noise=sc * 6.0,
                                             bump=0.22, var=0.08, color=mid), 2.0, 0.06, 0.04))
    mats["frame"] = reg(LB.clay_material("ph_frame", "light", theme, rough=0.3, noise=sc * 3,
                                         bump=0.01, var=0.03, metallic=0.9,
                                         color=tuple(c * 1.7 for c in T["light"]), bevel=0.003))
    mats["back"] = reg(LB.clay_material("ph_back", "dark", theme, rough=0.45, noise=sc, bevel=0.003))
    mats["metal"] = reg(LB.clay_material("ph_metal", "light", theme, rough=0.25, noise=sc * 3,
                                         bump=0.01, var=0.02, metallic=0.95,
                                         color=tuple(c * 2.2 for c in T["light"]), bevel=0.002))
    mats["plug"] = reg(LB.clay_material("ph_plug", "mid", theme, rough=0.42, noise=sc * 2,
                                        bump=0.02, bevel=0.004))
    mats["cable"] = reg(LB.clay_material("ph_cable", "mid", theme, rough=0.36, noise=sc * 2,
                                         bump=0.01, bevel=0.002))
    mats["router"] = reg(_vary(LB.clay_material("ph_router", "dark", theme, rough=0.4, noise=sc,
                                                bump=0.02, var=0.04, bevel=0.01), 3.0, 0.05, 0.06))
    mats["vent"] = reg(LB.clay_material("ph_vent", "dark", theme, rough=0.7, noise=sc, var=0.02,
                                        color=tuple(c * 0.35 for c in d), bevel=0.001))
    mats["glass"] = reg(_glass("ph_glass", theme))
    mats["display"] = reg(_glass("ph_display", theme, base_mul=1.0))
    mats["ring"] = reg(LB.emission_material("ph_ring", "accent", theme))
    mats["caret"] = reg(LB.emission_material("ph_caret", "accent", theme))
    mats["led_b"] = reg(LB.emission_material("ph_led_b", "led_blue", theme))
    mats["led_w"] = reg(LB.emission_material("ph_led_w", "led_white", theme))
    mats["led_act"] = reg(LB.emission_material("ph_led_act", "led_blue", theme))
    mats["tile2"] = reg(LB.clay_material("ph_tile2", "mid", theme, rough=0.55, noise=sc,
                                         color=tuple(c * 1.0 for c in T["mid"])))
    mats["pulse"] = reg(LB.emission_material("ph_pulse", "accent", theme))   # blue #3b82f6
    _strength(mats["pulse"]).default_value *= 1.5
    mats["trail"] = reg(LB.emission_material("ph_trail", "accent", theme))
    _strength(mats["trail"]).default_value *= 0.45
    mats["token"] = reg(LB.emission_material("ph_token", "accent", theme))
    mats["ink2"] = reg(LB.clay_material("ph_ink2", "light", theme, rough=0.55, noise=sc,
                                        color=tuple(c * 0.85 for c in T["light"])))
    return mats


def _strength(m):
    return m.node_tree.nodes.get("Principled BSDF").inputs["Emission Strength"]


# --------------------------------------------------------------------------- builders
def build_desk():
    mb = MB()
    mb.box(-15, -15, -0.5, 15, 15, 0.0, "ph_desk")
    PH["desk"] = place(mb, "desk")
    mb = MB()
    rbox(mb, *MAT_RECT, 0.0, H_MAT, 0.15, "ph_mat", n=6)
    PH["mat"] = place(mb, "desk_mat", bevel=0.0039, segs=5)


def build_body():
    # frame band + back as one slab; the glass sits on its top face
    mb = MB()
    prism_f(mb, rr_loop(-PW, -PL, PW, PL, PR, 10), Z_BACK, Z_GL0, mat="ph_frame")
    PH["body"] = place(mb, "phone_body", bevel=0.0075, segs=4, glint=True)
    # cover glass: bezel ring + display (dark app background), rounded glass edge
    gi, di = GLASS_IN, DISP_IN
    mb = MB()
    prism_f(mb, rr_loop(-PW + gi, -PL + gi, PW - gi, PL - gi, PR - gi, 10), Z_GL0, Z_GLASS,
            mat="ph_glass", inner=rr_loop(-PW + di, -PL + di, PW - di, PL - di, PR - di, 10),
            inner_mat="ph_display")
    PH["glass"] = place(mb, "phone_glass", bevel=0.0028, segs=3, glint=True)
    # side buttons (right: power; left: action, volume up/down), seated on the flat band
    mb = MB()
    zc = PORT_Z
    for (x0, x1, y0, y1) in ((PW, PW + 0.0065, 0.18, 0.37),
                             (-PW - 0.0065, -PW, 0.50, 0.56),
                             (-PW - 0.0065, -PW, 0.34, 0.44),
                             (-PW - 0.0065, -PW, 0.21, 0.31)):
        mb.box(x0, y0, zc - 0.0105, x1, y1, zc + 0.0105, "ph_frame")
    PH["buttons"] = place(mb, "phone_buttons", bevel=0.0026, segs=3, glint=True)
    # trim: antenna bands, speaker grille + mic holes, screws, earpiece slot
    mb = MB()
    e = 0.0004
    for y in (-0.62, 0.63):
        mb.box(PW, y - 0.0022, Z_BACK + 0.009, PW + e, y + 0.0022, Z_GL0 - 0.008, "ph_vent")
        mb.box(-PW - e, y - 0.0022, Z_BACK + 0.009, -PW, y + 0.0022, Z_GL0 - 0.008, "ph_vent")
    for side in (-1, 1):
        for k in range(6):
            x = side * (0.118 + k * 0.026)
            mb.tube((x, -PL, zc), (x, -PL - e, zc), 0.0052, "ph_vent", seg=12, smooth=False)
        mb.tube((side * 0.085, -PL, zc), (side * 0.085, -PL - e, zc), 0.0042, "ph_metal", seg=12,
                smooth=False)
    rbox(mb, -0.055, PL - 0.0235, 0.055, PL - 0.0185, Z_GLASS, Z_GLASS + 0.0002, 0.0025,
         "ph_vent", n=4)
    PH["trim"] = place(mb, "phone_trim")
    # camera bump on the back (top right seen from the front): plateau + three lens rings + flash;
    # it hangs past the mat edge and rests on the desk with the lens rings
    mb = MB()
    rbox(mb, 0.08, 0.465, 0.345, 0.735, H_MAT * 0.5, Z_BACK, 0.07, "ph_frame", n=8)
    for (x, y) in ((0.148, 0.668), (0.148, 0.532), (0.278, 0.600)):
        mb.cyl(x, y, 0.0, 0.05, H_MAT * 0.5, "ph_metal", seg=40)
        mb.cyl(x, y, 0.0, 0.034, 0.0004, "ph_glass", seg=40, smooth=False)
    mb.cyl(0.278, 0.695, H_MAT * 0.25, 0.016, H_MAT * 0.25, "mark", seg=24, smooth=False)
    PH["camera"] = place(mb, "phone_camera", bevel=0.002, segs=2)


def build_ui():
    """Abstract app UI on the display. Glyphs that sit on a raised element are separate objects:
    the look's bevel shader probes coincident faces of a second stacking level inside one mesh
    and shades them black."""
    z0, zi = Z_GLASS, Z_GLASS + 0.0012                 # display surface, ink height
    # status bar + dynamic island
    mb = MB()
    rbox(mb, -0.055, 0.688, 0.055, 0.721, z0, z0 + 0.0003, 0.0165, "ph_glass", n=8)
    rbox(mb, -0.29, 0.699, -0.215, 0.711, z0, zi, 0.004, "mark", n=4)
    for k, h in enumerate((0.004, 0.0065, 0.009, 0.0115)):
        mb.box(0.165 + k * 0.011, 0.6995, z0, 0.172 + k * 0.011, 0.6995 + h, zi, "mark")
    rbox(mb, 0.226, 0.699, 0.27, 0.7115, z0, zi, 0.003, "mark", n=4)
    mb.box(0.2715, 0.7025, z0, 0.2745, 0.708, zi, "clay")
    PH["status"] = place(mb, "ui_status", lit=False)
    # header: large title, subtitle, avatar (notification ring + badge are separate)
    mb = MB()
    rbox(mb, -0.31, 0.612, -0.03, 0.637, z0, zi, 0.006, "mark", n=4)
    rbox(mb, -0.31, 0.577, -0.13, 0.590, z0, zi, 0.0045, "ph_ink2", n=4)
    PH["header"] = place(mb, "ui_header", lit=False)
    av = (0.268, 0.606, 0.0)
    mb = MB()
    disc(mb, 0.0, 0.0, z0, 0.0025, 0.038, "clay", seg=48)
    PH["avatar"] = place(mb, "ui_avatar", av, lit=False, pivot=True)
    mb = MB()
    disc(mb, 0.0, 0.0, z0 + 0.0025, 0.0008, 0.017, "mark", seg=32)
    PH["avatar_g"] = place(mb, "ui_avatar_g", av, lit=False, pivot=True)
    mb = MB()
    disc(mb, 0.0, 0.0, z0 + 0.0025, 0.0012, 0.0095, "line", seg=24)
    PH["badge"] = place(mb, "ui_badge", (av[0] + 0.027, av[1] + 0.027, 0.0), lit=False,
                        pivot=True)
    mb = MB()
    annulus(mb, 0.0, 0.0, z0 + 0.0039, z0 + 0.0045, 0.92, 1.0, "ph_ring")
    PH["ring"] = place(mb, "ui_ring", av, lit=False, pivot=True)
    PH["ring"].scale = (0.05, 0.05, 1.0)
    # filter chips (active one lighter) + their labels (glyph level)
    mb, mg = MB(), MB()
    for k, (a, b) in enumerate(((-0.31, -0.20), (-0.19, -0.075), (-0.065, 0.03))):
        rbox(mb, a, 0.486, b, 0.516, z0, z0 + 0.0016, 0.015, "mark" if k == 0 else "ph_tile2",
             n=6)
        rbox(mg, a + 0.022, 0.4975, b - 0.022, 0.5045, z0 + 0.0016, z0 + 0.0024, 0.0035,
             "clay2" if k == 0 else "ph_ink2", n=3)
    PH["chips"] = place(mb, "ui_chips", lit=False)
    PH["chips_g"] = place(mg, "ui_chips_g", lit=False)
    # the primary card == the code card (tile exactly CARD_W x CARD_H, top ZT, material clay)
    mb = MB()
    cx, cy = CARD_C
    rbox(mb, cx - CARD_W / 2, cy - CARD_H / 2, cx + CARD_W / 2, cy + CARD_H / 2, z0, ZT, 0.03,
         CARD_TILE, n=8)
    PH["code"] = place(mb, "ui_code", bevel=0.0011, segs=2, lit=False)
    build_code_lines()
    # section label
    mb = MB()
    rbox(mb, -0.31, 0.022, -0.21, 0.034, z0, zi, 0.004, "ph_ink2", n=4)
    rbox(mb, 0.25, 0.023, 0.31, 0.033, z0, zi, 0.004, "ph_ink2", n=4)
    PH["label"] = place(mb, "ui_label", lit=False)

    # list cards (darker tiles, lighter content) built around their own centre
    def card(h, variant):
        mt, mb, mg = MB(), MB(), MB()
        rbox(mt, -0.31, -h / 2, 0.31, h / 2, z0, ZT, 0.03, "ph_tile2", n=8)
        zc = ZT
        rbox(mb, -0.285, -0.015, -0.205, 0.065, zc, zc + 0.0016, 0.022, "clay2", n=6)
        if variant == 0:
            disc(mg, -0.245, 0.025, zc + 0.0016, 0.0012, 0.013, "mark", seg=24)
        else:
            disc(mg, -0.256, 0.025, zc + 0.0016, 0.0010, 0.016, "mark", seg=24)
            disc(mg, -0.226, 0.025, zc + 0.0016, 0.0014, 0.010, "ph_ink2", seg=24)
        rbox(mb, -0.18, 0.040, 0.09 if variant == 0 else 0.03, 0.058, zc, zc + 0.0012, 0.005,
             "mark", n=4)
        rbox(mb, -0.18, 0.004, 0.0 if variant == 0 else 0.06, 0.016, zc, zc + 0.0012, 0.004,
             "ph_ink2", n=4)
        if variant == 0:      # deploy progress + toggle
            rbox(mb, -0.285, -0.073, 0.285, -0.065, zc, zc + 0.0008, 0.004, "clay2", n=4)
            rbox(mg, -0.285, -0.073, 0.10, -0.065, zc + 0.0008, zc + 0.0014, 0.004, "mark", n=4)
            rbox(mb, 0.215, 0.01, 0.285, 0.046, zc, zc + 0.0014, 0.018, "clay2", n=6)
            disc(mg, 0.267, 0.028, zc + 0.0014, 0.0008, 0.0135, "mark", seg=24)
        else:                 # activity bars
            for k, hh in enumerate((0.03, 0.05, 0.04, 0.07, 0.06, 0.09)):
                x = 0.12 + k * 0.028
                rbox(mb, x, -0.07, x + 0.016, -0.07 + hh, zc, zc + 0.0012, 0.004,
                     "mark" if k == 5 else "ph_ink2", n=3)
            rbox(mb, -0.18, -0.07, 0.07, -0.058, zc, zc + 0.0012, 0.004, "ph_ink2", n=3)
        return mt, mb, mg
    for nm, y, var in (("card2", -0.12, 0), ("card3", -0.38, 1)):
        mt, mb, mg = card(0.23, var)
        PH[nm] = place(mt, "ui_" + nm, (0.0, y, 0.0), lit=False)
        PH[nm + "_c"] = place(mb, "ui_%s_c" % nm, (0.0, y, 0.0), lit=False)
        PH[nm + "_g"] = place(mg, "ui_%s_g" % nm, (0.0, y, 0.0), lit=False)
    # floating tab bar + home indicator; the active tab's highlight + icon are glyph level
    mt, mb, mg = MB(), MB(), MB()
    rbox(mt, -0.27, -0.69, 0.27, -0.59, z0, ZT, 0.05, "ph_tile2", n=10)
    rbox(mt, -0.085, -0.7295, 0.085, -0.7215, z0, zi, 0.004, "mark", n=4)
    rbox(mb, -0.232, -0.665, -0.128, -0.615, ZT, ZT + 0.0006, 0.025, "ph_ink2", n=8)
    rbox(mg, -0.196, -0.656, -0.164, -0.624, ZT + 0.0006, ZT + 0.0018, 0.008, "mark", n=4)
    for x in (-0.06, 0.06, 0.18):
        rbox(mb, x - 0.016, -0.656, x + 0.016, -0.624, ZT, ZT + 0.0012, 0.008, "ph_ink2", n=4)
    disc(mb, -0.18, -0.6745, ZT, 0.0010, 0.0042, "line", seg=16)
    PH["tabbar"] = place(mt, "ui_tabbar", lit=False)
    PH["tabbar_c"] = place(mb, "ui_tabbar_c", lit=False)
    PH["tabbar_g"] = place(mg, "ui_tabbar_g", lit=False)


def build_code_lines():
    """One object per code line: exactly the bars of card_bars() (scale 1, same materials).
    The typing animation edits the bar vertices; the final state equals card_bars()."""
    cx, cy = CARD_C
    W, H = CARD_W, CARD_H
    x0, y0 = cx - W / 2, cy - H / 2
    bh, rise = 0.032 * H, 0.0012
    PH["lines"] = []
    PH["tok"] = []            # per line: [(a, b) card coords] for the segment boxes (8 verts each)
    for i, segs in enumerate(CODE):
        mb = MB()
        yc = y0 + line_y(i) * H
        for (a, b, mat) in segs:
            mb.box(x0 + a * W, yc - bh / 2, ZT, x0 + b * W, yc + bh / 2, ZT + rise, mat)
        mb.box(x0 + 0.035 * W, yc - bh / 2, ZT, x0 + 0.06 * W, yc + bh / 2, ZT + rise, CARD_GUTTER)
        ob = place(mb, "code_line%d" % i, lit=False)
        co = [0.0] * (len(ob.data.vertices) * 3)
        ob.data.vertices.foreach_get("co", co)
        ob["co0"] = co
        PH["lines"].append(ob)
        PH["tok"].append([(a, b) for (a, b, m) in segs])
    # caret: card_bars() cursor, built at its final place; it travels by location offsets
    mb = MB()
    cw, chh = 0.025 * W, 0.045 * H
    c = caret_loc(CURSOR_LINE, CODE[CURSOR_LINE][-1][1])
    mb.box(c[0] - cw / 2, c[1] - chh, ZT, c[0] + cw / 2, c[1] + chh, ZT + rise * 1.2, "line")
    PH["cursor"] = place(mb, "code_cursor", lit=False)
    PH["caret_home"] = Vector(c)


def caret_loc(i, x_end):
    """Phone-local location of the caret object after x_end (card coords) on line i."""
    cx, cy = CARD_C
    xe = x_end + 0.02
    return (cx - CARD_W / 2 + (xe + 0.0125) * CARD_W, cy - CARD_H / 2 + line_y(i) * CARD_H, 0.0)


def plug_mb():
    """USB-C plug in canonical frame: port face at y = 0, plug sticks out along -y, axis z = 0."""
    mb = MB()
    U, V, W = (1, 0, 0), (0, 0, 1), (0, -1, 0)
    prism_f(mb, rr_loop(-0.042, -0.0125, 0.042, 0.0125, 0.0124, 6), 0.0, 0.012, U=U, V=V, W=W,
            mat="ph_metal")
    prism_f(mb, rr_loop(-0.058, -0.026, 0.058, 0.026, 0.02, 6), 0.012, 0.19, U=U, V=V, W=W,
            mat="ph_plug")
    prof = ((0.19, 0.0215), (0.204, 0.0215), (0.204, 0.0196), (0.211, 0.0196), (0.211, 0.0207),
            (0.228, 0.0199), (0.228, 0.0184), (0.235, 0.0184), (0.235, 0.0190), (0.27, 0.0168))
    for (wa, ra), (wb, rb) in zip(prof[:-1], prof[1:]):
        if wb - wa < 1e-6:
            continue
        m = Matrix.Translation((0, -(wa + wb) / 2, 0)) @ Matrix.Rotation(math.pi / 2, 4, "X")
        mb._cyl(m, ra, rb, wb - wa, "ph_plug", 28, True)
    return mb


def router_frame():
    R = Matrix.Rotation(RY, 3, "Z")
    port = RC + R @ Vector(R_PORT)
    out = R @ Vector((-1.0, 0.0, 0.0))
    return R, port, out


def build_router():
    """Travel router: vented top, two RJ45 jacks + status LEDs on the front (facing the Klein
    camera), USB-C on the west side (phone cable), two hinged stub antennas at the back."""
    mb = MB()
    prism_f(mb, rr_loop(-RW, -RD, RW, RD, 0.06, 10), R_ZB, R_ZB + RH, mat="ph_router")
    PH["router"] = place(mb, "router", RC, RY, bevel=0.016, segs=4)
    top = R_ZB + RH
    mb = MB()
    for k in range(12):                                   # vented top
        x = -0.22 + k * 0.04
        rbox(mb, x, -0.15, x + 0.016, 0.15, top, top + 0.0006, 0.008, "ph_vent", n=4)
    zp = R_ZB + 0.022                                     # parting line (below the ports)
    band(mb, rr_loop(-RW, -RD, RW, RD, 0.06, 10),
         rr_loop(-RW - 0.0006, -RD - 0.0006, RW + 0.0006, RD + 0.0006, 0.0606, 10), zp, zp + 0.0028,
         "ph_vent")
    zj = R_ZB + 0.105                                     # RJ45 jacks on the front face
    for xc in (0.035, 0.185):
        w, h, t = 0.128, 0.098, 0.009
        f = -RD
        mb.box(xc - w / 2, f - 0.0006, zj - h / 2, xc + w / 2, f, zj + h / 2, "ph_vent")
        mb.box(xc - 0.022, f - 0.0006, zj - h / 2 - 0.018, xc + 0.022, f, zj - h / 2, "ph_vent")
        for (x0, z0, x1, z1) in ((xc - w / 2 - t, zj + h / 2, xc + w / 2 + t, zj + h / 2 + t),
                                 (xc - w / 2 - t, zj - h / 2 - t, xc - 0.022, zj - h / 2),
                                 (xc + 0.022, zj - h / 2 - t, xc + w / 2 + t, zj - h / 2),
                                 (xc - w / 2 - t, zj - h / 2, xc - w / 2, zj + h / 2),
                                 (xc + w / 2, zj - h / 2, xc + w / 2 + t, zj + h / 2)):
            mb.box(x0, f - 0.0014, z0, x1, f, z1, "ph_metal")
        mb.box(xc - 0.012, f - 0.0010, zj + h / 2 - 0.022, xc + 0.012, f - 0.0006,
               zj + h / 2 - 0.004, "ph_metal")              # contact fingers hint
    PH["router_top"] = place(mb, "router_vents", RC, RY)
    mb = MB()                                             # front status LEDs + jack LEDs
    zc = R_ZB + RH * 0.62
    for x, m in ((-0.245, "ph_led_w"), (-0.205, "ph_led_b"), (-0.165, "ph_led_b"),
                 (-0.125, "ph_led_act")):
        mb.tube((x, -RD, zc), (x, -RD - 0.0016, zc), 0.0072, m, seg=20, smooth=False)
    for xc in (0.035, 0.185):
        mb.box(xc - 0.073, -RD - 0.0018, zj + 0.049, xc - 0.052, -RD - 0.0014, zj + 0.058,
               "ph_led_w")
    PH["router_leds"] = place(mb, "router_leds", RC, RY, lit=False)
    mb = MB()                                             # rubber feet
    for sx in (-1, 1):
        for sy in (-1, 1):
            mb.cyl(sx * 0.24, sy * 0.17, H_MAT, 0.026, R_FEET, "ph_vent", seg=24)
    PH["router_feet"] = place(mb, "router_feet", RC, RY)
    mb = MB()                                             # hinged stub antennas (back edge)
    tilt = math.radians(14.0)
    d = Vector((0.0, math.sin(tilt), math.cos(tilt)))
    for xa in (-0.2, 0.2):
        rbox(mb, xa - 0.034, RD, xa + 0.034, RD + 0.042, top - 0.075, top - 0.012, 0.012,
             "ph_router", n=4)
        m = Matrix.Translation((xa, RD + 0.021, top - 0.012 - 0.005)) @ \
            Matrix.Rotation(math.pi / 2, 4, "Y")
        mb._cyl(m, 0.012, 0.012, 0.074, "ph_metal", 20, True)          # hinge knuckle
        p0 = Vector((xa, RD + 0.021, top - 0.012))
        p1 = p0 + d * 0.26
        mb.tube(p0, p1, 0.02, "ph_router", seg=24)
        mb.tube(p0 + d * 0.035, p0 + d * 0.041, 0.0204, "ph_vent", seg=24)  # grip ring
        mb.sphere(tuple(p1), 0.02, "ph_router", sub=3)
    PH["router_ant"] = place(mb, "router_antennas", RC, RY, bevel=0.0)


def build_cable():
    # plugs
    PH["plug_phone"] = place(plug_mb(), "plug_phone", (0.0, -PL, PORT_Z), 0.0, bevel=0.0035)
    R, port, out = router_frame()
    PH["plug_router"] = place(plug_mb(), "plug_router", port, RY - math.pi / 2, bevel=0.0035)
    A = Vector((0.0, -PL - PLUG_LEN, PORT_Z))
    B = port + out * PLUG_LEN
    da = Vector((0.0, -1.0, 0.0))
    db = -out
    # 2D route: leaves the phone straight down, sweeps right in a relaxed curve, enters the router
    ctrl = [A - da * 0.12, A, A + da * 0.15, Vector((0.09, -1.33, 0)), Vector((0.24, -1.33, 0)),
            B - db * 0.22, B, B + db * 0.12]
    pts = []
    for i in range(1, len(ctrl) - 2):
        p0, p1, p2, p3 = (Vector((c.x, c.y, 0.0)) for c in ctrl[i - 1:i + 3])
        for k in range(24):
            t = k / 24
            pts.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t +
                              (-p0 + 3 * p1 - 3 * p2 + p3) * t ** 3))
    pts.append(Vector((B.x, B.y, 0.0)))
    # arc-length resample
    acc = [0.0]
    for a, b in zip(pts[:-1], pts[1:]):
        acc.append(acc[-1] + (b - a).length)
    L = acc[-1]
    N = 140
    res = []
    j = 0
    for k in range(N + 1):
        s = L * k / N
        while j < len(acc) - 2 and acc[j + 1] < s:
            j += 1
        u = (s - acc[j]) / max(acc[j + 1] - acc[j], 1e-9)
        res.append((pts[j].lerp(pts[j + 1], u), s))
    # z: rests on the mat, lifts smoothly (horizontal tangent) into both strain reliefs
    rest = H_MAT + CABLE_R
    out_pts = []
    for p, s in res:
        z = rest
        for d, z_end, d0 in ((s, A.z, 0.15), (L - s, B.z, 0.21)):
            if d < d0:
                g = 1.0 - smooth(d / d0)
                z = max(z, rest + (z_end - rest) * g)
        out_pts.append(Vector((p.x, p.y, z)))
    # exact end stubs: the cable caps lie flush on the strain-relief end faces
    out_pts[0], out_pts[1] = A.copy(), A + da * 0.004
    out_pts[-1], out_pts[-2] = B.copy(), B - db * 0.004
    PH["cable_local"] = out_pts
    PH["cable_len"] = L
    PH["cable_pts"] = [P0 + p for p in out_pts]
    # curves carry phone-local points and sit at P0 (precise geometry, see place())
    cab = BS.curve("cable", out_pts, CABLE_R, "ph_cable", cat="set")
    cab.data.bevel_resolution = 4
    PH["cable"] = cab
    PH["_lit"].append(cab)
    pc = BS.curve("cable_pulse", out_pts, CABLE_R * 1.09, "ph_pulse", cat="set")
    pc.data.bevel_resolution = 3
    tr = BS.curve("cable_trail", out_pts, CABLE_R * 1.045, "ph_trail", cat="set")
    tr.data.bevel_resolution = 3
    for ob in (cab, pc, tr):
        ob.location = P0
    PH["cable_pulse"], PH["cable_trail"] = pc, tr
    PH["plug_anchor"] = (A, B)


def build_lights(coll):
    """Bible rig, light-linked to the physical set only (desk, mat, phone body, cable, router):
    the UI and the code card stay lit by the global sun + rim only (seam 2a)."""
    lit = bpy.data.collections.new("PH_LIT")
    for ob in PH["_lit"]:
        lit.objects.link(ob)
    tgt = P0 + Vector((0.45, -0.45, 0.0))
    rig = LB.rig("ph", tgt, 0.55, coll, key=(-125.0, 52.0, 1.0), fill=(-20.0, 28.0, 0.22),
                 rim=(95.0, 16.0, 0.55), base_energy=46.0, receivers=lit)
    rig[0].data.spread = math.radians(48.0)
    for ob in rig:
        ob.visible_camera = False
    # glint: a soft strip whose reflection sweeps the cover glass and the metal rim (Klein view)
    gl = bpy.data.collections.new("PH_GLINT")
    for ob in PH["_glint"]:
        gl.objects.link(ob)
    s = P0 + Vector((0.0, 0.12, Z_GLASS))
    d = Vector((-0.463, 0.605, 0.649)).normalized()
    ld = bpy.data.lights.new("ph_glint", "AREA")
    ld.shape = "RECTANGLE"
    ld.size, ld.size_y = 2.6, 0.9
    ld.energy = 2.4
    ld.color = (0.85, 0.9, 1.0)
    ob = bpy.data.objects.new("ph_glint", ld)
    ob.location = s + d * 3.0
    q = (s - ob.location).to_track_quat("-Z", "Y")
    ob.rotation_euler = (q.to_matrix().to_4x4() @ Matrix.Rotation(math.radians(32), 4, "Z")).to_euler()
    ob.visible_camera = False
    coll.objects.link(ob)
    ob.light_linking.receiver_collection = gl
    PH["lights"] = rig + [ob]


def build_phone():
    coll = new_coll("SET_phone")
    PH.clear()
    PH["_lit"], PH["_glint"] = [], []
    PH["mats"] = materials(BS.ARGS.theme)
    build_desk()
    build_body()
    build_ui()
    build_router()
    build_cable()
    build_lights(coll)
    PH["card_center"] = P0 + Vector((CARD_C[0], CARD_C[1], ZT))
    PH["caret_str0"] = _strength(PH["mats"]["caret"]).default_value
    PH["ring_str0"] = _strength(PH["mats"]["ring"]).default_value
    PH["act_str0"] = _strength(PH["mats"]["led_act"]).default_value
    PH["token_str0"] = _strength(PH["mats"]["token"]).default_value
    return PH


# --------------------------------------------------------------------------- animation
def _blink(ph):
    """Caret alpha over one 15-frame blink period (soft fade, no pop)."""
    if ph < 4.0:
        return 1.0
    if ph < 6.0:
        return 1.0 - smooth((ph - 4.0) / 2.0)
    if ph < 9.0:
        return 0.0
    if ph < 11.0:
        return smooth((ph - 9.0) / 2.0)
    return 1.0


def _schedule():
    """Token start times / durations of the Mini retype (lines RETYPE, in order)."""
    if "_sched" in PH:
        return PH["_sched"]
    out = []
    t = TYPE0
    for n, i in enumerate(RETYPE):
        if n:
            t += 1.0                                    # line break
        for k, (a, b) in enumerate(PH["tok"][i]):
            if k:
                t += 0.35
            dur = max(1.3, (b - a) / TYPE_V)
            out.append((i, k, t, dur))
            t += dur
    PH["_sched"] = out
    PH["_type_end"] = t
    return out


def _ease_back(u, s=1.4):
    u = clamp(u)
    return BS.ease_out_back(u, s) if u < 1.0 else 1.0


def _typing(t):
    """-> (per-line list of visible right edges or None per token, caret (line, x_end), active)."""
    sched = _schedule()
    vis = [[b for (a, b) in toks] for toks in PH["tok"]]
    caret = (CURSOR_LINE, PH["tok"][CURSOR_LINE][-1][1])
    if not (DEL0 <= t < 30.0):
        return vis, caret, False
    if t < DEL1:                                        # select + delete (right -> left wipe)
        u = smooth((t - DEL0) / (DEL1 - DEL0))
        for i in RETYPE:
            toks = PH["tok"][i]
            xs, xe = toks[0][0], toks[-1][1]
            e = lerp(xe, xs, u)
            vis[i] = [min(b, e) if e > a + 1e-4 else None for (a, b) in toks]
        i0 = RETYPE[0]
        ca = (CURSOR_LINE, PH["tok"][CURSOR_LINE][-1][1])
        cb = (i0, PH["tok"][i0][0][0] - 0.02)
        return vis, ("glide", ca, cb, u), True
    for i in RETYPE:
        vis[i] = [None] * len(PH["tok"][i])
    caret = (RETYPE[0], PH["tok"][RETYPE[0]][0][0] - 0.02)
    for (i, k, ts, dur) in sched:
        if t < ts:
            if k == 0 and t >= ts - 1.0:                # caret drops to the new line early
                caret = (i, PH["tok"][i][0][0] - 0.02)
            break
        a, b = PH["tok"][i][k]
        f = _ease_back((t - ts) / dur)
        vis[i][k] = a + (b - a) * f
        caret = (i, vis[i][k])
    return vis, caret, t < PH["_type_end"] + 0.5


def _apply_lines(vis):
    cx, cy = CARD_C
    x0 = cx - CARD_W / 2
    for i, ob in enumerate(PH["lines"]):
        co0 = ob["co0"]
        co = list(co0)
        toks = PH["tok"][i]
        for k, (a, b) in enumerate(toks):
            v = vis[i][k]
            xa = x0 + a * CARD_W
            for j in range(8 * k, 8 * k + 8):
                if v is None:
                    co[3 * j] = xa
                    co[3 * j + 2] = ZT                    # collapsed to a point line (no area)
                else:
                    xr = (co0[3 * j] - xa) / max((b - a) * CARD_W, 1e-9)   # 0 left, 1 right
                    co[3 * j] = xa + xr * (v - a) * CARD_W
        ob.data.vertices.foreach_set("co", co)
        ob.data.update()
        ob.hide_render = False


def _focus(t):
    """Mini focal point: the caret leads (x1.6), the blue tokens recede (x0.4); both ease back to
    the contract values over 30..60, so Mini (0..30) and Klein (66..96) loops stay seamless and
    frame 112 uses the plain `line` material."""
    u = smooth((t - 30.0) / 30.0) if t > 30.0 else 0.0
    return lerp(1.6, 1.0, u), lerp(0.4, 1.0, u)


def _tokens(t, D):
    kt = _focus(t)[1]
    for ob in D["lines"]:
        slot = ob.material_slots[BS.M["line"]]
        if kt >= 0.9999:
            slot.link = "DATA"
        else:
            slot.link = "OBJECT"
            slot.material = D["mats"]["token"]
    _strength(D["mats"]["token"]).default_value = D["token_str0"] * kt


def _caret(t, D, caret):
    cur = D["cursor"]
    if caret[0] == "glide":
        _, (ia, xa), (ib, xb), u = caret
        la, lb = Vector(caret_loc(ia, xa)), Vector(caret_loc(ib, xb))
        loc = la.lerp(lb, u)
    else:
        loc = Vector(caret_loc(*caret))
    cur.location = P0 + (loc - D["caret_home"])
    # alpha: solid while typing / after 96 (seam), soft blink otherwise; Mini and Klein loop
    if DEL0 <= t < 27.0 or t >= 96.0:
        a = 1.0
    elif t < 30.0:
        a = _blink(t + 3.0 if t < DEL0 else t - 27.0)
    else:
        a = _blink((t + 12.0) % 15.0)
    kc = _focus(t)[0]
    slot = cur.material_slots[BS.M["line"]]
    if a >= 0.999 and kc <= 1.0001:
        slot.link = "DATA"
    else:
        slot.link = "OBJECT"
        slot.material = D["mats"]["caret"]
        _strength(D["mats"]["caret"]).default_value = D["caret_str0"] * a * kc
    cur.hide_render = a < 0.03


def _notify(t, D):
    """Klein: the notification ring pops (overshoot) and ripples out; badge pops in and out."""
    ring, badge, av = D["ring"], D["badge"], D["avatar"]
    u = t - RING_T
    if 0.0 <= u < 17.0:
        if u < 5.0:
            r = 0.02 + 0.03 * _ease_back(u / 5.0, 2.2)
            k = 1.3 * smooth(u / 2.0)
        else:
            v = (u - 5.0) / 12.0
            r = 0.05 + 0.042 * (1.0 - (1.0 - v) ** 3)
            k = 1.3 * (1.0 - v) ** 1.6
        ring.scale = (r, r, 1.0)
        _strength(D["mats"]["ring"]).default_value = D["ring_str0"] * k
        ring.hide_render = k < 0.02
    else:
        ring.scale = (0.02, 0.02, 1.0)
        ring.hide_render = True
    # badge: in at 71 (overshoot), out at 91..94
    if 71.0 <= t < 94.0:
        s = _ease_back((t - 71.0) / 4.0, 2.5) * (1.0 - smooth((t - 91.0) / 3.0))
    else:
        s = 0.0
    badge.scale = (max(s, 1e-3), max(s, 1e-3), 1.0)
    badge.hide_render = s < 0.02
    # avatar bump (secondary motion)
    b = 0.0
    if 70.0 <= t < 82.0:
        v = (t - 70.0) / 12.0
        b = 0.09 * math.sin(math.pi * 2.0 * v) * (1.0 - v) ** 2
    av.scale = (1.0 + b, 1.0 + b, 1.0)
    D["avatar_g"].scale = av.scale


def _cards(t, D):
    """Klein: the list dips and springs back (staggered, damped overshoot); rest at 66 and 96."""
    for nm, t0 in (("card2", 72.0), ("card3", 75.0)):
        v = (t - t0) / 18.0
        off = 0.0
        if 0.0 <= v < 1.0:
            off = -0.013 * math.sin(2.0 * math.pi * 1.25 * v) * math.exp(-3.0 * v) * (1.0 - v)
        D[nm].location.y = D[nm + "_c"].location.y = D[nm + "_g"].location.y = P0.y + off
    D["label"].location.y = D["card2"].location.y


def _pulse(t, D):
    """Klein: the pulse leaves the phone and runs inside the cable to the router."""
    Lc, Lt = 0.035, 0.17
    u = (t - PULSE_T0) / (PULSE_T1 - PULSE_T0)
    if 0.0 <= u <= 1.0:
        h = smooth(u) * (1.0 + Lc + Lt) - 0.02
        window(D["cable_pulse"], h, Lc)
        window(D["cable_trail"], h - Lc * 0.5, Lt)
    else:
        D["cable_pulse"].hide_render = True
        D["cable_trail"].hide_render = True
    # router activity LED: dim idle, flickers when the pulse arrives
    k = 0.3
    if 88.5 <= t < 95.0:
        k = (1.0, 0.25, 1.0, 0.4, 0.9, 0.5, 0.3)[int(t - 88.5)]
    _strength(D["mats"]["led_act"]).default_value = D["act_str0"] * k


def state(t, D):
    """Idle / transition motion of the phone set at journey frame t."""
    vis, caret, _ = _typing(t)
    _apply_lines(vis)
    _caret(t, D, caret)
    _tokens(t, D)
    _notify(t, D)
    _cards(t, D)
    _pulse(t, D)


# --------------------------------------------------------------------------- physical check
def _local_mesh(ob, dg):
    """Evaluated mesh of ob in phone-local coordinates (exact for objects sitting at P0)."""
    ev = ob.evaluated_get(dg)
    me = ev.to_mesh()
    mw = ev.matrix_world
    R, t = mw.to_3x3(), mw.translation - P0
    verts = [R @ v.co + t for v in me.vertices]
    polys = [tuple(p.vertices) for p in me.polygons]
    samples = list(verts)
    for p in me.polygons:
        samples.append(R @ p.center + t)
    for e in me.edges:
        samples.append(R @ ((me.vertices[e.vertices[0]].co + me.vertices[e.vertices[1]].co) * 0.5)
                       + t)
    ev.to_mesh_clear()
    return verts, polys, samples


def _snapshot(t, D):
    """Everything state() drives, rounded, for loop comparisons."""
    state(t, D)
    r = lambda v: tuple(round(x, 7) for x in v)  # noqa: E731
    snap = [tuple(round(x, 7) for x in ob.data.vertices[0].co) for ob in D["lines"]]
    for ob in D["lines"]:
        co = [0.0] * (len(ob.data.vertices) * 3)
        ob.data.vertices.foreach_get("co", co)
        snap.append(tuple(round(x, 7) for x in co))
    cur = D["cursor"]
    slot = cur.material_slots[BS.M["line"]]
    snap += [r(cur.location), cur.hide_render, slot.link,
             round(_strength(D["mats"]["caret"]).default_value, 5) if slot.link == "OBJECT" else 0]
    for nm in ("ring", "badge", "avatar", "card2", "card3", "label"):
        snap += [r(D[nm].location), r(D[nm].scale), D[nm].hide_render]
    snap += [(ob.material_slots[BS.M["line"]].link for ob in D["lines"]).__next__(),
             round(_strength(D["mats"]["token"]).default_value, 5)]
    snap += [D["cable_pulse"].hide_render, D["cable_trail"].hide_render,
             round(_strength(D["mats"]["led_act"]).default_value, 5)]
    return snap


def _support_z(x, y):
    """Desk / mat top under phone-local (x, y)."""
    x0, y0, x1, y1 = MAT_RECT
    return H_MAT if (x0 <= x <= x1 and y0 <= y <= y1) else 0.0


def check(D, frames=(0.0, 12.0, 18.0, 74.0, 81.0, 112.0), tol=1e-4):
    """Physical logic of the phone set -> list of violations (empty == OK). Phone-local units.
    Contacts: mat on desk, phone back on the mat, camera bump on the desk (off the mat), glass on
    the frame, UI on the glass, router feet on the mat and router on its feet, plugs seated in
    their ports, the cable rests on the mat between its strain reliefs and ends in both plugs.
    Overlaps: no two solid objects interpenetrate (touching is fine). The glow overlays (pulse,
    trail) ride inside the cable by design and are exempt.
    UI: tiles stay on the display and never overlap, at every frame in `frames` (this runs
    state(); the scene is left at the last frame)."""
    V = []
    dg = bpy.context.evaluated_depsgraph_get()
    state(81.0, D)
    dg.update()
    cache = {}

    def mesh(nm):
        if nm not in cache:
            cache[nm] = _local_mesh(bpy.data.objects[nm], dg)
        return cache[nm]

    def zr(nm):
        vs = mesh(nm)[0]
        return min(v.z for v in vs), max(v.z for v in vs)

    def near(a, b, what):
        if abs(a - b) > tol:
            V.append("%s: %.5f != %.5f" % (what, a, b))
    # resting contacts
    near(zr("desk")[1], 0.0, "desk top")
    near(zr("desk_mat")[0], 0.0, "mat bottom on desk")
    near(zr("phone_body")[0], H_MAT, "phone back on mat")
    near(zr("phone_camera")[0], 0.0, "camera bump on desk")
    near(zr("phone_camera")[1], Z_BACK, "camera bump under phone back")
    cam_y = min(v.y for v in mesh("phone_camera")[0])
    if cam_y <= MAT_EDGE:
        V.append("camera bump lies on the mat (y %.3f <= mat edge %.3f)" % (cam_y, MAT_EDGE))
    if min(v.y for v in mesh("phone_body")[0]) > MAT_EDGE - 0.5:
        V.append("phone back has too little mat support")
    near(zr("phone_glass")[0], Z_GL0, "glass on frame")
    near(zr("phone_body")[1], Z_GL0, "frame top under glass")
    near(zr("router_feet")[0], H_MAT, "router feet on mat")
    near(zr("router")[0], R_ZB, "router on feet")
    near(zr("router_feet")[1], R_ZB, "feet top under router")
    for nm in ("router_feet", "router", "plug_router", "plug_phone"):
        if zr(nm)[0] < H_MAT - tol:
            V.append("%s below the mat top" % nm)
    for v in mesh("router_feet")[0]:
        if _support_z(v.x, v.y) != H_MAT:
            V.append("router foot off the mat")
            break
    for nm in ("ui_code", "ui_card2", "ui_card3", "ui_tabbar", "ui_chips", "ui_status",
               "ui_header", "ui_label", "ui_avatar"):
        near(zr(nm)[0], Z_GLASS, "%s on the glass" % nm)
    near(zr("ui_code")[1], ZT, "code card top (seam 2a)")
    # plugs seated: shell face on the port face
    near(max(v.y for v in mesh("plug_phone")[0]), -PL, "phone plug seated in the port")
    R, port, out = router_frame()
    near(max((v - port).dot(-out) for v in mesh("plug_router")[0]), 0.0,
         "router plug seated in the port")
    # cable: ends in both strain reliefs, never sinks into the mat/desk, rests between the ends
    A, B = D["plug_anchor"]
    pts = D["cable_local"]
    if (pts[0] - A).length > tol or (pts[-1] - B).length > tol:
        V.append("cable does not end in both plugs")
    acc = [0.0]
    for a, b in zip(pts[:-1], pts[1:]):
        acc.append(acc[-1] + (b - a).length)
    L = acc[-1]
    floating = 0
    for p, s in zip(pts, acc):
        sup = _support_z(p.x, p.y) + CABLE_R
        if p.z < sup - tol:
            V.append("cable sinks into the surface at (%.3f, %.3f)" % (p.x, p.y))
            break
        if 0.22 < s < L - 0.26 and p.z - sup > tol:
            floating += 1
    if floating:
        V.append("cable floats over the surface at %d points" % floating)
    if any(_support_z(p.x, p.y) != H_MAT for p in pts):
        V.append("cable leaves the mat (crosses the mat edge)")
    # overlaps between solid objects (touching is fine)
    exempt = {"cable_pulse", "cable_trail"}
    obs = [ob for ob in SETS["SET_phone"].objects if ob.type in ("MESH", "CURVE")
           and ob.name not in exempt]
    data = {}
    for ob in obs:
        vs, ps, smp = mesh(ob.name)
        if not ps:
            continue
        lo = Vector((min(v.x for v in vs), min(v.y for v in vs), min(v.z for v in vs)))
        hi = Vector((max(v.x for v in vs), max(v.y for v in vs), max(v.z for v in vs)))
        data[ob.name] = (BVHTree.FromPolygons(vs, ps), smp, (lo, hi))
    names = sorted(data)
    pairs = 0
    for i, a in enumerate(names):
        for b in names[i + 1:]:
            (la, ha), (lb, hb) = data[a][2], data[b][2]
            if any(la[k] > hb[k] + tol or lb[k] > ha[k] + tol for k in range(3)):
                continue
            pairs += 1
            if not data[a][0].overlap(data[b][0]):
                continue
            depth = 0.0
            for (x, y) in ((a, b), (b, a)):
                tree = data[y][0]
                for p in data[x][1]:
                    hit = tree.find_nearest(p)
                    if hit[0] is None:
                        continue
                    d = (p - hit[0]).dot(hit[1])
                    if d < -tol and hit[3] < 0.05 and -d > depth:
                        depth, worst = -d, (x, tuple(round(c, 4) for c in p))
            if depth > tol:
                V.append("overlap %s <-> %s (depth %.4f, %s at %s)" % (a, b, depth, *worst))
    D["_check_pairs"] = (len(names), pairs)
    # idle loops are seamless: the set state at the loop start equals the state at its end
    for a, b in ((0.0, 30.0), (66.0, 96.0)):
        if _snapshot(a, D) != _snapshot(b, D):
            V.append("idle loop %g..%g is not seamless" % (a, b))
    # UI on the display: tiles stay inside the display and never overlap, at every check frame
    di = DISP_IN
    tiles = ("ui_code", "ui_card2", "ui_card3", "ui_tabbar", "ui_chips", "ui_label")
    for f in frames:
        state(f, D)
        dg.update()
        rects = {}
        for nm in tiles:
            vs = _local_mesh(bpy.data.objects[nm], dg)[0]
            r = (min(v.x for v in vs), min(v.y for v in vs), max(v.x for v in vs),
                 max(v.y for v in vs))
            rects[nm] = r
            if r[0] < -PW + di or r[2] > PW - di or r[1] < -PL + di or r[3] > PL - di:
                V.append("frame %g: %s leaves the display" % (f, nm))
        for i, a in enumerate(tiles):
            for b in tiles[i + 1:]:
                ra, rb = rects[a], rects[b]
                if ra[0] < rb[2] - tol and rb[0] < ra[2] - tol and ra[1] < rb[3] - tol and \
                        rb[1] < ra[3] - tol:
                    V.append("frame %g: UI %s overlaps %s" % (f, a, b))
        if f == 112.0:
            if (D["cursor"].location - P0).length > 0.0 or D["cursor"].hide_render:
                V.append("frame 112: caret not at its card_bars() position")
            for ob in D["lines"] + [D["cursor"]]:
                if ob.material_slots[BS.M["line"]].link != "DATA":
                    V.append("frame 112: %s does not use the `line` material" % ob.name)
            for ob in D["lines"]:
                co = [0.0] * (len(ob.data.vertices) * 3)
                ob.data.vertices.foreach_get("co", co)
                if max(abs(a - b) for a, b in zip(co, ob["co0"])) > 0.0:
                    V.append("frame 112: %s differs from card_bars()" % ob.name)
    return V


build = build_phone
