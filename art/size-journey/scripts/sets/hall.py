"""Data hall (Mittel). Owner: hall agent. Seam contracts: 2c, 3 (see POLISH.md).

A 24 x 18 m hall on a 0.6 m raised-floor grid. Four rows of 18 racks; the hero cold aisle between
rows 1 and 2 is contained (sliding end doors, glazed roof on the rack tops). One drop-out roof panel
is removed above rack k=3 of row 1, whose door is open and whose top server is pulled out on its
rails (seam 3); the fibre adapter of rack k=8 in row 2 is the camera's exit (seam 2c).

Overhead, every element is hung from the slab: ladder trays on trapeze bars and threaded rods,
busways with tap-off boxes and whips into the rack tops, linear luminaires on wires, sprinkler
branches with pendant heads. CRAH units with fans stand on the west wall under the chilled-water
headers. Three services glow in their own patterns behind perforated doors (API chase, database
breathing, queue conveyor). Every idle period divides 30 frames (Mittel hold 186-216).

check(D) -> list of violations: grid, overlaps, doors/containment vs racks, hangers, cable ends,
nothing floating (contact graph down to the building shell), seam clearances. Standalone:
  blender -b --factory-startup -P scripts/sets/hall.py -- --theme dark --out x.png
"""
import math
import os
import random
import sys

_SCRIPTS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _SCRIPTS not in sys.path:
    sys.path.insert(0, _SCRIPTS)

import bpy  # noqa: E402
from mathutils import Matrix, Vector  # noqa: E402

import build_scene as BS  # noqa: E402
from build_scene import MB  # noqa: E402
from sets.common import H0, new_coll, ob_place, emit, window, catmull  # noqa: E402
import look as LB  # noqa: E402

# --------------------------------------------------------------------------- layout (hall-local)
HL = {}
ROW_Y = (-4.5, -1.5, 1.5, 4.5)
ROW_FRONT = (-1, 1, -1, 1)          # sign of the aisle-facing (front) side
N_RACK = 18
RACK_X0 = -5.4
RACK_D, RACK_H = 1.2, 2.2
GRID = 0.6
GX0, GY0 = -5.4, -0.9               # floor grid origin: every rack corner lies on a grid line
X0, X1, Y0, Y1, Z1 = -12.0, 12.0, -9.0, 9.0, 5.5
U = 0.0445
PORT_RACK = (2, 8)                  # seam 2c
SRV_RACK = (1, 3)                   # seam 3
SVC_RACKS = {(1, 0): "svc_db", (1, 1): "svc_db", (2, 0): "svc_q", (2, 1): "svc_q",
             (2, 2): "svc_api", (2, 3): "svc_api"}
CONT_Y = 0.9                        # contained cold aisle |y| < 0.9
ROOF_BAYS = [RACK_X0, -4.05, -2.55, -1.05, 0.45, 1.95, 3.45, 4.95, RACK_X0 + N_RACK * GRID]
ROOF_OPEN = (-4.05, -2.55)          # drop-out roof panel removed above the open server
TRAY_Z, BUS_Z, LAMP_Z, SPR_Z = 2.75, 2.45, 3.55, 4.7
AISLES = (0.0, -3.0, 3.0, -6.6, 6.6)
BEAMS_X = [X0 + 3.0 * i for i in range(1, 8)]
LOOP, T_LOOP0 = 30, 186.0
NET_RACK = (1, 7)                   # glass-door network rack: the focal point of the port exit
RV = random.Random(77)              # variation that must not reshuffle the rack elevations
VOLUME = ("--preset" in sys.argv and "final" in sys.argv) or bool(os.environ.get("HALL_VOL"))

PARTS = []      # (kind, lo, hi) hall-local AABB of every primitive -> check()
CABLES = []     # (name, p0, p1) cable end points
HUNG = []       # (owner, axis, a0, a1, z_under, rods[(a, z_lo, z_hi)])
RACKS = []      # (r, k, x0, x1, y0, y1, z0, z1)
NOFLOOR = ("shell",)


class HB(MB):
    """MB that records the AABB of every primitive (hall-local) for check()."""

    def __init__(self, kind="part"):
        super().__init__()
        self.kind = kind

    def rec(self, lo, hi, kind=None):
        PARTS.append((kind or self.kind, tuple(lo), tuple(hi)))

    _FACES = ((0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7))

    def box(self, x0, y0, z0, x1, y1, z1, mat="clay", kind=None):
        # direct verts/faces: bmesh.ops.create_cube scales with the mesh size (quadratic build)
        xa, xb = min(x0, x1), max(x0, x1)
        ya, yb = min(y0, y1), max(y0, y1)
        za, zb = min(z0, z1), max(z0, z1)
        nv = self.bm.verts.new
        vs = [nv(c) for c in ((xa, ya, za), (xb, ya, za), (xb, yb, za), (xa, yb, za),
                              (xa, ya, zb), (xb, ya, zb), (xb, yb, zb), (xa, yb, zb))]
        mi = BS.M[mat]
        for f in self._FACES:
            face = self.bm.faces.new([vs[i] for i in f])
            face.material_index = mi
            face.smooth = False
        self.rec((xa, ya, za), (xb, yb, zb), kind)

    def cyl(self, cx, cy, z0, r, h, mat="clay", seg=20, r2=None, smooth=True, kind=None):
        MB.cyl(self, cx, cy, z0, r, h, mat, seg, r2, smooth)
        q = max(r, r2 or r)
        self.rec((cx - q, cy - q, z0), (cx + q, cy + q, z0 + h), kind)

    def tube(self, p0, p1, r, mat="clay", seg=12, smooth=True, kind=None):
        MB.tube(self, p0, p1, r, mat, seg, smooth)
        self.seg(p0, p1, r, kind)

    def beam(self, p0, p1, t, mat="metal", kind=None):
        MB.beam(self, p0, p1, t, mat)
        self.seg(p0, p1, t * 0.5, kind)

    def seg(self, p0, p1, r, kind=None):
        d = Vector(p1) - Vector(p0)
        ext = [r * math.sqrt(max(0.0, 1.0 - (c / d.length) ** 2)) if d.length else r for c in d]
        self.rec(tuple(min(a, b) - e for a, b, e in zip(p0, p1, ext)),
                 tuple(max(a, b) + e for a, b, e in zip(p0, p1, ext)), kind)

    def prism(self, pts, z0, z1, mat, kind=None):
        """Vertical prism over a convex 2D polygon (floor paint, sign glyphs)."""
        n = len(pts)
        verts = [(x, y, z0) for x, y in pts] + [(x, y, z1) for x, y in pts]
        faces = [list(range(n))[::-1], list(range(n, 2 * n))]
        faces += [[i, (i + 1) % n, n + (i + 1) % n, n + i] for i in range(n)]
        self.poly(verts, faces, mat)
        xs, ys = [p[0] for p in pts], [p[1] for p in pts]
        self.rec((min(xs), min(ys), z0), (max(xs), max(ys), z1), kind)

    def ring_x(self, cx, cy, cz, r0, r1, depth, mat, seg=32, kind=None):
        """Annulus in the y-z plane, extruded along +x (fan shrouds, guard rings)."""
        verts, faces = [], []
        prof = ((r1, 0.0), (r1, depth), (r0, depth), (r0, 0.0))
        for i in range(seg):
            a = 2 * math.pi * i / seg
            for r, xo in prof:
                verts.append((cx + xo, cy + r * math.cos(a), cz + r * math.sin(a)))
        for i in range(seg):
            j = (i + 1) % seg
            for p in range(4):
                q = (p + 1) % 4
                faces.append([i * 4 + p, j * 4 + p, j * 4 + q, i * 4 + q])
        self.poly(verts, faces, mat)
        self.rec((cx, cy - r1, cz - r1), (cx + depth, cy + r1, cz + r1), kind)


# --------------------------------------------------------------------------- materials
def _perf(name, tier, plane, pitch, r, th, see=False, rough=0.45, fade=(2.2, 6.5), metallic=0.0,
          graze=None, color=None):
    """Perforated sheet: staggered round holes (shader), faded to their mean coverage with
    distance and at grazing angles so nothing moires. see=True: the holes are see-through."""
    m = LB.clay_material(name, tier, th, rough=rough, noise=LB.NOISE_SCALE["hall"] * 4, bevel=0.002,
                         metallic=metallic, color=color)
    nt = m.node_tree
    n, ln = nt.nodes, nt.links
    bsdf = next(x for x in n if x.bl_idname == "ShaderNodeBsdfPrincipled")
    out = next(x for x in n if x.bl_idname == "ShaderNodeOutputMaterial")
    tc = n.new("ShaderNodeTexCoord")
    sep = n.new("ShaderNodeSeparateXYZ")
    ln.new(tc.outputs["Object"], sep.inputs[0])
    a, b = {"xy": (0, 1), "xz": (0, 2), "yz": (1, 2)}[plane]
    cb = n.new("ShaderNodeCombineXYZ")
    ln.new(sep.outputs[a], cb.inputs[0])
    ln.new(sep.outputs[b], cb.inputs[1])
    sc = n.new("ShaderNodeVectorMath")
    sc.operation = "SCALE"
    ln.new(cb.outputs[0], sc.inputs[0])
    sc.inputs["Scale"].default_value = 1.0 / pitch

    def vm(op, src, val=None):
        v = n.new("ShaderNodeVectorMath")
        v.operation = op
        ln.new(src, v.inputs[0])
        if val is not None:
            v.inputs[1].default_value = val
        return v

    def dist(off):
        f = vm("FRACTION", vm("ADD", sc.outputs[0], (off, off, 0.0)).outputs[0])
        s = vm("SUBTRACT", f.outputs[0], (0.5, 0.5, 0.0))
        return vm("LENGTH", s.outputs[0]).outputs["Value"]

    def math_node(op, x, y=None, yv=None):
        mm = n.new("ShaderNodeMath")
        mm.operation = op
        ln.new(x, mm.inputs[0])
        if y is not None:
            ln.new(y, mm.inputs[1])
        elif yv is not None:
            mm.inputs[1].default_value = yv
        return mm.outputs[0]

    def map_range(src, f0, f1, t0, t1, smooth=False):
        mr = n.new("ShaderNodeMapRange")
        if smooth:
            mr.interpolation_type = "SMOOTHSTEP"
        ln.new(src, mr.inputs["Value"])
        mr.inputs["From Min"].default_value = f0
        mr.inputs["From Max"].default_value = f1
        mr.inputs["To Min"].default_value = t0
        mr.inputs["To Max"].default_value = t1
        return mr.outputs["Result"]

    d = math_node("MINIMUM", dist(0.0), dist(0.5))
    hole = map_range(d, r - 0.06, r + 0.06, 1.0, 0.0, smooth=True)
    cam = n.new("ShaderNodeCameraData")
    f_d = map_range(cam.outputs["View Distance"], fade[0], fade[1], 1.0, 0.0)
    lw = n.new("ShaderNodeLayerWeight")
    lw.inputs["Blend"].default_value = 0.5
    f_g = map_range(lw.outputs["Facing"], 0.72, 0.93, 1.0, 0.0)
    mean = 2 * math.pi * r * r
    # far: holes average out; grazing: a real sheet has thickness and closes up (graze coverage)
    far = math_node("ADD", math_node("MULTIPLY", math_node("SUBTRACT", hole, yv=mean), f_d), yv=mean)
    g = mean if graze is None else graze
    mask = math_node("ADD", math_node("MULTIPLY", math_node("SUBTRACT", far, yv=g), f_g), yv=g)
    if see:
        tr = n.new("ShaderNodeBsdfTransparent")
        mx = n.new("ShaderNodeMixShader")
        ln.new(mask, mx.inputs[0])
        ln.new(bsdf.outputs["BSDF"], mx.inputs[1])
        ln.new(tr.outputs[0], mx.inputs[2])
        ln.new(mx.outputs[0], out.inputs["Surface"])
    else:
        src = bsdf.inputs["Base Color"].links[0].from_socket
        mx, fac, ca, cbb, res = LB._mix_rgba(nt)
        ln.new(math_node("MULTIPLY", mask, yv=0.92), fac)
        ln.new(src, ca)
        cbb.default_value = (0.002, 0.002, 0.003, 1.0)
        ln.new(res, bsdf.inputs["Base Color"])
    return m


