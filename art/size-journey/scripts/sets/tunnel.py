"""Fibre tunnel (Klein -> Mittel, part 3). Owner: board agent. Seam contracts: 2b, 2c.

Film-grade pass. Inside the fibre core, looking down +x:
  - layers: a semi-transparent glassy core boundary (r 1.0), dim light running in the cladding
    behind it, the cladding wall (r 1.05, contract), and a dark, matte mouth sleeve (x < 16)
    so the entrance stays as dark as the USB-C cavity on the other side of seam 2b;
  - light dashes in three lanes (on the core boundary, in the core, in the cladding), blue and
    white, varied lengths and thicknesses, in four speed classes keyed along +x so motion blur
    gives each class its own streak length;
  - every dash fades in with distance (x 18 -> 24) and out before the ferrule (56 -> 60), and the
    whole field fades in over frames 143.6 -> 146.6, so the far streaks never flash at the cut;
  - a subtle core glow (a facing-ratio emission sleeve) that converges on the vanishing point;
  - the bright ferrule bore (r 0.98, x 60 -> 70, contract 2c) behind a ceramic end-face ring.
The pulse rides 3.0 ahead of the camera on the axis; it is keyed at t and t + 0.5 from the
camera's own f-curve so motion blur does not smear it.
"""
import math
import random

import bmesh
import bpy
from mathutils import Matrix, Vector

import build_scene as BS
from build_scene import MB
from sets.common import T0, new_coll, ob_place, clamp, smooth, lerp

# --------------------------------------------------------------------------- constants
TU = {"len": 70.0, "R": 1.0, "ferrule": 60.0}
R_WALL = 1.05            # contract 2b
BORE_R = 0.98            # contract 2c
MOUTH_X = 16.0           # matte dark sleeve up to here
X_IN = (18.0, 24.0)      # dashes fade in with distance (contract: dark until x ~ 18)
X_OUT = (56.0, 60.0)     # ... and out before the ferrule
T_IN = (143.6, 146.6)    # ... and in over time after the cut
NEAR = (1.0, 4.5)        # ... and fade out within a few units of the lens
FAR = (12.0, 30.0)       # ... and dim far down the tube, so the bore reads as a disc, not a flare
RING_R, RING_STEP = 0.998, 6.0     # cladding segment joints (spacing > the motion-blur length)
HAZE_K = 0.6             # seam 2c tone (lead integration 2026-10-17: was None, see POLISH.md)
T_A, T_B = 143.0, 160.5  # shot span (key range of the moving dashes)
SPEEDS = (0.0, 0.6, 1.3, 2.4)      # units per frame along +x
WEIGHTS = (0.45, 0.25, 0.2, 0.1)
PULSE_R, PULSE_LEAD = 0.09, 3.0    # contract 2b
LANES = {"wall": 0.972, "clad": 1.025}
DASH_MATS = ("tu_dash_b", "tu_dash_b2", "tu_dash_w")
RINGS = []               # (x0, x1, r)
DASHES = []              # (class, lane, r, x0, x1, thickness)


def _look():
    import look as LB
    return LB


def _bsdf(m):
    return next(x for x in m.node_tree.nodes if x.bl_idname == "ShaderNodeBsdfPrincipled")


def _m(nt, op, a, b=None):
    nd = nt.nodes.new("ShaderNodeMath")
    nd.operation = op
    for i, v in enumerate((a, b)):
        if v is None:
            continue
        if isinstance(v, (int, float)):
            nd.inputs[i].default_value = v
        else:
            nt.links.new(v, nd.inputs[i])
    return nd.outputs[0]


def _range(nt, v, a, b, lo, hi):
    nd = nt.nodes.new("ShaderNodeMapRange")
    nd.interpolation_type = "SMOOTHSTEP"
    nt.links.new(v, nd.inputs["Value"])
    nd.inputs["From Min"].default_value = a
    nd.inputs["From Max"].default_value = b
    nd.inputs["To Min"].default_value = lo
    nd.inputs["To Max"].default_value = hi
    return nd.outputs["Result"]


