"""Size journey: one continuous camera move from a line of code to a planet-scale network.
Owned by the lead (camera, seams, timing, integration). Use scripts/render_shot.py to render
(it holds the GPU lock); direct calls are for debugging only:

  blender -b --factory-startup -P scripts/journey.py -- --theme dark --res 960x720 --samples 24 \
      --mode animatic --out renders/anim/f_####.png
  ... --mode frames --frames 26,48,86-90 --res 640x480 --out renders/sb/f_####.png
  ... --mode hero --set phone --shot hold --preset review --out renders/hero/phone.png
  options: --preset legacy|draft|review|final   --look legacy|bible
           --set-override phone=sets.phone_wip   (repeatable)

Shots (24 fps) and seams; a seam is a pair of consecutive frames rendered in different sets that
match in shape, colour, direction and speed:
  phone   0-112   Mini (code card) -> pull back -> Klein (app) -> push into the code card
  board 113-142   SoC top (== code card) -> fly along the trace -> into the USB-C rear slot
  tunnel 143-160  fibre of light streaks -> bright ferrule bore
  hall  161-238   out of a patch-panel port -> Mittel aisle -> over an open server, rise
  ext   239-395   HA1 roof (== server fan modules) -> Gross campus builds -> Maximal node grid
"""
import math
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy  # noqa: E402
from mathutils import Matrix, Quaternion, Vector  # noqa: E402

import importlib  # noqa: E402

import build_scene as BS  # noqa: E402
import sets.common as JC  # noqa: E402

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []


def arg(name, default=None):
    return argv[argv.index(name) + 1] if name in argv else default


def args_all(name):
    return [argv[i + 1] for i, a in enumerate(argv[:-1]) if a == name]


MODE = arg("--mode", "animatic")
OUT = arg("--out", "renders/anim/f_####.png")
FRAMES = arg("--frames")
PRESET = arg("--preset", "legacy")
LOOK = arg("--look", "legacy")
SETMOD = {"phone": "sets.phone", "board": "sets.board", "tunnel": "sets.tunnel", "hall": "sets.hall"}
for ov in args_all("--set-override"):
    k, v = ov.split("=", 1)
    SETMOD[k] = v
MODS = {k: importlib.import_module(v) for k, v in SETMOD.items()}
# hero stills: the journey camera at a representative frame of each set ("hold" = level hold)
HERO = {"phone": {"hold": 81, "mini": 18, "seam": 112},
        "board": {"hold": 126, "seam": 113, "slot": 142},
        "tunnel": {"hold": 152, "mouth": 143, "end": 160},
        "hall": {"hold": 201, "port": 161, "server": 238},
        "ext": {"hold": 285, "roof": 239, "max": 378}}
END = 396
SEAMS = [112, 142, 160, 238]          # last frame of shot A; shot B starts at +1
SHOTS = [("phone", 0, 112), ("board", 113, 142), ("tunnel", 143, 160), ("hall", 161, 238),
         ("ext", 239, END - 1)]
LEVELS = {"Mini": (0, 30), "Klein": (66, 96), "Mittel": (186, 216), "Gross": (270, 300),
          "Maximal": (360, 396)}

# --------------------------------------------------------------------------- build
SC = bpy.context.scene
BS.setup_world_and_render()
JC.materials()
campus = bpy.data.collections.new("Campus")
SC.collection.children.link(campus)
BS.COLL = campus
BS.build_world()
BS.settle_timeline()
ground = bpy.data.objects["ground"]
campus.objects.unlink(ground)
SC.collection.objects.link(ground)
# seam 2a card materials (lead contract): the phone takes the tile / gutter from sets.common
MODS["phone"].CARD_TILE, MODS["phone"].CARD_GUTTER = JC.CARD_TILE, JC.CARD_GUTTER
PH = MODS["phone"].build()
BD = MODS["board"].build()
# seam 2a: the SoC package takes the card tile material (object-level override of "clay")
_so = bpy.data.objects.get("soc")
if _so is not None:
    for _slot in _so.material_slots:
        if _slot.material is not None and _slot.material.name == "clay":
            _slot.link = "OBJECT"
            _slot.material = bpy.data.materials[JC.CARD_TILE]
TU = MODS["tunnel"].build()
HL = MODS["hall"].build(BS.proto("chiller", BS.p_chiller))
BS.COLL = SC.collection

# macro: the campus is one tile of a regional grid (roads, backbones and power continue)
DX, DY = BS.NODE_X1 - BS.NODE_X0, BS.NODE_Y1 - BS.NODE_Y0
NODES = []
GRID_R = 3          # 7 x 7 tiles: the far rows read as the circuit board in the haze
for i in range(-GRID_R, GRID_R + 1):
    for j in range(-GRID_R, GRID_R + 1):
        if i == 0 and j == 0:
            continue
        e = bpy.data.objects.new("node_%d_%d" % (i, j), None)
        e.instance_type = "COLLECTION"
        e.instance_collection = getattr(BS, "VARIANT_COLLS", {}).get(BS.tile_variant(i, j), campus) \
            if hasattr(BS, "tile_variant") else campus
        e.location = (i * DX, j * DY, 0)
        SC.collection.objects.link(e)
        NODES.append((e, math.hypot(i, j)))