def _glass(name, th):
    """Polycarbonate glazing: mostly transparent (no refraction noise), a faint fresnel sheen."""
    m = bpy.data.materials.new(name)
    nt = LB._tree(m)
    n, ln = nt.nodes, nt.links
    out = n.new("ShaderNodeOutputMaterial")
    tr = n.new("ShaderNodeBsdfTransparent")
    tr.inputs["Color"].default_value = (0.80, 0.86, 0.93, 1.0)
    pb = n.new("ShaderNodeBsdfPrincipled")
    pb.inputs["Base Color"].default_value = (0.01, 0.012, 0.016, 1.0)
    pb.inputs["Roughness"].default_value = 0.03
    lw = n.new("ShaderNodeLayerWeight")
    lw.inputs["Blend"].default_value = 0.2
    mr = n.new("ShaderNodeMapRange")
    ln.new(lw.outputs["Fresnel"], mr.inputs["Value"])
    mr.inputs["To Min"].default_value = 0.06
    mr.inputs["To Max"].default_value = 0.14
    mx = n.new("ShaderNodeMixShader")
    ln.new(mr.outputs["Result"], mx.inputs[0])
    ln.new(tr.outputs[0], mx.inputs[1])
    ln.new(pb.outputs[0], mx.inputs[2])
    ln.new(mx.outputs[0], out.inputs["Surface"])
    return m


def _materials(th):
    ns = LB.NOISE_SCALE["hall"]
    reg = LB.register
    reg(LB.clay_material("h_tile", "mid", th, rough=0.30, noise=ns * 2, bevel=0.003, var=0.05))
    reg(LB.clay_material("h_tile2", "mid", th, rough=0.34, noise=ns * 2, bevel=0.003, var=0.05,
                         color=tuple(c * 0.86 for c in LB.CLAY_TIERS[th]["mid"])))
    reg(_perf("h_tile_perf", "mid", "xy", 0.03, 0.26, th, rough=0.36))
    door_c = tuple(0.5 * (a + b) for a, b in zip(LB.CLAY_TIERS[th]["dark"], LB.CLAY_TIERS[th]["mid"]))
    reg(_perf("h_door", "mid", "xz", 0.011, 0.30, th, see=True, rough=0.36, metallic=0.3,
              graze=0.3, color=door_c))
    reg(_perf("h_mesh", "mid", "xz", 0.008, 0.30, th, rough=0.45, fade=(1.2, 3.5)))
    reg(_perf("h_grille", "mid", "yz", 0.022, 0.30, th, rough=0.5, fade=(4.0, 12.0)))
    reg(LB.clay_material("h_wall", "mid", th, rough=0.75, noise=ns, bevel=0.01, var=0.08))
    reg(LB.clay_material("h_ceil", "dark", th, rough=0.8, noise=ns, bevel=0.01))
    reg(LB.clay_material("h_rack", "dark", th, rough=0.42, noise=ns * 4, bevel=0.004))
    reg(LB.clay_material("h_face", "mid", th, rough=0.45, noise=ns * 6, bevel=0.002))
    reg(LB.clay_material("h_frame", "light", th, rough=0.32, noise=ns * 6, bevel=0.003,
                         metallic=0.5))
    reg(LB.clay_material("h_crah", "light", th, rough=0.5, noise=ns * 3, bevel=0.008))
    reg(LB.clay_material("h_pipe", "light", th, rough=0.55, noise=ns * 3, bevel=0.004, var=0.04))
    reg(_glass("h_glass", th))
    reg(LB.glass_material("h_screen", th))
    reg(LB.emission_material("h_led_b", "led_blue", th))
    reg(LB.emission_material("h_led_w", "led_white", th))
    reg(LB.emission_material("h_fibre", "accent_soft", th))
    reg(LB.emission_material("h_led_dim", "accent_soft", th))      # dim blue indicator
    reg(LB.emission_material("h_led_wd", "lamp", th))              # dim white indicator
    reg(LB.emission_material("hall_racktop_strip", "lamp", th))               # aisle strips (ramped at 2c)
    reg(LB.emission_material("h_netlamp", "lamp", th))             # network rack interior light
    reg(LB.emission_material("h_net_led", "led_blue", th))         # network port link lights


# --------------------------------------------------------------------------- shell + floor
def _shell(sh, fl):
    sh.box(X0 - 0.3, Y0 - 0.3, -0.35, X1 + 0.3, Y1 + 0.3, -0.03, "trim")          # plenum slab
    sh.box(X0 - 0.3, Y0 - 0.3, Z1, X1 + 0.3, Y1 + 0.3, Z1 + 0.3, "h_ceil")         # roof slab
    for bx in BEAMS_X:                                                               # downstand beams
        sh.box(bx - 0.15, Y0, Z1 - 0.4, bx + 0.15, Y1, Z1, "h_ceil")
    sh.box(X0 - 0.3, Y0 - 0.3, -0.35, X0, Y1 + 0.3, Z1, "h_wall")
    sh.box(X1, Y0 - 0.3, -0.35, X1 + 0.3, Y1 + 0.3, Z1, "h_wall")
    sh.box(X0, Y0 - 0.3, -0.35, X1, Y0, Z1, "h_wall")
    sh.box(X0, Y1, -0.35, X1, Y1 + 0.3, Z1, "h_wall")
    # wall panel joints, skirting and a datum band (west wall is in the hold shot)
    for i in range(1, 20):
        y = Y0 + 0.9 * i
        sh.box(X0, y - 0.006, 0.12, X0 + 0.003, y + 0.006, Z1, "trim", kind="wall")
    for (xa, xb, ya, yb) in ((X0, X0 + 0.015, Y0, Y1), (X1 - 0.015, X1, Y0, Y1),
                             (X0, X1, Y0, Y0 + 0.015), (X0, X1, Y1 - 0.015, Y1)):
        sh.box(xa, ya, 0.0, xb, yb, 0.12, "clay2", kind="wall")
    sh.box(X0, Y0, 2.62, X0 + 0.01, Y1, 2.66, "clay2", kind="wall")
    # raised floor: 600 mm tiles with 4 mm joints, perforated in front of every rack front
    i0, i1 = math.floor((X0 - GX0) / GRID), math.ceil((X1 - GX0) / GRID)
    j0, j1 = math.floor((Y0 - GY0) / GRID), math.ceil((Y1 - GY0) / GRID)
    rr = random.Random(4)
    for i in range(i0, i1):
        xa, xb = max(X0, GX0 + i * GRID), min(X1, GX0 + (i + 1) * GRID)
        for j in range(j0, j1):
            ya, yb = max(Y0, GY0 + j * GRID), min(Y1, GY0 + (j + 1) * GRID)
            yc = (ya + yb) / 2
            perf = RACK_X0 <= xa < RACK_X0 + N_RACK * GRID and \
                any(abs(yc - (yr + fs * 0.9)) < 0.01 for yr, fs in zip(ROW_Y, ROW_FRONT))
            mat = "h_tile_perf" if perf else ("h_tile" if rr.random() < 0.7 else "h_tile2")
            fl.box(xa + 0.002, ya + 0.002, -0.03, xb - 0.002, yb - 0.002, 0.0, mat)


# --------------------------------------------------------------------------- racks
def _slots(rr):
    """Rack elevation, bottom to top: (z0, z1, kind) with kind 1u|2u|4u|blank|top."""
    out, z = [], 0.08
    out.append((z, 0.125, "blank"))
    z = 0.125
    while z < 1.82 - 1e-6:
        kind = rr.choices(("1u", "2u", "4u", "blank", "blank2"), weights=(30, 30, 9, 16, 9))[0]
        h = {"1u": U, "2u": 2 * U, "4u": 4 * U, "blank": U, "blank2": 2 * U}[kind]
        if z + h > 1.82 + 1e-6:
            h, kind = 1.82 - z, "blank"
        out.append((z, z + h, kind if kind != "blank2" else "blank"))
        z += h
    out.append((1.82, 1.92, "top"))
    out.append((1.92, 1.96, "blank"))
    return out