def _xwin(nt):
    """Smooth window on tunnel-local x (world position, so moving dashes fade correctly)."""
    geo = nt.nodes.new("ShaderNodeNewGeometry")
    sp = nt.nodes.new("ShaderNodeSeparateXYZ")
    nt.links.new(geo.outputs["Position"], sp.inputs[0])
    x = _m(nt, "SUBTRACT", sp.outputs["X"], T0.x)
    return _m(nt, "MULTIPLY", _range(nt, x, X_IN[0], X_IN[1], 0.0, 1.0),
              _range(nt, x, X_OUT[0], X_OUT[1], 1.0, 0.0)), geo


def _gain_node(nt, name="gain"):
    g = nt.nodes.new("ShaderNodeValue")
    g.name = name
    g.outputs[0].default_value = 0.0
    TU.setdefault("gains", []).append(g)
    return g.outputs[0]


def materials():
    LB = _look()
    th = BS.ARGS.theme
    tiers = LB.CLAY_TIERS[th]
    if "tu_dash_b" in BS.M:
        return
    # dashes: blue, dim blue, white -- the look's accent kinds only
    for name, kind, k in (("tu_dash_b", "accent", 0.6), ("tu_dash_b2", "accent", 0.22),
                          ("tu_dash_w", "led_white", 0.75), ("tu_dash_w2", "led_white", 0.2)):
        m = LB.emission_material(name, kind, th, base=(0.0, 0.0, 0.0))
        nt = m.node_tree
        b = _bsdf(m)
        base = b.inputs["Emission Strength"].default_value * k
        w, _ = _xwin(nt)
        # dim what is right next to the lens: its motion blur would smear into a white ring
        cd = nt.nodes.new("ShaderNodeCameraData")
        near = _range(nt, cd.outputs["View Distance"], NEAR[0], NEAR[1], 0.0, 1.0)
        far = _range(nt, cd.outputs["View Distance"], FAR[0], FAR[1], 1.0, 0.18)
        lit = _m(nt, "MULTIPLY", _m(nt, "MULTIPLY", w, _gain_node(nt)),
                 _m(nt, "MULTIPLY", near, far))
        nt.links.new(_m(nt, "MULTIPLY", lit, base), b.inputs["Emission Strength"])
        b.inputs["Roughness"].default_value = 1.0
        b.inputs["Specular IOR Level"].default_value = 0.0
        # an unlit dash is not there: opacity follows its own light (no black streaks)
        out = next(x for x in nt.nodes if x.bl_idname == "ShaderNodeOutputMaterial")
        tr = nt.nodes.new("ShaderNodeBsdfTransparent")
        mx = nt.nodes.new("ShaderNodeMixShader")
        nt.links.new(_m(nt, "MINIMUM", _m(nt, "MULTIPLY", lit, 4.0), 1.0), mx.inputs[0])
        nt.links.new(tr.outputs[0], mx.inputs[1])
        nt.links.new(b.outputs[0], mx.inputs[2])
        nt.links.new(mx.outputs[0], out.inputs["Surface"])
        LB.register(m)
    # core boundary: glassy, partly transparent (the cladding light shows through)
    m = bpy.data.materials.new("tu_core")
    nt = m.node_tree if m.node_tree else None
    try:
        m.use_nodes = True
    except Exception:
        pass
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    pb = nt.nodes.new("ShaderNodeBsdfPrincipled")
    pb.inputs["Base Color"].default_value = (*[c * 0.25 for c in tiers["dark"]], 1)
    pb.inputs["Roughness"].default_value = 0.22
    # its sheen fades in with the light field, so the cut frame shows no reflection ring
    # ... and stays off right next to the lens (its blurred reflection rings the frame otherwise)
    cd = nt.nodes.new("ShaderNodeCameraData")
    near = _range(nt, cd.outputs["View Distance"], 2.0, 7.0, 0.0, 1.0)
    far = _range(nt, cd.outputs["View Distance"], 9.0, 22.0, 1.0, 0.0)
    nt.links.new(_m(nt, "MULTIPLY", _m(nt, "MULTIPLY", _gain_node(nt), _m(nt, "MULTIPLY", near, far)),
                    0.18), pb.inputs["Specular IOR Level"])
    tr = nt.nodes.new("ShaderNodeBsdfTransparent")
    mx = nt.nodes.new("ShaderNodeMixShader")
    mx.inputs[0].default_value = 0.5
    nt.links.new(tr.outputs[0], mx.inputs[1])
    nt.links.new(pb.outputs[0], mx.inputs[2])
    nt.links.new(mx.outputs[0], out.inputs["Surface"])
    LB.register(m)
    # cladding wall (r 1.05) and the matte mouth sleeve
    LB.register(LB.clay_material("tu_clad", "dark", th, rough=0.45, bevel=0.002, noise=6.0,
                                 bump=0.03, var=0.25, color=tuple(c * 0.2 for c in tiers["dark"])))
    # segment joints of the cladding: neutral grey rings, matte, lit by the passing light
    rg = LB.clay_material("tu_ring", "light", th, rough=0.6, bevel=0.002, noise=8.0,
                          bump=0.02, var=0.08, color=tuple(min(0.9, c * 2.2) for c in tiers["light"]))
    nt = rg.node_tree
    b = _bsdf(rg)
    col, sd, sl = LB.ACCENT["lamp"]
    b.inputs["Emission Color"].default_value = (*col, 1)
    w, _ = _xwin(nt)
    cd = nt.nodes.new("ShaderNodeCameraData")
    far = _range(nt, cd.outputs["View Distance"], 10.0, 30.0, 1.0, 0.35)
    nt.links.new(_m(nt, "MULTIPLY", _m(nt, "MULTIPLY", w, far),
                    _m(nt, "MULTIPLY", _gain_node(nt), 0.12 * (sd if th == "dark" else sl))),
                 b.inputs["Emission Strength"])                   # faint: structure, not light
    LB.register(rg)
    mo = LB.clay_material("tu_mouth", "dark", th, rough=0.85, bevel=0.002, noise=6.0, bump=0.02,
                          var=0.1, color=tuple(c * 0.12 for c in tiers["dark"]))
    _bsdf(mo).inputs["Specular IOR Level"].default_value = 0.15
    LB.register(mo)
    LB.register(LB.clay_material("tu_ferrule", "light", th, rough=0.35, bevel=0.004, noise=8.0,
                                 bump=0.03, var=0.05))
    # core glow: transparent + facing-ratio blue emission, windowed like the dashes
    g = bpy.data.materials.new("tu_glow")
    try:
        g.use_nodes = True
    except Exception:
        pass
    nt = g.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    tr = nt.nodes.new("ShaderNodeBsdfTransparent")
    em = nt.nodes.new("ShaderNodeEmission")
    col, sd, sl = LB.ACCENT["lamp"]
    em.inputs["Color"].default_value = (*col, 1)
    add = nt.nodes.new("ShaderNodeAddShader")
    lw = nt.nodes.new("ShaderNodeLayerWeight")
    lw.inputs["Blend"].default_value = 0.5
    f = _m(nt, "POWER", _m(nt, "SUBTRACT", 1.0, lw.outputs["Facing"]), 3.0)
    w, _ = _xwin(nt)
    cd = nt.nodes.new("ShaderNodeCameraData")
    w = _m(nt, "MULTIPLY", w, _range(nt, cd.outputs["View Distance"], 6.0, 20.0, 1.0, 0.0))
    s = _m(nt, "MULTIPLY", _m(nt, "MULTIPLY", f, w), _m(nt, "MULTIPLY", _gain_node(nt),
                                                        0.012 * (sd if th == "dark" else sl)))
    nt.links.new(s, em.inputs["Strength"])
    nt.links.new(tr.outputs[0], add.inputs[0])
    nt.links.new(em.outputs[0], add.inputs[1])
    nt.links.new(add.outputs[0], out.inputs["Surface"])
    LB.register(g)