# --------------------------------------------------------------------------- render setup
r = SC.render
r.use_motion_blur = True
r.motion_blur_shutter = 0.5
try:
    r.motion_blur_position = "START"
except Exception as ex:
    print("motion_blur_position", ex)
SC.cycles.seed = 0
SC.cycles.use_animated_seed = False
cam_d = bpy.data.cameras.new("JCam")
cam_d.clip_start = 0.0005
cam_d.clip_end = 30000
cam_d.sensor_width = 36
cam = bpy.data.objects.new("JCam", cam_d)
SC.collection.objects.link(cam)
cam.rotation_mode = "QUATERNION"
SC.camera = cam
SC.frame_start, SC.frame_end = 0, END - 1


# --------------------------------------------------------------------------- camera math
def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def smooth(u):
    u = clamp(u)
    return u * u * (3 - 2 * u)


def herm(u, m0, m1):
    u = clamp(u)
    return (u ** 3 - 2 * u ** 2 + u) * m0 + (-2 * u ** 3 + 3 * u ** 2) + (u ** 3 - u ** 2) * m1


def lerp(a, b, u):
    return a + (b - a) * u


def look(pos, target, right_hint=None):
    f = (target - pos).normalized()
    if right_hint is None:
        right = f.cross(Vector((0, 0, 1)))
        if right.length < 1e-4:
            right = Vector((1, 0, 0))
    else:
        right = Vector(right_hint)
    zc = -f
    yc = zc.cross(right.normalized()).normalized()
    xc = yc.cross(zc).normalized()
    m = Matrix((xc, yc, zc)).transposed()
    return m.to_quaternion()


def orbit(target, az, el, D, right=None):
    a, e = math.radians(az), math.radians(el)
    pos = target + Vector((math.cos(e) * math.cos(a), math.cos(e) * math.sin(a), math.sin(e))) * D
    if right is None:
        right = Vector((-math.sin(a), math.cos(a), 0))
    return pos, look(pos, target, right)


def path(keys, t):
    """keys: list of (t, pos, target, right|None); Catmull-Rom on pos and target."""
    ts = [k[0] for k in keys]
    i = max(0, min(len(keys) - 2, next((j for j in range(len(ts) - 1) if t < ts[j + 1]), len(ts) - 2)))
    u = clamp((t - ts[i]) / (ts[i + 1] - ts[i]), 0, 1.5)

    def cr(idx):
        p = [keys[max(0, min(len(keys) - 1, k))][idx] for k in (i - 1, i, i + 1, i + 2)]
        p0, p1, p2, p3 = (Vector(v) for v in p)
        return 0.5 * ((2 * p1) + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u +
                      (-p0 + 3 * p1 - 3 * p2 + p3) * u ** 3)
    pos, tgt = cr(1), cr(2)
    ra, rb = keys[i][3], keys[i + 1][3]
    f = (tgt - pos).normalized()
    rc = f.cross(Vector((0, 0, 1)))
    rc = rc.normalized() if rc.length > 1e-3 else None
    a = Vector(ra) if ra is not None else rc
    b = Vector(rb) if rb is not None else rc
    if a is None or b is None:
        right = a if a is not None else b
    else:
        right = a.lerp(b, smooth(u))
    return pos, look(pos, tgt, right)


C = PH["card_center"]
K = JC.P0 + Vector((0.38, -0.5, 0.04))
S = BD["soc_top"]
o = JC.B0
slot = BD["slot"]
R_2A = 2 * math.log(0.70 / 3.75) / 16.0      # log-rate of the push-in at frame 112 (per frame)
B_KEYS = [
    (112.0, S + Vector((0, 0, 2.8)), S, (1, 0, 0)),
    (113.0, S + Vector((0, 0, 2.8 * math.exp(R_2A))), S, (1, 0, 0)),
    (116.0, S + Vector((0, 0.12, 1.08)), S + Vector((0, 0.7, 0)), (1, 0, 0)),
    (121.0, o + Vector((0.1, 0.1, 1.05)), o + Vector((0.0, 2.5, 0.12)), None),
    (130.0, o + Vector((0.05, 2.5, 0.62)), o + Vector((0.0, 4.45, 0.33)), None),
    (137.0, o + Vector((0.0, 4.0, 0.34)), o + Vector((0.0, 4.6, 0.33)), None),
    (142.5, o + Vector((0.0, 4.62, 0.33)), o + Vector((0.0, 5.0, 0.33)), None),
    (143.5, o + Vector((0.0, 4.74, 0.33)), o + Vector((0.0, 5.2, 0.33)), None),
]
pm = HL["port_mouth"]
H = JC.H0
sc = HL["server_center"]
H_KEYS = [
    (160.0, pm + Vector((0, 0.0175, 0)), pm + Vector((0, -1, 0)), None),
    (161.0, pm + Vector((0, 0.015, 0)), pm + Vector((0, -1, 0)), None),
    (163.0, pm + Vector((0, 0.006, 0)), pm + Vector((0, -1, 0)), None),
    (166.0, pm + Vector((0, -0.07, 0)), pm + Vector((0, -2, 0)), None),
    (170.0, pm + Vector((0, -0.45, -0.08)), pm + Vector((-0.8, -2.0, -0.3)), None),
    (175.0, H + Vector((-0.6, 0.05, 1.72)), H + Vector((-4.0, -0.1, 1.45)), None),
    (186.0, H + Vector((-1.2, 0.0, 1.62)), H + Vector((-8.0, 0.0, 1.3)), None),
]
T_AISLE = 186.0
W = Vector((-27.05, 17.5, 9.5))          # HA1 roof window (4 x 2 chillers) == server modules
G = Vector((-14.0, 52.0, 0.0))          # Gross: centred on the data halls of campuses A and B
G_AZ0, G_AZ1, G_EL, G_D0, G_D1 = -58.0, -54.0, 35.0, 235.0, 226.0
MC = Vector((-24.0, 6.0, 0.0))
MAX_D, MAX_EL, MAX_AZ, MAX_LENS = 820.0, 30.0, -30.0, 35.0
_look = Vector((-math.cos(math.radians(MAX_AZ)), -math.sin(math.radians(MAX_AZ)), 0.0))
MT = MC + Vector((0.0, 30.0, 0.0)) + _look * 180.0   # hero lower-centre, neighbours beside/behind
D3_SRV = 0.387                          # server-side distance at the seam (frame < roof width)
K_SRV = math.log(D3_SRV / 0.25) / 8.0
D3_EXT = D3_SRV * 30.0                  # = 11.6 m above HA1's roof
T_RISE = 230.0