def _rack(G, r, k, rr):
    """One rack. G: dict of HB builders. Depth d is measured from the aisle face into the rack."""
    x = RACK_X0 + k * GRID
    yr, fs = ROW_Y[r], ROW_FRONT[r]
    yf = yr + fs * RACK_D / 2

    def Y(d0, d1):
        a, b = yf - fs * d0, yf - fs * d1
        return min(a, b), max(a, b)

    def B(m, xa, xb, d0, d1, za, zb, mat, kind=None):
        ya, yb = Y(d0, d1)
        m.box(x + xa, ya, za, x + xb, yb, zb, mat, kind=kind)

    RACKS.append((r, k, x, x + GRID, *Y(0, RACK_D), 0.0, RACK_H))
    R = G["rack"]
    srv_slot = (r, k) == SRV_RACK
    svc = SVC_RACKS.get((r, k))
    # frame: plinth on the tiles, side panels, top cover, front/rear posts, rear door
    B(R, 0.01, 0.59, 0.03, 1.17, 0.0, 0.06, "trim")
    B(R, 0.005, 0.02, 0.0, RACK_D, 0.06, 2.17, "h_rack")
    B(R, 0.58, 0.595, 0.0, RACK_D, 0.06, 2.17, "h_rack")
    B(R, 0.005, 0.595, 0.0, RACK_D, 2.17, RACK_H, "h_rack")
    for xa, xb in ((0.02, 0.045), (0.555, 0.58)):
        B(R, xa, xb, 0.0, 0.05, 0.06, 2.17, "metal")
        B(R, xa, xb, RACK_D - 0.05, RACK_D, 0.06, 2.17, "metal")
    B(R, 0.045, 0.555, RACK_D - 0.025, RACK_D, 0.06, 2.17, "h_rack")
    if srv_slot:                                    # empty top slot: cavity with a dark back
        B(R, 0.045, 0.555, 0.07, RACK_D - 0.025, 0.06, 1.81, "trim")
        B(R, 0.045, 0.555, 0.07, RACK_D - 0.025, 1.93, 2.17, "trim")
        B(R, 0.045, 0.555, 1.13, RACK_D - 0.025, 1.81, 1.93, "trim")
    else:
        B(R, 0.045, 0.555, 0.07, RACK_D - 0.025, 0.06, 2.17, "trim")
    # equipment faces (seen through the perforated door). The network rack consumes the same
    # random draws into a discarded builder, so every other rack keeps its elevation.
    net = (r, k) == NET_RACK
    if net:
        n_parts, R_keep, L_keep = len(PARTS), R, G["led"]
        R, G["led"] = HB("rack"), [HB("led") for _ in range(5)]
    for (za, zb, kind) in _slots(rr):
        if kind == "top" and srv_slot:
            continue
        mat = "h_rack" if kind == "blank" else rr.choice(("h_face", "h_face", "clay2", "metal"))
        B(R, 0.045, 0.555, 0.05, 0.07, za + 0.001, zb - 0.001, mat)
        zc = (za + zb) / 2
        if kind == "blank":
            B(R, 0.06, 0.54, 0.047, 0.05, zc - 0.002, zc + 0.002, "trim")
            continue
        if kind in ("2u", "top"):
            for b in range(9):
                bx = 0.07 + b * 0.037
                B(R, bx, bx + 0.031, 0.044, 0.05, za + 0.008, zb - 0.008, "clay2")
                if rr.random() < 0.55:                  # drive activity LED on the caddy
                    B(G["led"][rr.choice((1, 2, 3, 4))], bx + 0.022, bx + 0.027, 0.042, 0.044,
                      za + 0.012, za + 0.016, ("h_led_b" if RV.random() < 0.4 else "h_led_dim")
                      if rr.random() < 0.8 else "h_led_wd", "led")
        elif kind == "4u":
            B(R, 0.07, 0.44, 0.047, 0.05, za + 0.015, zb - 0.015, "h_mesh")
        else:
            B(R, 0.07, 0.32, 0.047, 0.05, zc - 0.007, zc + 0.007, "trim")
        n_led = 2 if kind == "1u" else 3
        for i in range(n_led):
            g = rr.choices((0, 1, 2, 3, 4), weights=(3, 2, 2, 2, 4))[0]
            lx = 0.47 + i * 0.022
            lz = zb - 0.012 if kind != "1u" else zc
            mat = "h_led_w" if rr.random() < 0.18 else "h_led_b"
            if RV.random() < 0.3:                       # dim indicators next to bright ones
                mat = "h_led_dim" if mat == "h_led_b" else "h_led_wd"
            w, hh = RV.uniform(0.0035, 0.006), RV.uniform(0.0025, 0.0038)
            B(G["led"][g], lx, lx + w, 0.045, 0.05, lz - hh / 2, lz + hh / 2, mat)
        if svc:   # service light bars on the equipment faces
            if svc == "svc_db":                         # drive activity dots, breathing
                for b in range(9):
                    if RV.random() < 0.7:
                        bx = 0.07 + b * 0.037 + RV.uniform(0.004, 0.018)
                        B(G[svc][0], bx, bx + 0.006, 0.041, 0.05, zb - 0.0135, zb - 0.0095, svc)
            elif zb - za > 0.06 or kind == "1u":           # rows of small dots per level
                lvl = int((zc - 0.1) / 1.8 * (5 if svc == "svc_api" else 8))
                lvl = max(0, min(lvl, (5 if svc == "svc_api" else 8) - 1))
                rows = (zc,) if zb - za < 0.06 else (zc - 0.011, zc + 0.011)
                for rz in rows:
                    dx = RV.uniform(0.07, 0.10)
                    for _ in range(RV.randint(8, 17)):
                        if dx > 0.435:
                            break
                        B(G[svc][lvl], dx, dx + 0.005, 0.043, 0.05, rz - 0.002, rz + 0.002, svc)
                        dx += RV.choice((0.012, 0.016, 0.02, 0.028))
    if net:
        for m in [R] + G["led"]:
            m.bm.free()
        del PARTS[n_parts:]
        R, G["led"] = R_keep, L_keep
        _net_equipment(G, R, B)
    # door (closed) with perforated insert, handle, hinges; the server rack's door is open
    if not srv_slot:
        D = G["door"]
        B(D, 0.025, 0.06, -0.012, 0.0, 0.08, 1.96, "h_frame", "door")
        B(D, 0.54, 0.575, -0.012, 0.0, 0.08, 1.96, "h_frame", "door")
        B(D, 0.06, 0.54, -0.012, 0.0, 0.08, 0.12, "h_frame", "door")
        B(D, 0.06, 0.54, -0.012, 0.0, 1.92, 1.96, "h_frame", "door")
        B(D, 0.06, 0.54, -0.007, -0.005, 0.12, 1.92,
          "h_glass" if (r, k) == NET_RACK else "h_door", "door")
        B(D, 0.548, 0.566, -0.034, -0.012, 0.95, 1.22, "metal", "door")
        for hz in (0.3, 1.0, 1.7):
            B(D, 0.02, 0.03, -0.016, 0.0, hz, hz + 0.06, "metal", "door")
    # top zone: cover, the patch panel (contract box), LC adapters, finger duct
    T = G["top"]
    B(T, 0.02, 0.58, 0.0, 0.02, 1.96, 2.17, "clay2")
    B(T, 0.03, 0.57, -0.01, 0.0, 2.0, 2.09, "metal", "panel")
    hero = (r, k) == PORT_RACK
    for j in range(12):
        px = 0.06 + j * 0.04
        if hero and j == 6:
            continue                                # the hero adapter (seam 2c) sits here
        B(T, px - 0.007, px + 0.007, -0.022, -0.01, 2.039, 2.051, "h_face", "port")
        B(T, px - 0.004, px + 0.004, -0.0225, -0.022, 2.041, 2.049, "trim", "port")
        plugged = rr.random() < 0.55 and not (hero and abs(px - 0.3) < 0.1)
        if plugged:
            B(T, px - 0.005, px + 0.005, -0.045, -0.022, 2.040, 2.050, "trim", "port")
            G["cords"].append((x + px, yf + fs * 0.045, yf, fs, rr.uniform(-0.03, 0.03)))
    B(T, 0.03, 0.57, -0.004, 0.0, 2.10, 2.16, "trim", "duct")         # finger duct back
    ya_, yb_ = Y(-0.035, 0.0)
    PARTS.append(("duct", (x + 0.03, ya_, 2.10), (x + 0.57, yb_, 2.16)))   # duct volume
    B(T, 0.03, 0.57, -0.035, 0.0, 2.10, 2.106, "trim", "duct")        # duct floor
    for j in range(14):
        fx = 0.035 + j * 0.04
        B(T, fx, fx + 0.006, -0.035, -0.004, 2.106, 2.155, "trim", "duct")
    # fibre drop: brush grommet on the rack top, two bundles up into the ladder tray
    gx = x + 0.3
    T.box(gx - 0.06, yr - 0.05, RACK_H, gx + 0.06, yr + 0.05, RACK_H + 0.012, "trim", kind="grommet")
    for dx in (-0.022, 0.022):
        T.tube((gx + dx, yr, RACK_H + 0.012), (gx + dx, yr, TRAY_Z + 0.03), 0.014, "cable", seg=8,
               kind="cable")
        CABLES.append(("drop", (gx + dx, yr, RACK_H + 0.012), (gx + dx, yr, TRAY_Z + 0.03)))


def _net_equipment(G, R, B):
    """Network rack behind a glass door: two chassis, 1U switches with link-light rows, brush
    panels, and a light bar under the top zone (ramped in after seam 2c, see state)."""
    B(R, 0.045, 0.555, 0.05, 0.07, 0.081, 0.53, "h_face")
    B(R, 0.045, 0.555, 0.05, 0.07, 0.531, 0.98, "h_face")
    for za in (0.081, 0.531):
        B(R, 0.07, 0.44, 0.047, 0.05, za + 0.04, za + 0.40, "h_mesh")
        for i in range(4):
            B(G["net"][i % 3], 0.47 + 0.016 * i, 0.475 + 0.016 * i, 0.045, 0.05, za + 0.41,
              za + 0.414, "h_net_led")
    z = 1.0
    i = 0
    while z + U <= 1.86:
        za, zb = z, z + U
        if i % 5 == 4:                                       # brush panel
            B(R, 0.045, 0.555, 0.05, 0.07, za + 0.001, zb - 0.001, "h_rack")
            B(R, 0.06, 0.54, 0.046, 0.05, za + 0.019, zb - 0.019, "trim")
        else:                                                # switch: two rows of 16 ports
            B(R, 0.045, 0.555, 0.05, 0.07, za + 0.001, zb - 0.001, "clay2")
            for row, lz in enumerate((za + 0.011, zb - 0.013)):
                for j in range(16):
                    px = 0.075 + j * 0.021
                    B(R, px, px + 0.015, 0.046, 0.05, lz, lz + 0.011, "trim")
                    q = RV.random()
                    if q < 0.72:
                        B(G["net"][RV.randrange(3)], px + 0.004, px + 0.008, 0.045, 0.05,
                          lz + 0.012 if row else lz - 0.003, lz + 0.014 if row else lz - 0.001,
                          "h_net_led" if q < 0.5 else "h_led_dim")
            for j in range(4):                               # uplinks
                B(R, 0.43 + j * 0.026, 0.45 + j * 0.026, 0.046, 0.05, za + 0.012, zb - 0.012, "metal")
        z += U
        i += 1
    B(R, 0.045, 0.555, 0.05, 0.07, z + 0.001, 1.959, "h_rack")
    B(G["netlamp"], 0.06, 0.54, 0.012, 0.04, 1.955, 1.96, "h_netlamp")


