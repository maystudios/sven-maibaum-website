"""Procedural data-centre growth scene for the project-size slider (style test).

Everything is built from code; nothing is downloaded.  The timeline encodes the
five levels (Mini .. Maximal); a level still is simply the last frame of that
level's segment, so stills, contact sheets and the growth animation share one
source of truth.

Usage (headless):
  blender -b -P build_scene.py -- --theme light --level 5 --res 1600x1200 \
      --samples 256 --out renders/max-light.png
  blender -b -P build_scene.py -- --theme light --levels 1,2,3,4,5 \
      --res 800x600 --out renders/levels/light-L{level}.png
  blender -b -P build_scene.py -- --theme dark --anim 1-136 --res 960x720 \
      --samples 48 --out renders/anim-dark/f_####.png

Work-in-progress hook (exterior agent): with the environment variable EXT_BUILD_WIP set to a copy
of this file, every importer (journey.py, look.py, sets) and the --validate run use that copy, so
render_shot.py can render an exterior WIP without touching this file. Unset = no effect.
"""
import os as _os
import sys as _sys

_WIP = _os.environ.get("EXT_BUILD_WIP")
_WIP = _WIP if _WIP and _os.path.abspath(_WIP) != _os.path.abspath(__file__) else None
if _WIP:
    import importlib.util as _ilu
    if __name__ == "__main__":
        import runpy as _runpy
        _runpy.run_path(_WIP, run_name="__main__")
    else:
        _spec = _ilu.spec_from_file_location(__name__, _WIP)
        _mod = _ilu.module_from_spec(_spec)
        _sys.modules[__name__] = _mod
        _spec.loader.exec_module(_mod)

import argparse
import math
import os
import random
import sys
import time

import bmesh
import bpy
from mathutils import Matrix, Vector, noise

# --------------------------------------------------------------------------- timeline
FPS = 24
LV_START = {1: 2, 2: 25, 3: 51, 4: 81, 5: 109}
LV_END = {1: 24, 2: 50, 3: 80, 4: 108, 5: 136}
SETTLE = 13  # frames kept free at the end of each segment so motion settles


# 72-frame web sequence: growth index i -> growth time on the 136-frame timeline. Each level
# segment is retimed linearly onto its 18 (last: 17) frames; indices 0/18/36/54/71 are exactly
# the validated level states (old frames 24/50/80/108/136).
GROWTH_FRAMES = 72
LEVEL_INDEX = {1: 0, 2: 18, 3: 36, 4: 54, 5: 71}


def growth_time(i):
    keys = [(LEVEL_INDEX[l], LV_END[l]) for l in range(1, 6)]
    for (i0, f0), (i1, f1) in zip(keys[:-1], keys[1:]):
        if i0 <= i <= i1:
            return f0 + (f1 - f0) * (i - i0) / (i1 - i0)
    raise ValueError(i)


def T(level, frac):
    """Birth frame for something in `level`, frac 0..1 across the segment."""
    s, e = LV_START[level], LV_END[level]
    return s + frac * (e - s - SETTLE)


# --------------------------------------------------------------------------- args
def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    p = argparse.ArgumentParser()
    p.add_argument("--theme", default="light", choices=["light", "dark"])
    p.add_argument("--level", type=int, default=5)
    p.add_argument("--levels", default=None, help="comma list, out needs {level}")
    p.add_argument("--anim", default=None, help="frame range a-b, out needs ####")
    p.add_argument("--frame", type=int, default=None, help="explicit frame for a still")
    p.add_argument("--res", default="1600x1200")
    p.add_argument("--samples", type=int, default=256)
    p.add_argument("--out", required=True)
    p.add_argument("--save-blend", default=None)
    p.add_argument("--seed", type=int, default=11)
    p.add_argument("--ortho", type=float, default=None, help="override ortho scale")
    p.add_argument("--topview", action="store_true", help="layout check camera")
    p.add_argument("--validate", action="store_true", help="run validate_scene.py, no render")
    p.add_argument("--validate-levels", default="1,2,3,4,5")
    p.add_argument("--selftest", action="store_true", help="with --validate: inject faults")
    p.add_argument("--growth72", action="store_true",
                   help="72-frame growth sequence Mini..Maximal, out needs {i3}")
    p.add_argument("--loops", default=None,
                   help="comma list of levels: 16-frame idle loops (frames 1..15), out needs "
                        "{level} and {i2}; frame 00 is the growth frame of that level")
    p.add_argument("--frames", default=None, help="optional subset of growth indices, e.g. 0,18")
    return p.parse_known_args(argv)[0]


ARGS = parse_args()
RNG = random.Random(ARGS.seed)
SCENE = bpy.context.scene
# start from an empty scene (the factory startup file ships a cube, a light and a camera)
for _ob in list(bpy.data.objects):
    bpy.data.objects.remove(_ob, do_unlink=True)

# --------------------------------------------------------------------------- materials
MAT_NAMES = ["clay", "clay2", "trim", "road", "mark", "metal", "cable", "glass",
             "line", "pad", "tree", "ground", "solar", "pulse", "wab", "halo", "band"]
GLOW_MATS = ("wab", "halo", "band")      # exterior-only emissives, built in wab_shaders()
M = {n: i for i, n in enumerate(MAT_NAMES)}
BLUE = (0.044, 0.223, 0.922)

THEMES = {
    "light": dict(
        clay=((0.84, 0.86, 0.90), 0.55), clay2=((0.68, 0.71, 0.76), 0.6),
        trim=((0.20, 0.23, 0.28), 0.5), road=((0.050, 0.058, 0.075), 0.85),
        mark=((0.80, 0.82, 0.85), 0.6), metal=((0.62, 0.64, 0.68), 0.45),
        cable=((0.22, 0.24, 0.28), 0.5), pad=((0.62, 0.65, 0.71), 0.7),
        tree=((0.68, 0.72, 0.75), 0.8), ground=((0.46, 0.50, 0.57), 0.9),
        solar=((0.07, 0.085, 0.11), 0.25),
        glass_emit=2.2, line_emit=3.0, pulse_emit=24.0,
        world=((0.62, 0.69, 0.82), 0.7), sun=(4.6, 11.0),
        exposure=0.08, bloom=(1.6, 0.35),
    ),
    "dark": dict(
        clay=((0.060, 0.064, 0.072), 0.5), clay2=((0.040, 0.043, 0.050), 0.55),
        trim=((0.010, 0.011, 0.014), 0.45), road=((0.014, 0.015, 0.019), 0.8),
        mark=((0.16, 0.17, 0.19), 0.6), metal=((0.085, 0.09, 0.10), 0.45),
        cable=((0.05, 0.055, 0.065), 0.5), pad=((0.020, 0.022, 0.027), 0.7),
        tree=((0.032, 0.036, 0.040), 0.8), ground=((0.0038, 0.0042, 0.0052), 0.9),
        solar=((0.012, 0.014, 0.02), 0.25),
        glass_emit=7.0, line_emit=7.0, pulse_emit=45.0,
        world=((0.006, 0.009, 0.018), 1.0), sun=(4.0, 10.0),
        exposure=0.22, bloom=(0.55, 0.65),
    ),
}
TH = THEMES[ARGS.theme]


def principled(name, color, rough, metal=0.0, emit=None, strength=0.0):
    m = bpy.data.materials.new(name)
    try:
        m.use_nodes = True
    except Exception:
        pass
    b = m.node_tree.nodes.get("Principled BSDF")
    b.inputs["Base Color"].default_value = (*color, 1.0)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    if emit is not None:
        b.inputs["Emission Color"].default_value = (*emit, 1.0)
        b.inputs["Emission Strength"].default_value = strength
    return m


def build_materials():
    mats = []
    for n in MAT_NAMES:
        if n in GLOW_MATS:
            mats.append(principled(n, (0.0, 0.0, 0.0), 0.5))
        elif n == "glass":
            base = (0.06, 0.20, 0.75) if ARGS.theme == "light" else (0.01, 0.03, 0.12)
            mats.append(principled(n, base, 0.18, emit=BLUE, strength=TH["glass_emit"]))
        elif n == "line":
            mats.append(principled(n, (0.02, 0.1, 0.5), 0.4, emit=BLUE, strength=TH["line_emit"]))
        elif n == "pulse":
            mats.append(principled(n, (0.3, 0.5, 1.0), 0.4, emit=(0.35, 0.6, 1.0),
                                   strength=TH["pulse_emit"]))
        else:
            col, rough = TH[n]
            mats.append(principled(n, col, rough, metal=0.0))
    return mats


MATS = build_materials()

# --------------------------------------------------------------------------- mesh builder
COLL = SCENE.collection