AISLE = {}
# seam 2c: at 160 the camera is 2.5 bore radii (0.98) before the exit, moving at the hall's exit
# speed (0.72 radii/frame); the hall camera starts 2.5 radii inside the port mouth at 161
V_2C = 0.72 * 0.98
D_2C = 2.75 * 0.98      # measured: equal disc size at 2.75 radii (tunnel) vs 2.5 (hall port)
TUNNEL_X = [(142.5, 0.4, 1.6), (151.0, 38.0), (160.0, 70.0 - D_2C, V_2C),
            (161.0, 70.0 - D_2C + V_2C, V_2C)]


def _mono(keys, t):
    """Cubic Hermite through (t, value) keys with Catmull-style tangents; keys may carry an
    explicit tangent as a third element. C1 continuous."""
    ts = [k[0] for k in keys]
    i = max(0, min(len(keys) - 2, next((j for j in range(len(ts) - 1) if t < ts[j + 1]), len(ts) - 2)))

    def tan(j):
        if len(keys[j]) > 2:
            return keys[j][2]
        a, b = max(j - 1, 0), min(j + 1, len(keys) - 1)
        return (keys[b][1] - keys[a][1]) / (keys[b][0] - keys[a][0])
    t0, t1 = ts[i], ts[i + 1]
    h = t1 - t0
    u = clamp((t - t0) / h, 0.0, 1.5)
    v0, v1 = keys[i][1], keys[i + 1][1]
    m0, m1 = tan(i) * h, tan(i + 1) * h
    return ((2 * u ** 3 - 3 * u ** 2 + 1) * v0 + (u ** 3 - 2 * u ** 2 + u) * m0 +
            (-2 * u ** 3 + 3 * u ** 2) * v1 + (u ** 3 - u ** 2) * m1)


def board_move(t):
    """Seam 2a -> 2b: keep falling at the phone's log-rate, pitch over smoothly (no roll) and fly
    north along the trace into the USB-C rear slot."""
    o = JC.B0
    z113 = S.z + 2.8 * math.exp(R_2A)
    zk = [(112.0, S.z + 2.8), (113.0, z113, R_2A * 2.8 * math.exp(R_2A)), (122.0, 1.02),
          (131.0, 0.55), (138.0, 0.36), (142.5, 0.33, -0.002), (143.5, 0.33, 0.0)]
    yk = [(112.0, S.y, 0.0), (113.0, S.y, 0.0), (121.0, o.y - 0.7), (130.0, o.y + 2.2),
          (137.0, o.y + 4.0), (142.5, o.y + 4.62, 0.12), (143.5, o.y + 4.74, 0.12)]
    z = _mono(zk, t)
    y = _mono(yk, t)
    a = lerp(89.999, 22.0, smooth((t - 113.0) / 13.0))
    a = lerp(a, 0.0, smooth((t - 126.0) / 15.0))
    pos = Vector((o.x, y, z))
    f = Vector((0.0, math.cos(math.radians(a)), -math.sin(math.radians(a))))
    return pos, look(pos, pos + f, (1, 0, 0))