def _tube(mb, x0, x1, r, mat, seg=64):
    m = Matrix.Translation(((x0 + x1) / 2, 0, 0)) @ Matrix.Rotation(math.pi / 2, 4, "Y")
    res = bmesh.ops.create_cone(mb.bm, cap_ends=False, segments=seg, radius1=r, radius2=r,
                                depth=x1 - x0, matrix=m)
    mb._tag(res["verts"], mat, smooth=True)


def _annulus(mb, x, r0, r1, mat, seg=64, t=0.02):
    bm = mb.bm
    vs = []
    for k in range(seg):
        a = 2 * math.pi * k / seg
        c, s = math.cos(a), math.sin(a)
        vs.append([bm.verts.new((x + dx, c * r, s * r)) for (dx, r) in
                   ((0, r0), (0, r1), (t, r1), (t, r0))])
    for k in range(seg):
        A, B = vs[k], vs[(k + 1) % seg]
        for i in range(4):
            j = (i + 1) % 4
            f = bm.faces.new((A[i], A[j], B[j], B[i]))
            f.material_index = BS.M[mat]


def _key_x(ob, v):
    """Linear keys so the object travels v units per frame along +x (motion blur follows)."""
    for f in (T_A - 1.0, T_B + 1.0):
        ob.location = T0 + Vector((v * (f - T_A), 0, 0))
        ob.keyframe_insert("location", index=0, frame=f)
    act = ob.animation_data.action
    fcs = list(act.fcurves) if hasattr(act, "fcurves") else \
        [fc for ly in act.layers for st in ly.strips for cb in st.channelbags for fc in cb.fcurves]
    for fc in fcs:
        for kp in fc.keyframe_points:
            kp.interpolation = "LINEAR"
        try:
            fc.extrapolation = "LINEAR"
        except Exception:
            pass