def _open_door(G, o):
    """Door of the server rack, swung 100 deg into the aisle (hinge on the -x stile)."""
    r, k = SRV_RACK
    x = RACK_X0 + k * GRID
    yf = ROW_Y[r] + ROW_FRONT[r] * RACK_D / 2
    hx, hy = x + 0.025, yf + 0.014
    m = MB()
    W = 0.55
    m.box(0.0, -0.012, 0.08, 0.035, 0.0, 1.96, "h_frame")
    m.box(W - 0.035, -0.012, 0.08, W, 0.0, 1.96, "h_frame")
    m.box(0.035, -0.012, 0.08, W - 0.035, 0.0, 0.12, "h_frame")
    m.box(0.035, -0.012, 1.92, W - 0.035, 0.0, 1.96, "h_frame")
    m.box(0.035, -0.007, 0.12, W - 0.035, -0.005, 1.92, "h_door")
    m.box(W - 0.027, 0.0, 0.95, W - 0.009, 0.022, 1.22, "metal")
    th = math.radians(100.0)
    ob = ob_place(m, "rack_door_open", o + Vector((hx, hy, 0.0)), rot=th)
    c, s = math.cos(th), math.sin(th)
    pts = [(c * px - s * py + hx, s * px + c * py + hy) for px in (0.0, W) for py in (-0.012, 0.022)]
    PARTS.append(("door", (min(p[0] for p in pts), min(p[1] for p in pts), 0.08),
                  (max(p[0] for p in pts), max(p[1] for p in pts), 1.96)))
    for hz in (0.3, 1.0, 1.7):                               # hinge knuckles on the post
        G["door"].box(hx - 0.007, yf, hz, hx + 0.007, hy + 0.004, hz + 0.06, "metal", kind="door")
    return ob


def _cords(G):
    """Patch cords: from a plugged LC boot, forward and up into the finger duct (curves)."""
    cu = bpy.data.curves.new("patch_cords", "CURVE")
    cu.dimensions = "3D"
    cu.bevel_depth = 0.0018
    cu.bevel_resolution = 2
    cu.use_fill_caps = True
    for (px, yb, yf, fs, dx) in G["cords"]:
        def yy(d):
            return yf - fs * d
        ctrl = [Vector((px, yb, 2.045)), Vector((px, yy(-0.058), 2.05)),
                Vector((px + dx * 0.5, yy(-0.052), 2.095)), Vector((px + dx, yy(-0.02), 2.13)),
                Vector((px + dx, yy(-0.012), 2.135))]
        pts = catmull(ctrl, 5)
        sp = cu.splines.new("POLY")
        sp.points.add(len(pts) - 1)
        for i, p in enumerate(pts):
            sp.points[i].co = (p.x + H0.x, p.y + H0.y, p.z + H0.z, 1.0)
        CABLES.append(("cord", tuple(ctrl[0]), tuple(ctrl[-1])))
    cu.materials.append(bpy.data.materials["trim"])
    ob = bpy.data.objects.new("patch_cords", cu)
    BS.COLL.objects.link(ob)
    return ob


# --------------------------------------------------------------------------- containment
def _containment(C, S):
    xa, xb = RACK_X0, RACK_X0 + N_RACK * GRID
    for sy in (-1, 1):            # aisle light strips on the front edge of the rack tops
        ya, yb = sorted((sy * CONT_Y, sy * (CONT_Y - 0.045)))
        C.box(xa + 0.05, ya, 2.165, xb - 0.05, yb, RACK_H, "clay2", kind="cont")
        # aisle-side lip: hides the diffuser from near-horizontal views (port exit, seam 2c)
        la, lb = sorted((sy * (CONT_Y - 0.045), sy * (CONT_Y - 0.049)))
        C.box(xa + 0.05, la, 2.152, xb - 0.05, lb, RACK_H, "clay2", kind="cont")
        da, db = sorted((sy * (CONT_Y - 0.005), sy * (CONT_Y - 0.04)))
        S.box(xa + 0.07, da, 2.161, xb - 0.07, db, 2.165, "hall_racktop_strip", kind="cont")
    for sy in (-1, 1):                                   # roof rails resting on the rack tops
        C.box(xa, sy * CONT_Y, RACK_H, xb, sy * (CONT_Y + 0.06), RACK_H + 0.07, "clay2", kind="cont")
    # cross members every 1.5 m, phased so the port exit (x -0.3) and the open server (x -3.3)
    # both sit mid-bay
    for cx in ROOF_BAYS:
        cx0, cx1 = max(xa, cx - 0.02), min(xb, cx + 0.02)
        C.box(cx0, -CONT_Y, RACK_H + 0.02, cx1, CONT_Y, RACK_H + 0.07, "clay2", kind="cont")
    for pa, pb in zip(ROOF_BAYS, ROOF_BAYS[1:]):        # glazed drop-out panels
        if abs(pa - ROOF_OPEN[0]) < 1e-6:
            continue                                     # removed above the open server (seam 3)
        C.box(pa + 0.02, -CONT_Y, RACK_H + 0.045, pb - 0.02, CONT_Y, RACK_H + 0.05, "h_glass",
              kind="cont")
    # end doors: posts on the floor against the row ends, header, two sliding leaves
    for side, xe in ((-1, xa), (1, xb)):
        def X(a, b):
            p, q = xe + side * a, xe + side * b
            return min(p, q), max(p, q)
        hx0, hx1 = X(0.0, 0.06)
        for sy in (-1, 1):
            C.box(hx0, sy * CONT_Y, 0.0, hx1, sy * (CONT_Y - 0.06), RACK_H + 0.07, "clay2",
                  kind="cont")
        C.box(hx0, -CONT_Y + 0.06, 2.10, hx1, CONT_Y - 0.06, RACK_H + 0.07, "clay2", kind="cont")
        for li, (la, lb, d0) in enumerate(((-CONT_Y + 0.06, 0.03, 0.005), (-0.03, CONT_Y - 0.06, 0.03))):
            lx0, lx1 = X(d0, d0 + 0.022)
            C.box(lx0, la, 0.01, lx1, la + 0.045, 2.10, "clay2", kind="cont")
            C.box(lx0, lb - 0.045, 0.01, lx1, lb, 2.10, "clay2", kind="cont")
            C.box(lx0, la + 0.045, 0.01, lx1, lb - 0.045, 0.12, "clay2", kind="cont")
            C.box(lx0, la + 0.045, 1.99, lx1, lb - 0.045, 2.10, "clay2", kind="cont")
            gx0, gx1 = X(d0 + 0.009, d0 + 0.013)
            C.box(gx0, la + 0.045, 0.12, gx1, lb - 0.045, 1.99, "h_glass", kind="cont")
            hb0, hb1 = X(d0 - 0.03, d0)
            hy = lb - 0.0225                                  # pull bar on the leaf's stile
            C.box(hb0, hy - 0.012, 0.85, hb1, hy + 0.012, 1.35, "metal", kind="cont")
            C.box(lx0, la, 0.0, lx1, lb, 0.01, "trim", kind="cont")       # floor guide
        if side < 0:   # aisle sign on the inner face of the header: plate, three bars and a dot
            C.box(xe, -0.26, 2.115, xe + 0.008, 0.26, 2.255, "mark", kind="sign")
            for i, (w, zz) in enumerate(((0.30, 2.215), (0.20, 2.185), (0.36, 2.155))):
                C.box(xe + 0.008, -0.2, zz - 0.009, xe + 0.011, -0.2 + w, zz + 0.009, "trim",
                      kind="sign")
            C.box(xe + 0.008, 0.17, 2.165, xe + 0.011, 0.21, 2.205, "line", kind="sign")


# --------------------------------------------------------------------------- overhead
def _hang(Hm, owner, axis, a0, a1, cross, z_under, step, rod_r=0.008, offs=(-0.24, 0.24),
          bar=True, mat="metal"):
    """Threaded rods from the slab every `step` metres: down to a trapeze bar under `owner`
    (bar=True) or onto its top (bar=False, z_under = top of the hung element)."""
    rods = []
    n = max(1, int(math.ceil((a1 - a0 - 0.4) / step)))
    zl = z_under - 0.03 if bar else z_under
    for i in range(n + 1):
        a = a0 + 0.2 + (a1 - a0 - 0.4) * i / n
        if axis == "x" and any(abs(a - bx) < 0.2 for bx in BEAMS_X):
            a += 0.25
        for o_ in offs:
            px, py = (a, cross + o_) if axis == "x" else (cross + o_, a)
            Hm.tube((px, py, zl), (px, py, Z1), rod_r, mat, seg=6, kind="rod")
        if bar and axis == "x":
            Hm.box(a - 0.02, cross + offs[0] - 0.02, zl, a + 0.02, cross + offs[-1] + 0.02,
                   z_under, "metal", kind="rod")
        elif bar:
            Hm.box(cross + offs[0] - 0.02, a - 0.02, zl, cross + offs[-1] + 0.02, a + 0.02,
                   z_under, "metal", kind="rod")
        rods.append((a, zl, Z1))
    HUNG.append((owner, axis, a0, a1, z_under, rods))


def _ladder(Hm, owner, axis, a0, a1, cross, w=0.4, z=TRAY_Z):
    """Ladder tray: two C-rails and rungs every 0.3 m, on trapeze bars."""
    h = w / 2

    def bx(p0, p1, q0, q1, z0, z1, mat="metal", kind="tray"):
        if axis == "x":
            Hm.box(p0, q0, z0, p1, q1, z1, mat, kind=kind)
        else:
            Hm.box(q0, p0, z0, q1, p1, z1, mat, kind=kind)
    for s in (-1, 1):
        bx(a0, a1, cross + s * h - (0.015 if s > 0 else 0), cross + s * h + (0 if s > 0 else 0.015),
           z, z + 0.1)
    if axis == "x":                                         # tray volume (cable ends land in it)
        PARTS.append(("tray", (a0, cross - h, z), (a1, cross + h, z + 0.1)))
    else:
        PARTS.append(("tray", (cross - h, a0, z), (cross + h, a1, z + 0.1)))
    # rungs every 0.3 m, offset from the rack centres so the fibre drops pass between them
    a = RACK_X0 + 0.15 + 0.3 * math.ceil((a0 + 0.012 - RACK_X0 - 0.15) / 0.3)
    while a <= a1 - 0.012:
        bx(a - 0.012, a + 0.012, cross - h + 0.015, cross + h - 0.015, z, z + 0.015)
        a += 0.3
    _hang(Hm, owner, axis, a0, a1, cross, z, 1.5)