def exit_move(t):
    """Seam 2c -> Mittel: out of the bright bore at constant scale-relative speed (distance from a
    point inside the bore grows exponentially), then yaw from -y to -x and settle at eye height."""
    # seam 2c growth: the tunnel disc grows x1.45/frame into 160 (2.75 radii); the hall camera
    # starts at 1.9 radii (0.0114 m) inside the mouth so the disc keeps growing across the cut
    org = pm + Vector((0, 0.03, 0))
    s0 = 0.03 - 1.9 * 0.006
    k = math.log(0.85 / s0) / 14.0
    if t <= 175.0:
        y = org.y - s0 * math.exp(k * (t - 161.0))
    else:
        yv = -0.85 * k
        y = _mono([(175.0, org.y - 0.85, yv), (183.0, H.y + 0.0, 0.0), (190.0, H.y + 0.0, 0.0)], t)
    x = lerp(pm.x, H.x - 1.2, smooth((t - 168.0) / 18.0))
    z = lerp(pm.z, H.z + 1.62, smooth((t - 168.0) / 18.0))
    hd = math.radians(lerp(-90.0, -180.0, smooth((t - 164.0) / 22.0)))
    pitch = lerp(0.0, math.atan2(0.32, 6.8), smooth((t - 170.0) / 16.0))
    f = Vector((math.cos(hd) * math.cos(pitch), math.sin(hd) * math.cos(pitch), -math.sin(pitch)))
    right = Vector((math.sin(hd), -math.cos(hd), 0.0))
    pos = Vector((x, y, z))
    return pos, look(pos, pos + f, right)


def aisle_move(t):
    """Mittel hold + approach to the open server as one move (186-230): glide down the aisle and
    ease into a hover above the server; heading stays -x and screen-right stays +y, so the turn to
    top-down is a pure pitch (no roll, no swoop). Hands its climb speed to the rise at 230."""
    if not AISLE:
        p0 = exit_move(T_AISLE)[0]
        AISLE["p0"] = p0
        AISLE["v0"] = (p0 - exit_move(T_AISLE - 0.5)[0]) * 2.0
    p0, v0 = AISLE["p0"], AISLE["v0"]
    n = T_RISE - T_AISLE
    u = clamp((t - T_AISLE) / n)
    x = p0.x + (sc.x - p0.x) * herm(u, v0.x * n / (sc.x - p0.x), 0.0)
    y = lerp(p0.y, sc.y, smooth((t - 210.0) / 20.0))
    # climb before passing over the pulled-out tray (walls top 1.91 m), hand the climb rate to the rise
    z = _mono([(T_AISLE, p0.z, 0.0), (200.0, p0.z + 0.04), (218.0, sc.z + 0.20),
               (T_RISE, sc.z + 0.25, K_SRV * 0.25)], t)
    pitch0 = math.atan2(0.32, 6.8)
    pitch = lerp(pitch0, math.radians(89.999), smooth((t - 206.0) / 24.0))
    pos = Vector((x, y, z))
    f = Vector((-math.cos(pitch), 0.0, -math.sin(pitch)))
    return pos, look(pos, pos + f, (0, 1, 0))


def camera_at(t, shot=None):
    """Return (pos, quat, lens) for continuous time t; shot pins the evaluation to one shot."""
    if shot is None:
        shot = next(s for (s, a, b) in SHOTS if t < b + 1)
    if shot == "phone":
        if t < 30:
            p, q = orbit(C, -75, 68, lerp(0.95, 0.88, smooth(t / 30)))
        elif t < 66:
            u = smooth((t - 30) / 36)
            tg = C.lerp(K, u)
            p, q = orbit(tg, lerp(-75, -55, u), lerp(68, 47, u),
                         math.exp(lerp(math.log(0.88), math.log(3.9), u)))
        elif t < 96:
            u = smooth((t - 66) / 30)
            p, q = orbit(K, lerp(-55, -50, u), 47, lerp(3.9, 3.75, u))
        else:
            u = (t - 96) / 16
            v = smooth(u / 0.8)
            tg = K.lerp(C, smooth(u / 0.75))
            az, el = lerp(-50, -90, v), lerp(47, 89.999, v)
            D = math.exp(lerp(math.log(3.75), math.log(0.70), u * u))
            p, q = orbit(tg, az, el, D, right=Vector((1, 0, 0)) if v >= 1 else None)
        return p, q, 50.0
    if shot == "board":
        return board_move(t) + (lerp(50.0, 30.0, smooth((t - 113) / 10)),)
    if shot == "tunnel":
        x = _mono(TUNNEL_X, t)
        pos = JC.T0 + Vector((x, 0, 0))
        return pos, look(pos, pos + Vector((1, 0, 0))), 30.0
    if shot == "hall":
        if t >= T_RISE:
            D = 0.25 * math.exp(K_SRV * (t - T_RISE))
            pos = sc + Vector((0, 0, D))
            return pos, look(pos, sc, (0, 1, 0)), 35.0
        lens = 30.0 if t < 175 else lerp(30.0, 35.0, smooth((t - 175) / 50))
        if t < T_AISLE:
            return exit_move(t) + (lens,)
        return aisle_move(t) + (lens,)
    # exterior
    if t < 270:
        u = (t - 238) / 32.0
        D = math.exp(math.log(D3_EXT) + math.log(G_D0 / D3_EXT) *
                     herm(u, K_SRV * 32 / math.log(G_D0 / D3_EXT), 0))
        w = smooth((u - 0.12) / 0.88)
        tg = W.lerp(G, w)
        p, q = orbit(tg, lerp(0, G_AZ0, w), lerp(89.999, G_EL, w), D,
                     right=Vector((0, 1, 0)) if w <= 0 else None)
        return p, q, lerp(35.0, 50.0, smooth(u))
    if t < 300:
        u = smooth((t - 270) / 30)
        p, q = orbit(G, lerp(G_AZ0, G_AZ1, u), G_EL, lerp(G_D0, G_D1, u))
        return p, q, 50.0
    if t < 360:
        # pull back and down: the hero campus becomes one of several huge campuses; the grid
        # continues into the haze behind them
        u = smooth((t - 300) / 60)
        D = math.exp(lerp(math.log(G_D1), math.log(MAX_D), u))
        p, q = orbit(G.lerp(MT, u), lerp(G_AZ1, MAX_AZ, u), lerp(G_EL, MAX_EL, u), D)
        return p, q, lerp(50.0, MAX_LENS, u)
    u = smooth((t - 360) / 36)
    p, q = orbit(MT, lerp(MAX_AZ, MAX_AZ + 6.0, u), MAX_EL, lerp(MAX_D, MAX_D * 0.965, u))
    return p, q, MAX_LENS