# --------------------------------------------------------------------------- build
def build_tunnel():
    DASHES.clear()
    RINGS.clear()
    TU.pop("gains", None)
    new_coll("SET_tunnel")
    materials()
    o = T0
    L, R, F = TU["len"], TU["R"], TU["ferrule"]
    mb = MB()
    _tube(mb, 0.0, MOUTH_X, R, "tu_mouth")                    # dark mouth sleeve (seam 2b)
    _tube(mb, MOUTH_X, F, R, "tu_core")                       # glassy core boundary
    _tube(mb, 0.0, F, R_WALL, "tu_clad")                      # cladding wall (contract r 1.05)
    _annulus(mb, F - 0.02, BORE_R, R_WALL + 0.06, "tu_ferrule")   # ferrule end face
    _tube(mb, F, L, R_WALL + 0.06, "tu_ferrule")              # ferrule body behind the bore
    m = Matrix.Translation(((F + L) / 2, 0, 0)) @ Matrix.Rotation(math.pi / 2, 4, "Y")
    res = bmesh.ops.create_cone(mb.bm, cap_ends=False, segments=64, radius1=BORE_R,
                                radius2=BORE_R, depth=L - F, matrix=m)
    mb._tag(res["verts"], "bore", smooth=True)                # bright bore (contract 2c)
    # beyond the exit: a soft backdrop at the hall's tone (contract 2c)
    hz = "haze"
    if HAZE_K is not None and "haze" in bpy.data.materials:     # pending the lead's OK (POLISH.md)
        m = bpy.data.materials["haze"].copy()
        m.name = "tu_haze"
        _bsdf(m).inputs["Emission Strength"].default_value *= HAZE_K
        _look().register(m)
        hz = "tu_haze"
    mb.tube((L + 6.0, 0, 0), (L + 6.1, 0, 0), 6.0, hz, seg=48, smooth=False)
    TU["tube"] = ob_place(mb, "tunnel", o)
    rm = MB()
    x = MOUTH_X + 0.8
    while x + 0.6 < F - 0.5:
        for (dx, wd) in ((0.0, 0.3), (0.62, 0.08)):         # joint + a thin companion line
            _tube(rm, x + dx, x + dx + wd, RING_R, "tu_ring", seg=96)
            RINGS.append((x + dx, x + dx + wd, RING_R))
        x += RING_STEP
    TU["rings"] = ob_place(rm, "tunnel_rings", o)
    # core glow sleeve
    gm = MB()
    _tube(gm, X_IN[0], F - 0.5, 0.42, "tu_glow", seg=48)
    TU["glow"] = ob_place(gm, "tunnel_glow", o)
    # light dashes: three lanes x four speed classes
    rr = random.Random(3)
    mbs = [MB() for _ in SPEEDS]

    def lane(name, n_ang, r_fn, len_rng, gap_rng, thick_rng, mats, density=1.0):
        for k in range(n_ang):
            a = 2 * math.pi * (k + rr.uniform(-0.3, 0.3)) / n_ang
            r = r_fn()
            for c, (v, wgt) in enumerate(zip(SPEEDS, WEIGHTS)):
                xa, xb = X_IN[0] - v * (T_B - T_A), F - 1.0 - v * (T_B - T_A)
                x = xa + rr.uniform(0, 6.0)
                while True:
                    Ld = rr.uniform(*len_rng) * (1.0 + 0.6 * c / 3.0)
                    if x + Ld > xb:
                        break
                    mat = rr.choices(mats[0], mats[1])[0]
                    t = rr.uniform(*thick_rng)
                    p0 = Vector((x, math.cos(a) * r, math.sin(a) * r))
                    mbs[c].beam(p0, p0 + Vector((Ld, 0, 0)), t, mat)
                    DASHES.append((c, name, r, x, x + Ld, t))
                    x += Ld + rr.uniform(*gap_rng) / (wgt * density)
    lane("wall", 26, lambda: LANES["wall"], (0.3, 3.6), (1.2, 4.5), (0.014, 0.032),
         (DASH_MATS, (0.42, 0.2, 0.38)))
    lane("core", 12, lambda: rr.uniform(0.55, 0.86), (0.15, 1.0), (2.5, 7.0), (0.008, 0.016),
         (DASH_MATS, (0.2, 0.1, 0.7)), density=0.6)
    lane("clad", 18, lambda: LANES["clad"], (1.5, 6.0), (1.5, 5.0), (0.02, 0.03),
         (("tu_dash_w2", "tu_dash_b2"), (0.65, 0.35)))
    TU["dashes"] = []
    for c, mbc in enumerate(mbs):
        ob = ob_place(mbc, "tunnel_dash%d" % c, o)
        _key_x(ob, SPEEDS[c])
        TU["dashes"].append(ob)
    pm = MB()
    pm.sphere((0, 0, 0), PULSE_R, "pulse", sub=3)
    TU["pulse"] = ob_place(pm, "tunnel_pulse", o)
    return TU