class MB:
    """Accumulates primitives into one bmesh with per-face material indices."""

    def __init__(self):
        self.bm = bmesh.new()

    def _tag(self, verts, mat, smooth=False):
        faces = set()
        for v in verts:
            faces.update(v.link_faces)
        for f in faces:
            f.material_index = M[mat] if isinstance(mat, str) else mat
            f.smooth = smooth
        return faces

    def box(self, x0, y0, z0, x1, y1, z1, mat="clay"):
        m = Matrix.Translation(((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2)) @ \
            Matrix.Diagonal((abs(x1 - x0), abs(y1 - y0), abs(z1 - z0), 1.0))
        r = bmesh.ops.create_cube(self.bm, size=1.0, matrix=m)
        self._tag(r["verts"], mat)

    def boxc(self, cx, cy, z0, sx, sy, sz, mat="clay"):
        self.box(cx - sx / 2, cy - sy / 2, z0, cx + sx / 2, cy + sy / 2, z0 + sz, mat)

    def _cyl(self, m, r1, r2, depth, mat, seg, smooth):
        res = bmesh.ops.create_cone(self.bm, cap_ends=True, cap_tris=False, segments=seg,
                                    radius1=r1, radius2=r2, depth=depth, matrix=m)
        faces = self._tag(res["verts"], mat, smooth)
        if smooth:
            for f in faces:
                f.normal_update()
                if len(f.verts) > 4:  # caps
                    f.smooth = False
                    for e in f.edges:
                        e.smooth = False

    def cyl(self, cx, cy, z0, r, h, mat="clay", seg=20, r2=None, smooth=True):
        m = Matrix.Translation((cx, cy, z0 + h / 2))
        self._cyl(m, r, r if r2 is None else r2, h, mat, seg, smooth)

    def tube(self, p0, p1, r, mat="clay", seg=12, smooth=True):
        p0, p1 = Vector(p0), Vector(p1)
        d = p1 - p0
        q = d.to_track_quat("Z", "Y")
        m = Matrix.Translation((p0 + p1) / 2) @ q.to_matrix().to_4x4()
        self._cyl(m, r, r, d.length, mat, seg, smooth)

    def beam(self, p0, p1, t, mat="metal"):
        p0, p1 = Vector(p0), Vector(p1)
        d = p1 - p0
        if d.length < 1e-4:
            return
        q = d.to_track_quat("Z", "Y")
        m = Matrix.Translation((p0 + p1) / 2) @ q.to_matrix().to_4x4() @ \
            Matrix.Diagonal((t, t, d.length, 1.0))
        r = bmesh.ops.create_cube(self.bm, size=1.0, matrix=m)
        self._tag(r["verts"], mat)

    def slab(self, p0, p1, w, t, mat="metal", roll=0.0):
        """Flat bar from p0 to p1: width w across (horizontal side), thickness t, rolled by
        `roll` radians about its axis (fan blades, louvres)."""
        p0, p1 = Vector(p0), Vector(p1)
        d = p1 - p0
        L = d.length
        if L < 1e-5:
            return
        d.normalize()
        side = d.cross(Vector((0, 0, 1)))
        side = side.normalized() if side.length > 1e-4 else Vector((1, 0, 0))
        up = side.cross(d).normalized()
        side, up = side * math.cos(roll) + up * math.sin(roll), up * math.cos(roll) - side * math.sin(roll)
        m = Matrix.Identity(4)
        for i in range(3):
            m[i][0], m[i][1], m[i][2] = side[i] * w, up[i] * t, d[i] * L
        m.translation = (p0 + p1) / 2
        r = bmesh.ops.create_cube(self.bm, size=1.0, matrix=m)
        self._tag(r["verts"], mat)

    def ring(self, cx, cy, z, r, t, mat="clay2", n=24):
        """Thin horizontal ring of n bars (fan guards, hoops)."""
        for s in range(n):
            a0, a1 = s * 2 * math.pi / n, (s + 1) * 2 * math.pi / n
            self.beam((cx + math.cos(a0) * r, cy + math.sin(a0) * r, z),
                      (cx + math.cos(a1) * r, cy + math.sin(a1) * r, z), t, mat)

    def sphere(self, c, r, mat="clay", scale=(1, 1, 1), sub=2, jitter=0.0, seed=0.0):
        m = Matrix.Translation(c) @ Matrix.Diagonal((*scale, 1.0))
        res = bmesh.ops.create_icosphere(self.bm, subdivisions=sub, radius=r, matrix=m)
        if jitter:
            for v in res["verts"]:
                n = (v.co - Vector(c)).normalized()
                v.co += n * noise.noise(v.co * 0.9 + Vector((seed, seed, seed))) * jitter
        self._tag(res["verts"], mat, smooth=True)

    def poly(self, verts, faces, mat="clay"):
        vs = [self.bm.verts.new(v) for v in verts]
        for f in faces:
            face = self.bm.faces.new([vs[i] for i in f])
            face.material_index = M[mat]

    def mesh(self, name):
        me = bpy.data.meshes.new(name)
        self.bm.normal_update()
        self.bm.to_mesh(me)
        self.bm.free()
        for m in MATS:
            me.materials.append(m)
        return me


def add_bevel(ob, width=0.08, segs=2):
    mod = ob.modifiers.new("Bevel", "BEVEL")
    mod.width = width
    mod.segments = segs
    mod.limit_method = "ANGLE"
    mod.angle_limit = math.radians(35)
    mod.use_clamp_overlap = True
    return mod


PREFIX = ""      # object-name prefix of the campus variant being built ("" = the hero campus)
STATIC = False   # variant builds are static (no growth), only loops (spin, pulse, breathe) run
REF_KEYS = ("parent", "fed_by", "sprout_from")


def tag(ob, cat, **meta):
    """Category + metadata used by validate_scene.py (name references follow the prefix)."""
    ob["cat"] = cat
    for k, v in meta.items():
        if PREFIX and k in REF_KEYS and v:
            v = PREFIX + v
        elif PREFIX and k == "attached" and v:
            v = ",".join(PREFIX + s for s in v.split(",") if s)
        ob[k] = v
    return ob


def place(me, name, loc=(0, 0, 0), rot=0.0, scale=1.0, bevel=0.0, cat="misc", **meta):
    ob = bpy.data.objects.new(PREFIX + name, me)
    ob.location = loc
    ob.rotation_euler = (0, 0, rot)
    ob.scale = (scale, scale, scale) if not isinstance(scale, tuple) else scale
    COLL.objects.link(ob)
    if bevel:
        add_bevel(ob, bevel)
    tag(ob, cat, **meta)
    return ob


def l2w(cx, cy, rot, lx, ly):
    c, s = math.cos(rot), math.sin(rot)
    return (cx + lx * c - ly * s, cy + lx * s + ly * c)


# --------------------------------------------------------------------------- animation
ANIMS = []


class Anim:
    __slots__ = ("ob", "kind", "t0", "dur", "base_loc", "base_scale", "base_rot", "kw")

    def __init__(self, ob, kind, t0, dur, **kw):
        self.ob, self.kind, self.t0, self.dur, self.kw = ob, kind, float(t0), float(dur), kw
        self.base_loc = ob.location.copy()
        self.base_scale = ob.scale.copy()
        self.base_rot = ob.rotation_euler.copy()


LOOP_KINDS = ("spin", "pulse", "breathe")


def anim(ob, kind, t0, dur=12, **kw):
    if STATIC:
        if kind not in LOOP_KINDS:
            return ob                     # variant tiles stand fully built
        t0, kw = -1e6, dict(kw, after=None)
    a = Anim(ob, kind, t0, dur, **kw)
    ANIMS.append(a)
    if kind != "spin" and not STATIC:
        ob["born"] = min(float(ob.get("born", 1e9)), float(t0))
    return ob


def ease_out_back(t, s=1.0):
    u = t - 1.0
    return 1.0 + (s + 1.0) * u ** 3 + s * u ** 2


def ease_spring(t, k=6.0, w=3.0):
    """Damped spring 0 -> 1: one overshoot (about e^-k/3), a small undershoot, settle; exactly 1
    at t = 1 so level stills are unaffected."""
    s = 1.0 - math.exp(-k * t) * math.cos(w * math.pi * t)
    s1 = 1.0 - math.exp(-k) * math.cos(w * math.pi)
    return s + (1.0 - s1) * t ** 4


def ease_out_cubic(t):
    return 1.0 - (1.0 - t) ** 3


def ease_in_out_cubic(t):
    return 4 * t ** 3 if t < 0.5 else 1 - (-2 * t + 2) ** 3 / 2


LOOP = 15  # micro-motion period: every spin / pulse / beacon state repeats after 15 frames, so
           # the lead's 30-frame level loops (journey LOOP_N) wrap cleanly


def spin_speed(sym, steps):
    """Radians per micro frame so that `steps` symmetry steps (2*pi/sym) take one LOOP."""
    return steps * (2 * math.pi / sym) / LOOP


def apply_frame(f, m=None):
    """f = growth time (old 136-frame timeline), m = micro-motion clock (spins, pulses)."""
    if m is None:
        m = f
    assign_tiles()
    for c in WAB["clock"]:
        c.outputs[0].default_value = m
    for a in ANIMS:
        ob, k = a.ob, a.kind
        p = (f - a.t0) / a.dur
        q = min(max(p, 0.0), 1.0)
        if k == "spin":
            if a.kw.get("axis", "Z") == "Z":
                ob.rotation_euler.z = a.base_rot.z + a.kw["speed"] * m
            else:
                ob.rotation_euler.x = a.base_rot.x + a.kw["speed"] * m
            continue
        if a.t0 > -1e5:
            ob.hide_render = p <= 0.0
        bs = a.base_scale
        if k == "rise":  # grows out of the ground on a damped spring; thins while it overshoots
            e = ease_spring(q, 8.0 if a.kw.get("back", 1.0) < 0.75 else 6.0)
            sq = 1.0 - max(e - 1.0, 0.0) * 0.35
            ob.scale = (bs.x * sq, bs.y * sq, bs.z * max(e, 1e-4))
        elif k == "breathe":  # pops in, then breathes on the 16-frame loop (seamless)
            e = max(ease_out_back(q, 1.6), 1e-4)
            s = e * (1.0 + a.kw.get("amp", 0.3) *
                     math.sin(2 * math.pi * (m / LOOP + a.kw.get("phase", 0.0))))
            ob.scale = (bs.x * s, bs.y * s, bs.z * s)
        elif k == "pop":
            e = max(ease_out_back(q, a.kw.get("back", 1.6)), 1e-4)
            ob.scale = (bs.x * e, bs.y * e, bs.z * e)
        elif k == "grow_xy":
            e = max(ease_out_cubic(q), 1e-4)
            ob.scale = (bs.x * e, bs.y * e, bs.z)
        elif k == "extrude":  # along local x from a face pivot
            e = max(ease_out_back(q, a.kw.get("back", 0.8)), 1e-4)
            ob.scale = (bs.x * e, bs.y, bs.z)
        elif k == "draw":  # mesh drawn along local x
            e = max(ease_in_out_cubic(q), 1e-4)
            ob.scale = (bs.x * e, bs.y, bs.z)
        elif k == "head":  # bright head riding the front of a fibre while it is drawn
            s = a.kw["src"]
            qs = min(max((f - s.t0) / s.dur, 0.0), 1.0)
            e = ease_in_out_cubic(qs)
            ob.data.bevel_factor_start = min(max(e - a.kw["length"], 0.0), 0.999)
            ob.data.bevel_factor_end = min(max(e, 0.001), 1.0)
            ob.hide_render = not (0.0 < qs < 1.0)
        elif k == "draw_curve":
            ob.data.bevel_factor_end = max(ease_in_out_cubic(q), 1e-3)
        elif k == "slide":  # sprouts out of a parent volume
            e = ease_out_back(q, a.kw.get("back", 0.8))
            src = Vector(a.kw["src"])
            ob.location = src.lerp(a.base_loc, e)
            s0 = a.kw.get("s0", 0.97)
            sc = s0 + (1 - s0) * min(q * 1.4, 1.0)
            ob.scale = (bs.x * sc, bs.y * sc, bs.z * sc)
        elif k == "pulse":
            per, L, ph = a.kw["period"], a.kw.get("length", 0.08), a.kw.get("phase", 0.0)
            ph_now = (m / per + ph) % 1.0
            head = ph_now * (1.0 + L)
            tail = head - L
            ob.data.bevel_factor_start = min(max(tail, 0.0), 0.999)
            ob.data.bevel_factor_end = min(max(head, 0.001), 1.0)
        elif k == "drive":
            d = a.kw["speed"] * max(f - a.t0, 0.0)
            ob.location = a.base_loc + Vector(a.kw["dir"]) * d
            e = max(ease_out_back(q, 1.4), 1e-4)
            ob.scale = (bs.x * e, bs.y * e, bs.z * e)


# --------------------------------------------------------------------------- occupancy
OCC = []  # rects (x0, y0, x1, y1) used to keep trees off things


def occupy(x0, y0, x1, y1, m=0.0):
    OCC.append((min(x0, x1) - m, min(y0, y1) - m, max(x0, x1) + m, max(y0, y1) + m))


def is_free(x, y, m=1.5):
    for (a, b, c, d) in OCC:
        if a - m <= x <= c + m and b - m <= y <= d + m:
            return False
    return True


PAD_Z = 0.15

# --------------------------------------------------------------------------- prototypes
PROTO = {}


def proto(name, builder):
    if name not in PROTO:
        PROTO[name] = builder()
    return PROTO[name]


def p_chiller():
    """Air-cooled chiller, 2.5 x 5.4 footprint, two fans on top (seam 3: the server fan modules
    are this mesh at 1/30). Coil faces with fin slats, corner posts, control panel, fan guards."""
    mb = MB()
    mb.boxc(0, 0, 0, 2.5, 5.4, 0.25, "clay2")
    mb.boxc(0, 0, 0.25, 2.3, 5.2, 1.45, "clay")
    for sx in (-1, 1):
        mb.boxc(sx * 1.16, 0, 0.45, 0.04, 4.6, 0.9, "trim")
        for i in range(19):                                       # coil fin slats
            mb.boxc(sx * 1.19, -2.16 + i * 0.24, 0.47, 0.03, 0.05, 0.86, "clay2")
        for sy in (-1, 1):                                        # corner posts
            mb.boxc(sx * 1.12, sy * 2.56, 0.25, 0.1, 0.1, 1.45, "clay2")
    mb.boxc(0, 2.6, 0.4, 1.5, 0.08, 1.0, "clay2")                # control panel (+y end)
    mb.boxc(0, -2.6, 0.5, 0.9, 0.06, 0.5, "trim")                # pipe connection box
    mb.boxc(0, 0, 1.7, 2.3, 0.07, 0.03, "clay2")                 # deck seam between the fans
    for y in (-1.3, 1.3):
        mb.cyl(0, y, 1.7, 0.92, 0.32, "clay", seg=24)            # fan shroud
        mb.cyl(0, y, 2.02, 0.80, 0.02, "trim", seg=24, smooth=False)
        for b in range(5):                                        # blades under the guard
            a = b * 2 * math.pi / 5
            mb.slab((math.cos(a) * 0.15, y + math.sin(a) * 0.15, 2.065),
                    (math.cos(a) * 0.74, y + math.sin(a) * 0.74, 2.065), 0.22, 0.02, "clay2",
                    roll=0.3)
        for r in (0.34, 0.56, 0.78):                              # guard rings
            mb.ring(0, y, 2.12, r, 0.024, "clay2", n=24)
        for b in range(4):                                        # guard spokes
            a = b * math.pi / 4 + math.pi / 8
            mb.beam((-math.cos(a) * 0.8, y - math.sin(a) * 0.8, 2.12),
                    (math.cos(a) * 0.8, y + math.sin(a) * 0.8, 2.12), 0.03, "clay2")
        mb.cyl(0, y, 2.04, 0.16, 0.08, "clay2", seg=12, smooth=False)
    return mb.mesh("chiller")


def chiller_lo(mb, x, y):
    """Low-poly chiller (same 2.5 x 5.4 footprint, two fans) for the merged hyperscale rows."""
    mb.boxc(x, y, 0, 2.5, 5.4, 0.25, "clay2")
    mb.boxc(x, y, 0.25, 2.3, 5.2, 1.45, "clay")
    for dy in (-1.3, 1.3):
        mb.cyl(x, y + dy, 1.7, 0.92, 0.32, "clay", seg=12)
        mb.cyl(x, y + dy, 2.02, 0.8, 0.03, "trim", seg=12, smooth=False)


def p_condenser():
    """Roof condenser, 2.2 x 3.6, four small fans with guards."""
    mb = MB()
    mb.boxc(0, 0, 0, 2.2, 3.6, 0.2, "clay2")
    mb.boxc(0, 0, 0.2, 2.0, 3.4, 1.15, "clay")
    for sx in (-1, 1):
        mb.boxc(sx * 1.01, 0, 0.35, 0.03, 3.0, 0.8, "trim")
        for i in range(12):
            mb.boxc(sx * 1.035, -1.38 + i * 0.25, 0.37, 0.025, 0.05, 0.76, "clay2")
    for (x, y) in ((-0.5, -0.85), (0.5, -0.85), (-0.5, 0.85), (0.5, 0.85)):
        mb.cyl(x, y, 1.35, 0.44, 0.12, "clay", seg=16)
        mb.cyl(x, y, 1.47, 0.37, 0.015, "trim", seg=16, smooth=False)
        mb.ring(x, y, 1.5, 0.2, 0.02, "clay2", n=12)
        mb.ring(x, y, 1.5, 0.35, 0.02, "clay2", n=16)
        mb.beam((x - 0.38, y, 1.5), (x + 0.38, y, 1.5), 0.025, "clay2")
        mb.cyl(x, y, 1.47, 0.07, 0.05, "clay2", seg=8, smooth=False)
    return mb.mesh("condenser")


def p_exhaust():
    """Generator / kitchen exhaust stack on a plinth with a rain cap ring."""
    mb = MB()
    mb.boxc(0, 0, 0, 1.4, 1.4, 0.5, "clay2")
    mb.cyl(0, 0, 0.5, 0.36, 3.7, "clay", seg=16)
    for z in (1.5, 2.9):
        mb.cyl(0, 0, z, 0.42, 0.12, "clay2", seg=16)
    mb.cyl(0, 0, 4.2, 0.46, 0.1, "clay2", seg=16)
    mb.cyl(0, 0, 0.5, 0.5, 0.18, "clay2", seg=16)                  # base flange
    return mb.mesh("exhaust")


def p_louvre():
    """Louvred plant box / air intake, 4.2 x 2.6."""
    mb = MB()
    mb.boxc(0, 0, 0, 4.2, 2.6, 0.2, "clay2")
    mb.boxc(0, 0, 0.2, 4.0, 2.4, 2.2, "clay")
    for i in range(7):
        z = 0.55 + i * 0.24
        for sy in (-1, 1):
            mb.boxc(0, sy * 1.21, z, 3.5, 0.05, 0.08, "clay2")
        for sx in (-1, 1):
            mb.boxc(sx * 2.01, 0, z, 0.05, 1.9, 0.08, "clay2")
    mb.boxc(0, 0, 2.4, 4.2, 2.6, 0.12, "clay2")
    mb.cyl(1.0, 0, 2.52, 0.45, 0.4, "clay", seg=14)
    return mb.mesh("louvre")


def p_mast():
    """Lightning mast of a substation (tapered steel pole with rings)."""
    mb = MB()
    mb.boxc(0, 0, 0, 0.8, 0.8, 0.3, "clay2")
    mb.cyl(0, 0, 0.3, 0.17, 15.0, "metal", seg=10, r2=0.06)
    for z in (5.0, 10.0):
        mb.cyl(0, 0, z, 0.2 - z * 0.008, 0.15, "metal", seg=10)
    return mb.mesh("mast")


def p_beacon():
    """White obstruction light (stacks, nacelles); it breathes on the loop."""
    mb = MB()
    mb.sphere((0, 0, 0.25), 0.25, "lamp" if "lamp" in M else "glass", sub=2)
    return mb.mesh("beacon")


def p_ahu():
    mb = MB()
    mb.boxc(0, 0, 0, 3.4, 2.2, 1.7, "clay")
    mb.boxc(1.0, 0, 1.7, 1.2, 1.2, 0.9, "clay")
    mb.boxc(-1.72, 0, 0.3, 0.04, 1.6, 1.0, "trim")
    mb.boxc(-0.5, 0, 1.7, 1.6, 1.8, 0.12, "clay2")
    return mb.mesh("ahu")


def p_vent():
    mb = MB()
    mb.cyl(0, 0, 0, 0.32, 0.9, "clay", seg=14)
    mb.cyl(0, 0, 0.9, 0.55, 0.16, "clay", seg=14, r2=0.3)
    return mb.mesh("vent")


def p_genset():
    mb = MB()
    mb.boxc(0, 0, 0, 10.0, 3.0, 0.35, "clay2")
    mb.boxc(0, 0, 0.35, 9.6, 2.7, 2.7, "clay")
    for x in (-4.82, 4.82):
        mb.boxc(x, 0, 0.7, 0.04, 2.1, 1.9, "trim")
    for x in (-2.5, 0.0, 2.5):
        mb.boxc(x, -1.37, 0.5, 1.0, 0.04, 2.1, "trim")
    mb.boxc(-3.2, 0, 3.05, 2.6, 2.4, 0.6, "clay2")
    mb.cyl(-3.8, 0, 3.65, 0.5, 0.04, "trim", seg=14, smooth=False)
    mb.cyl(-2.6, 0, 3.65, 0.5, 0.04, "trim", seg=14, smooth=False)
    mb.tube((1.0, 0.3, 3.4), (3.6, 0.3, 3.4), 0.42, "clay", seg=14)
    mb.cyl(3.6, 0.3, 3.0, 0.2, 2.3, "clay", seg=10)
    return mb.mesh("genset")


def p_transformer():
    mb = MB()
    mb.boxc(0, 0, 0, 5.0, 4.4, 0.3, "clay2")
    mb.boxc(0, 0, 0.3, 3.6, 2.4, 2.6, "clay")
    for i in range(9):
        x = -1.6 + i * 0.4
        for sy in (-1, 1):
            mb.boxc(x, sy * 1.55, 0.5, 0.1, 0.7, 2.1, "clay2")
    for x in (-0.9, 0.0, 0.9):
        mb.cyl(x, -0.5, 2.9, 0.13, 1.5, "metal", seg=8)
        for z in (3.2, 3.6, 4.0):
            mb.cyl(x, -0.5, z, 0.22, 0.08, "metal", seg=10, smooth=False)
    mb.tube((-1.3, 0.8, 3.75), (1.3, 0.8, 3.75), 0.42, "clay")
    mb.box(-1.0, 0.7, 2.9, -0.85, 0.85, 3.4, "metal")
    mb.box(0.85, 0.7, 2.9, 1.0, 0.85, 3.4, "metal")
    for x in (-1.45, 1.45):                          # surge arresters on the HV side
        mb.cyl(x, -0.95, 2.9, 0.07, 1.1, "metal", seg=8)
        for z in (3.15, 3.4, 3.65, 3.9):
            mb.cyl(x, -0.95, z, 0.14, 0.05, "clay", seg=10, smooth=False)
    mb.boxc(1.95, 0.0, 0.3, 0.6, 1.4, 1.8, "clay")   # LV cable box
    mb.boxc(-1.95, 0.6, 0.3, 0.4, 0.7, 1.3, "trim")  # control cabinet
    return mb.mesh("transformer")


def p_gantry():
    """Substation gantry, line along local x, spans along local y."""
    mb = MB()
    h, half = 9.0, 5.0
    for sy in (-1, 1):
        y = sy * half
        for dx in (-0.35, 0.35):
            for dy in (-0.35, 0.35):
                mb.beam((dx, y + dy, 0), (dx * 0.6, y + dy * 0.6, h), 0.1)
        for z0 in range(0, 9, 2):
            mb.beam((-0.35, y - 0.35, z0), (0.3, y + 0.3, z0 + 2), 0.06)
            mb.beam((0.35, y - 0.35, z0), (-0.3, y + 0.3, z0 + 2), 0.06)
    for z in (h - 0.6, h):
        for dx in (-0.3, 0.3):
            mb.beam((dx, -half, z), (dx, half, z), 0.1)
    for i in range(10):
        y = -half + i * (2 * half / 10)
        mb.beam((-0.3, y, h - 0.6), (0.3, y + 1.0, h), 0.05)
    for y in (-2.8, 0.0, 2.8):                       # suspension insulator strings (disc stacks)
        mb.beam((0, y, h - 0.6), (0, y, h - 2.4), 0.05, "metal")
        for i in range(10):
            mb.cyl(0, y, h - 2.15 + i * 0.15, 0.17, 0.05, "clay", seg=12)
        mb.beam((-0.25, y, h - 2.4), (0.25, y, h - 2.4), 0.08, "metal")   # clamp yoke
    return mb.mesh("gantry")


GANTRY_ATTACH = [(0, -2.8, 6.6), (0, 0.0, 6.6), (0, 2.8, 6.6)]


def p_pylon():
    """Lattice transmission tower. Line runs along local x, arms along +-y."""
    mb = MB()
    h, zw = 30.0, 19.5
    t = 0.2

    def hw(z):
        if z <= zw:
            return 3.0 + (0.85 - 3.0) * (z / zw)
        return 0.85 + (0.45 - 0.85) * ((z - zw) / (h - zw))

    levels = [0, 3.0, 6.3, 9.4, 12.3, 15.0, 17.4, zw, 22.5, 25.5, 28.0, h]
    corners = [(1, 1), (1, -1), (-1, -1), (-1, 1)]
    for i in range(len(levels) - 1):
        z0, z1 = levels[i], levels[i + 1]
        w0, w1 = hw(z0), hw(z1)
        for (sx, sy) in corners:
            mb.beam((sx * w0, sy * w0, z0), (sx * w1, sy * w1, z1), t)
        for k in range(4):
            a, b = corners[k], corners[(k + 1) % 4]
            mb.beam((a[0] * w1, a[1] * w1, z1), (b[0] * w1, b[1] * w1, z1), t * 0.6)
            mb.beam((a[0] * w0, a[1] * w0, z0), (b[0] * w1, b[1] * w1, z1), t * 0.45)
            mb.beam((b[0] * w0, b[1] * w0, z0), (a[0] * w1, a[1] * w1, z1), t * 0.45)
    attach = []
    for za, span in ((zw, 7.0), (zw + 4.6, 5.5)):
        w = hw(za)
        for sy in (-1, 1):
            tip = (0, sy * span, za)
            for dx in (-0.6, 0.6):
                mb.beam((dx, sy * w, za), (0, sy * span, za), t * 0.7)
                mb.beam((dx, sy * w, za + 1.8), (0, sy * span, za), t * 0.6)
            mb.beam((0, sy * span, za), (0, sy * span, za - 2.0), 0.2, "trim")
            attach.append((0, sy * span, za - 2.0))
    mb.beam((0.45, 0.45, h), (0, 0, h + 2.2), t * 0.6)
    mb.beam((-0.45, -0.45, h), (0, 0, h + 2.2), t * 0.6)
    mb.beam((0.45, -0.45, h), (0, 0, h + 2.2), t * 0.6)
    mb.beam((-0.45, 0.45, h), (0, 0, h + 2.2), t * 0.6)
    return mb.mesh("pylon"), attach


def ground_shader(m):
    """Procedural ground (world space, not periodic, so every tile of the region differs):
    field parcels with crop rows and hedgerow / track edges outside each campus core, a calm
    lawn inside it, and large-scale undulation (value + bump) for gentle terrain."""
    nt = m.node_tree
    n, ln = nt.nodes, nt.links
    n.clear()
    out = n.new("ShaderNodeOutputMaterial")
    bsdf = n.new("ShaderNodeBsdfPrincipled")
    ln.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    base, rough = TH["ground"]
    dark = ARGS.theme == "dark"
    tc = n.new("ShaderNodeTexCoord")

    def math_(op, a, b=None, clamp=False):
        nd = n.new("ShaderNodeMath")
        nd.operation = op
        nd.use_clamp = clamp
        for i, v in enumerate((a, b)):
            if v is None:
                continue
            if isinstance(v, (int, float)):
                nd.inputs[i].default_value = v
            else:
                ln.new(v, nd.inputs[i])
        return nd.outputs[0]

    def maprange(v, a, b, c, d, interp="LINEAR"):
        nd = n.new("ShaderNodeMapRange")
        nd.interpolation_type = interp
        ln.new(v, nd.inputs["Value"])
        for k, val in (("From Min", a), ("From Max", b), ("To Min", c), ("To Max", d)):
            nd.inputs[k].default_value = val
        return nd.outputs["Result"]

    sep = n.new("ShaderNodeSeparateXYZ")
    ln.new(tc.outputs["Object"], sep.inputs[0])
    X, Y = sep.outputs["X"], sep.outputs["Y"]
    # parcels: two offset brick patchworks (100 x 58 m and 64 x 140 m) on domain-warped
    # coordinates, one or the other per ~400 m block -> rectangular fields with farm tracks
    warp = n.new("ShaderNodeTexNoise")
    warp.inputs["Scale"].default_value = 1.0 / 170.0
    warp.inputs["Detail"].default_value = 2.0
    ln.new(tc.outputs["Object"], warp.inputs["Vector"])
    vs = n.new("ShaderNodeVectorMath")
    vs.operation = "SUBTRACT"
    ln.new(warp.outputs["Color"], vs.inputs[0])
    vs.inputs[1].default_value = (0.5, 0.5, 0.5)
    vk = n.new("ShaderNodeVectorMath")
    vk.operation = "SCALE"
    ln.new(vs.outputs[0], vk.inputs[0])
    vk.inputs["Scale"].default_value = 18.0
    va = n.new("ShaderNodeVectorMath")
    va.operation = "ADD"
    ln.new(tc.outputs["Object"], va.inputs[0])
    ln.new(vk.outputs[0], va.inputs[1])
    bricks = []
    for (bw, rh, off, fq) in ((100.0, 58.0, 0.37, 2), (64.0, 140.0, 0.61, 3)):
        b = n.new("ShaderNodeTexBrick")
        b.offset, b.offset_frequency = off, fq
        b.inputs["Color1"].default_value = (0, 0, 0, 1)
        b.inputs["Color2"].default_value = (1, 1, 1, 1)
        b.inputs["Mortar"].default_value = (0.5, 0.5, 0.5, 1)
        b.inputs["Scale"].default_value = 1.0
        b.inputs["Mortar Size"].default_value = 1.7
        b.inputs["Mortar Smooth"].default_value = 0.4
        b.inputs["Bias"].default_value = 0.0
        b.inputs["Brick Width"].default_value = bw
        b.inputs["Row Height"].default_value = rh
        ln.new(va.outputs[0], b.inputs["Vector"])
        bricks.append(b)
    blk = n.new("ShaderNodeTexNoise")
    blk.inputs["Scale"].default_value = 1.0 / 420.0
    blk.inputs["Detail"].default_value = 0.0
    ln.new(tc.outputs["Object"], blk.inputs["Vector"])
    bsel = math_("GREATER_THAN", blk.outputs["Fac"], 0.5)

    def mixf(fac, a, b):
        nd = n.new("ShaderNodeMix")
        nd.data_type = "FLOAT"
        ln.new(fac, nd.inputs[0])
        ln.new(a, nd.inputs[2])
        ln.new(b, nd.inputs[3])
        return nd.outputs[0]
    sc1, sc2 = n.new("ShaderNodeSeparateColor"), n.new("ShaderNodeSeparateColor")
    ln.new(bricks[0].outputs["Color"], sc1.inputs[0])
    ln.new(bricks[1].outputs["Color"], sc2.inputs[0])
    r1 = mixf(bsel, sc1.outputs[0], sc2.outputs[0])
    r2 = math_("FRACT", math_("MULTIPLY", r1, 7.31))
    field_v = maprange(r1, 0.0, 1.0, 0.55 if dark else 0.86, 3.0 if dark else 1.14)
    # crop rows, direction per parcel
    wx, wy = n.new("ShaderNodeTexWave"), n.new("ShaderNodeTexWave")
    for w, d in ((wx, "X"), (wy, "Y")):
        w.wave_type = "BANDS"
        w.bands_direction = d
        w.inputs["Scale"].default_value = 0.055
        w.inputs["Distortion"].default_value = 0.0
        ln.new(tc.outputs["Object"], w.inputs["Vector"])
    sel = math_("GREATER_THAN", r2, 0.5)
    rows = mixf(sel, wx.outputs["Fac"], wy.outputs["Fac"])
    crop = maprange(rows, 0.0, 1.0, 0.78, 1.15)
    # farm tracks on the parcel edges (subtle, slightly lighter gravel)
    edge = mixf(bsel, bricks[0].outputs["Fac"], bricks[1].outputs["Fac"])
    edge_v = maprange(edge, 0.0, 1.0, 1.0, 1.45 if dark else 1.04)
    # campus core mask (periodic per 600 x 460 tile): lawn inside, fields outside
    def tile_local(c, o, per):
        u = math_("SUBTRACT", c, o)
        q = math_("FLOOR", math_("DIVIDE", u, per))
        return math_("SUBTRACT", u, math_("MULTIPLY", q, per))
    lx = tile_local(X, NODE_X0, NODE_X1 - NODE_X0)
    ly = tile_local(Y, NODE_Y0, NODE_Y1 - NODE_Y0)
    # lawn = the plots built up to Gross (x -56..60, y -40..125); the L5 land is still fields
    dx = math_("MAXIMUM", math_("SUBTRACT", 268.0, lx), math_("SUBTRACT", lx, 384.0))
    dy = math_("MAXIMUM", math_("SUBTRACT", 184.0, ly), math_("SUBTRACT", ly, 349.0))
    fieldmask = maprange(math_("MAXIMUM", dx, dy), 0.0, 12.0, 0.0, 1.0, "SMOOTHSTEP")
    # large-scale undulation
    nz = n.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = 1.0 / 240.0
    nz.inputs["Detail"].default_value = 3.0
    ln.new(tc.outputs["Object"], nz.inputs["Vector"])
    terr_v = maprange(nz.outputs["Fac"], 0.3, 0.7, 0.7, 1.3)
    fine = n.new("ShaderNodeTexNoise")
    fine.inputs["Scale"].default_value = 0.35
    fine.inputs["Detail"].default_value = 4.0
    ln.new(tc.outputs["Object"], fine.inputs["Vector"])
    fine_v = maprange(fine.outputs["Fac"], 0.3, 0.7, 0.9, 1.1)
    fields = math_("MULTIPLY", math_("MULTIPLY", field_v, crop), edge_v)
    k = n.new("ShaderNodeMix")
    k.data_type = "FLOAT"
    ln.new(fieldmask, k.inputs[0])
    k.inputs[2].default_value = 1.0
    ln.new(fields, k.inputs[3])
    val = math_("MULTIPLY", math_("MULTIPLY", k.outputs[0], terr_v), fine_v)
    col = n.new("ShaderNodeCombineColor")
    for i in range(3):
        ln.new(math_("MULTIPLY", val, base[i]), col.inputs[i])
    ln.new(col.outputs[0], bsdf.inputs["Base Color"])
    bsdf.inputs["Roughness"].default_value = rough
    # bump: crop rows + hedges (fields only), terrain undulation everywhere
    h_rows = math_("MULTIPLY", math_("ADD", math_("MULTIPLY", rows, 0.5), edge), fieldmask)
    b1 = n.new("ShaderNodeBump")
    b1.inputs["Strength"].default_value = 0.35
    b1.inputs["Distance"].default_value = 0.08
    ln.new(h_rows, b1.inputs["Height"])
    b2 = n.new("ShaderNodeBump")
    b2.inputs["Strength"].default_value = 1.0
    b2.inputs["Distance"].default_value = 8.0
    ln.new(nz.outputs["Fac"], b2.inputs["Height"])
    ln.new(b1.outputs["Normal"], b2.inputs["Normal"])
    ln.new(b2.outputs["Normal"], bsdf.inputs["Normal"])
    return m


def road_shader(m):
    """Asphalt: blotchy macro value variation, aggregate grain, a few darker repair patches
    (object space: on road meshes x runs along the road)."""
    nt = m.node_tree
    n, ln = nt.nodes, nt.links
    n.clear()
    out = n.new("ShaderNodeOutputMaterial")
    bsdf = n.new("ShaderNodeBsdfPrincipled")
    ln.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    base, rough = TH["road"]
    tc = n.new("ShaderNodeTexCoord")
    nodes = []
    for sc, det in ((0.06, 3.0), (2.5, 6.0)):
        nz = n.new("ShaderNodeTexNoise")
        nz.inputs["Scale"].default_value = sc
        nz.inputs["Detail"].default_value = det
        ln.new(tc.outputs["Object"], nz.inputs["Vector"])
        nodes.append(nz)
    vo = n.new("ShaderNodeTexVoronoi")
    vo.inputs["Scale"].default_value = 0.09
    ln.new(tc.outputs["Object"], vo.inputs["Vector"])
    sc_ = n.new("ShaderNodeSeparateColor")
    ln.new(vo.outputs["Color"], sc_.inputs[0])

    def mr(sock, a, b, c, d):
        nd = n.new("ShaderNodeMapRange")
        ln.new(sock, nd.inputs["Value"])
        for k, v in (("From Min", a), ("From Max", b), ("To Min", c), ("To Max", d)):
            nd.inputs[k].default_value = v
        return nd.outputs["Result"]

    def mul(a, b):
        nd = n.new("ShaderNodeMath")
        nd.operation = "MULTIPLY"
        ln.new(a, nd.inputs[0])
        ln.new(b, nd.inputs[1])
        return nd.outputs[0]
    macro = mr(nodes[0].outputs["Fac"], 0.3, 0.7, 0.86, 1.16)
    grain = mr(nodes[1].outputs["Fac"], 0.3, 0.7, 0.93, 1.07)
    patch = mr(sc_.outputs[0], 0.86, 0.9, 1.0, 0.82)            # darker repair patches
    val = mul(mul(macro, grain), patch)
    col = n.new("ShaderNodeCombineColor")
    for i in range(3):
        nd = n.new("ShaderNodeMath")
        nd.operation = "MULTIPLY"
        ln.new(val, nd.inputs[0])
        nd.inputs[1].default_value = base[i]
        ln.new(nd.outputs[0], col.inputs[i])
    ln.new(col.outputs[0], bsdf.inputs["Base Color"])
    rmr = mr(nodes[1].outputs["Fac"], 0.3, 0.7, rough - 0.06, rough + 0.06)
    ln.new(rmr, bsdf.inputs["Roughness"])
    bp = n.new("ShaderNodeBump")
    bp.inputs["Strength"].default_value = 0.12
    bp.inputs["Distance"].default_value = 0.02
    ln.new(nodes[1].outputs["Fac"], bp.inputs["Height"])
    ln.new(bp.outputs["Normal"], bsdf.inputs["Normal"])
    return m


WAB = {"clock": []}
WAB_PERIOD = 30.0          # breathing period: divides the lead's 30-frame level loops
# a backbone pulse passes the campus every LOOP (15) frames: F0 has 10 pulses on 460 m, period
# 150; its head reaches the hero campus core (y = 30) at micro frame 78.4 + 15 k -> phase 3.4
WAB_ARRIVE = 3.4
WAB_DELAY = 4.0            # frames of flash delay per tile of distance from the hero campus
WAB_RISE, WAB_PEAK = 3.5, 0.3   # flash envelope: 3.5-frame rise, fade over the rest of LOOP


def wab_shaders():
    """'Wabern': the data campuses breathe. wab = roof-edge strips of the data halls, halo = soft
    ground glow under each data campus (transparent + emission, radial falloff), band = the soft
    glow corridor along the trunk backbones (falloff across the band).
    - breathing: period 30 frames, phase hashed from the tile index of the (instanced) object;
    - flash: when the backbone pulse reaches the hero campus, then travelling outward tile by tile
      (delay WAB_DELAY frames per tile of distance), 3.5-frame rise, ~11.5-frame fade, peak
      1.3 x the breathing level, blue only (no white).
    Everything repeats after 30 frames (2 x LOOP), so the level loops wrap cleanly."""
    DXs, DYs = NODE_X1 - NODE_X0, NODE_Y1 - NODE_Y0
    for name, S in (("wab", 4.5), ("halo", 0.29), ("band", 0.55)):
        m = MATS[M[name]]
        nt = m.node_tree
        n, ln = nt.nodes, nt.links
        n.clear()
        out = n.new("ShaderNodeOutputMaterial")

        def mth(op, a, b=None):
            nd = n.new("ShaderNodeMath")
            nd.operation = op
            for i, v in enumerate((a, b)):
                if v is None:
                    continue
                if isinstance(v, (int, float)):
                    nd.inputs[i].default_value = v
                else:
                    ln.new(v, nd.inputs[i])
            return nd.outputs[0]

        def smooth(v, a, b, lo, hi):
            nd = n.new("ShaderNodeMapRange")
            nd.interpolation_type = "SMOOTHSTEP"
            ln.new(v, nd.inputs["Value"])
            for k, val in (("From Min", a), ("From Max", b), ("To Min", lo), ("To Max", hi)):
                nd.inputs[k].default_value = val
            return nd.outputs["Result"]
        clock = n.new("ShaderNodeValue")
        clock.outputs[0].default_value = 0.0
        WAB["clock"].append(clock)
        oi = n.new("ShaderNodeObjectInfo")
        sp = n.new("ShaderNodeSeparateXYZ")
        ln.new(oi.outputs["Location"], sp.inputs[0])
        cx = mth("FLOOR", mth("DIVIDE", mth("SUBTRACT", sp.outputs["X"], NODE_X0), DXs))
        cy = mth("FLOOR", mth("DIVIDE", mth("SUBTRACT", sp.outputs["Y"], NODE_Y0), DYs))
        hsh = mth("FRACT", mth("MULTIPLY", mth("SINE", mth("ADD", mth("MULTIPLY", cx, 12.9898),
                                                           mth("MULTIPLY", cy, 78.233))), 43758.55))
        ph = mth("ADD", mth("DIVIDE", clock.outputs[0], WAB_PERIOD), hsh)
        breath = mth("ADD", mth("MULTIPLY", mth("SINE", mth("MULTIPLY", ph, 2 * math.pi)), 0.5), 0.5)
        # flash wave: delay grows with the tile distance from the hero campus
        dist = mth("SQRT", mth("ADD", mth("MULTIPLY", cx, cx), mth("MULTIPLY", cy, cy)))
        t_rel = mth("SUBTRACT", mth("SUBTRACT", clock.outputs[0], WAB_ARRIVE),
                    mth("MULTIPLY", dist, WAB_DELAY))
        s = mth("MULTIPLY", mth("FRACT", mth("DIVIDE", t_rel, float(LOOP))), float(LOOP))
        env = mth("MULTIPLY", smooth(s, 0.0, WAB_RISE, 0.0, 1.0),
                  smooth(s, WAB_RISE, float(LOOP), 1.0, 0.0))
        base = mth("ADD", mth("MULTIPLY", breath, 0.45), 0.55)
        lvl = mth("MULTIPLY", base, mth("ADD", mth("MULTIPLY", env, WAB_PEAK), 1.0))
        if name == "band":
            lvl = mth("ADD", mth("MULTIPLY", env, 0.15), 0.85)
        em = n.new("ShaderNodeEmission")
        em.inputs["Color"].default_value = (*BLUE, 1)
        strength = mth("MULTIPLY", lvl, S)
        if name == "wab":
            ln.new(strength, em.inputs["Strength"])
            ln.new(em.outputs[0], out.inputs["Surface"])
            continue
        # soft falloff from the generated (bounding-box) coordinates of the flat mesh
        tc = n.new("ShaderNodeTexCoord")
        sg = n.new("ShaderNodeSeparateXYZ")
        ln.new(tc.outputs["Generated"], sg.inputs[0])

        def edge(c, p):        # 1 in the middle -> 0 at the border, exponent p shapes it
            d = mth("ABSOLUTE", mth("SUBTRACT", mth("MULTIPLY", c, 2.0), 1.0))
            return mth("POWER", mth("SUBTRACT", 1.0, mth("POWER", d, p)), 2.0)
        fall = mth("MULTIPLY", edge(sg.outputs["X"], 2.0 if name == "halo" else 12.0),
                   edge(sg.outputs["Y"], 2.0 if name == "halo" else 1.0))
        ln.new(mth("MULTIPLY", strength, fall), em.inputs["Strength"])
        tr = n.new("ShaderNodeBsdfTransparent")
        add = n.new("ShaderNodeAddShader")
        ln.new(tr.outputs[0], add.inputs[0])
        ln.new(em.outputs[0], add.inputs[1])
        ln.new(add.outputs[0], out.inputs["Surface"])


def glow_plane(name, x0, y0, x1, y1, mat, t0=None, z=0.26, rot=0.0):
    """Flat glow mesh (no validator category, casts no shadow). For rot = pi/2 pass the rect in
    the plane's own frame (long side along local x)."""
    mb = MB()
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    mb.poly([(x0 - cx, y0 - cy, 0), (x1 - cx, y0 - cy, 0), (x1 - cx, y1 - cy, 0),
             (x0 - cx, y1 - cy, 0)], [(0, 1, 2, 3)], mat)
    me = mb.mesh(name)
    ob = bpy.data.objects.new(PREFIX + name, me)
    ob.location = (cx, cy, z) if rot == 0.0 else (cx, cy, z)
    ob.rotation_euler = (0, 0, rot)
    ob.visible_shadow = False
    COLL.objects.link(ob)
    if t0 is not None:
        anim(ob, "grow_xy", t0, 12)
    return ob


def p_tank(r=3.2, h=11.0, glow=True):
    mb = MB()
    mb.cyl(0, 0, 0, r + 0.5, 0.45, "clay2", seg=40)
    mb.cyl(0, 0, 0.45, r, h - 0.45, "clay", seg=40)
    b0, b1 = 0.45 + 0.30 * h, 0.45 + 0.72 * h
    mb.cyl(0, 0, b0, r + 0.06, b1 - b0, "glass" if glow else "clay2", seg=40)
    for z in (b0 - 0.15, b1 - 0.1, 0.45 + 0.1 * h, h - 0.35):
        mb.cyl(0, 0, z, r + 0.14, 0.26, "clay2", seg=40)
    mb.sphere((0, 0, h), r, "clay", scale=(1, 1, 0.28), sub=3)
    mb.cyl(0, 0, h + 0.75, 0.45, 0.35, "clay2", seg=12)
    for dy in (-0.28, 0.28):
        mb.beam((r + 0.3, dy, 0.45), (r + 0.3, dy, h + 0.4), 0.07, "metal")
    for z in range(2, int(h), 2):
        mb.beam((r + 0.3, -0.28, z), (r + 0.3, 0.28, z), 0.05, "metal")
    return mb.mesh("tank")


def p_htank():
    mb = MB()
    L, r = 9.0, 1.5
    mb.tube((-L / 2, 0, 2.0), (L / 2, 0, 2.0), r, "clay", seg=24)
    for x in (-L / 2, L / 2):
        mb.sphere((x, 0, 2.0), r, "clay", scale=(0.45, 1, 1), sub=3)
    for x in (-2.6, 2.6):
        mb.boxc(x, 0, 0, 0.6, 2.6, 1.6, "clay2")
    mb.cyl(1.5, 0, 3.3, 0.25, 0.6, "clay2", seg=10)
    return mb.mesh("htank")


def p_ct_cell():
    """Mechanical-draft cooling tower cell, 8x8 m, fan stack on top."""
    mb = MB()
    mb.boxc(0, 0, 0, 8.4, 8.4, 0.5, "clay2")
    mb.boxc(0, 0, 0.5, 7.6, 7.6, 3.8, "trim")
    for z in [0.8 + i * 0.55 for i in range(7)]:
        mb.boxc(0, 0, z, 8.0, 8.0, 0.16, "clay")
    for sx in (-1, 1):
        for sy in (-1, 1):
            mb.boxc(sx * 3.85, sy * 3.85, 0.5, 0.35, 0.35, 3.8, "clay")
    mb.boxc(0, 0, 4.3, 8.0, 8.0, 2.6, "clay")
    mb.boxc(0, 0, 6.9, 8.2, 8.2, 0.25, "clay2")
    mb.cyl(0, 0, 7.15, 3.25, 2.4, "clay", seg=40, r2=3.0)
    mb.cyl(0, 0, 9.0, 2.86, 0.6, "trim", seg=40, smooth=False)
    return mb.mesh("ct_cell")


def p_fan_blades(r=2.75, n=6):
    mb = MB()
    mb.cyl(0, 0, 0.0, 0.4, 0.24, "clay2", seg=12)
    for i in range(n):
        a = i * 2 * math.pi / n
        p1 = (math.cos(a) * r, math.sin(a) * r, 0.1)
        mb.beam((0, 0, 0.1), p1, 0.2, "clay2")
    return mb.mesh("fan_blades")


TREE_SP = ("oak", "lime", "spruce", "poplar", "birch", "pine")
# species: trunk height, trunk radius, crown centre z, crown radii (xy, z), clumps, clump radii,
# foliage / bark material (dark theme values: tree 0.032, pad 0.020 darker, clay2 0.040 lighter)
TREE_P = {
    "oak": (1.9, 0.26, 4.3, 2.5, 1.8, 26, 0.5, 0.92, "tree", "clay2"),
    "lime": (2.3, 0.22, 5.1, 1.9, 2.8, 22, 0.48, 0.85, "tree", "clay2"),
    "birch": (2.4, 0.12, 4.7, 1.45, 2.4, 13, 0.38, 0.62, "clay2", "mark"),
}


def p_tree2(sp, v):
    """Low-poly clay trees of five species with distinct silhouettes (no blob spheres):
    oak broad and clumpy, lime ovate, birch sparse with a light trunk, spruce stacked cones,
    poplar a narrow column."""
    mb = MB()
    rr = random.Random(1000 + 37 * TREE_SP.index(sp) + v)
    sd = 10.0 * TREE_SP.index(sp) + v * 3.7
    if sp == "spruce":           # slim, irregular tiers, a slight lean (no traffic cones)
        h = rr.uniform(9.0, 12.5)
        lean = (rr.uniform(-0.3, 0.3), rr.uniform(-0.3, 0.3))
        mb.cyl(0, 0, 0, 0.16, 2.2, "clay2", seg=7)
        n = rr.randint(6, 9)
        z = 1.3
        for i in range(n):
            u = i / (n - 1)
            r = (1.45 * (1 - u) ** 0.9 + 0.22) * rr.uniform(0.8, 1.15)
            th = (h - 1.3) / n * rr.uniform(1.4, 1.8)
            mb.cyl(lean[0] * u + rr.uniform(-0.12, 0.12), lean[1] * u + rr.uniform(-0.12, 0.12),
                   z, r, th, "pad", seg=rr.choice((6, 7, 8)), r2=0.04, smooth=False)
            z += (h - 1.3) / n * rr.uniform(0.8, 1.15)
        return mb.mesh("tree_%s%d" % (sp, v))
    if sp == "pine":             # Scots pine: long bare trunk, flat irregular crown on top
        h = rr.uniform(10.0, 13.0)
        lx, ly = rr.uniform(-0.6, 0.6), rr.uniform(-0.6, 0.6)
        top = (lx, ly, 0.7 * h)
        mb.cyl(0, 0, 0, 0.26, 0.6, "clay2", seg=8, r2=0.2)
        mb.beam((0, 0, 0.5), top, 0.3, "clay2")
        for b in range(3):
            a = b * 2.1 + rr.uniform(-0.5, 0.5)
            mb.beam(top, (lx + math.cos(a) * 1.6, ly + math.sin(a) * 1.6, 0.78 * h), 0.14, "clay2")
        for i in range(10):
            a, d = rr.uniform(0, 2 * math.pi), rr.uniform(0.3, 2.0)
            r = rr.uniform(0.7, 1.15)
            mb.sphere((lx + math.cos(a) * d, ly + math.sin(a) * d, rr.uniform(0.76, 0.9) * h), r,
                      "tree", scale=(1.0, 1.0, 0.55), sub=1, jitter=0.25 * r, seed=sd + i)
        return mb.mesh("tree_%s%d" % (sp, v))
    if sp == "poplar":
        h = rr.uniform(11.0, 13.0)
        mb.cyl(0, 0, 0, 0.2, 3.2, "trim", seg=8)
        n = 12
        for i in range(n):
            u = i / (n - 1)
            rad = 1.1 * math.sin(math.pi * (0.12 + 0.8 * u)) + 0.3
            a, d = rr.uniform(0, 2 * math.pi), rr.uniform(0.1, 0.45)
            mb.sphere((math.cos(a) * d, math.sin(a) * d, 2.9 + u * (h - 4.2)), rad, "pad",
                      scale=(1, 1, 1.3), sub=1, jitter=0.22 * rad, seed=sd + i)
        return mb.mesh("tree_%s%d" % (sp, v))
    th, tr, cz, rx, rz, n, r0, r1, fm, bm = TREE_P[sp]
    th, cz = th * rr.uniform(0.9, 1.1), cz * rr.uniform(0.92, 1.08)
    mb.cyl(0, 0, 0, tr, th + 0.9, bm, seg=8, r2=tr * 0.75)
    for b in range(3):                                     # limbs into the crown
        a = b * 2.1 + rr.uniform(-0.4, 0.4)
        mb.beam((0, 0, th * 0.8), (math.cos(a) * rx * 0.5, math.sin(a) * rx * 0.5, cz - rz * 0.15),
                tr * 0.8, bm)
    mb.sphere((0, 0, cz), 1.0, fm, scale=(rx * 0.74, rx * 0.74, rz * 0.66), sub=2, jitter=0.12,
              seed=sd)
    for i in range(n):                                     # clumps on a jittered crown shell
        u = rr.uniform(-0.5, 1.0)
        a = rr.uniform(0, 2 * math.pi)
        s = math.sqrt(max(0.0, 1.0 - u * u))
        k = rr.uniform(0.62, 1.0)
        r = rr.uniform(r0, r1) * (1.1 - 0.3 * max(u, 0.0))
        mb.sphere((math.cos(a) * s * rx * k, math.sin(a) * s * rx * k, cz + u * rz * k), r, fm,
                  sub=2 if r > 0.9 else 1, jitter=0.22 * r, seed=sd + i * 1.3)
    return mb.mesh("tree_%s%d" % (sp, v))


def pick_species(x, y):
    """Stands, not salt-and-pepper: a low-frequency noise picks conifer or broadleaf stands."""
    nv = noise.noise(Vector((x * 0.014 + 31.0, y * 0.014, 3.3)))
    r = RNG.random()
    if nv > -0.02:
        return "spruce" if r < 0.5 else ("pine" if r < 0.8 else "birch")
    if nv < -0.3:
        return "oak" if r < 0.7 else "birch"
    return "oak" if r < 0.45 else ("lime" if r < 0.7 else "spruce")


def p_car():
    mb = MB()
    mb.boxc(0, 0, 0.3, 4.3, 1.8, 0.75, "clay")
    mb.boxc(-0.2, 0, 1.05, 2.3, 1.62, 0.6, "clay")
    mb.boxc(-0.2, 0, 1.1, 2.34, 1.5, 0.42, "trim")
    for x in (-1.35, 1.35):
        for y in (-0.82, 0.82):
            mb.tube((x, y - 0.12, 0.33), (x, y + 0.12, 0.33), 0.33, "trim", seg=10)
    return mb.mesh("car")


def p_truck():
    mb = MB()
    mb.boxc(5.6, 0, 0.6, 2.4, 2.5, 2.6, "clay")
    mb.boxc(6.81, 0, 2.0, 0.04, 2.2, 0.9, "trim")
    mb.boxc(5.6, 0, 3.2, 2.0, 2.4, 0.5, "clay2")
    mb.boxc(-1.4, 0, 1.05, 12.6, 2.55, 3.1, "clay")
    mb.boxc(-1.4, 0, 0.75, 12.0, 1.8, 0.3, "trim")
    for x in (6.0, 4.0, -5.0, -6.2, -3.8):
        for y in (-1.0, 1.0):
            mb.tube((x, y - 0.2, 0.5), (x, y + 0.2, 0.5), 0.5, "trim", seg=12)
    return mb.mesh("truck")


def p_streetlight():
    mb = MB()
    mb.cyl(0, 0, 0, 0.12, 8.0, "metal", seg=8)
    mb.beam((0, 0, 7.8), (1.8, 0, 8.0), 0.09)
    mb.boxc(1.9, 0, 7.85, 0.7, 0.32, 0.16, "clay")
    return mb.mesh("streetlight")


def p_solar_row(L=34.0):
    mb = MB()
    tilt = math.radians(24)
    depth = 3.4
    n = int(L / 2.1)
    for i in range(n):
        x = -L / 2 + i * 2.1 + 1.05
        for row in range(2):
            d0 = row * (depth / 2 + 0.03)
            d1 = d0 + depth / 2 - 0.03
            p = []
            for (dx, d) in ((-1.0, d0), (1.0, d0), (1.0, d1), (-1.0, d1)):
                y = -depth / 2 + d * math.cos(tilt)
                z = 0.8 + d * math.sin(tilt)
                p.append((x + dx, y, z))
            top = [(a, b, c + 0.06) for (a, b, c) in p]
            mb.poly(p + top, [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5),
                              (2, 3, 7, 6), (3, 0, 4, 7)], "solar")
    for x in [-L / 2 + 1 + k * 4.2 for k in range(int(L / 4.2) + 1)]:
        mb.beam((x, -1.2, 0), (x, -1.2, 0.95), 0.1)
        mb.beam((x, 1.3, 0), (x, 1.3, 2.35), 0.1)
    return mb.mesh("solar_row")