def key_camera():
    prev = None
    keys = []
    for f in range(0, END):
        keys.append((float(f), None))
        if f in SEAMS:
            keys.append((f + 0.5, f))
    cam.animation_data_clear()
    for (t, cut) in keys:
        shot = None
        if cut is not None:
            shot = next(s for (s, a, b) in SHOTS if a <= cut <= b)
        p, q, lens = camera_at(t, shot)
        if prev is not None and prev.dot(q) < 0:
            q = -q
        prev = q
        cam.location = p
        cam.rotation_quaternion = q
        cam.data.lens = lens
        cam.keyframe_insert("location", frame=t)
        cam.keyframe_insert("rotation_quaternion", frame=t)
        cam.data.keyframe_insert("lens", frame=t)
    cuts = {s + 0.5 for s in SEAMS}

    def fcurves(idb):
        ad = idb.animation_data
        act = ad.action
        if hasattr(act, "fcurves"):
            return list(act.fcurves)
        out = []
        for layer in act.layers:
            for strip in layer.strips:
                for cb in strip.channelbags:
                    out += list(cb.fcurves)
        return out
    for idb in (cam, cam.data):
        for fc in fcurves(idb):
            for kp in fc.keyframe_points:
                kp.interpolation = "CONSTANT" if kp.co.x in cuts else "LINEAR"


# --------------------------------------------------------------------------- per-frame state
emit, window = JC.emit, JC.window


def ext_time(t):
    if t < 241:
        return 80.0
    if t < 270:
        return lerp(80.0, 108.0, (t - 241) / 29)
    if t < 300:
        return 108.0
    if t < 330:
        return lerp(108.0, 136.0, (t - 300) / 30)
    return 136.0


STRUCT = {"t": None}          # loop mode: structural time frozen at the level frame
LEVEL_FRAMES = {1: 30, 2: 66, 3: 186, 4: 270, 5: 360}   # V4 player: levels 1..5
LOOP_N, LOOP_K = 30, 8        # loop length (multiple of the 15/30-frame micro periods) + pre-roll


def state(t):
    ts = t if STRUCT["t"] is None else STRUCT["t"]
    shot = next(s for (s, a, b) in SHOTS if t < b + 1)
    for name, coll in JC.SETS.items():
        coll.hide_render = name != {"phone": "SET_phone", "board": "SET_board",
                                    "tunnel": "SET_tunnel", "hall": "SET_hall"}.get(shot)
    ext = shot == "ext"
    bpy.data.collections["Campus"].hide_render = not ext
    ground.hide_render = not ext
    MODS["phone"].state(t, PH)
    MODS["board"].state(t, BD, lambda tt: camera_at(tt, "board")[0])
    cx = (camera_at(t, "tunnel")[0].x - JC.T0.x) if shot == "tunnel" else 0.0
    MODS["tunnel"].state(t, TU, cx)
    MODS["hall"].state(t, HL)
    # exterior growth + micro motion; macro nodes rise; glows breathe at Maximal
    BS.apply_frame(ext_time(ts), t)
    for e, dist in NODES:
        p = (ts - (316 + 6.0 * dist)) / 14.0
        s = max(BS.ease_out_back(clamp(p), 0.8), 1e-4)
        e.scale = (1, 1, s)
        e.hide_render = p <= 0 or not ext
    # Maximal "wabern": a slow emission wave spreads tile by tile from the hero campus
    if "set_wave" in dir(LB):
        LB.set_wave(0.6 * smooth((ts - 318) / 30.0), 2 * math.pi * t / 30.0)


# --------------------------------------------------------------------------- integration (lead)
INTEG = {}


def _link_coll(name, objs):
    c = bpy.data.collections.new(name)
    for ob in objs:
        if ob is not None and ob.name not in c.objects:
            c.objects.link(ob)
    return c