def _overhead(Hm, Lm, G):
    xa, xb = RACK_X0 - 1.0, RACK_X0 + N_RACK * GRID + 0.3
    G["tray_line"] = []
    for r, (yr, fs) in enumerate(zip(ROW_Y, ROW_FRONT)):
        _ladder(Hm, "tray%d" % r, "x", xa, xb, yr)
        zb = TRAY_Z + 0.015
        Hm.tube((xa + 0.05, yr - 0.1, zb + 0.03), (xb - 0.05, yr - 0.1, zb + 0.03), 0.03, "cable",
                seg=10, kind="cable")
        Hm.tube((xa + 0.05, yr - 0.03, zb + 0.022), (xb - 0.05, yr - 0.03, zb + 0.022), 0.022, "cable",
                seg=10, kind="cable")
        Hm.tube((xa + 0.05, yr + 0.07, zb + 0.008), (xb - 0.05, yr + 0.07, zb + 0.008), 0.008, "h_fibre",
                seg=8, kind="cable")
        Hm.tube((xa + 0.05, yr + 0.12, zb + 0.018), (xb - 0.05, yr + 0.12, zb + 0.018), 0.018, "cable",
                seg=10, kind="cable")
        G["tray_line"].append(((xa + 0.05, yr + 0.07, zb + 0.008), (xb - 0.05, yr + 0.07, zb + 0.008)))
        # busway over the front half of the row, tap-off boxes with whips into every 2nd rack
        yb = yr + fs * 0.35
        Hm.box(xa + 0.3, yb - 0.06, BUS_Z, xb - 0.1, yb + 0.06, BUS_Z + 0.1, "metal", kind="bus")
        for i in range(int((xb - xa) / 1.2)):
            Hm.box(xa + 0.3 + 1.2 * i - 0.004, yb - 0.065, BUS_Z - 0.004, xa + 0.3 + 1.2 * i + 0.004,
                   yb + 0.065, BUS_Z + 0.104, "trim", kind="bus")
        Hm.box(xa + 0.3, yb - 0.14, BUS_Z - 0.25, xa + 0.6, yb + 0.14, BUS_Z + 0.1, "h_pipe",
               kind="bus")                                            # end feed unit
        Hm.tube((xa + 0.45, yb, BUS_Z + 0.1), (xa + 0.45, yb, Z1), 0.04, "clay2", seg=10, kind="bus")
        for k in range(0, N_RACK, 2):
            tx = RACK_X0 + k * GRID + 0.3
            Hm.box(tx - 0.08, yb - 0.07, BUS_Z - 0.15, tx + 0.08, yb + 0.07, BUS_Z, "h_pipe",
                   kind="bus")
            Hm.box(tx + 0.03, yb - 0.072, BUS_Z - 0.06, tx + 0.06, yb - 0.07, BUS_Z - 0.03, "trim",
                   kind="bus")
            G["led"][4].box(tx - 0.05, yb - 0.072 if fs > 0 else yb + 0.07, BUS_Z - 0.05, tx - 0.04,
                            yb - 0.07 if fs > 0 else yb + 0.072, BUS_Z - 0.04, "h_led_w", kind="led")
            Hm.tube((tx, yb, BUS_Z - 0.15), (tx, yb, RACK_H), 0.014, "cable", seg=8, kind="cable")
            CABLES.append(("whip", (tx, yb, BUS_Z - 0.15), (tx, yb, RACK_H)))
        _hang(Hm, "bus%d" % r, "x", xa + 0.3, xb - 0.1, yb, BUS_Z + 0.1, 2.0, offs=(0.0,), bar=False)
    # spine tray across the row ends (west)
    _ladder(Hm, "spine", "y", ROW_Y[0] - 0.25, ROW_Y[-1] + 0.25, RACK_X0 - 1.2)
    Hm.tube((RACK_X0 - 1.2, ROW_Y[0] - 0.2, TRAY_Z + 0.045), (RACK_X0 - 1.2, ROW_Y[-1] + 0.2,
            TRAY_Z + 0.045), 0.03, "cable", seg=10, kind="cable")
    # sprinkler branches over every aisle with pendant heads, a cross main at the east wall
    for ay in AISLES:
        py = ay + 0.4
        Hm.tube((X0 + 0.6, py, SPR_Z), (X1 - 0.6, py, SPR_Z), 0.03, "h_pipe", seg=10, kind="pipe")
        for i in range(10):
            hx = X0 + 1.5 + 2.4 * i
            Hm.tube((hx, py, SPR_Z - 0.03), (hx, py, SPR_Z - 0.17), 0.011, "metal", seg=8, kind="pipe")
            Hm.cyl(hx, py, SPR_Z - 0.2, 0.012, 0.03, "metal", seg=8, kind="pipe")
            Hm.cyl(hx, py, SPR_Z - 0.206, 0.026, 0.006, "metal", seg=12, kind="pipe")
        _hang(Hm, "spr%.1f" % ay, "x", X0 + 0.6, X1 - 0.6, py, SPR_Z - 0.03, 3.0, rod_r=0.006,
              offs=(0.0,))
    Hm.tube((X1 - 0.6, AISLES[3] + 0.4, SPR_Z), (X1 - 0.6, AISLES[4] + 0.4, SPR_Z), 0.05, "h_pipe",
            seg=12, kind="pipe")
    Hm.tube((X1 - 0.6, AISLES[3] + 0.4, -0.03), (X1 - 0.6, AISLES[3] + 0.4, SPR_Z), 0.05, "h_pipe",
            seg=12, kind="pipe")
    # linear luminaires on wires over every aisle
    for ay in AISLES:
        for i in range(9):
            sx0 = -10.8 + 2.4 * i + 0.01
            sx1 = sx0 + 2.38
            Lm.box(sx0, ay - 0.05, LAMP_Z + 0.006, sx1, ay + 0.05, LAMP_Z + 0.07, "clay2", kind="lamp")
            Lm.box(sx0 + 0.02, ay - 0.03, LAMP_Z, sx1 - 0.02, ay + 0.03, LAMP_Z + 0.006, "lamp",
                   kind="lamp")
            rods = []
            for wx in (sx0 + 0.3, sx1 - 0.3):
                Lm.tube((wx, ay, LAMP_Z + 0.07), (wx, ay, Z1), 0.0025, "metal", seg=5, kind="rod")
                rods.append((wx, LAMP_Z + 0.07, Z1))
            HUNG.append(("lamp%.1f_%d" % (ay, i), "x", sx0, sx1, LAMP_Z + 0.07, rods))


# --------------------------------------------------------------------------- cooling + wall
def _fan_mesh(r_tip=0.29, n=7):
    fm = MB()
    fm.tube((-0.01, 0, 0), (0.035, 0, 0), 0.075, "clay2", seg=16)
    pitch = math.radians(32)
    verts, faces = [], []
    for b in range(n):
        a = 2 * math.pi * b / n
        u = Vector((0, math.cos(a), math.sin(a)))
        w = Vector((0, -math.sin(a), math.cos(a)))
        base = len(verts)
        for (rad, ch, sw) in ((0.07, 0.07, 0.0), (r_tip, 0.13, 0.05)):
            dirv = (w * math.cos(pitch) + Vector((1, 0, 0)) * math.sin(pitch)).normalized()
            c = u * rad + w * sw + Vector((0.012, 0, 0))
            verts += [tuple(c + dirv * ch / 2), tuple(c - dirv * ch / 2)]
        faces.append([base, base + 1, base + 3, base + 2])
    fm.poly(verts, faces, "clay2")
    return fm