def p_turbine():
    mb = MB()
    h = 36.0
    mb.cyl(0, 0, 0, 3.0, 0.6, "clay2", seg=24)
    mb.cyl(0, 0, 0.6, 1.25, h - 0.6, "clay", seg=28, r2=0.7)
    mb.boxc(0.6, 0, h - 0.2, 5.0, 2.0, 2.1, "clay")
    mb.boxc(0.1, 0, h + 1.9, 3.6, 1.6, 0.25, "clay")
    return mb.mesh("turbine"), (3.4, 0.0, h + 0.85)


def p_rotor():
    mb = MB()
    mb.tube((-0.3, 0, 0), (0.9, 0, 0), 0.75, "clay", seg=16)
    mb.cyl(0, 0, 0, 0.1, 0.1, "clay")  # keeps origin centred
    bm = mb.bm
    for k in range(3):
        a = k * 2 * math.pi / 3
        R = Matrix.Rotation(a, 4, "X")
        prof = []
        for (rad, w, t) in ((0.6, 1.0, 0.45), (3.5, 1.5, 0.32), (17.0, 0.28, 0.08)):
            prof.append([(0.2 + t / 2, -w / 2, rad), (0.2 + t / 2, w / 2, rad),
                         (0.2 - t / 2, w / 2, rad), (0.2 - t / 2, -w / 2, rad)])
        vs = []
        for ring in prof:
            vs.append([bm.verts.new(R @ Vector(p)) for p in ring])
        for i in range(len(vs) - 1):
            for j in range(4):
                f = bm.faces.new([vs[i][j], vs[i][(j + 1) % 4], vs[i + 1][(j + 1) % 4],
                                  vs[i + 1][j]])
                f.material_index = M["clay"]
        bm.faces.new(vs[-1][::-1]).material_index = M["clay"]
    return mb.mesh("rotor")


# --------------------------------------------------------------------------- builders
PLOTS = []   # (x0, y0, x1, y1) of pads, lots and buildings; keeps streetlights off them
ROADS = []   # footprints of every road-like strip
DRIVES = []  # ((x0, y0), (x1, y1), w) of every drive: fence gates open where they meet a plot


def inst(name, me, x, y, z=0.0, rot=0.0, scale=1.0, bevel=0.0, cat="equip", **meta):
    return place(me, name, (x, y, z), rot, scale, bevel, cat=cat, **meta)


def pad(name, x0, y0, x1, y1, t0, level_mat="pad", fence=True, z=PAD_Z, role="plot"):
    mb = MB()
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    mb.box(x0 - cx, y0 - cy, 0, x1 - cx, y1 - cy, z, level_mat)
    ob = place(mb.mesh(name), name, (cx, cy, 0), bevel=0.06, cat="pad", role=role,
               rect=[x0, y0, x1, y1], top=z)
    anim(ob, "grow_xy", t0, 10)
    occupy(x0, y0, x1, y1)
    PLOTS.append((x0, y0, x1, y1))
    if fence:
        FENCE_JOBS.append(lambda: fence_for(name, x0, y0, x1, y1, z, t0))
    if role == "dc":            # the data campus breathes: soft halo on the ground around it
        glow_plane(name + "_halo", max(x0 - 25, NODE_X0), max(y0 - 25, NODE_Y0), min(x1 + 25, NODE_X1),
                   min(y1 + 25, NODE_Y1), "halo", t0 + 10)
    return ob