def _area(name, coll, loc, target, size, energy, color=(0.9, 0.94, 1.0), size_y=None):
    ld = bpy.data.lights.new(name, "AREA")
    if size_y:
        ld.shape = "RECTANGLE"
        ld.size, ld.size_y = size, size_y
    else:
        ld.size = size
    ld.energy = energy
    ld.color = color
    ob = bpy.data.objects.new(name, ld)
    ob.location = loc
    ob.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    ob.visible_camera = False
    ob.visible_glossy = False
    coll.objects.link(ob)
    return ob


def build_integration():
    sets = JC.SETS
    # 2a: one soft light on the phone UI, mirrored on the SoC at x4 placement / x16 energy
    ui = [o for o in sets["SET_phone"].all_objects if o.type == "MESH" and
          (o.name.startswith("ui_") or o.name.startswith("code_"))]
    soc = [bpy.data.objects.get(n) for n in ("soc", "soc_marks")]
    off = Vector((0.18, -0.30, 0.62))
    E_UI = 0.9
    l1 = _area("lead_ui_soft", sets["SET_phone"], C + off, C, 0.7, E_UI)
    l1.light_linking.receiver_collection = _link_coll("LEAD_UI", ui)
    l2 = _area("lead_soc_soft", sets["SET_board"], S + off * 4.0, S, 0.7 * 4.0, E_UI * 16.0)
    l2.light_linking.receiver_collection = _link_coll("LEAD_SOC", soc)

    # 2b: no pulse reflection in the USB-C tongue (the pulse and its trail skip the connector)
    rx = _link_coll("LEAD_PULSE_RX", [o for o in sets["SET_board"].all_objects
                                     if o.type in {"MESH", "CURVE"} and o.name != "usbc"])
    for ob in (BD.get("pulse"), BD.get("trace_pulse")):
        if ob is not None:
            ob.light_linking.receiver_collection = rx
    # 2b: the tunnel pulse is seen, but lights nothing (its wall glow made 143 brighter than 142)
    if TU.get("pulse") is not None:
        TU["pulse"].light_linking.receiver_collection = bpy.data.collections.new("LEAD_NONE")
    # 2c: the tunnel's exit disc at 0.5 of the shared haze strength, plus a soft horizontal line
    # slightly above centre (the hall's rack-top strip seen through the port at 161)
    hz = bpy.data.materials.get("tu_haze") or bpy.data.materials.get("haze")
    if hz is not None:
        hb = hz.node_tree.nodes.get("Principled BSDF") or next(
            n_ for n_ in hz.node_tree.nodes if n_.bl_idname == "ShaderNodeBsdfPrincipled")
        hb.inputs["Emission Strength"].default_value = 0.45 * 0.5
    lm = bpy.data.materials.new("lead_hazeline")
    lm.use_nodes = True
    lb = lm.node_tree.nodes.get("Principled BSDF")
    lb.inputs["Base Color"].default_value = (0, 0, 0, 1)
    lb.inputs["Emission Color"].default_value = (0.85, 0.9, 1.0, 1)
    lb.inputs["Emission Strength"].default_value = 1.6
    from build_scene import MB
    for k_, (h_, e_) in enumerate(((0.035, 1.6), (0.16, 0.35))):
        mb = MB()
        xd = JC.T0.x + 70.0 + 6.0 - 0.02 - k_ * 0.005
        mb.box(-0.005, -3.2, -h_ / 2, 0.005, 3.2, h_ / 2, "clay")
        me = mb.mesh("lead_hazeline%d" % k_)
        me.materials.clear()
        m2 = lm if k_ == 0 else lm.copy()
        if k_:
            m2.node_tree.nodes.get("Principled BSDF").inputs["Emission Strength"].default_value = e_
        me.materials.append(m2)
        ob = bpy.data.objects.new("lead_hazeline%d" % k_, me)
        ob.location = (xd, JC.T0.y, JC.T0.z + 0.62)
        sets["SET_tunnel"].objects.link(ob)
    # hall: a little more light on the rack fronts (hall lights' receivers only, never the server)
    hall_lit = bpy.data.collections.get("HALL_LIT")
    for k, sy in enumerate((-1, 1)):
        lo = _area("lead_aisle_fill%d" % k, sets["SET_hall"], JC.H0 + Vector((-0.6, 0.0, 1.35)),
                   JC.H0 + Vector((-0.6, sy * 3.0, 1.2)), 9.0, 140.0, size_y=1.4)
        lo.light_linking.receiver_collection = hall_lit
    # hall: server silhouette at the Mittel hold - a rim linked to the server only, off at seam 3
    srv = bpy.data.collections.get("SRV_LINK")
    rim = _area("lead_srv_rim", sets["SET_hall"], sc + Vector((-1.6, 0.6, 0.55)), sc, 0.9, 30.0,
                color=(0.75, 0.85, 1.0))
    rim.light_linking.receiver_collection = srv
    rim.light_linking.blocker_collection = srv
    INTEG["rim"] = rim
    INTEG["rim_e"] = 80.0
    # Gross: the F0/F5 glow corridor ("band", exterior shader) is dimmed so the data halls lead;
    # a lead multiplier is inserted in front of its emission strength (full again at Maximal)
    bm_ = bpy.data.materials.get("band")
    if bm_ is not None and bm_.node_tree:
        nt_ = bm_.node_tree
        em_ = next((n_ for n_ in nt_.nodes if n_.bl_idname == "ShaderNodeEmission"), None)
        if em_ is not None and em_.inputs["Strength"].is_linked:
            src = em_.inputs["Strength"].links[0].from_socket
            mul_ = nt_.nodes.new("ShaderNodeMath")
            mul_.operation = "MULTIPLY"
            mul_.inputs[1].default_value = 1.0
            nt_.links.new(src, mul_.inputs[0])
            nt_.links.new(mul_.outputs[0], em_.inputs["Strength"])
            INTEG["band_k"] = mul_.inputs[1]
    # per-set bevel radius for the shared materials (look bible)
    LB.tag_look_scale(sets, {o: 1.0 / 30.0 for o in HL.get("modules", [])})

    def fx(t):
        # the rim fades out before the seam-3 frames (contract: srv_Sun + srv_Rim only)
        INTEG["rim"].data.energy = INTEG["rim_e"] * (1.0 - smooth((t - 214.0) / 10.0))
        if "band_k" in INTEG:
            INTEG["band_k"].default_value = lerp(0.35, 1.0, smooth((t - 305.0) / 35.0))
    INTEG["fx"] = fx