def _cam_x(tt, fallback):
    """Tunnel-local camera x at time tt from the journey camera's own f-curve."""
    cam = bpy.context.scene.camera
    ad = cam.animation_data if cam else None
    act = ad.action if ad else None
    if act is None:
        return fallback
    fcs = list(act.fcurves) if hasattr(act, "fcurves") else \
        [fc for ly in act.layers for st in ly.strips for cb in st.channelbags for fc in cb.fcurves]
    for fc in fcs:
        if fc.data_path == "location" and fc.array_index == 0:
            return fc.evaluate(tt) - T0.x
    return fallback


def state(t, D, cam_x):
    """The pulse rides 3 units ahead of the camera (cam_x = camera x relative to T0); the light
    field fades in after the cut."""
    ob = D["pulse"]
    x0 = cam_x + PULSE_LEAD
    x1 = _cam_x(t + 0.5, cam_x) + PULSE_LEAD if 142.5 < t < 161 else x0
    ob.animation_data_clear()
    for (f, x) in ((t, x0), (t + 0.5, x1)):
        ob.location = T0 + Vector((x, 0, 0))
        ob.keyframe_insert("location", frame=f)
    act = ob.animation_data.action
    fcs = list(act.fcurves) if hasattr(act, "fcurves") else \
        [fc for ly in act.layers for st in ly.strips for cb in st.channelbags for fc in cb.fcurves]
    for fc in fcs:
        for kp in fc.keyframe_points:
            kp.interpolation = "LINEAR"
    ob.location = T0 + Vector((x0, 0, 0))
    ob.matrix_world = Matrix.Translation(T0 + Vector((x0, 0, 0)))
    ob.hide_render = x0 > D["len"] - 0.5
    g = smooth((t - T_IN[0]) / (T_IN[1] - T_IN[0]))
    for n in D.get("gains", []):
        n.outputs[0].default_value = g