FENCE_JOBS = []


def near_trench(x, y, m=0.35):
    return any(r[0] - m <= x <= r[2] + m and r[1] - m <= y <= r[3] + m for r in TRENCHES)


def fence_for(name, x0, y0, x1, y1, z, t0):
    """Perimeter fence of a plot, built once the whole layout is known: posts and pickets skip
    buried cable / fibre crossings, gates open where drives meet the plot."""
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    if True:
        fb = MB()
        hx, hy = (x1 - x0) / 2 - 0.4, (y1 - y0) / 2 - 0.4
        per = [(-hx, -hy), (hx, -hy), (hx, hy), (-hx, hy)]
        # gates where a drive meets the plot edge: (side, offset along the side from its start)
        gates = {}
        for (p0, p1, w) in DRIVES:
            for (ex, ey) in (p0, p1):
                if not (x0 - 1.0 <= ex <= x1 + 1.0 and y0 - 1.0 <= ey <= y1 + 1.0):
                    continue
                d = [abs(ey - y0), abs(ex - x1), abs(ey - y1), abs(ex - x0)]
                k = d.index(min(d))
                if d[k] <= 1.0:
                    a = Vector(per[k])
                    t = (Vector((ex - cx, ey - cy)) - a).dot((Vector(per[(k + 1) % 4]) - a).normalized())
                    gates.setdefault(k, []).append((t, w / 2 + 0.7))
        for k in range(4):
            a, b = Vector((*per[k], z)), Vector((*per[(k + 1) % 4], z))
            L = (b - a).length
            u = (b - a) / L
            runs, s0 = [], 0.0
            for (t, g) in sorted(gates.get(k, [])):
                runs.append((s0, max(t - g, s0)))
                s0 = t + g
                for sg in (-1, 1):                       # gate posts
                    p = a + u * (t + sg * g)
                    if not near_trench(cx + p.x, cy + p.y):
                        fb.boxc(p.x, p.y, z, 0.22, 0.22, 2.4, "clay2")
                # sliding gate leaf parked open beside the opening, inside the fence line
                nrm = Vector((-u.y, u.x, 0)) * 0.35
                g0, g1 = a + u * (t + g) + nrm, a + u * (t + 3 * g) + nrm
                if t + 3 * g < L:
                    for zz in (0.55, 1.95):
                        fb.beam(g0 + Vector((0, 0, zz)), g1 + Vector((0, 0, zz)), 0.07, "metal")
                    nb = max(int(2 * g / 0.32), 2)
                    for i in range(nb + 1):
                        p = g0.lerp(g1, i / nb)
                        if not near_trench(cx + p.x, cy + p.y):
                            fb.beam(p + Vector((0, 0, 0.55)), p + Vector((0, 0, 1.95)), 0.04,
                                    "metal")
            runs.append((s0, L))
            for (r0, r1) in runs:
                if r1 - r0 < 0.3:
                    continue
                pa, pb = a + u * r0, a + u * r1
                n = max(int((r1 - r0) / 2.8), 1)
                for i in range(n + 1):
                    p = pa.lerp(pb, i / n)
                    if not near_trench(cx + p.x, cy + p.y):
                        fb.beam(p, p + Vector((0, 0, 2.1)), 0.08)
                for zz in (0.9, 2.05):
                    fb.beam(pa + Vector((0, 0, zz)), pb + Vector((0, 0, zz)), 0.05)
                m_ = max(int((r1 - r0) / 0.9), 1)           # mesh panel pickets
                for i in range(m_):
                    p = pa.lerp(pb, (i + 0.5) / m_)
                    if not near_trench(cx + p.x, cy + p.y):
                        fb.beam(p + Vector((0, 0, 0.5)), p + Vector((0, 0, 2.05)), 0.02, "metal")
        fo = place(fb.mesh(name + "_fence"), name + "_fence", (cx, cy, 0), cat="fence",
                   parent=name)
        anim(fo, "rise", t0 + 8, 10, back=0.6)
    return fo


ROAD_TOP = {"drive": 0.04, "turn": 0.04, "sec": 0.04, "main": 0.07, "main2": 0.09, "hwy": 0.11}
# right-hand lanes as (lo, hi) lateral offsets from the centre line, per direction
LANES = {"sec": [(0.08, 2.2)], "main": [(0.08, 3.87)], "main2": [(0.08, 3.87)],
         "hwy": [(0.3, 3.77), (3.93, 6.87)]}


def road(name, x0, y0, x1, y1, w, kind, t0, dur=14, rid=None):
    """Straight road drawn from (x0,y0) toward (x1,y1)."""
    top = ROAD_TOP[kind]
    d = Vector((x1 - x0, y1 - y0))
    L = d.length
    rot = math.atan2(d.y, d.x)
    mb = MB()
    mb.box(0, -w / 2, 0, L, w / 2, top, "road")
    mz = top + 0.012
    lw = 0.16
    if kind in ("main", "main2", "hwy"):
        for s in (-1, 1):
            mb.box(0, s * (w / 2 - 0.55) - lw / 2, top, L, s * (w / 2 - 0.55) + lw / 2, mz, "mark")
    lanes = []
    if kind == "hwy":
        for s in (-1, 1):
            mb.box(0, s * 0.22 - lw / 2, top, L, s * 0.22 + lw / 2, mz, "mark")
        lanes = [-w / 4 - 0.1, w / 4 + 0.1]
    elif kind in ("main", "main2", "sec"):
        lanes = [0.0]
    for ly in lanes:
        x = 1.0
        while x + 3.0 < L:
            mb.box(x, ly - lw / 2, top, x + 3.0, ly + lw / 2, mz, "mark")
            x += 7.0
    ob = place(mb.mesh(name), name, (x0, y0, 0), rot, cat="road", rid=rid or name, kind=kind,
               w=w, top=top, p0=[x0, y0], p1=[x1, y1],
               lanes=[c for ln in LANES.get(kind, []) for c in ln] or [0.0, 0.0])
    anim(ob, "draw", t0, dur)
    c, s = math.cos(rot), math.sin(rot)
    nx, ny = -s * w / 2, c * w / 2
    xs = [x0 + nx, x0 - nx, x1 + nx, x1 - nx]
    ys = [y0 + ny, y0 - ny, y1 + ny, y1 - ny]
    occupy(min(xs), min(ys), max(xs), max(ys), 1.0)
    ROADS.append(((min(xs), min(ys), max(xs), max(ys)), rid or name))
    if kind == "drive":
        DRIVES.append(((x0, y0), (x1, y1), w))
    return ob


KERBED = ("main", "main2", "hwy", "sec")


def add_kerbs():
    """Kerbs (0.25 m, 12 cm proud) along both edges of every through road, inside its width,
    dropped wherever a junction, another road or a drive meets that edge."""
    for ob in list(COLL.objects):
        if ob.get("cat") != "road" or ob.get("kind") not in KERBED or ob.get("p0") is None:
            continue
        (x0, y0), (x1, y1) = list(ob["p0"]), list(ob["p1"])
        w, top = float(ob["w"]), float(ob["top"])
        d = Vector((x1 - x0, y1 - y0))
        L = d.length
        d.normalize()
        nrm = Vector((-d.y, d.x))
        mb = MB()
        mb.bm.from_mesh(ob.data)
        lots = [(tuple(o["rect"]), o.name) for o in COLL.objects if o.get("cat") == "lot"]
        for side in (-1, 1):
            gaps = []
            for (r, nm) in ROADS + lots:
                if nm == ob.get("rid"):
                    continue
                # does the footprint touch this edge strip? project its corners on the axis
                cs = [Vector((r[0], r[1])), Vector((r[2], r[1])), Vector((r[0], r[3])),
                      Vector((r[2], r[3]))]
                lat = [(c - Vector((x0, y0))).dot(nrm) * side for c in cs]
                if max(lat) < w / 2 - 0.6 or min(lat) > w / 2 + 0.6:
                    continue
                s = [(c - Vector((x0, y0))).dot(d) for c in cs]
                gaps.append((min(s) - 1.5, max(s) + 1.5))
            gaps.sort()
            s0 = 0.0
            for (g0, g1) in gaps + [(L, L)]:
                if g0 - s0 > 1.0:
                    a, b = max(s0, 0.0), min(g0, L)
                    if b - a > 1.0:
                        mb.box(a, side * (w / 2 - 0.25), top, b, side * w / 2, top + 0.12, "clay")
                s0 = max(s0, g1)
        mb.bm.to_mesh(ob.data)
        mb.bm.free()


def pave_on_edge():
    """Pavement against the kerb with the lamp posts standing on it, once validate_scene.py
    allows ("pavement","road") and ("pavement","streetlight"); until then the pavement runs
    behind the lamp verge (1.35 m off the kerb) so nothing touches."""
    try:
        import validate_scene as VS
        return all(frozenset(p) in VS.ALLOW for p in (("pavement", "road"),
                                                       ("pavement", "streetlight")))
    except Exception:
        return False


def pavement(name, rid, y_edge, side, xa, xb, t0):
    """Footway along an east-west road edge (y_edge, side -1 = south / +1 = north), cut wherever a
    plot, another road / junction / drive or a buried cable meets it."""
    edge = pave_on_edge()
    o0 = 0.0 if edge else 1.35
    ya, yb = sorted((y_edge + side * o0, y_edge + side * (o0 + (2.2 if edge else 1.6))))
    blocked = [r for r in PLOTS] + [r for (r, nm) in ROADS if nm != rid] + list(TRENCHES)
    runs, cur = [], None
    x = xa
    while x <= xb:
        bad = any(r[0] - 0.4 <= x <= r[2] + 0.4 and r[1] - 0.3 < yb and r[3] + 0.3 > ya
                  for r in blocked)
        if not bad and cur is None:
            cur = x
        if (bad or x + 0.5 > xb) and cur is not None:
            if x - cur > 3.0:
                runs.append((cur, x - 0.5 if bad else x))
            cur = None
        x += 0.5
    if not runs:
        return None
    mb = MB()
    for (a, b) in runs:
        mb.box(a, ya, 0, b, yb, 0.12, "clay2")
        for yy in (ya, yb - 0.12):                      # kerb edges
            mb.box(a, yy, 0, b, yy + 0.12, 0.16, "clay")
        k = a + 1.2
        while k < b - 0.5:                              # paving joints
            mb.box(k, ya + 0.12, 0.12, k + 0.05, yb - 0.12, 0.125, "pad")
            k += 2.4
    ob = place(mb.mesh(name), name, (0, 0, 0), cat="pavement", road=rid)
    anim(ob, "rise", t0, 8, back=0.6)
    for (a, b) in runs:
        occupy(a, ya, b, yb, 0.3)
    return ob


def turnaround(name, x0, y0, x1, y1, t0, rid):
    mb = MB()
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    mb.box(x0 - cx, y0 - cy, 0, x1 - cx, y1 - cy, ROAD_TOP["turn"], "road")
    ob = place(mb.mesh(name), name, (cx, cy, 0), cat="road", rid=rid, kind="turn",
               top=ROAD_TOP["turn"], rect=[x0, y0, x1, y1])
    anim(ob, "grow_xy", t0, 9)
    occupy(x0, y0, x1, y1, 1.0)
    ROADS.append(((x0, y0, x1, y1), name))
    return ob


DIRS = {"E": (1, 0), "W": (-1, 0), "N": (0, 1), "S": (0, -1)}


def junction(name, cx, cy, wx, wy, top, arms, t0, appr=6.0):
    """Real intersection: raised junction surface over the crossing, approach strips that
    interrupt the lane markings, zebra crossings and stop lines on the incoming lanes.
    wx/wy = extent of the core along x / y; arms = {"E": (road_w, road_top), ...}."""
    mb = MB()
    ztop = top + 0.02
    mb.box(-wx / 2, -wy / 2, 0, wx / 2, wy / 2, ztop, "road")
    rect = [cx - wx / 2, cy - wy / 2, cx + wx / 2, cy + wy / 2]
    parts = list(rect)
    for key, (w, rtop) in arms.items():
        ax, ay = DIRS[key]
        px, py = -ay, ax                      # across vector; also the incoming-lane side
        e = wx / 2 if ax else wy / 2          # distance centre -> junction edge along arm
        st = rtop + 0.02

        def rb(s0, s1, c0, c1, z0, z1, mat):
            xs = [ax * (e + s0) + px * c0, ax * (e + s1) + px * c1]
            ys = [ay * (e + s0) + py * c0, ay * (e + s1) + py * c1]
            mb.box(min(xs), min(ys), z0, max(xs), max(ys), z1, mat)

        rb(0.0, appr, -w / 2, w / 2, 0, st, "road")
        xs = [cx + ax * e - px * w / 2, cx + ax * (e + appr) + px * w / 2]
        ys = [cy + ay * e - py * w / 2, cy + ay * (e + appr) + py * w / 2]
        parts += [min(xs), min(ys), max(xs), max(ys)]
        c = -w / 2 + 0.6
        while c + 0.5 < w / 2 - 0.4:
            rb(1.0, 3.6, c, c + 0.5, st, st + 0.012, "mark")
            c += 1.0
        rb(4.4, 4.8, 0.1, w / 2 - 0.45, st, st + 0.012, "mark")
        for sgn in (-1, 1):  # extent bookkeeping for the validator
            xs = [cx + ax * e, cx + ax * (e + appr) + px * w / 2 * sgn]
            ys = [cy + ay * e, cy + ay * (e + appr) + py * w / 2 * sgn]
            rect = [min(rect[0], *xs), min(rect[1], *ys), max(rect[2], *xs), max(rect[3], *ys)]
    ob = place(mb.mesh(name), name, (cx, cy, 0), cat="junction",
               core=[cx - wx / 2, cy - wy / 2, cx + wx / 2, cy + wy / 2], rect=rect, parts=parts,
               arms="".join(sorted(arms)))
    anim(ob, "grow_xy", t0, 8)
    ROADS.append((tuple(rect), name))
    return ob


HALLS = {}


def hall(name, cx, cy, L, W, h, rot, t0, roof="chillers", mode="rise", src=None, dur=13,
         fed_by="", sprout_from="", unit_gap=1.0, bay=3.6, band="louvre", screen=False,
         ladder=True):
    """Data hall: long body along local x with a pilaster rhythm of pitch `bay`, a facade band
    ("louvre" band, "slots" = a vertical louvre per bay, "ribbon" = two thin bands), parapet with
    coping and guard rail, cage ladder on the east gable, optional louvred plant screen around the
    east roof end (a setback in the silhouette).
    roof: "chillers" (seam 3 layout) | "condensers" | "mixed" | "none"."""
    mb = MB()
    hl, hw = L / 2, W / 2
    mb.box(-hl - 0.3, -hw - 0.3, 0, hl + 0.3, hw + 0.3, 0.6, "clay2")
    mb.box(-hl, -hw, 0, hl, hw, h, "clay")
    pt = 0.35
    mb.box(-hl - 0.1, -hw - 0.1, h, hl + 0.1, -hw + pt, h + 0.9, "clay")
    mb.box(-hl - 0.1, hw - pt, h, hl + 0.1, hw + 0.1, h + 0.9, "clay")
    mb.box(-hl - 0.1, -hw, h, -hl + pt, hw, h + 0.9, "clay")
    mb.box(hl - pt, -hw, h, hl + 0.1, hw, h + 0.9, "clay")
    for sy in (-1, 1):                                            # coping
        mb.box(-hl - 0.16, sy * (hw + 0.16), h + 0.9, hl + 0.16, sy * (hw - pt - 0.04), h + 1.0,
               "clay2")
    for sx in (-1, 1):
        mb.box(sx * (hl + 0.16), -hw + pt, h + 0.9, sx * (hl - pt - 0.04), hw - pt, h + 1.0,
               "clay2")
    if roof != "none":           # data hall: faint blue roof-edge strip (it breathes, see wab)
        for sy in (-1, 1):
            mb.box(-hl - 0.2, sy * (hw + 0.16), h + 0.78, hl + 0.2, sy * (hw + 0.21), h + 0.9, "wab")
        for sx in (-1, 1):
            mb.box(sx * (hl + 0.16), -hw - 0.2, h + 0.78, sx * (hl + 0.21), hw + 0.2, h + 0.9, "wab")
    n = max(int(round(L / bay)), 2)
    xs = [-hl + i * L / n for i in range(1, n)]
    for x in xs:
        for sy in (-1, 1):
            mb.box(x - 0.22, sy * hw, 0.6, x + 0.22, sy * (hw + 0.3), h + 0.9, "clay")
    for sy in (-1, 1):
        if band == "louvre":
            mb.box(-hl + 0.3, sy * hw, h - 2.7, hl - 0.3, sy * (hw + 0.07), h - 1.1, "trim")
            for z in (h - 2.35, h - 1.95, h - 1.55):
                mb.box(-hl + 0.3, sy * (hw + 0.05), z, hl - 0.3, sy * (hw + 0.1), z + 0.07, "clay2")
        elif band == "slots":
            edges = [-hl] + xs + [hl]
            for a, b in zip(edges[:-1], edges[1:]):
                c, sw = (a + b) / 2, min(1.3, 0.42 * (b - a))
                mb.box(c - sw / 2, sy * hw, 1.5, c + sw / 2, sy * (hw + 0.06), h - 1.3, "trim")
                z = 1.75
                while z < h - 1.45:
                    mb.box(c - sw / 2, sy * (hw + 0.04), z, c + sw / 2, sy * (hw + 0.09), z + 0.06,
                           "clay2")
                    z += 0.5
        else:  # ribbon
            for (z0, z1) in ((h - 2.4, h - 1.7), (h - 4.4, h - 3.7)):
                mb.box(-hl + 0.3, sy * hw, z0, hl - 0.3, sy * (hw + 0.07), z1, "trim")
        mb.box(-hl + 0.3, sy * hw, 0.6, hl - 0.3, sy * (hw + 0.04), 0.9, "clay2")
    m = max(int(W / 4.0), 2)
    for i in range(1, m):
        y = -hw + i * W / m
        for sx in (-1, 1):
            mb.box(sx * hl, y - 0.22, 0.6, sx * (hl + 0.3), y + 0.22, h + 0.9, "clay")
    for sx in (-1, 1):
        mb.box(sx * hl, -hw + 0.8, 0.6, sx * (hl + 0.06), -hw + 3.6, 4.2, "trim")
        for z in (1.4, 2.2, 3.0, 3.8):                            # roll-up door ribs
            mb.box(sx * (hl + 0.06), -hw + 0.85, z, sx * (hl + 0.09), -hw + 3.55, z + 0.05, "clay2")
        mb.box(sx * hl, hw - 3.0, 0.6, sx * (hl + 0.06), hw - 1.8, 3.0, "trim")
        mb.box(sx * hl, -hw + 0.6, 4.2, sx * (hl + 0.9), -hw + 3.8, 4.45, "clay")
    # roof core / stair tower with door and hatch
    core = (hl - 6.5, hw - 5.5, hl - 2.0, hw - 1.2)
    mb.box(core[0], core[1], h, core[2], core[3], h + 3.0, "clay")
    mb.box(core[0] - 0.1, core[1] - 0.1, h + 3.0, core[2] + 0.1, core[3] + 0.1, h + 3.15, "clay2")
    mb.box(hl - 6.3, hw - 1.21, h + 0.2, hl - 5.2, hw - 1.17, h + 2.4, "trim")
    mb.box(core[0] + 0.8, core[1] + 0.8, h + 3.15, core[0] + 1.8, core[1] + 1.8, h + 3.45, "clay2")
    # louvred plant screen: a taller enclosure over the east roof end (core, AHU, vents)
    x_s = core[0] - 0.25
    if screen:
        zt = h + 3.3
        mb.box(x_s - 0.12, -hw + pt, h, x_s, hw - pt, zt, "clay")
        mb.box(x_s - 0.1, -hw - 0.1, h + 0.9, hl + 0.1, -hw + pt, zt, "clay")
        mb.box(x_s - 0.1, hw - pt, h + 0.9, hl + 0.1, hw + 0.1, zt, "clay")
        mb.box(hl - pt, -hw, h + 0.9, hl + 0.1, hw, zt, "clay")
        z = h + 1.15
        while z < zt - 0.3:
            mb.box(x_s - 0.05, -hw - 0.16, z, hl + 0.05, -hw - 0.1, z + 0.08, "clay2")
            mb.box(x_s - 0.05, hw + 0.1, z, hl + 0.05, hw + 0.16, z + 0.08, "clay2")
            mb.box(hl + 0.1, -hw + 0.1, z, hl + 0.16, hw - 0.1, z + 0.08, "clay2")
            z += 0.42
        for (a0, a1) in (((x_s - 0.16, -hw - 0.16), (hl + 0.16, -hw + pt)),
                         ((x_s - 0.16, hw - pt), (hl + 0.16, hw + 0.16)),
                         ((hl - pt, -hw + pt), (hl + 0.16, hw - pt)),
                         ((x_s - 0.16, -hw + pt), (x_s + 0.04, hw - pt))):
            mb.box(a0[0], a0[1], zt, a1[0], a1[1], zt + 0.1, "clay2")
    # guard rail on the parapet coping (posts every ~2.5 m), skipped along the screen
    zr = h + 1.0
    x_end = (x_s - 0.3) if screen else hl
    for sy in (-1, 1):
        y = sy * (hw - 0.12)
        k = max(int((x_end + hl) / 2.5), 1)
        for i in range(k + 1):
            x = -hl + 0.12 + (x_end - 0.24 + hl) * i / k
            mb.beam((x, y, zr), (x, y, zr + 0.5), 0.06, "metal")
        for z in (zr + 0.25, zr + 0.48):
            mb.beam((-hl + 0.12, y, z), (x_end - 0.12, y, z), 0.05, "metal")
    for sx in ((-1,) if screen else (-1, 1)):
        x = sx * (hl - 0.12)
        k = max(int(W / 2.5), 1)
        for i in range(k + 1):
            y = -hw + 0.12 + (W - 0.24) * i / k
            mb.beam((x, y, zr), (x, y, zr + 0.5), 0.06, "metal")
        for z in (zr + 0.25, zr + 0.48):
            mb.beam((x, -hw + 0.12, z), (x, hw - 0.12, z), 0.05, "metal")
    # cage ladder on the east gable, between the gable pilasters
    if ladder and roof != "none":
        ly = 0.0 if m % 2 == 1 else W / m / 2
        xr = hl + 0.2
        for s in (-1, 1):
            mb.beam((xr, ly + s * 0.25, 0.6), (xr, ly + s * 0.25, h + 2.0), 0.06, "metal")
            for zb in range(2, int(h), 3):
                mb.beam((hl, ly + s * 0.25, zb), (xr, ly + s * 0.25, zb), 0.05, "metal")
        z = 0.95
        while z < h + 0.9:
            mb.beam((xr, ly - 0.25, z), (xr, ly + 0.25, z), 0.035, "metal")
            z += 0.35
        hoop = [(xr, ly - 0.25), (xr + 0.62, ly - 0.36), (xr + 0.72, ly), (xr + 0.62, ly + 0.36),
                (xr, ly + 0.25)]
        zc = 2.6
        while zc < h + 1.95:
            for a, b in zip(hoop[:-1], hoop[1:]):
                mb.beam((a[0], a[1], zc), (b[0], b[1], zc), 0.04, "metal")
            zc += 0.9
        for p in hoop[1:-1]:
            mb.beam((p[0], p[1], 2.6), (p[0], p[1], zc - 0.9), 0.035, "metal")
    ob = place(mb.mesh(name), name, (cx, cy, 0), rot, bevel=0.0 if STATIC else 0.07,
               cat="building", roof_h=h, roof_rect=[-hl + pt, -hw + pt, hl - pt, hw - pt],
               roof_core=list(core), fed_by=fed_by, sprout_from=sprout_from)
    if mode == "rise":
        anim(ob, "rise", t0, dur)
    elif mode == "slide":
        anim(ob, "slide", t0, dur + 4, src=src)
    c, s = abs(math.cos(rot)), abs(math.sin(rot))
    ex, ey = (hl + 0.9) * c + (hw + 0.3) * s, (hl + 0.9) * s + (hw + 0.3) * c
    occupy(cx - ex, cy - ey, cx + ex, cy + ey, 0.5)
    PLOTS.append((cx - ex, cy - ey, cx + ex, cy + ey))
    HALLS[name] = dict(cx=cx, cy=cy, hl=hl, hw=hw, h=h, rot=rot, t_end=t0 + dur)
    # roof plant pops once the roof is (nearly) in place; units are parented to the hall so
    # they ride along with the last few frames of its settle
    te = t0 + (0.6 * dur if mode == "rise" else 0.75 * (dur + 4))
    if roof == "none":
        return ob
    pinv = (Matrix.Translation((cx, cy, 0)) @ Matrix.Rotation(rot, 4, "Z")).inverted()

    def unit(nm, me, lx, ly, t, back=1.6, bev=0.04):
        x, y = l2w(cx, cy, rot, lx, ly)
        u = inst(nm, me, x, y, h, rot, bevel=0.0 if STATIC else bev, cat="roof", parent=name)
        u.parent = ob
        u.matrix_parent_inverse = pinv
        anim(u, "pop", t, 7, back=back)
        return u

    lim = core[0] - 0.5            # every unit stays west of the stair core / screen
    k = 0
    if roof == "array":
        # hyperscale hall: each chiller row is one merged roof object (keeps object counts sane)
        rows = (-(hw - 3.45), 0.0, hw - 3.45) if W >= 24 else (-(hw - 3.45), hw - 3.45)
        for j, ry in enumerate(rows):
            rb = MB()
            lx = -hl + 2.1
            while lx + 1.25 <= lim:
                chiller_lo(rb, lx, ry)
                lx += 3.1
            ux, uy = l2w(cx, cy, rot, 0.0, 0.0)
            u = place(rb.mesh(name + "_arr%d" % j), name + "_arr%d" % j, (ux, uy, h), rot,
                      cat="roof", parent=name)
            u.parent = ob
            u.matrix_parent_inverse = pinv
            anim(u, "pop", te + unit_gap * j, 7, back=1.2)
    if roof in ("chillers", "mixed"):
        # seam 3: chiller rows at +-(hw - 3.45), lx = -hl + 2.1 + 3.1 k (HA1: -15.9 + 3.1 k)
        rows = (-(hw - 3.45), hw - 3.45) if W >= 12.5 else (-hw + 3.45,)
        if roof == "mixed":
            rows = rows[:1]
        for ry in rows:
            lx = -hl + 2.1
            while lx + 1.25 <= lim:
                unit(name + "_ch%d" % k, proto("chiller", p_chiller), lx, ry,
                     te + unit_gap * 0.5 * k ** 0.85)
                lx += 3.1
                k += 1
    if roof == "condensers":
        for ry in (-(hw - 2.5), hw - 2.5):
            lx = -hl + 1.8
            while lx + 1.1 <= lim:
                unit(name + "_cd%d" % k, proto("condenser", p_condenser), lx, ry,
                     te + unit_gap * 0.45 * k ** 0.85, bev=0.0)
                lx += 2.6
                k += 1
        lx, j = -hl + 4.0, 0
        while lx + 0.7 <= lim:
            unit(name + "_ex%d" % j, proto("exhaust", p_exhaust), lx, 0.0,
                 te + unit_gap * (1.5 + 0.6 * j), back=1.2, bev=0.0)
            lx += 7.8
            j += 1
    if roof == "mixed":
        lx, j, box = -hl + 2.6, 0, True
        ry = hw - 2.0
        while lx + (2.1 if box else 0.7) <= lim:
            if box:
                unit(name + "_lv%d" % j, proto("louvre", p_louvre), lx, ry,
                     te + unit_gap * (1.0 + 0.5 * j))
                lx += 2.1 + 1.0 + 0.7
            else:
                unit(name + "_ex%d" % j, proto("exhaust", p_exhaust), lx, ry,
                     te + unit_gap * (1.0 + 0.5 * j), back=1.2, bev=0.0)
                lx += 0.7 + 1.0 + 2.1
            box = not box
            j += 1
    unit(name + "_ahu", proto("ahu", p_ahu), hl - 4.25, -hw + 1.85, te + 2 * unit_gap)
    vy = ((-hw + 2.95) + core[1]) / 2
    for j, lx in enumerate((hl - 5.5, hl - 3.0)):
        unit(name + "_v%d" % j, proto("vent", p_vent), lx, vy, te + (3 + j) * unit_gap, bev=0.0)
    return ob