# --------------------------------------------------------------------------- lens / exposure
PH_CENTER = JC.P0 + Vector((0.0, 0.0, 0.08))


def focus_at(t):
    """(focus point or distance, f-stop) per shot; None = deep focus (aerial)."""
    shot = next(s for (s, a, b) in SHOTS if t < b + 1)
    pos = camera_at(t, shot)[0]
    if shot == "phone":
        # Mini f/2 on the card, Klein f/2.8 on the card, f/4 -> f/8 into the seam (sharp card)
        n = lerp(2.0, 2.8, smooth((t - 30) / 36.0))
        n = lerp(n, 8.0, smooth((t - 103) / 7.0))
        return C, n
    if shot == "board":
        # x4 scene: the equivalent of the phone's f/8 is f/2; then f/1.2 macro on the pulse
        foc = BD["pulse"].matrix_world.translation if t >= 116 else S
        return foc, lerp(2.0, 1.2, smooth((t - 114) / 6.0))
    if shot == "tunnel":
        if t >= 157:
            return None      # seam 2c: no depth of field on either side of the cut
        return pos + Vector((lerp(3.0, 8.0, smooth((t - 152) / 5.0)), 0, 0)), lerp(2.8, 11.0, smooth((t - 152) / 5.0))
    if shot == "hall":
        if t < 166:
            return None      # seam 2c: bore rim and hall both sharp, like the tunnel side
        if t < 176:
            return 3.5, lerp(22.0, 2.8, smooth((t - 166) / 10.0))
        if t < 208:
            return 4.0, 2.8
        d = (pos - sc).length
        return d, lerp(2.8, 16.0, smooth((t - 208) / 8.0))
    return None


def exposure_dip(t):
    """Seam 2b: both sides of the cut sink into the same darkness, the streaks then fade in.
    Seam 2c: the hall side starts +0.55 EV (eye adapting out of the whiteout), fading in 6 frames,
    so the view through the port matches the tone of the tunnel's exit disc."""
    e = -1.5 * math.exp(-((t - 142.5) / 2.2) ** 2)
    if 161 <= t < 167:
        e += (0.85 if BS.ARGS.theme == "dark" else LIFT_2C_LIGHT) * (1.0 - smooth((t - 161) / 6.0))
    if 239 <= t < 249:
        e += EXP_3 * (1.0 - smooth((t - 239) / 10.0))
    if BS.ARGS.theme == "light" and 161 <= t <= 238:
        # light theme: the white hall interior is tuned for the dark lights; pull it down, but
        # not at the 2c cut (whiteout) nor over the server (seam 3 is lit by the sun copies)
        e += -0.7 * smooth((t - 163) / 6.0) * (1.0 - smooth((t - 222) / 8.0))
    return e


LIFT_2C_LIGHT = -0.85   # light theme: the white hall through the port is brighter than the disc
EXP_3 = -0.06   # measured on the 238/239 pair (renders/integration), see POLISH.md


def shutter_at(t):
    if 113 <= t <= 142:
        return lerp(0.5, 0.3, smooth((t - 113) / 5.0)) if t < 128 else lerp(0.3, 0.5, smooth((t - 134) / 6.0))
    if 206 <= t <= 238:
        return lerp(0.5, 0.2, smooth((t - 206) / 6.0)) if t < 226 else lerp(0.2, 0.5, smooth((t - 226) / 8.0))
    return 0.5


def lens_fx(t):
    t = t if STRUCT["t"] is None else STRUCT["t"]
    SC.render.motion_blur_shutter = shutter_at(t)
    INTEG["fx"](t)
    cam = SC.camera
    fo = focus_at(t)
    if fo is None:
        cam.data.dof.use_dof = False
    else:
        LB.dof(cam, fo[0], fo[1])
    SC.view_settings.exposure = BS.TH["exposure"] + exposure_dip(t)