build = build_tunnel


# --------------------------------------------------------------------------- physical logic
def check(D=None):
    """Tunnel violations (empty list = clean): contract geometry, lanes inside their layers,
    nothing in the pulse's sight line, the entrance dark, dashes clear of the ferrule bore."""
    v = []
    if TU["len"] != 70.0 or TU["ferrule"] != 60.0 or TU["R"] != 1.0:
        v.append("contract 2c: len / ferrule / R changed")
    if abs(R_WALL - 1.05) > 1e-9 or abs(BORE_R - 0.98) > 1e-9:
        v.append("contract 2b/2c: wall or bore radius changed")
    if PULSE_R != 0.09 or PULSE_LEAD != 3.0:
        v.append("contract 2b: pulse radius / lead changed")
    if X_IN[0] < 18.0 - 1e-9:
        v.append("contract 2b: light starts before x = 18")
    if D is not None and D["pulse"].dimensions.x and abs(D["pulse"].dimensions.x / 2 - PULSE_R) > 2e-3:
        v.append("pulse mesh radius %.4f != %.3f" % (D["pulse"].dimensions.x / 2, PULSE_R))
    for (c, lane, r, x0, x1, t) in DASHES:
        h = t * math.sqrt(2) / 2                          # beam half-diagonal
        if lane in ("wall", "core") and r + h >= TU["R"] - 1e-4:
            v.append("%s dash pokes through the core boundary (r %.3f)" % (lane, r))
        if lane == "clad" and not (TU["R"] + 1e-4 < r - h and r + h < R_WALL - 1e-4):
            v.append("cladding dash outside its layer (r %.3f)" % r)
        if r - h < PULSE_R * 2.5:
            v.append("dash in the pulse sight line (r %.3f)" % r)
        x1_end = x1 + SPEEDS[c] * (T_B - T_A)
        if x1_end > TU["ferrule"] - 0.5:
            v.append("dash reaches the ferrule (x %.2f at the end of the shot)" % x1_end)
        if r + h > BORE_R and x1_end > TU["ferrule"]:
            v.append("dash would cut the bore wall")
    hmax = max((r + t * math.sqrt(2) / 2 for (c, ln, r, x0, x1, t) in DASHES if ln != "clad"),
               default=0.0)
    for (x0, x1, r) in RINGS:
        if not (hmax + 1e-4 < r < TU["R"]):
            v.append("cladding ring at r %.4f collides with the dash lanes or the wall" % r)
        if x0 < MOUTH_X or x1 > TU["ferrule"]:
            v.append("cladding ring outside the core section (x %.2f)" % x0)
    if X_OUT[1] > TU["ferrule"] + 1e-9:
        v.append("light window runs into the ferrule")
    return sorted(set(v))