def link_bridge(name, a, b, lx, t0, dur, reverse=False):
    """Enclosed sky-bridge between two parallel halls (rot 0, b north of a). Grows out of a
    (or out of b when reverse=True)."""
    A, B = HALLS[a], HALLS[b]
    y0 = A["cy"] + A["hw"] + 0.3
    y1 = B["cy"] - B["hw"] - 0.3
    z0, z1 = 6.0, min(A["h"], B["h"]) - 0.8
    mb = MB()
    L = y1 - y0
    mb.box(0, -2.0, z0, L, 2.0, z1, "clay")
    mb.box(0.2, -2.04, z0 + 0.9, L - 0.2, 2.04, z1 - 0.7, "trim")
    if reverse:
        ob = place(mb.mesh(name), name, (A["cx"] + lx, y1, 0), -math.pi / 2, bevel=0.05,
                   cat="building", attached="%s,%s" % (a, b), floating_ok=1)
    else:
        ob = place(mb.mesh(name), name, (A["cx"] + lx, y0, 0), math.pi / 2, bevel=0.05,
                   cat="building", attached="%s,%s" % (a, b), floating_ok=1)
    anim(ob, "extrude", t0, dur, back=0.3)
    return ob


def gen_row(name, x0, y0, n, t0, step=11.0):
    """Row of generator containers, long side along world x."""
    out = []
    for i in range(n):
        g = inst("%s_%d" % (name, i), proto("genset", p_genset), x0 + i * step, y0, PAD_Z, 0,
                 bevel=0.05, cat="equip")
        anim(g, "rise", t0 + i * 0.9, 10)
        out.append(g)
    return out


def pipe_rack(name, x0, y0, x1, y1, t0, z=4.2):
    d = Vector((x1 - x0, y1 - y0))
    L = d.length
    rot = math.atan2(d.y, d.x)
    mb = MB()
    n = max(int(L / 6), 1)
    for i in range(n + 1):
        x = i * L / n
        for sy in (-1, 1):
            mb.beam((x, sy * 1.1, 0), (x, sy * 1.1, z), 0.22)
        mb.beam((x, -1.2, z), (x, 1.2, z), 0.2)
        mb.beam((x, -1.2, z - 1.4), (x, 1.2, z - 1.4), 0.16)
    for (py, pz, r) in ((-0.65, z + 0.38, 0.28), (0.0, z + 0.38, 0.28), (0.65, z + 0.33, 0.22),
                        (-0.5, z - 1.05, 0.22), (0.4, z - 1.05, 0.22)):
        mb.tube((0, py, pz), (L, py, pz), r, "clay", seg=12)
    ob = place(mb.mesh(name), name, (x0, y0, PAD_Z), rot, cat="rack")
    anim(ob, "draw", t0, 12)
    return ob


def pipe_bridge(name, x0, x1, y, z, legs, t0, attached=""):
    """Pipe bridge along +x at height z between two buildings (ends in their walls): portal
    frames on `legs` (world x), lattice girders, three insulated pipes with flange rings and a
    cable tray underneath. Draws out of the x0 building."""
    mb = MB()
    L = x1 - x0
    for lx in legs:
        x = lx - x0
        for sy in (-1, 1):
            mb.boxc(x, sy * 1.0, 0.0, 0.7, 0.7, 0.3, "clay2")           # footing
            mb.beam((x, sy * 1.0, 0.3), (x, sy * 1.0, z), 0.24)
        for zz in (z, z - 1.6):
            mb.beam((x, -1.15, zz), (x, 1.15, zz), 0.2)
        mb.beam((x, -1.0, z - 1.6), (x, 1.0, z - 3.2), 0.1)               # knee brace
    for sy in (-1, 1):                                                   # girders + lacing
        for zz in (z + 0.1, z - 1.5):
            mb.beam((0, sy * 1.12, zz), (L, sy * 1.12, zz), 0.14)
        nseg = max(int(L / 2.0), 1)
        for i in range(nseg):
            xa, xb = L * i / nseg, L * (i + 1) / nseg
            mb.beam((xa, sy * 1.12, z - 1.5), (xb, sy * 1.12, z + 0.1), 0.07)
    for (py, r) in ((-0.62, 0.3), (0.02, 0.3), (0.62, 0.22)):
        mb.tube((0, py, z + 0.2 + r), (L, py, z + 0.2 + r), r, "clay", seg=14)
        f = 3.0
        while f < L - 1.0:
            mb.tube((f - 0.08, py, z + 0.2 + r), (f + 0.08, py, z + 0.2 + r), r + 0.05, "clay2",
                    seg=14)
            f += 6.0
    mb.box(0, -0.85, z - 1.42, L, 0.85, z - 1.36, "metal")                # cable tray
    for sy in (-1, 1):
        mb.box(0, sy * 0.85 - 0.03, z - 1.42, L, sy * 0.85 + 0.03, z - 1.25, "metal")
    ob = place(mb.mesh(name), name, (x0, y, 0), 0.0, bevel=0.0, cat="rack", attached=attached)
    anim(ob, "draw", t0, 14)
    occupy(x0, y - 1.5, x1, y + 1.5)
    return ob


def gantry_points(gx, gy):
    return [Vector((gx, gy + a[1], PAD_Z + a[2])) for a in GANTRY_ATTACH]


def substation(name, x0, y0, x1, y1, t0, n_tr=2, gantries=1, cols=1, keep_out=()):
    """Fenced substation: transformer rows (rot 0, pitch 5.6), gantries at the east end,
    busbars from every transformer to the last gantry."""
    pad(name + "_pad", x0, y0, x1, y1, t0, role="sub")
    trs = []
    cy = (y0 + y1) / 2
    for i in range(n_tr):
        ty = cy + (i - (n_tr - 1) / 2) * 5.6
        for j in range(cols):
            tx = x0 + 4.0 + j * 7.5
            tr = inst("%s_tr%d_%d" % (name, i, j), proto("transformer", p_transformer), tx, ty,
                      PAD_Z, 0, bevel=0.04, cat="equip")
            anim(tr, "rise", t0 + 3 + i * 1.3 + j, 10)
            trs.append(tr)
    gs = []
    for g in range(gantries):
        gx = x1 - 4.5 - g * 7.0
        go = inst("%s_g%d" % (name, g), proto("gantry", p_gantry), gx, cy, PAD_Z, 0,
                  cat="gantry", attach=[c for p in gantry_points(gx, cy) for c in p])
        anim(go, "rise", t0 + 5 + g, 11, back=0.7)
        gs.append(go)
    if gantries:
        bb = MB()
        gx_last = x1 - 4.5 - (gantries - 1) * 7.0
        if gantries > 1:
            for (_, gy, gz) in GANTRY_ATTACH:
                bb.tube((x1 - 4.5, cy + gy, PAD_Z + gz + 1.6), (gx_last, cy + gy, PAD_Z + gz + 1.6),
                        0.09, "metal", seg=8)
        foot = [(tr.location.x - 3.1, tr.location.y - 2.8, tr.location.x + 3.1, tr.location.y + 2.8)
                for tr in trs]
        for tr in trs:
            tx, ty = tr.location.x, tr.location.y
            bb.beam((tx, ty, PAD_Z + 3.9), (tx, ty, PAD_Z + 6.5), 0.12, "metal")
            bb.beam((tx, ty, PAD_Z + 6.5), (gx_last, ty, PAD_Z + 6.5), 0.08)
            # busbar supports: steel column + post insulator stack, clear of every transformer
            sx = tx + 4.0
            while sx < gx_last - 1.6:
                if not any(r[0] <= sx <= r[2] and r[1] <= ty <= r[3] for r in foot):
                    bus_support(bb, sx, ty, PAD_Z, PAD_Z + 6.5)
                sx += 3.5
        bo = place(bb.mesh(name + "_bus"), name + "_bus", (0, 0, 0), cat="bus", floating_ok=1)
        anim(bo, "pop", t0 + 9, 8, back=0.6)
    masts(name, x0, y0, x1, y1, trs, gs, t0 + 10, keep_out)
    return gs


def bus_support(mb, x, y, z0, zb):
    """Steel column with a post insulator (disc stack) carrying a busbar at height zb."""
    mb.boxc(x, y, z0, 0.6, 0.6, 0.25, "clay2")
    mb.beam((x, y, z0 + 0.25), (x, y, zb - 1.0), 0.2, "metal")
    mb.cyl(x, y, zb - 1.0, 0.08, 0.95, "clay", seg=10)
    for i in range(5):
        mb.cyl(x, y, zb - 0.9 + i * 0.17, 0.16, 0.05, "clay", seg=12)


def masts(name, x0, y0, x1, y1, trs, gs, t0, extra=()):
    """Lightning masts in up to two free corners inside the fence."""
    busy = [(o.location.x - 3.4, o.location.y - 3.0, o.location.x + 3.4, o.location.y + 3.0)
            for o in trs] + [(o.location.x - 1.4, o.location.y - 6.4, o.location.x + 1.4,
                              o.location.y + 6.4) for o in gs] + list(extra)
    me = proto("mast", p_mast)
    k = 0
    for (mx, my) in ((x0 + 1.3, y0 + 1.3), (x1 - 1.3, y1 - 1.3), (x1 - 1.3, y0 + 1.3),
                     (x0 + 1.3, y1 - 1.3)):
        if k == 2 or any(r[0] - 0.6 <= mx <= r[2] + 0.6 and r[1] - 0.6 <= my <= r[3] + 0.6
                         for r in busy):
            continue
        o = inst("%s_mast%d" % (name, k), me, mx, my, PAD_Z, 0, cat="equip")
        anim(o, "rise", t0 + k, 10, back=0.7)
        k += 1


PYLON_ME = None
PYLON_ATTACH = None
CORRIDORS = []


def pylon(name, x, y, rot, t0, chain=""):
    global PYLON_ME, PYLON_ATTACH
    if PYLON_ME is None:
        PYLON_ME, PYLON_ATTACH = p_pylon()
        PYLON_ATTACH.sort(key=lambda p: p[1])
    pts = []
    for (ax, ay, az) in PYLON_ATTACH:
        wx, wy = l2w(x, y, rot, ax, ay)
        pts.append(Vector((wx, wy, az)))
    ob = inst(name, PYLON_ME, x, y, 0, rot, cat="pylon", chain=chain,
              attach=[c for p in pts for c in p])
    anim(ob, "rise", t0, 12, back=0.7)
    occupy(x - 3.5, y - 3.5, x + 3.5, y + 3.5)
    return pts


def curve(name, pts, radius, mat, t0=None, dur=14, cat="misc", **meta):
    cu = bpy.data.curves.new(name, "CURVE")
    cu.dimensions = "3D"
    sp = cu.splines.new("POLY")
    sp.points.add(len(pts) - 1)
    for i, p in enumerate(pts):
        sp.points[i].co = (p[0], p[1], p[2], 1.0)
    cu.bevel_depth = radius
    cu.bevel_resolution = 2
    cu.use_fill_caps = True
    cu.bevel_factor_mapping_start = "SPLINE"
    cu.bevel_factor_mapping_end = "SPLINE"
    cu.materials.append(MATS[M[mat]])
    ob = bpy.data.objects.new(PREFIX + name, cu)
    COLL.objects.link(ob)
    tag(ob, cat, **meta)
    if t0 is not None:
        anim(ob, "draw_curve", t0, dur)
    return ob


def power_line(name, a_pts, b_pts, t0, sag=0.035, dur=12):
    for k, (a, b) in enumerate(zip(a_pts, b_pts)):
        L = (b - a).length
        pts = []
        for i in range(17):
            t = i / 16
            p = a.lerp(b, t)
            p.z -= sag * L * 4 * t * (1 - t)
            pts.append(p)
        curve("%s_%d" % (name, k), pts, 0.07, "cable", t0 + k * 0.4, dur, cat="cable",
              floating_ok=1)


NODE_X0, NODE_X1, NODE_Y0, NODE_Y1 = -324.0, 276.0, -224.0, 236.0  # one tile of the region


def switchyard(name, x0, y0, x1, y1, ys, t0, drive_to):
    """Grid switchyard: gantries facing west (one per incoming line) + transformers + busbars,
    with a drive from the regional road."""
    road(name + "_drive", (x0 + x1) / 2, drive_to, (x0 + x1) / 2, y1 if drive_to > y1 else y0, 4,
         "drive", t0 - 1, 3)
    pad(name + "_pad", x0, y0, x1, y1, t0, role="grid")
    bb = MB()
    gs, trs = [], []
    for k, gy in enumerate(ys):
        g = inst("%s_g%d" % (name, k), proto("gantry", p_gantry), 192.0, gy, PAD_Z, 0, cat="gantry",
                 attach=[c for p in gantry_points(192.0, gy) for c in p])
        anim(g, "rise", t0 + 2 + k, 10, back=0.7)
        tr = inst("%s_tr%d" % (name, k), proto("transformer", p_transformer), 200.0, gy, PAD_Z,
                  math.pi / 2, bevel=0.04, cat="equip")
        anim(tr, "rise", t0 + 3 + k, 9)
        gs.append(g)
        trs.append(tr)
        bb.beam((200.0, gy, PAD_Z + 3.9), (200.0, gy, PAD_Z + 6.5), 0.12, "metal")
        bb.beam((200.0, gy, PAD_Z + 6.5), (192.0, gy, PAD_Z + 6.5), 0.08)
        bus_support(bb, 195.6, gy, PAD_Z, PAD_Z + 6.5)
    bo = place(bb.mesh(name + "_bus"), name + "_bus", (0, 0, 0), cat="bus", floating_ok=1)
    anim(bo, "pop", t0 + 8, 6, back=0.6)
    masts(name, x0, y0, x1, y1, trs, gs, t0 + 9)
    occupy(x0, y0, x1, y1, 2.0)


def line_chain(name, start_pts, start_half, xs, y, t0, t_end, step_t=1.0, end_pts=None):
    """Straight east-west transmission line: equal spans, pylons rise first, each span is strung
    once both of its ends stand (start_half = frame the source gantry is half up)."""
    prev = start_pts
    prev_half = start_half
    t_cab = -1e9
    for i, x in enumerate(xs):
        tp = t0 + i * step_t
        pts = pylon("%s%d" % (name, i), x, y, 0.0, tp, chain=name)
        half = tp + 6.0
        t_cab = max(t_cab + 0.8, prev_half, half) + 0.5
        dur = max(min(8.0, t_end - t_cab - 1.6), 3.0)
        power_line("%sL%d" % (name, i), prev[:3], pts[:3], t_cab, dur=dur)
        if len(prev) > 3:
            power_line("%sLb%d" % (name, i), prev[3:], pts[3:], t_cab, dur=dur)
        prev, prev_half = pts, half
    if end_pts is not None:
        t_cab = max(t_cab + 0.8, prev_half) + 0.5
        dur = max(min(8.0, t_end - t_cab - 1.6), 3.0)
        power_line("%sLe" % name, prev[:3], end_pts, t_cab, dur=dur)
    x0 = start_pts[0].x
    CORRIDORS.append((min(x0, xs[0]), y - 9.0, max(xs) + 30, y + 9.0))
    occupy(min(x0, xs[0]), y - 9.0, max(xs) + 30, y + 9.0)


def fiber(name, pts2d, t0, dur=16, z=None, pulses_n=0, trunk=False):
    """Glowing data/fibre line in a trench on the ground, drawn along its path. With pulses_n,
    that many light pulses travel along it once it is drawn (n pulses advance 1/n per LOOP).
    trunk=True: a regional backbone between campuses -- thick, with bigger pulses and a soft glow
    corridor; secondary lines stay thin. Both stand 0.25 m proud of the ground."""
    r = 0.7 if trunk else 0.13
    z = 0.25 - r if z is None else z
    ob = _fiber(name, pts2d, t0, dur, z, r)
    if pulses_n:
        src = None if STATIC else next(a for a in reversed(ANIMS)
                                       if a.ob is ob and a.kind == "draw_curve")
        pulses("P_" + name, pts2d, pulses_n, src, z=z, r=1.0 if trunk else 0.26)
    if trunk:
        (xa, ya), (xb, yb) = pts2d[0], pts2d[-1]
        cx, cy, L = (xa + xb) / 2, (ya + yb) / 2, math.hypot(xb - xa, yb - ya)
        glow_plane(name + "_band", cx - L / 2, cy - 5.0, cx + L / 2, cy + 5.0, "band", t0 + dur,
                   z=0.27, rot=math.atan2(yb - ya, xb - xa))
    return ob


def _fiber(name, pts2d, t0, dur=16, z=0.2, r=0.2):
    flat = [c for p in pts2d for c in p]
    for (x0, y0), (x1, y1) in zip(pts2d[:-1], pts2d[1:]):
        occupy(min(x0, x1), min(y0, y1), max(x0, x1), max(y0, y1), 0.4 + r)
        TRENCHES.append((min(x0, x1) - r, min(y0, y1) - r, max(x0, x1) + r, max(y0, y1) + r))
    ob = curve(name, [(x, y, z) for (x, y) in pts2d], r, "line", t0, dur, cat="fiber",
               path=flat, embedded_ok=1)
    if not STATIC:
        src = ANIMS[-1]
        L = sum(math.hypot(b[0] - a[0], b[1] - a[1]) for a, b in zip(pts2d[:-1], pts2d[1:]))
        hd = curve(name + "_head", [(x, y, z) for (x, y) in pts2d], max(r * 1.6, 0.3), "pulse",
                   cat="pulse")
        hd.data.taper_object = pulse_taper()
        hd.data.use_map_taper = True
        anim(hd, "head", t0, dur, src=src, length=min(18.0 / max(L, 1.0), 0.25))
    return ob