def _crah(Cm, Gm, G, o):
    """CRAH units against the west wall, fans facing +x into the hall."""
    fans = []
    xf = X0 + 0.9
    for yc in (-5.0, 0.0, 5.0):
        Cm.box(X0, yc - 1.18, 0.0, X0 + 0.88, yc + 1.18, 0.1, "trim", kind="crah")
        Cm.box(X0, yc - 1.2, 0.1, xf, yc + 1.2, 2.0, "h_crah", kind="crah")
        Cm.box(X0, yc - 1.15, 2.0, X0 + 0.8, yc + 1.15, 2.35, "h_crah", kind="crah")
        for i in range(6):                                              # return louvres
            z = 2.06 + i * 0.045
            Cm.box(X0 + 0.8, yc - 1.1, z, X0 + 0.825, yc + 1.1, z + 0.02, "clay2", kind="crah")
        for sy in (-0.4, 0.4):                                          # door joints
            Cm.box(xf, yc + sy - 0.004, 0.12, xf + 0.003, yc + sy + 0.004, 1.98, "trim", kind="crah")
        Cm.box(xf, yc - 1.18, 1.0, xf + 0.003, yc + 1.18, 1.006, "trim", kind="crah")
        for (fy, fz) in ((-0.55, 0.55), (0.55, 0.55)):                 # fan section, lower doors
            cy = yc + fy
            Cm.ring_x(xf, cy, fz, 0.30, 0.345, 0.05, "clay2", seg=40, kind="crah")
            Cm.box(xf - 0.002, cy - 0.3, fz - 0.3, xf, cy + 0.3, fz + 0.3, "trim", kind="crah")
            for rg in (0.1, 0.2, 0.29):                                 # finger guard
                Gm.ring_x(xf + 0.05, cy, fz, rg - 0.004, rg + 0.004, 0.006, "metal", seg=32,
                          kind="crah")
            for s in range(8):
                a = 2 * math.pi * s / 8
                Gm.beam((xf + 0.053, cy + 0.02 * math.cos(a), fz + 0.02 * math.sin(a)),
                        (xf + 0.053, cy + 0.32 * math.cos(a), fz + 0.32 * math.sin(a)), 0.006,
                        "metal", kind="crah")
            fans.append((cy, fz))
        for (fy, fz) in ((-0.55, 1.45), (0.55, 1.45)):                  # upper louvred panels
            Cm.box(xf, yc + fy - 0.42, fz - 0.36, xf + 0.006, yc + fy + 0.42, fz + 0.36, "clay2",
                   kind="crah")
            for i in range(12):
                lz = fz - 0.33 + i * 0.055
                Cm.box(xf + 0.006, yc + fy - 0.4, lz, xf + 0.02, yc + fy + 0.4, lz + 0.03, "h_crah",
                       kind="crah")
        Cm.box(xf, yc + 0.72, 1.62, xf + 0.008, yc + 1.08, 1.84, "h_screen", kind="crah")
        for i, w in enumerate((0.22, 0.14, 0.27)):                      # abstract status bars
            Cm.box(xf + 0.008, yc + 0.76, 1.66 + i * 0.055, xf + 0.010, yc + 0.76 + w, 1.672 + i * 0.055,
                   "line", kind="crah")
        G["led"][4].box(xf, yc + 1.1, 1.9, xf + 0.006, yc + 1.112, 1.912, "h_led_w", kind="led")
        for py in (yc - 0.9, yc + 0.9):                                 # chilled water drops
            Cm.tube((X0 + 0.15, py, 2.35), (X0 + 0.15, py, 2.9 + (0.25 if py > yc else 0.0)), 0.06,
                    "h_pipe", seg=14, kind="pipe")
        # return-air grille on the wall above
        Cm.box(X0, yc - 1.0, 3.3, X0 + 0.02, yc + 1.0, 4.1, "h_grille", kind="wall")
        for i in range(9):
            Cm.box(X0 + 0.02, yc - 1.0, 3.32 + i * 0.087, X0 + 0.045, yc + 1.0, 3.34 + i * 0.087,
                   "clay2", kind="wall")
    # chilled-water headers along the west wall on brackets
    for zz in (2.9, 3.15):
        Cm.tube((X0 + 0.15, Y0 + 0.4, zz), (X0 + 0.15, Y1 - 0.4, zz), 0.075, "h_pipe", seg=16,
                kind="pipe")
    for i in range(9):
        by = Y0 + 1.0 + 2.0 * i
        Cm.box(X0, by - 0.03, 2.77, X0 + 0.25, by + 0.03, 2.825, "metal", kind="pipe")
        Cm.box(X0, by - 0.03, 3.02, X0 + 0.25, by + 0.03, 3.075, "metal", kind="pipe")
    # electrical distribution panels between the units, hazard sign (triangle + bolt), no text
    for yc in (-2.5, 2.5):
        Cm.box(X0, yc - 0.45, 0.3, X0 + 0.28, yc + 0.45, 2.0, "h_crah", kind="crah")
        Cm.box(X0 + 0.28, yc - 0.002, 0.35, X0 + 0.283, yc + 0.002, 1.95, "trim", kind="crah")
        Cm.box(X0 + 0.28, yc + 0.3, 1.0, X0 + 0.3, yc + 0.33, 1.2, "metal", kind="crah")
        G["led"][4].box(X0 + 0.28, yc - 0.3, 1.8, X0 + 0.286, yc - 0.288, 1.812, "h_led_b", kind="led")
        tri = [(yc - 0.12, 1.42), (yc + 0.12, 1.42), (yc, 1.63)]
        for (a, b) in zip(tri, tri[1:] + tri[:1]):
            Cm.beam((X0 + 0.285, a[0], a[1]), (X0 + 0.285, b[0], b[1]), 0.012, "mark", kind="sign")
        bolt = [(yc + 0.01, 1.58), (yc - 0.03, 1.5), (yc + 0.01, 1.5), (yc - 0.02, 1.44)]
        for (a, b) in zip(bolt, bolt[1:]):
            Cm.beam((X0 + 0.285, a[0], a[1]), (X0 + 0.285, b[0], b[1]), 0.01, "mark", kind="sign")
    G["fans"] = fans
    return fans


def _floor_paint(Pm):
    """Floor markings (no text): keep-clear hatching, walkway edges, chevrons."""
    z0, z1 = 0.0, 0.0012

    def hatch(xa, xb, ya, yb, step=0.22, w=0.06):
        for (p, q, r_, s) in ((xa, xb, ya, ya + 0.05), (xa, xb, yb - 0.05, yb),
                              (xa, xa + 0.05, ya, yb), (xb - 0.05, xb, ya, yb)):
            Pm.box(p, r_, z0, q, s, z1, "mark", kind="mark")
        t = xa - (yb - ya)
        while t < xb:
            pts = []
            # stripe between lines x - y = t and x - y = t + w, clipped to the inner rectangle
            ia, ib, ja, jb = xa + 0.08, xb - 0.08, ya + 0.08, yb - 0.08
            cand = []
            for yv in (ja, jb):
                for off in (0.0, w):
                    xv = t + off + (yv - ya)
                    cand.append((xv, yv))
            pts = [(min(max(px, ia), ib), py) for px, py in cand]
            quad = [pts[0], pts[1], pts[3], pts[2]]
            if max(p[0] for p in quad) - min(p[0] for p in quad) > 0.02:
                Pm.prism(quad, z0, z1, "mark", kind="mark")
            t += step
    hatch(RACK_X0 - 1.3, RACK_X0 - 0.15, -CONT_Y, CONT_Y)
    for yc in (-5.0, 0.0, 5.0):
        hatch(X0 + 0.95, X0 + 1.9, yc - 1.2, yc + 1.2)
    for xe in (RACK_X0 - 1.45, X0 + 2.05):
        Pm.box(xe - 0.03, Y0 + 0.4, z0, xe + 0.03, Y1 - 0.4, z1, "mark", kind="mark")
    cx = (RACK_X0 - 1.45 + X0 + 2.05) / 2
    for cy in (-7.4, -6.2, 6.2, 7.4):
        d = 1 if cy > 0 else -1
        for (a, b) in (((cx - 0.3, cy), (cx, cy + d * 0.3)), ((cx, cy + d * 0.3), (cx + 0.3, cy))):
            ax, ay = a
            bx, by = b
            nx, ny = -(by - ay), (bx - ax)
            ln_ = math.hypot(nx, ny)
            nx, ny = nx / ln_ * 0.04, ny / ln_ * 0.04
            Pm.prism([(ax - nx, ay - ny), (bx - nx, by - ny), (bx + nx, by + ny), (ax + nx, ay + ny)],
                     z0, z1, "mark", kind="mark")


# --------------------------------------------------------------------------- lights
def _light(name, loc, size, size_y, energy, rot=None, spread=None, color=(0.86, 0.91, 1.0)):
    ld = bpy.data.lights.new(name, "AREA")
    ld.shape = "RECTANGLE"
    ld.size, ld.size_y = size, size_y
    ld.energy = energy
    ld.color = color
    if spread is not None:
        ld.spread = math.radians(spread)
    lo = bpy.data.objects.new(name, ld)
    lo.visible_camera = False
    lo.location = loc
    if rot is not None:
        lo.rotation_euler = rot
    BS.COLL.objects.link(lo)
    return lo


def _lights(o):
    for ay in AISLES:
        e = 210.0 if ay == 0.0 else 120.0
        _light("hall_line%+.1f" % ay, o + Vector((0.0, ay, LAMP_Z - 0.002)), 21.5, 0.06, e)
        _light("hall_up%+.1f" % ay, o + Vector((0.0, ay, LAMP_Z + 0.075)), 21.5, 0.08, 35.0,
               rot=(math.pi, 0.0, 0.0))
    for sy in (-1, 1):       # containment strips graze the opposite rack fronts
        loc = o + Vector((0.0, sy * (CONT_Y - 0.022), 2.158))
        tgt = o + Vector((0.0, -sy * CONT_Y, 0.6))
        rot = (tgt - loc).to_track_quat("-Z", "Y").to_euler()
        _light("hall_strip%+d" % sy, loc, 10.6, 0.03, 95.0, rot=rot, spread=80)   # no spill upward
    # soft wash on the west wall (CRAH units, the far end of the hold shot)
    tgt = o + Vector((X0, 0.0, 1.1))
    loc = o + Vector((X0 + 2.6, 0.0, 4.3))
    rot = (tgt - loc).to_track_quat("-Z", "Y").to_euler()
    _light("hall_wash", loc, 9.0, 1.2, 160.0, rot=rot, spread=110)