def camcheck():
    """Report camera velocity / turn-rate jumps (scale-relative), excluding the seam cuts."""
    rows = []
    prev = None
    for f in range(0, END):
        p, q, _ = camera_at(f)
        fo = focus_at(f)
        if fo is None:
            scale = (p - MC).length if f >= 300 else (p - G).length
        else:
            scale = (fo[0] - p).length if isinstance(fo[0], Vector) else float(fo[0])
        if prev is not None and f - 1 not in SEAMS:
            pp, pq, ps = prev
            v = (p - pp).length / max(scale, 1e-6)
            w = math.degrees(pq.rotation_difference(q).angle)
            w = min(w, 360.0 - w)
            rows.append((f, v, w))
        prev = (p, q, scale)
    jumps = []
    for (f0, v0, w0), (f1, v1, w1) in zip(rows[:-1], rows[1:]):
        if f1 - 1 in SEAMS or f0 - 1 in SEAMS:
            continue
        dv = abs(v1 - v0) / max(v0, v1, 0.002)
        dw = abs(w1 - w0)
        jumps.append((max(dv if max(v0, v1) > 0.004 else 0, dw / 3.0), f1, v0, v1, w0, w1))
    jumps.sort(reverse=True)
    print("CAMCHECK frame  rel.speed(prev->cur)  turn deg/frame(prev->cur)")
    for j in jumps[:14]:
        print("CAMCHECK %4d  %.4f -> %.4f   %.2f -> %.2f   score %.2f" % (j[1], j[2], j[3], j[4], j[5], j[0]))
    print("CAMCHECK max turn %.2f deg/frame at %d" % max((w, f) for (f, v, w) in rows))


# --------------------------------------------------------------------------- run
def parse_frames(spec):
    out = []
    for part in spec.split(","):
        if "-" in part.strip()[1:]:
            a, b = part.split("-", 1)
            out += list(range(int(a), int(b) + 1))
        elif part.strip():
            out.append(int(part))
    return out


import look as LB  # noqa: E402
if MODE == "camcheck":
    camcheck()
    sys.exit(0)
if MODE == "checks":
    # every set's own physical / contract check, on the integrated scene
    tot = 0
    for k, D in (("phone", PH), ("board", BD), ("tunnel", TU), ("hall", HL)):
        fn = getattr(MODS[k], "check", None)
        if fn is None:
            print("SETCHECK %-6s no check()" % k)
            continue
        v = fn(D) or []
        tot += len(v)
        print("SETCHECK %-6s violations=%d" % (k, len(v)))
        for x in v[:20]:
            print("SETCHECK %-6s   %s" % (k, x))
    print("SETCHECK_TOTAL %d" % tot)
    sys.exit(0)
if LOOK == "bible" or PRESET != "legacy":
    if LOOK == "bible":
        LB.apply_materials(BS.ARGS.theme)
    if PRESET != "legacy":
        LB.render_preset(SC, PRESET, res=arg("--res"))
        LB.haze(SC, strength=0.0, color=(0.03, 0.04, 0.065))
        build_integration()
        LB.add_wave(("line", "glass", "pulse"), MC)


def haze_at(t):
    """Atmosphere only over the exterior: visible depth behind the campus at Gross, and the far
    rows of the grid fading into blue haze at Maximal (mist start / depth follow the scale)."""
    if t < 239:
        return 0.0
    u = smooth((t - 300) / 60.0)
    SC.world.mist_settings.falloff = "LINEAR"
    SC.world.mist_settings.start = lerp(150.0, 700.0, u)
    SC.world.mist_settings.depth = lerp(600.0, 2200.0, u)
    return lerp(0.8 * smooth((t - 245) / 20.0), 0.92, u)


key_camera()
if MODE == "animatic":
    frames = list(range(0, END))
elif MODE == "hero":
    frames = [HERO[arg("--set")][arg("--shot", "hold")]]
elif MODE == "loop":
    # idle loop of one level: camera frozen at the level pose, structure frozen at the level
    # frame, micro-motion running; frames TL-K..TL-1 are the crossfade pre-roll for the wrap
    TL = LEVEL_FRAMES[int(arg("--level"))]
    STRUCT["t"] = TL
    p_, q_, lens_ = camera_at(TL)
    for idb in (cam, cam.data):
        idb.animation_data_clear()
    cam.location, cam.rotation_quaternion, cam.data.lens = p_, q_, lens_
    frames = [TL + j for j in range(-LOOP_K, LOOP_N)]
else:
    frames = parse_frames(FRAMES)
times = []
for f in frames:
    SC.frame_set(f)
    state(f)
    if PRESET != "legacy":
        LB.set_haze(haze_at(f if STRUCT["t"] is None else STRUCT["t"]))
        lens_fx(f)
    path_out = OUT.replace("####", "%04d" % f) if "####" in OUT else OUT
    SC.render.filepath = os.path.abspath(path_out)
    t0 = time.time()
    bpy.ops.render.render(write_still=True)
    times.append(time.time() - t0)
    print("RENDERED %d %.2fs -> %s" % (f, times[-1], path_out), flush=True)
print("RENDER_TIMES n=%d avg=%.2fs max=%.2fs total=%.1fs" % (len(times), sum(times) / len(times),
                                                             max(times), sum(times)))