def pulses(name, pts2d, n, src, z=0.2, r=0.36):
    """Short bright segments travelling along a fibre path (bevel factor window). They appear
    when the fibre `src` (its draw Anim) has finished; the phase only depends on the micro clock."""
    pts = [(x, y, z) for (x, y) in pts2d]
    L = sum((Vector(pts[j + 1]) - Vector(pts[j])).length for j in range(len(pts) - 1))
    dense = [pts[0]]                       # resample so the taper (comet trail) is smooth
    for a, b in zip(pts[:-1], pts[1:]):
        a, b = Vector(a), Vector(b)
        k = max(int((b - a).length / 2.0), 1)
        dense += [tuple(a.lerp(b, s / k)) for s in range(1, k + 1)]
    t0 = (src.t0 + src.dur) if src is not None else 0.0
    for i in range(n):
        po = curve("%s_%d" % (name, i), dense, r, "pulse", cat="pulse")
        po.data.taper_object = pulse_taper()
        po.data.use_map_taper = True
        anim(po, "pulse", t0, 1, period=LOOP * n, length=min(26.0 / L, 0.3),
             phase=i / n, after=src)


TAPER = {}


def pulse_taper():
    """Comet profile for pulse trails: thin tail -> full head (mapped onto the lit window)."""
    ob = TAPER.get("ob")
    if ob is None:
        cu = bpy.data.curves.new("pulse_taper", "CURVE")
        cu.dimensions = "2D"
        sp = cu.splines.new("POLY")
        prof = [(0.0, 0.06), (0.3, 0.16), (0.6, 0.34), (0.82, 0.62), (0.95, 1.0), (1.0, 0.85)]
        sp.points.add(len(prof) - 1)
        for i, (x, y) in enumerate(prof):
            sp.points[i].co = (x, y, 0.0, 1.0)
        ob = bpy.data.objects.new("pulse_taper", cu)
        SCENE.collection.objects.link(ob)
        TAPER["ob"] = ob
    return ob


def trench(name, pts2d, t0, dur=12):
    """Buried power-cable route: flush concrete cover strip, 0.8 m wide, drawn along its path."""
    ob = curve(name, [(x, y, 0.4) for (x, y) in pts2d], 0.4, "clay2", t0, dur, cat="trench",
               path=[c for p in pts2d for c in p], embedded_ok=1)
    ob.data.bevel_resolution = 0
    ob.scale = (1.0, 1.0, 0.0375)
    for (x0, y0), (x1, y1) in zip(pts2d[:-1], pts2d[1:]):
        occupy(min(x0, x1), min(y0, y1), max(x0, x1), max(y0, y1), 0.6)
        TRENCHES.append((min(x0, x1) - 0.4, min(y0, y1) - 0.4, max(x0, x1) + 0.4, max(y0, y1) + 0.4))
    return ob


def tank(name, x, y, t0, r=3.2, h=11.0, mode="rise", src=None, parent=""):
    g = VCFG.get("glow_tanks", True)
    me = proto("tank_%.1f_%.1f_%d" % (r, h, g), lambda: p_tank(r, h, g))
    ob = inst(name, me, x, y, PAD_Z, 0, cat="tank", sprout_from=parent)
    if mode == "rise":
        anim(ob, "rise", t0, 12)
    else:
        anim(ob, "slide", t0, 14, src=src, s0=0.96)
    occupy(x - r, y - r, x + r, y + r, 0.8)
    return ob


def pipe(name, p0, p1, t0, r=0.3):
    mb = MB()
    mb.tube(p0, p1, r, "metal", seg=12)
    ob = place(mb.mesh(name), name, cat="rack", floating_ok=1)
    anim(ob, "pop", t0, 7, back=0.6)
    return ob


def trees(prefix, pts, t0, spread=6.0, species=None):
    """species: one name for avenues / hedgerows, None for mixed stands (pick_species)."""
    for i, (x, y) in enumerate(pts):
        sp = species or pick_species(x, y)
        v = RNG.randrange(3)
        me = proto("tree_%s%d" % (sp, v), lambda sp=sp, v=v: p_tree2(sp, v))
        if species:
            s = 0.85 + RNG.random() * 0.25
        elif sp in ("spruce", "pine", "birch"):
            s = 0.62 + RNG.random() * 0.62           # wide size range in mixed stands
        else:
            s = 0.7 + RNG.random() * 0.42
        ob = inst("%s_%d" % (prefix, i), me, x, y, 0, RNG.random() * 6.28, s, cat="tree")
        anim(ob, "pop", t0 + RNG.random() * spread, 9, back=1.8)
        occupy(x - 0.5, y - 0.5, x + 0.5, y + 0.5)


TREE_CLEAR = 4.2


def tree_line(x0, y0, x1, y1, step, jitter=0.6):
    d = Vector((x1 - x0, y1 - y0))
    n = max(int(d.length / step), 1)
    out = []
    for i in range(n + 1):
        p = Vector((x0, y0)) + d * (i / n)
        x, y = p.x + RNG.uniform(-jitter, jitter), p.y + RNG.uniform(-jitter, jitter)
        if is_free(x, y, TREE_CLEAR) and all((x - a) ** 2 + (y - b) ** 2 > 12.0 for (a, b) in out):
            out.append((x, y))
    for (x, y) in out:
        occupy(x - 0.5, y - 0.5, x + 0.5, y + 0.5)
    return out