# --------------------------------------------------------------------------- build
def build_hall(chiller_me, server_scale=30.0):
    for lst in (PARTS, CABLES, HUNG, RACKS):
        lst.clear()
    new_coll("SET_hall")
    o = H0
    th = BS.ARGS.theme
    _materials(th)
    HL.clear()
    sh, fl = HB("shell"), HB("tile")
    _shell(sh, fl)
    ob_place(sh, "hall_shell", o)
    ob_place(fl, "hall_floor", o)
    # racks
    rr = random.Random(21)
    RV.seed(77)
    G = {"rack": HB("rack"), "door": HB("door"), "top": HB("rack"), "cords": [],
         "led": [HB("led") for _ in range(5)], "net": [HB("led") for _ in range(3)],
         "netlamp": HB("lamp"),
         "svc_db": [HB("svc")], "svc_api": [HB("svc") for _ in range(5)],
         "svc_q": [HB("svc") for _ in range(8)],
         }
    for r in range(4):
        for k in range(N_RACK):
            _rack(G, r, k, rr)
    _open_door(G, o)
    ob_place(G["rack"], "racks", o)
    ob_place(G["door"], "rack_doors", o)
    ob_place(G["top"], "rack_tops", o)
    HL["cords"] = _cords(G)
    # containment + overhead + cooling
    C, S = HB("cont"), HB("cont")
    _containment(C, S)
    ob_place(C, "containment", o)
    HL["strips"] = ob_place(S, "aisle_strips", o)
    Hm, Lm = HB("tray"), HB("lamp")
    _overhead(Hm, Lm, G)
    ob_place(Hm, "overhead", o)
    ob_place(Lm, "luminaires", o)
    Cm, Gm = HB("crah"), HB("crah")
    fans = _crah(Cm, Gm, G, o)
    ob_place(Cm, "crah", o)
    ob_place(Gm, "crah_guards", o)
    Pm = HB("mark")
    _floor_paint(Pm)
    ob_place(Pm, "floor_paint", o)
    HL["fans"] = []
    for i, (fy, fz) in enumerate(fans):
        HL["fans"].append(ob_place(_fan_mesh(), "crah_fan%d" % i, o + Vector((X0 + 0.905, fy, fz))))
        PARTS.append(("crah", (X0 + 0.895, fy - 0.29, fz - 0.29), (X0 + 0.95, fy + 0.29, fz + 0.29)))
    HL["led_groups"] = [ob_place(G["led"][g], "leds%d" % g, o) for g in range(5)]
    HL["net_leds"] = [ob_place(G["net"][g], "net_leds%d" % g, o) for g in range(3)]
    ob_place(G["netlamp"], "net_lamp", o)
    HL["svc_db"] = ob_place(G["svc_db"][0], "svc_db_glow", o)
    HL["svc_api"] = [ob_place(m, "svc_api_l%d" % i, o) for i, m in enumerate(G["svc_api"])]
    HL["svc_q"] = [ob_place(m, "svc_q_s%d" % i, o) for i, m in enumerate(G["svc_q"])]
    # tray fibre pulses (period 30 frames), visible through the glazed roof
    HL["tray_pulses"] = []
    for r, (p0, p1) in enumerate(G["tray_line"]):
        pts = [o + Vector(p1), o + Vector(p0)] if r % 2 else [o + Vector(p0), o + Vector(p1)]
        for i in range(2):
            HL["tray_pulses"].append((BS.curve("tray_pulse%d_%d" % (r, i), pts, 0.014, "pulse",
                                               cat="set"), (r * 0.31 + i * 0.5) % 1.0))
    _lights(o)
    # ---------------------------------------------------------------- hero port (seam 2c)
    k = PORT_RACK[1]
    px = RACK_X0 + k * 0.6 + 0.3
    yf = ROW_Y[PORT_RACK[0]] - 0.6
    bm = MB()
    import bmesh
    m = Matrix.Translation((0, 0.02, 0)) @ Matrix.Rotation(math.pi / 2, 4, "X")
    res = bmesh.ops.create_cone(bm.bm, cap_ends=False, segments=64, radius1=0.006, radius2=0.006,
                                depth=0.04, matrix=m)
    bm._tag(res["verts"], "bore", smooth=True)
    res = bmesh.ops.create_cone(bm.bm, cap_ends=False, segments=64, radius1=0.0085,
                                radius2=0.0085, depth=0.04, matrix=m)
    bm._tag(res["verts"], "metal", smooth=True)
    y_panel = yf - 0.01
    HL["port"] = ob_place(bm, "hero_port", o + Vector((px, y_panel - 0.04, 2.045)))
    HL["port_mouth"] = o + Vector((px, y_panel - 0.04, 2.045))
    HL["port_r"] = 0.006
    PARTS.append(("port", (px - 0.0085, y_panel - 0.04, 2.045 - 0.0085),
                  (px + 0.0085, y_panel, 2.045 + 0.0085)))
    # ---------------------------------------------------------------- open server (seam 3)
    k = SRV_RACK[1]
    sx = RACK_X0 + k * 0.6 + 0.3
    yfr = ROW_Y[SRV_RACK[0]] + 0.6
    sm = HB("srv")
    ty0, ty1, zf = yfr - 0.1, yfr + 0.65, 1.86
    sm.box(sx - 0.25, ty0, zf - 0.03, sx + 0.25, ty1, zf, "clay")              # tray floor
    sm.box(sx - 0.25, ty0, zf, sx - 0.235, ty1, zf + 0.05, "clay2")
    sm.box(sx + 0.235, ty0, zf, sx + 0.25, ty1, zf + 0.05, "clay2")
    sm.box(sx - 0.25, ty1 - 0.012, zf - 0.03, sx + 0.25, ty1, zf + 0.05, "clay2")
    for i in range(6):                                                          # DIMMs at the back
        x = sx - 0.2 + i * 0.08
        sm.box(x, ty0 + 0.01, zf, x + 0.008, ty0 + 0.11, zf + 0.035, "clay2")
    ob_place(sm, "server_tray", o)
    # chassis parts outside the seam window, lit by the hall: rails, bezel, underside, arm
    cm = HB("srvc")
    yr0 = yfr - RACK_D
    for s in (-1, 1):
        xa = sx + s * 0.25
        xo = xa + s * 0.005
        cm.box(min(xa, xo), yr0 + 0.05, zf - 0.025, max(xa, xo), yfr + 0.02, zf + 0.005, "metal")
        cm.box(min(xa, xo), yfr - 0.3, zf - 0.021, max(xa, xo), yfr + 0.35, zf + 0.001, "metal")
        cm.box(min(xa, xo), yfr - 0.05, zf - 0.018, max(xa, xo), ty1 - 0.06, zf - 0.002, "metal")
    cm.box(sx - 0.245, ty0 + 0.02, zf - 0.034, sx + 0.245, ty1 - 0.012, zf - 0.03, "metal")
    for i in range(7):
        vy = ty0 + 0.25 + i * 0.06
        cm.box(sx - 0.18, vy, zf - 0.036, sx + 0.18, vy + 0.025, zf - 0.034, "trim")
    cm.box(sx - 0.27, ty1, zf - 0.03, sx + 0.27, ty1 + 0.008, zf + 0.05, "h_frame")     # bezel
    cm.box(sx - 0.2, ty1 + 0.008, zf - 0.022, sx + 0.12, ty1 + 0.01, zf + 0.042, "h_mesh")
    for s in (-1, 1):
        hx = sx + s * 0.235
        cm.box(hx - 0.012, ty1 + 0.008, zf - 0.02, hx + 0.012, ty1 + 0.03, zf - 0.012, "metal")
        cm.box(hx - 0.012, ty1 + 0.008, zf + 0.032, hx + 0.012, ty1 + 0.03, zf + 0.04, "metal")
        cm.box(hx - 0.012, ty1 + 0.022, zf - 0.02, hx + 0.012, ty1 + 0.03, zf + 0.04, "metal")
    cm.box(sx + 0.15, ty1 + 0.008, zf + 0.032, sx + 0.154, ty1 + 0.010, zf + 0.036, "h_led_w")
    # cable management arm folded out behind the pulled server, inside the rack
    arm = [(sx - 0.2, ty0 - 0.002), (sx + 0.16, ty0 - 0.42), (sx - 0.2, yr0 + 0.05)]
    for (a, b) in zip(arm, arm[1:]):
        cm.beam((a[0], a[1], zf - 0.005), (b[0], b[1], zf - 0.005), 0.03, "metal")
        cm.tube((a[0], a[1], zf + 0.022), (b[0], b[1], zf + 0.022), 0.012, "cable", seg=8)
    ob_place(cm, "server_chassis", o)
    um = HB("led")
    um.box(sx + 0.165, ty1 + 0.008, zf + 0.008, sx + 0.215, ty1 + 0.013, zf + 0.020, "h_led_b")  # light pipe
    HL["uid"] = ob_place(um, "server_uid", o)
    # fan modules: miniature of HA1's rooftop chillers (same proto, 1/server_scale)
    s = 1.0 / server_scale
    mc = Vector((sx, (ty0 + 0.11 + ty1) / 2 + 0.01, zf))
    HL["server_center"] = o + mc
    HL["modules"] = []
    for row, ry in enumerate((-3.05, 3.05)):
        for c in range(4):
            lx = (c - 1.5) * 3.1
            ob = BS.place(chiller_me, "srv_mod%d_%d" % (row, c),
                          tuple(o + mc + Vector((lx * s, ry * s, 0))), 0.0, s, 0.0, cat="set")
            HL["modules"].append(ob)
    if VOLUME:
        LB.room_volume("hall_air", o + Vector((X0, Y0, 0.0)), o + Vector((X1, Y1, Z1)), BS.COLL,
                       density=0.008)
    # seam lighting: the open server is lit by light-linked copies of the exterior sun and rim
    # (shadows only from the server itself); hall lights and every hall emitter skip it
    srv = bpy.data.collections.new("SRV_LINK")
    lit = bpy.data.collections.new("HALL_LIT")
    for ob in list(BS.COLL.objects):
        if ob.type not in ("MESH", "CURVE"):
            continue
        (srv if ob.name.startswith(("srv_mod", "server_tray")) else lit).objects.link(ob)
    for ob in list(BS.COLL.objects):
        if ob.type == "LIGHT" or (ob.type in ("MESH", "CURVE") and ob.name in lit.objects):
            ob.light_linking.receiver_collection = lit
    # the strip diffusers are seen but light nothing (their linked area lights do the lighting);
    # lit from 4 cm they burned the patch cords below them into white streaks
    HL["strips"].light_linking.receiver_collection = bpy.data.collections.new("HALL_NONE")
    # pulled-out server at the hold: floor bounce linked to its chassis and door only (the tray
    # and modules stay srv_Sun/srv_Rim only, seam 3)
    chs = bpy.data.collections.new("SRV_CHASSIS")
    for nm in ("server_chassis", "rack_door_open"):
        chs.objects.link(bpy.data.objects[nm])
    bl = _light("hall_srv_bounce", o + Vector((sx, yfr + 0.3, 0.02)), 0.8, 0.9, 9.0,
                rot=(math.pi, 0.0, 0.0))
    bl.light_linking.receiver_collection = chs
    # network rack interior light (ramped in after seam 2c)
    nk = NET_RACK[1]
    nx = RACK_X0 + nk * GRID + 0.3
    ny = ROW_Y[NET_RACK[0]] + ROW_FRONT[NET_RACK[0]] * (RACK_D / 2 - 0.03)
    nl_ = _light("hall_net_light", o + Vector((nx, ny, 1.95)), 0.46, 0.03, 5.0, spread=120)
    nl_.light_linking.receiver_collection = lit
    HL["net_light"] = (nl_, 5.0)
    for nm in ("Sun", "Rim"):
        src = bpy.data.objects.get(nm)
        if src is None:
            continue
        lo = bpy.data.objects.new("srv_" + nm, src.data.copy())
        lo.rotation_euler = src.rotation_euler.copy()
        BS.COLL.objects.link(lo)
        lo.light_linking.receiver_collection = srv
        lo.light_linking.blocker_collection = srv
    HL["window"] = (mc.x, mc.y, 0.23, 0.23)
    if os.environ.get("HALL_CHECK"):
        v = check(HL)
        print("HALL_CHECK TOTAL %d" % len(v))
        for line in v[:40]:
            print("HALL_CHECK", line)
    return HL


# --------------------------------------------------------------------------- per frame
def smooth01(u):
    u = min(1.0, max(0.0, u))
    return u * u * (3 - 2 * u)


LED_ON = (lambda f: not (12 <= f % 30 < 17), lambda f: f % 6 < 3, lambda f: f % 10 < 2,
          lambda f: f % 15 in (0, 2, 4), lambda f: True)
Q_PATTERN = (1, 1, 0, 1, 0, 0, 1, 0, 1, 0)