def tree_area(x0, y0, x1, y1, n, dens_seed=0.0, thresh=-0.1, frame=True, d2=12.0):
    out, grid = [], {}
    tries = 0
    while len(out) < n and tries < n * 40:
        tries += 1
        x, y = RNG.uniform(x0, x1), RNG.uniform(y0, y1)
        if noise.noise(Vector((x * 0.03 + dens_seed, y * 0.03, 0.5))) < thresh:
            continue
        if frame and not in_frame(x, y):
            continue
        if not is_free(x, y, TREE_CLEAR):
            continue
        gx, gy = int(x // 4.0), int(y // 4.0)
        if any((x - a) ** 2 + (y - b) ** 2 < d2 for i in (-1, 0, 1) for j in (-1, 0, 1)
               for (a, b) in grid.get((gx + i, gy + j), ())):
            continue
        out.append((x, y))
        grid.setdefault((gx, gy), []).append((x, y))
    for (x, y) in out:
        occupy(x - 0.5, y - 0.5, x + 0.5, y + 0.5)
    return out


def in_frame(x, y, margin=0.0):
    u = (x + y) / math.sqrt(2)
    v = (-x + y) / math.sqrt(2)
    return abs(u - CAM_U) < 108 + margin and -135 - margin < v - CAM_V < 135 + margin


def cars(prefix, x0, y0, x1, y1, t0, fill=0.7):
    """Parking lot with stall markings, cars nose-in along the two stall rows."""
    mb = MB()
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    hx, hy = (x1 - x0) / 2, (y1 - y0) / 2
    mb.box(-hx, -hy, 0, hx, hy, 0.05, "road")
    rows = [-hy + 2.8, hy - 2.8]
    lines = []
    for ry in rows:
        x = -hx + 1.0
        while x < hx - 1.0:
            mb.box(x - 0.06, ry - 2.6, 0.05, x + 0.06, ry + 2.6, 0.062, "mark")
            lines.append(x)
            x += 2.7
    mb.box(-hx + 0.3, -hy + 0.3, 0.05, hx - 0.3, -hy + 0.42, 0.062, "mark")   # lot edge lines
    mb.box(-hx + 0.3, hy - 0.42, 0.05, hx - 0.3, hy - 0.3, 0.062, "mark")
    # light poles on the stall lines at the back of each row (between cars, clear of the aisle)
    ux = sorted(set(lines))
    for xl in (ux[len(ux) // 3], ux[(2 * len(ux)) // 3]) if len(ux) >= 3 else ():
        for sy in (-1, 1):
            yp = sy * (hy - 0.36)
            mb.boxc(xl, yp, 0.05, 0.36, 0.36, 0.25, "clay2")
            mb.cyl(xl, yp, 0.3, 0.07, 6.0, "metal", seg=8, r2=0.05)
            mb.beam((xl, yp, 6.2), (xl, yp - sy * 1.0, 6.25), 0.06)
            mb.boxc(xl, yp - sy * 1.1, 6.1, 0.3, 0.5, 0.12, "clay")
    lot = place(mb.mesh(prefix + "_lot"), prefix + "_lot", (cx, cy, 0), cat="lot",
                rect=[x0, y0, x1, y1], top=0.05)
    anim(lot, "grow_xy", t0, 9)
    occupy(x0, y0, x1, y1)
    PLOTS.append((x0, y0, x1, y1))
    me = proto("car", p_car)
    k = 0
    for ry in rows:
        x = -hx + 1.0 + 1.35
        while x < hx - 1.5:
            if RNG.random() < fill:
                c = inst("%s_car%d" % (prefix, k), me, cx + x, cy + ry, 0.05,
                         math.pi / 2 + (0 if RNG.random() < 0.5 else math.pi), 1.0, bevel=0.15,
                         cat="vehicle", stall=1)
                anim(c, "pop", t0 + 4 + RNG.random() * 6, 7)
                k += 1
            x += 2.7


def streetlights(prefix, road_name, x0, y0, x1, y1, step, side_rot, t0):
    """Poles on the verge, arm over the road; skipped near other roads, junctions, plots."""
    d = Vector((x1 - x0, y1 - y0))
    n = max(int(d.length / step), 1)
    me = proto("streetlight", p_streetlight)
    k = 0
    for i in range(n + 1):
        p = Vector((x0, y0)) + d * (i / n)
        if not in_frame(p.x, p.y, 10):
            continue
        if any(r[0] - 2.5 <= p.x <= r[2] + 2.5 and r[1] - 2.5 <= p.y <= r[3] + 2.5
               for (r, nm) in ROADS if nm != road_name):
            continue
        if any(r[0] - 1.0 <= p.x <= r[2] + 1.0 and r[1] - 1.0 <= p.y <= r[3] + 1.0
               for r in PLOTS + CORRIDORS):
            continue
        if any(r[0] - 0.2 <= p.x <= r[2] + 0.2 and r[1] - 0.2 <= p.y <= r[3] + 0.2
               for r in TRENCHES):
            continue
        ob = inst("%s_%d" % (prefix, k), me, p.x, p.y, 0, side_rot, cat="streetlight")
        anim(ob, "rise", t0 + i * 0.35, 8, back=0.5)
        occupy(p.x - 0.5, p.y - 0.5, p.x + 0.5, p.y + 0.5)
        k += 1


TRENCHES = []


def energy_centre(name, cx, cy, t0):
    """On-site gas-turbine energy centre: hall, HRSG blocks, two stacks, export gantry."""
    pad(name + "_pad", cx - 17, cy - 23.5, cx + 19, cy + 22, t0 - 2, role="plant")
    hall(name + "_hall", cx - 4, cy - 9.5, 24, 15, 14.0, math.pi / 2, t0, roof="none")
    mb = MB()
    for dx in (-6.0, 6.0):
        x, y = dx, 10.0
        mb.box(x - 2.6, y - 7, 0, x + 2.6, y + 7, 12.5, "clay")
        mb.box(x - 2.8, y - 7.2, 12.5, x + 2.8, y + 7.2, 13.1, "clay2")
        for z in (3.0, 6.0, 9.0):
            mb.box(x - 2.65, y - 7.05, z, x + 2.65, y + 7.05, z + 0.25, "clay2")
        mb.box(x - 1.6, y - 9.5, 4.0, x + 1.6, y - 7.0, 8.0, "clay")
    ob = place(mb.mesh(name + "_hrsg"), name + "_hrsg", (cx, cy, PAD_Z), bevel=0.06,
               cat="building", attached=name + "_hall")
    anim(ob, "rise", t0 + 4, 12)
    H = VCFG.get("stack_h", 55.0)                   # stack height varies per campus variant
    for i, dx in enumerate((-6.0, 6.0)):
        sb = MB()
        sb.cyl(0, 0, 0, 3.0, 1.2, "clay2", seg=36)
        sb.cyl(0, 0, 1.2, 2.3, H - 1.2, "clay", seg=36, r2=1.75)
        rr_ = lambda z: 2.3 - 0.55 * (z - 1.2) / (H - 1.2)
        for z in [H * f for f in (0.25, 0.44, 0.62, 0.8)]:
            sb.cyl(0, 0, z, rr_(z) + 0.12, 0.6, "clay2", seg=36)
        sb.cyl(0, 0, H - 0.9, 1.95, 0.9, "clay2", seg=36)
        sb.cyl(0, 0, H, 1.6, 0.05, "trim", seg=36, smooth=False)
        zps = (H * 0.55, H * 0.87)
        for zp in zps:                              # service platforms with guard rails
            sb.cyl(0, 0, zp, 2.75, 0.2, "clay2", seg=36)
            sb.ring(0, 0, zp + 1.1, 2.68, 0.06, "metal", n=28)
            for a in range(14):
                aa = a * 2 * math.pi / 14
                sb.beam((math.cos(aa) * 2.68, math.sin(aa) * 2.68, zp + 0.2),
                        (math.cos(aa) * 2.68, math.sin(aa) * 2.68, zp + 1.1), 0.05, "metal")
        for s in (-1, 1):                           # access ladder on the stack face
            sb.beam((s * 0.25, -rr_(1.2) - 0.15, 1.2), (s * 0.25, -rr_(zps[1]) - 0.15, zps[1]),
                    0.06, "metal")
        so = place(sb.mesh(name + "_stack%d" % i), name + "_stack%d" % i,
                   (cx + dx, cy + 17.0, PAD_Z), cat="building", attached=name + "_hrsg")
        anim(so, "rise", t0 + 9 + i * 1.5, 14, back=0.5)
        for j, sx in enumerate((-1.75, 1.75)):      # obstruction lights, breathing on the loop
            bo = inst("%s_bcn%d_%d" % (name, i, j), proto("beacon", p_beacon), cx + dx + sx,
                      cy + 17.0, PAD_Z + H + 0.05, cat="glass", parent=name + "_stack%d" % i)
            anim(bo, "breathe", t0 + 9 + i * 1.5 + 14, 6, amp=0.35, phase=0.5 * j + 0.25 * i)
    gx, gy = cx + 16, cy + 5
    g = inst(name + "_gantry", proto("gantry", p_gantry), gx, gy, PAD_Z, 0, cat="gantry",
             attach=[c for p in gantry_points(gx, gy) for c in p])
    anim(g, "rise", t0 + 7, 11, back=0.7)
    bb = MB()
    for j in range(2):
        ty = cy + 2 + j * 6
        tr = inst("%s_tr%d" % (name, j), proto("transformer", p_transformer), cx + 12.5,
                  ty, PAD_Z, math.pi / 2, bevel=0.04, cat="equip")
        anim(tr, "rise", t0 + 6 + j, 10)
        bb.beam((cx + 12.5, ty, PAD_Z + 3.9), (cx + 12.5, ty, PAD_Z + 6.5), 0.12, "metal")
        bb.beam((cx + 12.5, ty, PAD_Z + 6.5), (gx, ty, PAD_Z + 6.5), 0.08)
    bo = place(bb.mesh(name + "_bus"), name + "_bus", (0, 0, 0), cat="bus", floating_ok=1)
    anim(bo, "pop", t0 + 12, 8, back=0.6)
    return (gx, gy)


def office(name, cx, cy, t0):
    """Operations / NOC building: two storeys with ribbon windows and a roof plant."""
    mb = MB()
    L, W = 20.0, 13.0
    mb.box(-L / 2 - 0.3, -W / 2 - 0.3, 0, L / 2 + 0.3, W / 2 + 0.3, 0.5, "clay2")
    mb.box(-L / 2, -W / 2, 0, L / 2, W / 2, 8.2, "clay")
    for z in (1.4, 4.9):
        mb.box(-L / 2 + 0.8, -W / 2 - 0.05, z, L / 2 - 0.8, -W / 2, z + 1.9, "trim")
        mb.box(L / 2, -W / 2 + 0.8, z, L / 2 + 0.05, W / 2 - 0.8, z + 1.9, "trim")
    for i in range(1, 8):
        x = -L / 2 + i * L / 8
        mb.box(x - 0.15, -W / 2 - 0.25, 0.5, x + 0.15, -W / 2, 8.2, "clay")
    mb.box(-L / 2 - 0.1, -W / 2 - 0.1, 8.2, L / 2 + 0.1, W / 2 + 0.1, 8.9, "clay")
    mb.box(-L / 2 + 1, -W / 2 - 2.5, 3.2, -L / 2 + 7, -W / 2, 3.5, "clay")
    mb.box(-3, -2, 8.9, 4, 3, 10.2, "clay2")
    ob = place(mb.mesh(name), name, (cx, cy, 0), bevel=0.06, cat="building", roof_h=8.9,
               roof_rect=[-L / 2, -W / 2, L / 2, W / 2], roof_core=[-3, -2, 4, 3])
    anim(ob, "rise", t0, 12)
    occupy(cx - L / 2 - 3, cy - W / 2 - 3, cx + L / 2 + 1, cy + W / 2 + 1)
    PLOTS.append((cx - L / 2 - 1, cy - W / 2 - 3, cx + L / 2 + 1, cy + W / 2 + 1))
    for i in range(3):
        u = inst("%s_ahu%d" % (name, i), proto("ahu", p_ahu), cx - 6 + i * 5.5, cy + 4.6, 8.9,
                 0, bevel=0.04, cat="roof", parent=name)
        anim(u, "pop", t0 + 10 + i, 8)


def bess(name, x0, y0, x1, y1, t0):
    """Battery energy storage yard: rows of containers with HVAC units."""
    pad(name + "_pad", x0, y0, x1, y1, t0, role="storage")
    mb = MB()
    mb.boxc(0, 0, 0, 12.2, 2.6, 0.3, "clay2")
    mb.boxc(0, 0, 0.3, 12.0, 2.45, 2.6, "clay")
    for i in range(5):
        mb.boxc(-4.8 + i * 2.4, -1.25, 0.6, 1.9, 0.04, 2.0, "trim")
    for i in range(3):
        mb.boxc(-4 + i * 4, 0, 2.9, 1.6, 1.6, 0.6, "clay2")
        mb.cyl(-4 + i * 4, 0, 3.5, 0.6, 0.03, "trim", seg=14, smooth=False)
    me = mb.mesh("bess_unit")
    k = 0
    y = y0 + 4
    while y < y1 - 3:
        x = x0 + 8.5
        while x < x1 - 6:
            u = inst("%s_%d" % (name, k), me, x, y, PAD_Z, 0, bevel=0.04, cat="equip")
            anim(u, "rise", t0 + 3 + k * 0.35, 9)
            k += 1
            x += 13.5
        y += 5.2


# --------------------------------------------------------------------------- camera
CAM_ELEV = 35.0
CAM_YAW = 45.0
CAM_U, CAM_V = 2.0, 12.0  # frame centre in screen-aligned ground coords
ORTHO = ARGS.ortho or 204.0


def setup_camera():
    cam = bpy.data.cameras.new("Cam")
    cam.type = "ORTHO"
    cam.ortho_scale = ORTHO
    cam.clip_end = 3000
    ob = bpy.data.objects.new("Cam", cam)
    COLL.objects.link(ob)
    tx = (CAM_U - CAM_V) / math.sqrt(2)
    ty = (CAM_U + CAM_V) / math.sqrt(2)
    target = Vector((tx, ty, 0))
    if ARGS.topview:
        ob.rotation_euler = (0, 0, math.radians(CAM_YAW))
        ob.location = target + Vector((0, 0, 500))
        cam.ortho_scale = 340
    else:
        ob.rotation_euler = (math.radians(90 - CAM_ELEV), 0, math.radians(CAM_YAW))
        back = ob.rotation_euler.to_matrix() @ Vector((0, 0, 1))
        ob.location = target + back * 800
    SCENE.camera = ob


# --------------------------------------------------------------------------- world / render
def setup_world_and_render():
    world = bpy.data.worlds.new("World")
    SCENE.world = world
    try:
        world.use_nodes = True
    except Exception:
        pass
    bg = world.node_tree.nodes.get("Background")
    bg.inputs["Color"].default_value = (*TH["world"][0], 1.0)
    bg.inputs["Strength"].default_value = TH["world"][1]

    sun = bpy.data.lights.new("Sun", "SUN")
    sun.energy, ang = TH["sun"]
    sun.angle = math.radians(ang)
    sun.color = (1.0, 0.98, 0.95) if ARGS.theme == "light" else (0.85, 0.9, 1.0)
    so = bpy.data.objects.new("Sun", sun)
    COLL.objects.link(so)
    toward = Vector((-0.55, -1.0, 0.95)).normalized()
    so.rotation_euler = toward.to_track_quat("Z", "Y").to_euler()
    if ARGS.theme == "dark":
        rim = bpy.data.lights.new("Rim", "SUN")
        rim.energy = 1.6
        rim.angle = math.radians(20)
        rim.color = (0.55, 0.7, 1.0)
        ro = bpy.data.objects.new("Rim", rim)
        COLL.objects.link(ro)
        ro.rotation_euler = Vector((0.6, 1.0, 0.55)).normalized().to_track_quat("Z", "Y").to_euler()

    r = SCENE.render
    r.engine = "CYCLES"
    w, h = (int(v) for v in ARGS.res.lower().split("x"))
    r.resolution_x, r.resolution_y, r.resolution_percentage = w, h, 100
    r.image_settings.file_format = "PNG"
    r.image_settings.color_depth = "8"
    r.use_persistent_data = True
    r.fps = FPS
    cy = SCENE.cycles
    prefs = bpy.context.preferences.addons["cycles"].preferences
    dev = "NONE"
    for t in ("OPTIX", "CUDA"):
        try:
            prefs.compute_device_type = t
            prefs.get_devices()
            ok = False
            for d in prefs.devices:
                d.use = d.type == t
                ok = ok or d.use
            if ok:
                dev = t
                break
        except Exception:
            continue
    cy.device = "GPU" if dev != "NONE" else "CPU"
    print("RENDER DEVICE", dev)
    cy.samples = ARGS.samples
    cy.seed = 0
    cy.use_animated_seed = False
    cy.use_adaptive_sampling = True
    cy.adaptive_threshold = 0.015
    cy.use_denoising = True
    try:
        cy.denoiser = "OPENIMAGEDENOISE"
        cy.denoising_use_gpu = True
    except Exception:
        pass
    cy.max_bounces = 6
    cy.diffuse_bounces = 3
    cy.glossy_bounces = 2
    cy.transmission_bounces = 2
    cy.caustics_reflective = False
    cy.caustics_refractive = False
    cy.blur_glossy = 1.0
    vs = SCENE.view_settings
    vs.view_transform = "AgX"
    try:
        vs.look = "AgX - Base Contrast" if ARGS.theme == "light" else "AgX - Medium High Contrast"
    except Exception:
        pass
    vs.exposure = TH["exposure"]

    # compositor: gentle bloom on the blue accents
    tree = bpy.data.node_groups.new("Comp", "CompositorNodeTree")
    tree.interface.new_socket(name="Image", in_out="OUTPUT", socket_type="NodeSocketColor")
    rl = tree.nodes.new("CompositorNodeRLayers")
    gl = tree.nodes.new("CompositorNodeGlare")
    out = tree.nodes.new("NodeGroupOutput")
    try:
        gl.inputs["Type"].default_value = "Bloom"
    except Exception as e:
        print("glare type", e)
    gl.inputs["Threshold"].default_value = TH["bloom"][0]
    gl.inputs["Strength"].default_value = TH["bloom"][1]
    gl.inputs["Size"].default_value = 0.6
    tree.links.new(rl.outputs["Image"], gl.inputs["Image"])
    tree.links.new(gl.outputs[0], out.inputs[0])
    SCENE.compositing_node_group = tree
    r.use_compositing = True


# --------------------------------------------------------------------------- layout
# Site plan (metres, +x east, +y north). Camera looks from the south-east.
#   RN1  north-south main road x=16 (L1)       RE2  east-west main road y=60 (L4)
#   HW   east-west highway y=-48 (L5)           RW   north-south road x=-64 (L5)
#   A_int access road y=5.5 with a turning area at its west end (L3)
# Every crossing has a junction; every plot has a drive; power and data run in trenches,
# overhead lines leave the substations in straight equal-span runs toward the east.
#
# Campus variants (Maximal grid): variant 0 is the hero campus (animated, validated per level);
# variants 1-4 are static builds of the same tile with other plots. The tile trunk -- roads RN1,
# RE2, RW, HW, backbones F0, F5, substations, switchyards and overhead lines -- is identical in
# every variant, so roads and backbones still meet exactly on the tile borders.
VARIANTS = {
    0: dict(seed=11, hb2=True, c_halls=3, solar=True, tank_farm=True, bess=True, wind=True,
            glow_tanks=True, campus_d=0, woods=380, mega=("Z1", "Z4", "Z5")),
    1: dict(seed=23, hb2=True, c_halls=2, solar=True, tank_farm=False, bess=True, wind=False,
            glow_tanks=False, campus_d=2, woods=460, stack_h=42.0,
            mega=("Z1", "Z2", "Z3", "Z4", "Z5")),
    2: dict(seed=37, hb2=False, c_halls=3, solar=False, tank_farm=True, bess=False, wind=True,
            glow_tanks=False, campus_d=3, woods=420, stack_h=60.0,
            mega=("Z1", "Z3", "Z4", "Z5", "Z6")),
    3: dict(seed=51, hb2=True, c_halls=0, solar=False, tank_farm=True, bess=True, wind=True,
            glow_tanks=False, campus_d=0, woods=520, stack_h=48.0,
            mega=("Z1", "Z3", "Z4", "Z5", "Z6")),
    4: dict(seed=67, hb2=True, c_halls=3, solar=False, tank_farm=False, bess=True, wind=True,
            glow_tanks=False, campus_d=2, woods=440, stack_h=38.0,
            mega=("Z1", "Z3", "Z4", "Z5", "Z6")),
}
VCFG = VARIANTS[0]
VARIANT_COLLS = {}
HERO_STYLE = {
    "S1": dict(bay=3.2, band="louvre", ladder=False),
    "HA1": dict(bay=3.6, band="louvre"),
    "HA2": dict(bay=4.5, band="slots", screen=True),
    "HB1": dict(bay=5.0, band="ribbon", roof="condensers"),
    "HB2": dict(bay=5.0, band="ribbon", roof="condensers", screen=True),
    "HC1": dict(bay=4.0, band="slots", roof="mixed"),
    "HC2": dict(bay=4.0, band="louvre", roof="mixed", screen=True),
    "HC3": dict(bay=6.0, band="slots", roof="mixed"),
    "HD1": dict(bay=4.5, band="ribbon", roof="chillers", screen=True),
    "HD2": dict(bay=4.5, band="slots", roof="condensers"),
    "HD3": dict(bay=6.0, band="louvre", roof="mixed"),
}


def hs(name, h):
    """(height, style kwargs) of a hall: fixed on the hero campus (HA1 is seam 3), drawn per
    variant elsewhere so the hall module stops repeating across the grid."""
    st = dict(HERO_STYLE[name])
    if not PREFIX or name == "S1":
        return h, st
    rr = random.Random(VCFG["seed"] * 1000 + sum(ord(c) for c in name))
    st.update(bay=rr.choice((3.6, 4.0, 4.5, 5.0, 6.0)), band=rr.choice(("louvre", "slots", "ribbon")),
              roof=rr.choice(("chillers", "condensers", "mixed")), screen=rr.random() < 0.5)
    return rr.choice((9.5, 10.5, 11.5, 12.5, 13.5)), st


# hyperscale extensions (Maximal): pad rect, drive (from a trunk road edge to the pad edge),
# halls (cx, cy, L, W), generator row (x0, y)
MEGA = {
    "Z1": dict(rect=(64, 96, 180, 178), drive=((120, 64.5), (120, 96)),
               halls=[(122, 113, 108, 28), (122, 156, 108, 28)], gen=(80, 134.5)),
    "Z2": dict(rect=(-172, -36, -74, 52), drive=((-67.5, 16), (-74, 16)),
               halls=[(-123, -20, 90, 24), (-123, 34, 90, 24)], gen=(-160, 4.5)),
    "Z3": dict(rect=(-172, -158, -74, -63), drive=((-67.5, -110), (-74, -110)),
               halls=[(-123, -82, 90, 26), (-123, -138, 90, 26)], gen=(-160, -110)),
    "Z4": dict(rect=(104, -158, 200, -63), drive=((150, -55.5), (150, -63)),
               halls=[(152, -82, 86, 26), (152, -138, 86, 26)], gen=(118, -110)),
    "Z5": dict(rect=(210, -36, 272, 52), drive=((241, 55.5), (241, 52)),
               halls=[(241, -22, 52, 22), (241, 7, 52, 22), (241, 36, 52, 22)], gen=None),
    "Z6": dict(rect=(44, -158, 100, -63), drive=((72, -55.5), (72, -63)),
               halls=[(72, -82, 50, 26), (72, -138, 50, 26)], gen=(58, -110)),
}


def mega_zone(tag, t0):
    """A hyperscale data campus: drive first, then the fenced pad, big halls with merged chiller
    arrays, a generator row; the halls glow at the roof edge and the pad gets a halo."""
    z = MEGA[tag]
    (dx0, dy0), (dx1, dy1) = z["drive"]
    road("drive_" + tag, dx0, dy0, dx1, dy1, 6, "drive", t0, 5)
    x0, y0, x1, y1 = z["rect"]
    pad(tag, x0, y0, x1, y1, t0 + 1, role="dc")
    rr = random.Random(VCFG["seed"] * 31 + sum(ord(c) for c in tag))
    for i, (cx, cy, L, W) in enumerate(z["halls"]):
        hall("%s_H%d" % (tag, i), cx, cy, L, W, rr.choice((13.0, 14.0, 15.0, 16.0)), 0,
             t0 + 3 + i * 2, roof="array", dur=12, fed_by="SS2_pad", unit_gap=0.8,
             bay=rr.choice((4.5, 5.0, 6.0)), band=rr.choice(("louvre", "slots", "ribbon")),
             screen=rr.random() < 0.5)
    if z["gen"]:
        gen_row(tag + "_gen", z["gen"][0], z["gen"][1], 3, t0 + 6)


def reset_layout():
    for lst in (OCC, PLOTS, ROADS, CORRIDORS, TRENCHES, DRIVES, FENCE_JOBS):
        lst.clear()
    HALLS.clear()


def build_world():
    """Hero campus (animated) + static campus variants 1-4 for the Maximal grid."""
    global COLL, PREFIX, STATIC, VCFG, RNG
    ground_shader(MATS[M["ground"]])
    road_shader(MATS[M["road"]])
    wab_shaders()
    place(ground_mesh(), "ground", cat="ground")
    build_campus()
    hero, hero_rng = COLL, RNG
    for k in sorted(VARIANTS):
        if k == 0:
            continue
        coll = bpy.data.collections.new("Campus_v%d" % k)
        COLL, PREFIX, STATIC, VCFG = coll, "v%d_" % k, True, VARIANTS[k]
        RNG = random.Random(VCFG["seed"])
        reset_layout()
        build_campus()
        VARIANT_COLLS[k] = coll
    COLL, PREFIX, STATIC, VCFG, RNG = hero, "", False, VARIANTS[0], hero_rng


ENVELOPE = (-190.0, -172.0, 280.0, 192.0)       # tile content incl. woods, plus a margin
TRUNK_X = (16.0, -64.0, 9.5)                    # RN1, RW, F0 (run north-south through tiles)
TRUNK_Y = (60.0, -48.0, -58.0)                  # RE2, HW, F5 (run east-west)


def relief(x, y):
    """Gentle terrain height (0..~3.5 m) in the open land between campuses. Exactly 0 inside each
    tile's content envelope and along the trunk roads / backbones, so everything that is
    ground-checked still stands on z = 0."""
    DX, DY = NODE_X1 - NODE_X0, NODE_Y1 - NODE_Y0
    lx = (x - NODE_X0) % DX + NODE_X0
    ly = (y - NODE_Y0) % DY + NODE_Y0

    def ss(a, b, v):
        t = min(max((v - a) / (b - a), 0.0), 1.0)
        return t * t * (3 - 2 * t)
    d_env = max(ENVELOPE[0] - lx, lx - ENVELOPE[2], ENVELOPE[1] - ly, ly - ENVELOPE[3])
    m = ss(0.0, 45.0, d_env)
    if m <= 0.0:
        return 0.0
    m *= ss(12.0, 40.0, min(abs(lx - c) for c in TRUNK_X))
    m *= ss(12.0, 40.0, min(abs(ly - c) for c in TRUNK_Y))
    if m <= 0.0:
        return 0.0
    n = 0.7 * noise.noise(Vector((x / 230.0, y / 230.0, 0.37))) + \
        0.3 * noise.noise(Vector((x / 95.0, y / 95.0, 1.9)))
    return m * 3.5 * min(max(0.5 + 0.6 * n, 0.0), 1.0)


def ground_mesh(step=10.0):
    """Ground: a 10 m grid over the 5 x 5 tile region with gentle relief between the campuses,
    on top of a far-reaching flat slab (its top 2 cm lower, so they never z-fight)."""
    DX, DY = NODE_X1 - NODE_X0, NODE_Y1 - NODE_Y0
    x0, x1 = NODE_X0 - 2 * DX, NODE_X1 + 2 * DX
    y0, y1 = NODE_Y0 - 2 * DY, NODE_Y1 + 2 * DY
    nx, ny = int((x1 - x0) / step), int((y1 - y0) / step)
    bm = bmesh.new()
    vs = [[bm.verts.new((x0 + i * (x1 - x0) / nx, y0 + j * (y1 - y0) / ny, 0.0))
           for i in range(nx + 1)] for j in range(ny + 1)]
    for row in vs:
        for v in row:
            v.co.z = relief(v.co.x, v.co.y)
    for j in range(ny):
        for i in range(nx):
            f = bm.faces.new((vs[j][i], vs[j][i + 1], vs[j + 1][i + 1], vs[j + 1][i]))
            f.material_index = M["ground"]
            f.smooth = True
    slab = bmesh.ops.create_cube(bm, size=1.0, matrix=Matrix.Translation((0, 0, -0.52)) @
                                 Matrix.Diagonal((12000.0, 12000.0, 1.0, 1.0)))
    for v in slab["verts"]:
        for fc in v.link_faces:
            fc.material_index = M["ground"]
    me = bpy.data.meshes.new("ground")
    bm.normal_update()
    bm.to_mesh(me)
    bm.free()
    for m in MATS:
        me.materials.append(m)
    return me


def tile_variant(i, j):
    """Variant of grid tile (i, j): the centre is the hero campus; the rest follow a 2 x 2
    pattern, so no two touching tiles (incl. diagonals) are the same campus."""
    if i == 0 and j == 0:
        return 0
    return 1 + (i % 2) * 2 + (j % 2)


_TILES = {"done": False}


def assign_tiles():
    """Point the Maximal grid instances (journey.py: node_i_j -> collection 'Campus') at the
    campus variants. Runs once, on the first apply_frame()."""
    if _TILES["done"] or not VARIANT_COLLS:
        return
    _TILES["done"] = True
    for ob in bpy.data.objects:
        if ob.instance_type != "COLLECTION" or not ob.name.startswith("node_"):
            continue
        if ob.instance_collection is None or ob.instance_collection.name != "Campus":
            continue
        try:
            i, j = (int(v) for v in ob.name.split("_")[1:3])
        except ValueError:
            continue
        k = tile_variant(i, j)
        if k in VARIANT_COLLS:
            ob.instance_collection = VARIANT_COLLS[k]


def build_campus():
    V = VCFG
    tree_jobs = []

    # ---------------------------------------------------------------- L1 Mini
    # road first, then the plot with its drive, power (kiosk + genset), the hall, roof plant
    road("RN1_n", 16, -16, 16, NODE_Y1, 9, "main", LV_START[1], 12, rid="RN1")
    road("RN1_s", 16, -16, 16, NODE_Y0, 9, "main", LV_START[1], 12, rid="RN1")
    road("drive_A0", 11.5, -16, 8, -16, 4, "drive", T(1, 0.1), 4)
    pad("A0", -24, -19.5, 8, 3, T(1, 0.15), role="dc")
    k = inst("A0_tr", proto("transformer", p_transformer), 0.5, -16.0, PAD_Z, 0, bevel=0.04)
    anim(k, "rise", T(1, 0.3), 9)
    gen_row("A0_gen", -15.0, -16.0, 1, T(1, 0.35))
    h, st = hs("S1", 6.5)
    hall("S1", -13, -7.5, 16, 10, h, 0, T(1, 0.4), dur=10, fed_by="A0_tr", unit_gap=0.5, **st)
    win = "trim" if PREFIX else "glass"     # only the hero campus is lit: Maximal focal point
    gl = MB()
    for i in range(4):
        x = -19.6 + i * 4.0
        gl.box(x, -12.62, 2.2, x + 1.4, -12.52, 4.6, win)
    go = place(gl.mesh("S1_glass"), "S1_glass", (0, 0, 0), cat="glass", parent="S1")
    anim(go, "rise", T(1, 0.6), 9)
    fiber("F0", [(9.5, NODE_Y0), (9.5, NODE_Y1)], T(1, 0.85), 8, pulses_n=10, trunk=True)
    fiber("F0b", [(-6.0, -1.9), (9.5, -1.9)], T(1, 0.9), 5, pulses_n=1)

    # ---------------------------------------------------------------- L2 Klein
    road("drive_SS1", 20.5, -7.25, 50, -7.25, 4, "drive", LV_START[2], 6)
    road("drive_SS1b", 48, -9.25, 48, -5.25, 4, "drive", LV_START[2] + 2, 3, rid="drive_SS1")
    substation("SS1", 43, -5.25, 57, 9, LV_START[2] + 1, n_tr=2, gantries=1)
    # database block extrudes out of S1's east wall
    mb = MB()
    mb.box(0, -4.5, 0, 9, 4.5, 9.5, "clay")
    mb.box(0, -4.6, 9.5, 9.2, 4.6, 10.3, "clay")
    for z in (2.0, 4.6, 7.2):
        mb.box(1.0, -4.62, z, 8.0, -4.5, z + 1.2, win)
        mb.box(9.0, -3.5, z, 9.12, 3.5, z + 1.2, win)
    for x in (2.6, 4.6, 6.6):
        mb.box(x, -4.75, 1.4, x + 0.25, -4.5, 9.5, "clay")
    mb.box(3.0, -2.0, 10.3, 7.0, 2.0, 11.4, "clay2")
    d1 = place(mb.mesh("D1"), "D1", (-5.0, -7.5, 0), bevel=0.06, cat="building",
               attached="S1", fed_by="SS1_pad", sprout_from="S1")
    anim(d1, "extrude", T(2, 0.2), 13)
    occupy(-5, -12.5, 4.5, -2.5)
    PLOTS.append((-5, -12.5, 4.5, -2.5))
    switchyard("GRID_S", 186, -8, 206, 48, [1.875, 38.0], LV_START[2], drive_to=55.5)
    line_chain("PyS", gantry_points(52.5, 1.875), LV_START[2] + 1 + 5 + 5.5, [80, 108, 136, 164],
               1.875, LV_START[2] + 3, LV_END[2], end_pts=gantry_points(192, 1.875))
    trench("TR_SS1", [(45, -5.25), (45, -9.875), (8, -9.875)], T(2, 0.6), 10)
    tree_jobs.append(("k_trees", lambda: tree_line(-28.5, -18, -28.5, 2, 3.8) +
                      tree_line(-22, -23.5, 6, -23.5, 4.0), T(2, 0.6), 6, "birch"))

    # ---------------------------------------------------------------- L3 Mittel
    road("A_int", 11.5, 5.5, -50.5, 5.5, 4.6, "sec", LV_START[3], 12)
    junction("J_A", 16, 5.5, 9, 4.6, 0.07,
             {"W": (4.6, 0.04), "N": (9, 0.07), "S": (9, 0.07)}, LV_START[3])
    turnaround("A_turn", -60.5, 0.5, -50.5, 10.5, LV_START[3] + 8, rid="A_int")
    road("drive_NOC", 11.5, -27, -8, -27, 5, "drive", LV_START[3] + 1, 8)
    pad("A1", -50, 8, 8, 52, LV_START[3] + 2, role="dc")
    h, st = hs("HA1", 9.5)            # seam 3: HA1 at (-22, 17.5), L36 W13 h9.5, rotation 0
    hall("HA1", -22, 17.5, 36, 13, h, 0, T(3, 0.12), dur=11, fed_by="SS1_pad", **st)
    h, st = hs("HA2", 11.0)
    hall("HA2", -22, 38.5, 36, 13, h, 0, T(3, 0.12) + 7, mode="slide", src=(-22, 17.5, 0),
         dur=8, fed_by="SS1_pad", sprout_from="HA1", **st)
    link_bridge("HA_link", "HA1", "HA2", 14.0, T(3, 0.12) + 7, 12)
    me = proto("chiller", p_chiller)
    k = 0
    for cx in (-0.6, 3.6):
        for i in range(6):
            u = inst("A_yard%d" % k, me, cx, 12.5 + i * 6.0, PAD_Z, 0, bevel=0.0 if STATIC else 0.04)
            anim(u, "pop", T(3, 0.35) + k * 0.45, 8)
            k += 1
    gen_row("A1_gen1", -34, 28.0, 3, T(3, 0.55))
    gen_row("A1_gen2", -34, 48.5, 3, T(3, 0.7))
    for i, y in enumerate((14.5, 26.5)):
        ht = inst("A_htank%d" % i, proto("htank", p_htank), -45, y, PAD_Z, math.pi / 2,
                  cat="tank")
        anim(ht, "rise", T(3, 0.5) + i, 10)
    cars("A_park", 21, -3.5, 39, 9.0, T(3, 0.3), fill=0.65)
    office("NOC", -38, -30, T(3, 0.2))
    cars("NOC_park", -24, -37, -8, -24, T(3, 0.35), fill=0.55)
    fiber("F1", [(0, -2.7), (0, 1.0), (3.2, 1.0), (3.2, 8.8), (-41.6, 8.8), (-41.6, 31.4)],
          T(3, 0.66), 12, pulses_n=2)
    tree_jobs.append(("m_trees", lambda: tree_line(-54, 12, -54, 50, 4.2) +
                      tree_line(-48, 56.5, 6, 56.5, 5.0), T(3, 0.5), 8, "lime"))
    tree_jobs.append(("m_trees2", lambda: tree_line(44, -2, 44, 8, 4.2), T(3, 0.55), 4, "birch"))

    # ---------------------------------------------------------------- L4 Gross
    road("RE2_w", 16, 60, NODE_X0, 60, 9, "main2", LV_START[4], 14, rid="RE2")
    road("RE2_e", 16, 60, NODE_X1, 60, 9, "main2", LV_START[4], 14, rid="RE2")
    junction("J_N", 16, 60, 9, 9, 0.09, {"E": (9, 0.09), "W": (9, 0.09), "N": (9, 0.07),
                                         "S": (9, 0.07)}, LV_START[4])
    road("drive_SS2", 20.5, 72, 24, 72, 4, "drive", LV_START[4] + 1, 4)
    substation("SS2", 24, 68, 54, 96, LV_START[4] + 2, n_tr=3, gantries=2, cols=2,
               keep_out=[(42.3, 87.8, 52.8, 95.3)])
    ctl = MB()
    ctl.box(-5, -3.5, 0, 5, 3.5, 4.2, "clay")
    ctl.box(-5.1, -3.6, 4.2, 5.1, 3.6, 4.7, "clay")
    for i in range(5):
        ctl.box(-4 + i * 1.8, -3.53, 1.5, -3.2 + i * 1.8, -3.5, 3.2, "trim")
    for i in range(3):                                   # roof condensers of the control room
        ctl.box(-3.6 + i * 2.6, 0.4, 4.7, -2.0 + i * 2.6, 2.4, 5.6, "clay2")
    co = place(ctl.mesh("SS2_ctl"), "SS2_ctl", (47.5, 91.5, PAD_Z), bevel=0.05, cat="building")
    anim(co, "rise", T(4, 0.2), 10)
    switchyard("GRID_N", 186, 70, 206, 94, [82.0], LV_START[4], drive_to=64.5)
    line_chain("PyN", gantry_points(49.5, 82), LV_START[4] + 2 + 5 + 5.5, [78, 106, 134, 162], 82,
               LV_START[4] + 4, LV_END[4], end_pts=gantry_points(192, 82))
    ec_g = energy_centre("EC", 38, 33, T(4, 0.15))
    line_chain("PyE", gantry_points(*ec_g), T(4, 0.15) + 7 + 5.5, [78, 106, 134, 162], 38,
               LV_START[4] + 5, LV_END[4], end_pts=gantry_points(192, 38))
    # chilled-water / heat-recovery pipe bridge from the energy centre over RN1 into HA1
    pipe_bridge("PB_EC", -4.1, 26.4, 22.0, 7.0, [1.5, 6.6, 22.8], T(4, 0.42),
                attached="HA1,EC_hall")
    pad("B", -50, 66, 8, 116, T(4, 0.05), role="dc")
    h, st = hs("HB1", 11.5)
    hall("HB1", -24, 76, 40, 15, h, 0, T(4, 0.15), dur=10, fed_by="SS2_pad", **st)
    if V["hb2"]:
        h, st = hs("HB2", 13.0)
        hall("HB2", -24, 99, 40, 15, h, 0, T(4, 0.15) + 6, mode="slide", src=(-24, 76, 0),
             dur=6, fed_by="SS2_pad", sprout_from="HB1", unit_gap=0.6, **st)
        link_bridge("HB_link", "HB1", "HB2", 16.0, T(4, 0.15) + 6, 10)
    cell = proto("ct_cell", p_ct_cell)
    blades = proto("fan_blades", p_fan_blades)
    for i in range(5):
        y = 71.5 + i * 8.7
        c = inst("B_ct%d" % i, cell, 2.5, y, PAD_Z, 0, bevel=0.05)
        anim(c, "rise", T(4, 0.3) + i * 1.1, 10)
        b = inst("B_fan%d" % i, blades, 2.5, y, PAD_Z + 9.6, RNG.random(), cat="fan",
                 parent="B_ct%d" % i)
        anim(b, "pop", T(4, 0.3) + i * 1.1 + 8, 6)
        anim(b, "spin", 0, 1, speed=spin_speed(6, 2 + i % 2))
    gen_row("B_gen", -38, 87.5, 3, T(4, 0.55))
    tank("TB0", -42, 111.5, T(4, 0.45), r=2.4, h=9.0)
    tank("TB1", -35, 111.5, T(4, 0.45) + 7, r=2.4, h=9.0, mode="slide", src=(-42, 111.5, PAD_Z),
         parent="TB0")
    pipe("TB_pipe", (-42 + 2.0, 112.7, PAD_Z + 2.2), (-35 - 2.0, 112.7, PAD_Z + 2.2),
         T(4, 0.45) + 14)
    trench("TR_SS2", [(24, 90), (8, 90)], T(4, 0.5), 8)
    trench("TR_EC", [(21, 30), (8, 30)], T(4, 0.6), 8)
    fiber("F2", [(-5, 45.6), (-5, 67.9)], T(4, 0.5), 10, pulses_n=1)
    tree_jobs.append(("g_trees", lambda: tree_line(-54, 66, -54, 116, 4.2) +
                      tree_line(-50, 120, 8, 120, 4.5), T(4, 0.5), 9, "poplar"))
    tree_jobs.append(("g_wood", lambda: tree_area(22, 98, 70, 125, 14, 3.0, -0.25), T(4, 0.55),
                      8, None))

    # ---------------------------------------------------------------- L5 Maximal
    road("HW_w", 16, -48, NODE_X0, -48, 15, "hwy", LV_START[5], 14, rid="HW")
    road("HW_e", 16, -48, NODE_X1, -48, 15, "hwy", LV_START[5], 14, rid="HW")
    junction("J_S", 16, -48, 9, 15, 0.11, {"E": (15, 0.11), "W": (15, 0.11), "N": (9, 0.07),
                                           "S": (9, 0.07)}, LV_START[5])
    road("RW_n", -64, 60, -64, NODE_Y1, 7, "main", T(5, 0.05), 10, rid="RW")
    road("RW_s", -64, 60, -64, NODE_Y0, 7, "main", T(5, 0.05), 14, rid="RW")
    junction("J_RW_N", -64, 60, 7, 9, 0.09, {"E": (9, 0.09), "W": (9, 0.09), "N": (7, 0.07),
                                             "S": (7, 0.07)}, T(5, 0.05))
    junction("J_RW_A", -64, 5.5, 7, 4.6, 0.07, {"E": (4.6, 0.04), "N": (7, 0.07), "S": (7, 0.07)},
             T(5, 0.05) + 3)
    junction("J_RW_S", -64, -48, 7, 15, 0.11, {"E": (15, 0.11), "W": (15, 0.11), "N": (7, 0.07),
                                               "S": (7, 0.07)}, T(5, 0.05) + 5)
    nc = V["c_halls"]
    if nc:
        # solar substation feeds campus C, before its halls rise
        road("drive_SSP", 20.5, -101, 24, -101, 4, "drive", LV_START[5], 4)
        substation("SSP", 24, -108, 40, -98, LV_START[5], n_tr=1, gantries=0)
        road("drive_C", -20, -55.5, -20, -60, 5, "drive", LV_START[5] + 2, 4)
        pad("C", -56, -122, 8, -60, LV_START[5] + 2, role="dc")
        h, st = hs("HC1", 10.5)
        hall("HC1", -26, -70, 44, 14, h, 0, T(5, 0.05), dur=10, fed_by="SSP_pad", unit_gap=0.5,
             **st)
        if nc >= 2:
            h, st = hs("HC2", 12.0)
            hall("HC2", -26, -91, 44, 14, h, 0, T(5, 0.05) + 6, mode="slide", src=(-26, -70, 0),
                 dur=6, fed_by="SSP_pad", sprout_from="HC1", unit_gap=0.4, **st)
            link_bridge("HC_link1", "HC2", "HC1", 18.0, T(5, 0.05) + 6, 10, reverse=True)
        if nc >= 3:
            h, st = hs("HC3", 9.0)
            hall("HC3", -26, -112, 44, 14, h, 0, T(5, 0.05) + 13, mode="slide",
                 src=(-26, -91, 0), dur=5, fed_by="SSP_pad", sprout_from="HC2", unit_gap=0.3,
                 **st)
            link_bridge("HC_link2", "HC3", "HC2", 18.0, T(5, 0.05) + 13, 9, reverse=True)
        for i in range(5):
            y = -66 - i * 9.5
            c = inst("C_ct%d" % i, cell, 2.5, y, PAD_Z, 0, bevel=0.05)
            anim(c, "rise", T(5, 0.3) + i * 0.9, 10)
            b = inst("C_fan%d" % i, blades, 2.5, y, PAD_Z + 9.6, RNG.random(), cat="fan",
                     parent="C_ct%d" % i)
            anim(b, "pop", T(5, 0.3) + i * 0.9 + 8, 6)
            anim(b, "spin", 0, 1, speed=spin_speed(6, 3 - i % 2))
        gen_row("C_gen", -40, -80.5, 3, T(5, 0.5))
        if nc >= 3:
            pipe_rack("C_rack", -46, -101.5, -12, -101.5, T(5, 0.55))
        tank("TC0", -52.0, -66.0, T(5, 0.2), r=2.6, h=9.0)
        tank("TC1", -52.0, -74.5, T(5, 0.2) + 7, r=2.6, h=9.0, mode="slide",
             src=(-52.0, -66.0, PAD_Z), parent="TC0")
        pipe("TC_pipe", (-53.2, -66 - 2.0, PAD_Z + 2.2), (-53.2, -74.5 + 2.0, PAD_Z + 2.2),
             T(5, 0.2) + 15)
        trench("TR_SSP", [(24, -106.5), (8, -106.5)], T(5, 0.3), 8)
    if V["tank_farm"]:
        # tank farm east of RN1: tanks rise in sequence, one sprouts from its neighbour,
        # all hang off the central pipe rack
        road("drive_TF", 20.5, -25, 23, -25, 4, "drive", LV_START[5] + 1, 4)
        pad("TF", 23, -39.5, 76, -10.5, LV_START[5] + 2, role="storage")
        order = [(31, -16), (31, -30), (44, -16), (44, -30), (57, -16), (57, -30), (69, -16),
                 (69, -30)]
        for i, (x, y) in enumerate(order):
            if i == 1:
                tank("TF1", x, y, T(5, 0.08) + 7, mode="slide", src=(31, -16, PAD_Z), parent="TF0")
            else:
                tank("TF%d" % i, x, y, T(5, 0.08) + i * 1.2)
        pipe_rack("TF_rack", 27, -23, 74, -23, T(5, 0.4), z=3.4)
        for i, (x, y) in enumerate(order):
            wy = y - 3.0 if y > -23 else y + 3.0
            pipe("TF_stub%d" % i, (x, -23.0, PAD_Z + 2.35), (x, wy, PAD_Z + 2.35),
                 T(5, 0.6) + i * 0.4, r=0.22)
    if V["bess"]:
        bess("BESS", 84, -40, 132, -12, T(5, 0.25))
        trench("TR_BESS", [(84, -14), (78, -14), (78, -3), (57, -3)], T(5, 0.55), 10)
    if V["solar"] and nc:
        # solar field (panels all face south), collector trench to the solar substation
        srow = proto("solar_row", p_solar_row)
        k = 0
        for j in range(5):
            for i in range(2):
                x, y = 46 + i * 35, -64 - j * 7.0
                if not in_frame(x, y, 20):
                    continue
                so = inst("SOL%d" % k, srow, x, y, 0, 0, cat="solar")
                anim(so, "pop", T(5, 0.3) + k * 0.4, 9, back=0.8)
                k += 1
        occupy(28, -95, 99, -61)
        PLOTS.append((28, -95, 99, -61))
        trench("TR_SOL", [(27, -62.5), (27, -98)], T(5, 0.55), 10)
    if V["wind"]:
        # wind farm west of RW: collector substation, turbines with rotor clearance, buried cables
        road("drive_SSW", -67.5, -9, -70, -9, 4, "drive", T(5, 0.3), 4)
        substation("SSW", -84, -12, -70, 2, T(5, 0.3), n_tr=2, gantries=0)
        tme, hub = proto("turbine", p_turbine)
        rme = proto("rotor", p_rotor)
        for i, (x, y) in enumerate(((-92, -20), (-88, 24), (-84, 72))):
            yaw = math.radians(-35)
            tw = inst("WT%d" % i, tme, x, y, 0, yaw, cat="turbine")
            anim(tw, "rise", T(5, 0.15) + i * 1.5, 13, back=0.6)
            hx, hy = l2w(x, y, yaw, hub[0], hub[1])
            ro = inst("WTr%d" % i, rme, hx, hy, hub[2], yaw, cat="rotor", parent="WT%d" % i)
            ro.rotation_euler.x = RNG.random() * 6.28
            anim(ro, "pop", T(5, 0.15) + i * 1.5 + 7, 8, back=1.2)
            anim(ro, "spin", 0, 1, axis="X", speed=spin_speed(3, 1))
            occupy(x - 4, y - 4, x + 4, y + 4)
        trench("TR_W0", [(-92, -17), (-92, -5), (-84, -5)], T(5, 0.6), 8)
        trench("TR_W1", [(-88, 21), (-88, -1), (-84, -1)], T(5, 0.6), 8)
        trench("TR_W2", [(-84, 69), (-84, 45), (-81, 45), (-81, 2)], T(5, 0.6), 10)
        trench("TR_SSW", [(-70, -5), (-24, -5)], T(5, 0.65), 10)
    nd = V["campus_d"]
    if nd:
        # second data campus west of RW (variants only), fed from SS2
        road("drive_D", -67.5, 122.5, -105, 122.5, 5, "drive", T(5, 0.1), 6)
        pad("D", -165, 95, -105, 150, T(5, 0.12), role="dc")
        ys = (108.0, 137.0) if nd == 2 else (103.0, 122.5, 142.0)
        wd = 15 if nd == 2 else 13
        for i, y in enumerate(ys):
            h, st = hs("HD%d" % (i + 1), 11.5)
            hall("HD%d" % (i + 1), -135, y, 44, wd, h, 0, T(5, 0.15) + i * 2, dur=10,
                 fed_by="SS2_pad", **st)
        gen_row("D_gen", -150, 122.5 if nd == 2 else 112.75, 3, T(5, 0.5))
    for i, tag in enumerate(V.get("mega", ())):   # hyperscale extensions
        mega_zone(tag, T(5, 0.18) + 2 * i)
    # data lines: campus A to C along the RN1 verge, branch to the tank farm
    fiber("F5", [(NODE_X0, -58), (NODE_X1, -58)], T(5, 0.3), 12, pulses_n=12, trunk=True)
    fiber("F3", [(4.4, -8), (9.5, -8)], T(5, 0.35), 5, pulses_n=1)
    if nc:
        fiber("F3c", [(-52, -58), (-52, -62.7)], T(5, 0.45), 4, pulses_n=1)
    if V["tank_farm"]:
        fiber("F4", [(9.5, -35), (24.5, -35), (24.5, -23), (69, -23), (69, -19.9)], T(5, 0.65),
              10, pulses_n=2)
    # trucks keep to the right-hand outer lane of the highway
    tr = proto("truck", p_truck)
    for i, (x, y, rot, sp) in enumerate(((-40, -53.4, 0.0, 0.55), (70, -42.6, math.pi, 0.5),
                                          (-20, -42.6, math.pi, 0.5))):
        t = inst("truck%d" % i, tr, x, y, ROAD_TOP["hwy"], rot, bevel=0.06, cat="vehicle",
                 road="HW")
        anim(t, "drive", T(5, 0.3) + i * 2, 9, speed=sp,
             dir=(math.cos(rot), math.sin(rot), 0))
    tree_jobs.append(("x_trees", lambda: tree_line(-60, -63, -60, -125, 4.0),
                      T(5, 0.45), 8, "poplar"))
    tree_jobs.append(("x_trees2", lambda: tree_line(12.5, -64, 12.5, -125, 4.5),
                      T(5, 0.45), 8, "lime"))
    tree_jobs.append(("x_wood", lambda: tree_area(-175, -158, 204, 178, V["woods"],
                                                  7.0 + V["seed"] * 0.37, 0.18, frame=False,
                                                  d2=8.4),
                      T(5, 0.45), 12, None))

    # streetlights once every road, junction, plot and trench is known
    streetlights("RN1_lights", "RN1", 10.5, -40, 10.5, 90, 22, 0.0, T(2, 0.5))
    streetlights("RE2_lights", "RE2", -120, 54.5, 120, 54.5, 24, math.pi / 2, T(4, 0.2))
    streetlights("HW_lights", "HW", -150, -39.5, 150, -39.5, 26, -math.pi / 2, T(5, 0.2))
    pavement("PV_RE2", "RE2", 55.5, -1, -60.0, 180.0, T(4, 0.3))
    pavement("PV_HW", "HW", -40.5, 1, -60.0, 160.0, T(5, 0.25))
    add_kerbs()
    for job in FENCE_JOBS:                  # fences once every cable route and drive is known
        job()
    FENCE_JOBS.clear()
    # vegetation last, so it keeps clear of everything built at any level
    for prefix, pts_fn, t0, spread, sp in tree_jobs:
        trees(prefix, pts_fn(), t0, spread, sp)


def settle_timeline():
    """Clamp every one-shot animation so it has finished before its level's still frame."""
    for a in ANIMS:
        if a.kind in ("spin", "pulse", "drive", "breathe", "head"):
            continue
        lv = next(l for l in range(1, 6) if a.t0 <= LV_END[l])
        latest = LV_END[lv] - 0.5 - a.dur
        if a.t0 > latest:
            a.t0 = latest
    for a in ANIMS:
        if a.kind == "pulse" and a.kw.get("after") is not None:
            a.t0 = a.kw["after"].t0 + a.kw["after"].dur
    for ob in bpy.data.objects:
        if "born" in ob:
            del ob["born"]
    for a in ANIMS:
        if a.kind != "spin" and a.t0 > -1e5:
            a.ob["born"] = min(float(a.ob.get("born", 1e9)), a.t0)
            a.ob["ready"] = max(float(a.ob.get("ready", -1e9)), a.t0 + a.dur)


# --------------------------------------------------------------------------- tile validation
TRUNK_ROADS = ("RN1", "RW", "RE2", "HW")
TRUNK_FIBRES = ("F0", "F5")


def validate_tiles(VS):
    """Maximal grid: (1) every campus variant passes the validator's checks at its full (L5)
    state, (2) tiling contract -- trunk roads and backbones are identical in every variant and
    end exactly on the tile border, all content lies inside the tile, every overhead line ends
    on a switchyard gantry -- and (3) seam 3 -- HA1 chiller layout and the empty roof window.
    Returns (violations, report lines)."""
    lines, total = [], 0
    apply_frame(LV_END[5])
    colls = [(0, bpy.data.collections.get("Campus") or COLL)] + sorted(VARIANT_COLLS.items())
    for k, coll in colls[1:]:
        SCENE.collection.children.link(coll)
    bpy.context.view_layer.update()
    dg = bpy.context.evaluated_depsgraph_get()
    found = []
    for k, coll in colls[1:]:
        objs = [VS.Obj(ob, dg) for ob in coll.objects if ob.type in {"MESH", "CURVE"} and "cat" in ob]
        n0 = len(found)
        VS.check_level(5, SCENE, objs, lambda lv, kind, msg, k=k: found.append(
            "V T%d %-8s %s" % (k, kind, msg)))
        lines += found[n0:] + ["VARIANT %d objects=%d violations=%d" % (k, len(objs), len(found) - n0)]
    total += len(found)
    # tiling contract
    tl = []
    eps = 1e-4
    sigs = {}
    for k, coll in colls:
        pre = "" if k == 0 else "v%d_" % k
        sig = []
        for ob in coll.objects:
            nm = ob.name[len(pre):] if ob.name.startswith(pre) else ob.name
            if ob.get("cat") == "road" and ob.get("rid") in TRUNK_ROADS:
                p1 = list(ob["p1"])
                sig.append((nm, tuple(ob["p0"]), tuple(p1), ob["w"], ob["kind"]))
                if not (abs(p1[0] - NODE_X0) < eps or abs(p1[0] - NODE_X1) < eps or
                        abs(p1[1] - NODE_Y0) < eps or abs(p1[1] - NODE_Y1) < eps):
                    tl.append("V T%d tiling   road %s does not end on the tile border %s" % (k, nm, p1))
            if ob.get("cat") == "fiber" and nm in TRUNK_FIBRES:
                f = list(ob["path"])
                sig.append((nm, tuple(f)))
                for (x, y) in ((f[0], f[1]), (f[-2], f[-1])):
                    if not (abs(x - NODE_X0) < eps or abs(x - NODE_X1) < eps or
                            abs(y - NODE_Y0) < eps or abs(y - NODE_Y1) < eps):
                        tl.append("V T%d tiling   backbone %s ends inside the tile (%.1f, %.1f)"
                                  % (k, nm, x, y))
            if ob.type in {"MESH", "CURVE"} and "cat" in ob and ob.get("cat") != "ground":
                ev = ob.evaluated_get(dg)
                if ob.type == "CURVE":       # the path itself (a bevel cap is not tile content)
                    bb = [ob.matrix_world @ Vector(p.co[:3]) for s in ob.data.splines
                          for p in s.points]
                else:
                    bb = [ev.matrix_world @ Vector(c) for c in ev.bound_box]
                if (min(v.x for v in bb) < NODE_X0 - 0.01 or max(v.x for v in bb) > NODE_X1 + 0.01 or
                        min(v.y for v in bb) < NODE_Y0 - 0.01 or max(v.y for v in bb) > NODE_Y1 + 0.01):
                    tl.append("V T%d tiling   %s leaves the tile" % (k, nm))
        sigs[k] = sorted(sig)
        if len([s for s in sig if len(s) == 5]) != 8 or len([s for s in sig if len(s) == 2]) != 2:
            tl.append("V T%d tiling   trunk incomplete (%d roads, %d backbones)" % (
                k, len([s for s in sig if len(s) == 5]), len([s for s in sig if len(s) == 2])))
        # every overhead line ends on a switchyard gantry
        gant = []
        for ob in coll.objects:
            if ob.get("cat") == "gantry" and "GRID_" in ob.name:
                f = list(ob["attach"])
                gant += [Vector(f[i:i + 3]) for i in range(0, len(f), 3)]
        for ch in ("PyS", "PyN", "PyE"):
            cb = coll.objects.get(pre + ch + "Le_0")
            if cb is None:
                tl.append("V T%d tiling   line %s has no end span" % (k, ch))
                continue
            e = cb.matrix_world @ Vector(cb.data.splines[0].points[-1].co[:3])
            if not any((g - e).length < 0.6 for g in gant):
                tl.append("V T%d tiling   line %s does not end in a switchyard" % (k, ch))
    for k in sigs:
        if sigs[k] != sigs[0]:
            tl.append("V T%d tiling   trunk roads / backbones differ from the hero tile" % k)
    lines += tl + ["TILING variants=%d violations=%d" % (len(colls), len(tl))]
    total += len(tl)
    # seam 3 contract on the hero campus
    sl = []
    chs = sorted((o for o in bpy.data.objects if o.name.startswith("HA1_ch")), key=lambda o: o.name)
    want = [(-22.0 - 18.0 + 2.1 + 3.1 * c, 17.5 + ry) for ry in (-3.05, 3.05) for c in range(9)]
    got = sorted((round(o.matrix_world.translation.x, 3), round(o.matrix_world.translation.y, 3))
                 for o in chs)
    if got != sorted((round(x, 3), round(y, 3)) for (x, y) in want):
        sl.append("V seam3    HA1 chiller layout changed: %s" % got)
    for o in chs:
        if abs(o.matrix_world.translation.z - 9.5) > 1e-3 or o.data.name != "chiller" or \
                abs(o.matrix_world.to_scale().x - 1.0) > 1e-4:
            sl.append("V seam3    %s not the chiller proto at scale 1 on z 9.5" % o.name)
    for o in bpy.data.objects:
        if o.get("parent") == "HA1" and not o.name.startswith("HA1_ch"):
            bb = [o.matrix_world @ Vector(c) for c in o.bound_box]
            if max(v.x for v in bb) > -34 and min(v.x for v in bb) < -20 and \
                    max(v.y for v in bb) > 12.4 and min(v.y for v in bb) < 22.6:
                sl.append("V seam3    %s sits in the HA1 roof window" % o.name)
    lines += sl + ["SEAM3 chillers=%d violations=%d" % (len(chs), len(sl))]
    total += len(sl)
    for k, coll in colls[1:]:
        SCENE.collection.children.unlink(coll)
    lines.append("TILES_TOTAL %d" % total)
    return total, lines


# --------------------------------------------------------------------------- main
def main():
    t_build = time.time()
    setup_camera()
    setup_world_and_render()
    build_world()
    settle_timeline()
    print("BUILD objects=%d anims=%d in %.1fs" % (len(bpy.data.objects), len(ANIMS),
                                                time.time() - t_build))
    SCENE.frame_start, SCENE.frame_end = 1, LV_END[5]
    if ARGS.validate:
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        import validate_scene
        variant_obs = [ob for c in VARIANT_COLLS.values() for ob in c.objects]
        for ob in variant_obs:              # the per-level run sees the hero campus only
            ob.hide_render = True
        if ARGS.selftest:
            validate_scene.selftest(SCENE, apply_frame, LV_END, ARGS.out)
            return
        def tiles():
            for ob in variant_obs:
                ob.hide_render = False
            return validate_tiles(validate_scene)
        n = validate_scene.run(SCENE, apply_frame, LV_END, ARGS.validate_levels, ARGS.out,
                               extra=tiles)
        print("VALIDATION_TOTAL", n)
        return
    if ARGS.save_blend:
        apply_frame(LV_END[5])
        bpy.ops.wm.save_as_mainfile(filepath=os.path.abspath(ARGS.save_blend))

    jobs = []
    if ARGS.growth72:
        sel = [int(v) for v in ARGS.frames.split(",")] if ARGS.frames else range(GROWTH_FRAMES)
        for i in sel:
            jobs.append((growth_time(i), i, ARGS.out.replace("{i3}", "%03d" % i)))
    elif ARGS.loops:
        for lv in (int(v) for v in ARGS.loops.split(",")):
            I = LEVEL_INDEX[lv]
            for j in range(1, LOOP):
                jobs.append((growth_time(I), I + j,
                             ARGS.out.replace("{level}", str(lv)).replace("{i2}", "%02d" % j)))
    elif ARGS.anim:
        a, b = (int(v) for v in ARGS.anim.split("-"))
        for f in range(a, b + 1):
            jobs.append((f, ARGS.out.replace("####", "%04d" % f)))
    elif ARGS.levels:
        for lv in (int(v) for v in ARGS.levels.split(",")):
            jobs.append((LV_END[lv], ARGS.out.replace("{level}", str(lv))))
    else:
        f = ARGS.frame if ARGS.frame is not None else LV_END[ARGS.level]
        jobs.append((f, ARGS.out))

    jobs = [j if len(j) == 3 else (j[0], j[0], j[1]) for j in jobs]
    times = []
    for f, m, path in jobs:
        SCENE.frame_set(int(round(f)))
        apply_frame(f, m)
        SCENE.render.filepath = os.path.abspath(path)
        t0 = time.time()
        bpy.ops.render.render(write_still=True)
        dt = time.time() - t0
        times.append(dt)
        print("RENDERED t=%.2f m=%d -> %s in %.2fs" % (f, m, path, dt), flush=True)
    if times:
        print("RENDER_TIMES n=%d avg=%.2fs min=%.2fs max=%.2fs total=%.1fs" % (
            len(times), sum(times) / len(times), min(times), max(times), sum(times)))


if __name__ == "__main__" and not _WIP:
    main()