def state(t, D):
    """Idle loop, every period divides 30 frames: LEDs, CRAH fans, tray pulses, services."""
    f = int(math.floor(t + 1e-6))
    u = t - T_LOOP0
    for g, ob in enumerate(D["led_groups"]):
        ob.hide_render = not LED_ON[g](f)
    step = 2 * math.pi / 7 / LOOP
    for i, ob in enumerate(D["fans"]):
        ob.rotation_euler.x = u * step * (4 + i % 3)
    for ob, ph in D["tray_pulses"]:
        window(ob, ((u / LOOP + ph) % 1.0) * 1.15, 0.07)
    s = (f // 2) % 5
    for i, ob in enumerate(D["svc_api"]):
        ob.hide_render = i not in (s, (s - 1) % 5)
    q = (f // 3) % 10
    for i, ob in enumerate(D["svc_q"]):
        ob.hide_render = not Q_PATTERN[(i - q) % 10]
    # service dots: small, so they run brighter than the old bars (colour unchanged)
    emit("svc_db", 1.0 + 0.8 * (0.5 - 0.5 * math.cos(2 * math.pi * u / LOOP)))
    emit("svc_api", 1.8)
    emit("svc_q", 1.8)
    # seam 2c: the aisle strips stay dark in the bore (161) and come up by 164; the network
    # rack (focal point of the port exit) lights up right after, 162 -> 165
    emit("hall_racktop_strip", smooth01((t - 161.0) / 3.0))
    kn = smooth01((t - 162.0) / 3.0)
    emit("h_netlamp", kn)
    emit("h_net_led", kn)
    lo, e0 = D["net_light"]
    lo.data.energy = e0 * kn
    for g, ob in enumerate(D["net_leds"]):
        ob.hide_render = not LED_ON[g + 1](f)
    D["uid"].hide_render = f % 10 >= 5


build = build_hall


# --------------------------------------------------------------------------- physical check
CAM_PATH = None


def _cam_path(D):
    """Hall camera positions (hall-local) after it leaves the bore: sampled from the running
    journey (camera_at) when present, else a copy of journey.exit_move/aisle_move (2026-10-17)."""
    pm = D["port_mouth"] - H0
    sc = D["server_center"] - H0
    jm = sys.modules.get("__main__")
    if hasattr(jm, "camera_at") and hasattr(jm, "SHOTS"):
        return [jm.camera_at(164.0 + 0.5 * i, "hall")[0] - H0 for i in range(149)]
    pts = []
    for (t, x, y, z) in ((165, pm.x, pm.y - 0.018, pm.z), (168, pm.x, pm.y - 0.083, pm.z),
                         (172, -0.413, pm.y - 0.33, 1.991), (175, -0.602, 0.03, 1.902),
                         (180, -0.967, 0.0, 1.73), (186, -1.2, 0.0, 1.62),
                         (201, -1.77, 0.0, 1.66), (210, -2.39, 0.0, 1.85),
                         (218, -2.92, -0.2, 2.06), (224, -3.2, -0.44, 2.09)):
        pts.append(Vector((x, y, z)))
    return pts + [sc + Vector((0, 0, 0.25)), sc + Vector((0, 0, 0.44))]


def check(D):
    """Physical logic of the hall -> list of violation strings (empty = pass)."""
    import numpy as np
    v = []
    eps = 0.004
    kinds = [p[0] for p in PARTS]
    LO = np.array([p[1] for p in PARTS], dtype=float)
    HI = np.array([p[2] for p in PARTS], dtype=float)
    n = len(PARTS)
    # 1. nothing floats: contact graph (AABB touch within 4 mm) down to the building shell
    seen = np.zeros(n, dtype=bool)
    stack = [i for i, kd in enumerate(kinds) if kd == "shell"]
    seen[stack] = True
    while stack:
        i = stack.pop()
        m = ~seen
        m &= (LO[:, 0] <= HI[i, 0] + eps) & (HI[:, 0] >= LO[i, 0] - eps)
        m &= (LO[:, 1] <= HI[i, 1] + eps) & (HI[:, 1] >= LO[i, 1] - eps)
        m &= (LO[:, 2] <= HI[i, 2] + eps) & (HI[:, 2] >= LO[i, 2] - eps)
        idx = np.nonzero(m)[0]
        seen[idx] = True
        stack.extend(idx.tolist())
    for i in np.nonzero(~seen)[0][:30]:
        v.append("floating %s at %s" % (kinds[i], tuple(round(c, 3) for c in LO[i])))
    if (~seen).sum() > 30:
        v.append("... %d floating parts in total" % int((~seen).sum()))
    # 2. racks on the 0.6 m grid, standing on the floor, no overlaps
    for (r, k, x0, x1, y0, y1, z0, z1) in RACKS:
        for val, org in ((x0, GX0), (x1, GX0), (y0, GY0), (y1, GY0)):
            q = (val - org) / GRID
            if abs(q - round(q)) > 1e-6:
                v.append("rack %d/%d off the floor grid (%.3f)" % (r, k, val))
        if abs(z0) > 1e-6:
            v.append("rack %d/%d does not stand on the floor (z0=%.3f)" % (r, k, z0))
    for a in range(len(RACKS)):
        for b in range(a + 1, len(RACKS)):
            A, B_ = RACKS[a], RACKS[b]
            ox = min(A[3], B_[3]) - max(A[2], B_[2])
            oy = min(A[5], B_[5]) - max(A[4], B_[4])
            if ox > 1e-6 and oy > 1e-6:
                v.append("racks %s and %s overlap" % (A[:2], B_[:2]))
    # 3. doors and containment do not intersect racks
    RB = np.array([[R[2] + 0.005, R[4], 0.0, R[3] - 0.005, R[5], RACK_H] for R in RACKS])
    for i, kd in enumerate(kinds):
        if kd not in ("door", "cont"):
            continue
        pen = np.minimum(HI[i], RB[:, 3:]) - np.maximum(LO[i], RB[:, :3])
        hit = np.all(pen > 0.001, axis=1)
        if hit.any():
            v.append("%s part %s intersects rack %s" % (kd, tuple(round(c, 3) for c in LO[i]),
                                                        RACKS[int(np.nonzero(hit)[0][0])][:2]))
    # 4. hung elements: rods reach the slab or a beam, spacing and end cover
    for (owner, axis, a0, a1, z_under, rods) in HUNG:
        if len(rods) < 2:
            v.append("%s hangs on fewer than 2 rods" % owner)
        pos = sorted(r_[0] for r_ in rods)
        if pos and (pos[0] - a0 > 0.5 or a1 - pos[-1] > 0.5):
            v.append("%s: unsupported end (rods %.2f..%.2f, span %.2f..%.2f)" % (owner, pos[0], pos[-1],
                                                                               a0, a1))
        lim = 3.1 if owner.startswith("spr") else 2.6 if owner.startswith("bus") else 2.0
        if any(b - a > lim for a, b in zip(pos, pos[1:])):
            v.append("%s: rod spacing above %.1f m" % (owner, lim))
        for (a, zl, zh) in rods:
            if abs(zh - Z1) > 1e-6:
                v.append("%s: rod at %.2f does not reach the slab" % (owner, a))
            if zl > z_under + 1e-6:
                v.append("%s: rod at %.2f ends above the hung element" % (owner, a))
    # 5. cable ends lie in a port, duct, tray, grommet, busway or rack top
    hosts = [i for i, kd in enumerate(kinds) if kd in ("port", "duct", "tray", "grommet", "bus",
                                                        "rack", "srvc", "srv")]
    HL_, HH_ = LO[hosts] - 0.003, HI[hosts] + 0.003
    for (nm, p0, p1) in CABLES:
        for p in (p0, p1):
            P = np.array(p)
            if not np.any(np.all((HL_ <= P) & (P <= HH_), axis=1)):
                v.append("%s end %s is not in a port/duct/tray" % (nm, tuple(round(c, 3) for c in p)))
    # 6. seam 2c: port contract and a clear aisle in front of it
    pm = D["port_mouth"] - H0
    if abs(D["port_r"] - 0.006) > 1e-9:
        v.append("seam 2c: port_r changed")
    px = RACK_X0 + PORT_RACK[1] * GRID + 0.3
    # (H0 offsets are float32 vectors: compare to 1 mm)
    if abs(pm.x - px) > 1e-3 or abs(pm.y - (ROW_Y[PORT_RACK[0]] - 0.6 - 0.05)) > 1e-3 or \
            abs(pm.z - 2.045) > 1e-3:
        v.append("seam 2c: port mouth moved")
    # from the mouth to the opposite rack face, minus its 8 cm equipment zone (cords, handles)
    corr_lo = np.array([pm.x - 0.06, -CONT_Y + 0.08, pm.z - 0.06])
    corr_hi = np.array([pm.x + 0.06, pm.y - 0.001, pm.z + 0.06])
    hit = np.all((LO < corr_hi) & (HI > corr_lo), axis=1)
    for i in np.nonzero(hit)[0][:5]:
        v.append("seam 2c: %s blocks the aisle in front of the port" % kinds[i])
    # 7. seam 3: nothing above the tray inside the camera window but the tray and modules
    wx, wy, hx, hy = D["window"]
    w_lo = np.array([wx - hx, wy - hy, 1.861])
    w_hi = np.array([wx + hx, wy + hy, 2.6])
    hit = np.all((LO < w_hi) & (HI > w_lo), axis=1)
    for i in np.nonzero(hit)[0]:
        if kinds[i] != "srv":
            v.append("seam 3: %s enters the camera window" % kinds[i])
    # 8. the journey camera path stays 4 cm clear of everything (after it leaves the bore)
    path = _cam_path(D)
    pts = []
    for a, b in zip(path, path[1:]):
        steps = max(2, int((b - a).length / 0.02))
        pts += [a.lerp(b, i / steps) for i in range(steps + 1)]
    P = np.array([tuple(p) for p in pts])
    for i in range(n):
        if kinds[i] in ("port", "srv"):
            continue
        inside = np.all((P > LO[i] - 0.04) & (P < HI[i] + 0.04), axis=1)
        if inside.any():
            v.append("camera path passes within 4 cm of %s at %s" % (
                kinds[i], tuple(round(c, 2) for c in P[int(np.nonzero(inside)[0][0])])))
    # 9. emissives: only the look's blue and white
    ok = [tuple(c) for c in (LB.BLUE, LB.WHITE_LED)]
    for m in bpy.data.materials:
        if not m.name.startswith("h_") or not m.node_tree:
            continue
        b = m.node_tree.nodes.get("Principled BSDF")
        if b is None or b.inputs["Emission Strength"].default_value <= 0:
            continue
        col = tuple(b.inputs["Emission Color"].default_value[:3])
        if not any(max(abs(p - q) for p, q in zip(col, c)) < 1e-3 for c in ok):
            v.append("material %s emits a colour outside the look" % m.name)
    return v


if __name__ == "__main__":
    import time
    BS.setup_world_and_render()
    import sets.common as JC
    JC.materials()
    t0 = time.time()
    D = build(BS.proto("chiller", BS.p_chiller))
    t1 = time.time()
    viol = check(D)
    print("HALL_CHECK parts=%d build=%.1fs check=%.1fs" % (len(PARTS), t1 - t0, time.time() - t1))
    for line in viol:
        print("HALL_CHECK", line)
    print("HALL_CHECK TOTAL %d" % len(viol))
