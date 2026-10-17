"""Look bible of the size journey (owned by the lead). Every set uses these functions instead of
ad-hoc materials, lights or render settings, so the five scales read as one film.

Materials
  clay_material(name, tier, ...)   clay with a bevel node (no razor edges), micro-noise bump,
                                   subtle value + roughness variation; tiers "light" | "mid" | "dark"
  emission_material(name, kind)    the only emissives: kind in ACCENT (blue #3b82f6 or white)
  glass_material(name)             black glossy cover glass (phone screen)
  register(mat)                    make a material usable by MB meshes (by name, like "clay")
  apply_materials(theme)           upgrade the shared registry ("clay", "clay2", ...) in place
Render / camera
  render_preset(scene, "draft" | "review" | "final", res=None)
  bloom(scene, threshold, strength, size)      compositor glare on emissives
  haze(scene, strength, color, start, depth)   mist-pass atmosphere (exteriors only)
  set_haze(strength)                           per-frame haze strength (0 for macro/interior)
  dof(cam, focus, fstop)                       depth of field; focus = Vector | object | metres
Lighting
  rig(name, target, scale, ...)    key / fill / rim area lights sized for the set's scale,
                                   optionally light-linked to one collection
  room_volume(name, lo, hi, density)  subtle interior volumetrics (final only, it is costly)
"""
import math

import bpy
from mathutils import Vector

import build_scene as BS

# --------------------------------------------------------------------------- palette
# linear RGB; dark theme is the site's default, light theme mirrors it
CLAY_TIERS = {
    "dark": {"light": (0.115, 0.122, 0.135), "mid": (0.060, 0.064, 0.072),
             "dark": (0.030, 0.032, 0.038)},
    "light": {"light": (0.86, 0.88, 0.92), "mid": (0.70, 0.73, 0.78), "dark": (0.48, 0.51, 0.57)},
}
BLUE = (0.044, 0.223, 0.922)            # #3b82f6 in linear sRGB
WHITE_LED = (0.88, 0.93, 1.0)
# kind -> (colour, strength dark theme, strength light theme)
ACCENT = {
    "accent": (BLUE, 7.0, 3.0),          # glowing lines, glass bands, UI accents
    "accent_soft": (BLUE, 3.0, 1.5),     # service panels, large glowing areas
    "pulse": ((0.35, 0.6, 1.0), 45.0, 24.0),   # travelling pulses (white-blue core)
    "led_blue": (BLUE, 12.0, 6.0),       # tiny status LEDs
    "led_white": (WHITE_LED, 10.0, 5.0),
    "lamp": (WHITE_LED, 6.0, 4.0),       # ceiling light lines
    "bore": ((0.75, 0.85, 1.0), 14.0, 10.0),   # bright fibre bores (seam 2c whiteout)
}
NOISE_SCALE = {"phone": 60.0, "board": 15.0, "hall": 4.0, "ext": 0.6}   # per world unit


def _tree(m):
    try:
        m.use_nodes = True
    except Exception:
        pass
    nt = m.node_tree
    nt.nodes.clear()
    return nt


def _mix_rgba(nt):
    mx = nt.nodes.new("ShaderNodeMix")
    mx.data_type = "RGBA"
    cols = [s for s in mx.inputs if s.type == "RGBA"]
    out = [s for s in mx.outputs if s.type == "RGBA"][0]
    return mx, mx.inputs[0], cols[0], cols[1], out


def clay_material(name, tier="mid", theme="dark", rough=0.55, bevel=0.008, noise=None,
                  bump=0.04, var=0.06, color=None, metallic=0.0, mat=None, scale_attr=None):
    """Clay: tier colour +-var value variation, roughness +-0.06, micro bump, bevelled normals.
    noise = noise scale per world unit (use NOISE_SCALE[set]); bevel = radius in world units."""
    m = mat or bpy.data.materials.new(name)
    nt = _tree(m)
    n, l = nt.nodes, nt.links
    out = n.new("ShaderNodeOutputMaterial")
    bsdf = n.new("ShaderNodeBsdfPrincipled")
    l.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    base = color or CLAY_TIERS[theme][tier]
    tc = n.new("ShaderNodeTexCoord")
    nz = n.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = noise or 20.0
    nz.inputs["Detail"].default_value = 6.0
    nz.inputs["Roughness"].default_value = 0.55
    l.new(tc.outputs["Object"], nz.inputs["Vector"])
    mx, fac, a, b, o = _mix_rgba(nt)
    a.default_value = (*[c * (1 - var) for c in base], 1)
    b.default_value = (*[c * (1 + var) for c in base], 1)
    l.new(nz.outputs["Fac"], fac)
    l.new(o, bsdf.inputs["Base Color"])
    mr = n.new("ShaderNodeMapRange")
    mr.inputs["To Min"].default_value = rough - 0.06
    mr.inputs["To Max"].default_value = rough + 0.06
    l.new(nz.outputs["Fac"], mr.inputs["Value"])
    l.new(mr.outputs["Result"], bsdf.inputs["Roughness"])
    bsdf.inputs["Metallic"].default_value = metallic
    bv = n.new("ShaderNodeBevel")
    bv.samples = 6
    bv.inputs["Radius"].default_value = bevel
    bp = n.new("ShaderNodeBump")
    bp.inputs["Strength"].default_value = bump
    bp.inputs["Distance"].default_value = bevel * 0.2
    if scale_attr:
        # shared materials across set scales: radius = bevel * object["look_scale"]
        at = n.new("ShaderNodeAttribute")
        at.attribute_type = "OBJECT"
        at.attribute_name = scale_attr
        for sock, k in ((bv.inputs["Radius"], bevel), (bp.inputs["Distance"], bevel * 0.2)):
            mu = n.new("ShaderNodeMath")
            mu.operation = "MULTIPLY"
            mu.inputs[1].default_value = k
            l.new(at.outputs["Fac"], mu.inputs[0])
            l.new(mu.outputs[0], sock)
    l.new(nz.outputs["Fac"], bp.inputs["Height"])
    l.new(bv.outputs["Normal"], bp.inputs["Normal"])
    l.new(bp.outputs["Normal"], bsdf.inputs["Normal"])
    return m


def emission_material(name, kind="accent", theme="dark", mat=None, base=(0.01, 0.03, 0.12)):
    col, s_dark, s_light = ACCENT[kind]
    m = mat or bpy.data.materials.new(name)
    nt = _tree(m)
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
    nt.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    bsdf.inputs["Base Color"].default_value = (*base, 1)
    bsdf.inputs["Roughness"].default_value = 0.35
    bsdf.inputs["Emission Color"].default_value = (*col, 1)
    bsdf.inputs["Emission Strength"].default_value = s_dark if theme == "dark" else s_light
    return m


def glass_material(name, theme="dark", mat=None):
    m = mat or bpy.data.materials.new(name)
    nt = _tree(m)
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
    nt.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    bsdf.inputs["Base Color"].default_value = (0.003, 0.004, 0.006, 1) if theme == "dark" else (0.02, 0.022, 0.026, 1)
    bsdf.inputs["Roughness"].default_value = 0.05
    bsdf.inputs["Coat Weight"].default_value = 1.0
    bsdf.inputs["Coat Roughness"].default_value = 0.02
    bsdf.inputs["Specular IOR Level"].default_value = 0.6
    return m


def register(mat):
    """Make `mat` available to MB meshes by name (meshes created afterwards get the slot)."""
    if mat.name not in BS.M:
        BS.MATS.append(mat)
        BS.M[mat.name] = len(BS.MATS) - 1
    return mat


# registry name -> how it is upgraded by apply_materials()
UPGRADE = {
    "clay": ("clay", "mid"), "clay2": ("clay", "dark"), "trim": ("clay", "dark"),
    "pad": ("clay", "dark"), "tree": ("clay", "mid"), "ground": ("keep", None),
    "road": ("keep", None), "mark": ("clay", "light"), "metal": ("metal", "mid"),
    "cable": ("clay", "dark"), "copper": ("metal", "light"), "solar": ("keep", None),
    "screen": ("glass", None),
    "line": ("emit", "accent"), "glass": ("emit", "accent"), "pulse": ("emit", "pulse"),
    "lamp": ("emit", "lamp"), "bore": ("emit", "bore"),
    "svc_api": ("emit", "accent_soft"), "svc_db": ("emit", "accent_soft"),
    "svc_q": ("emit", "accent_soft"),
}


def apply_materials(theme="dark", noise=20.0):
    """Upgrade the shared registry in place (all existing meshes follow). Colours of "keep"
    materials and the base value of the legacy materials stay, so seams keep matching."""
    for name, (kind, tier) in UPGRADE.items():
        m = bpy.data.materials.get(name)
        if m is None:
            continue
        b = m.node_tree.nodes.get("Principled BSDF") if m.node_tree else None
        col = tuple(b.inputs["Base Color"].default_value[:3]) if b else None
        rough = b.inputs["Roughness"].default_value if b else 0.55
        if kind == "clay":
            clay_material(name, tier, theme, rough=rough, color=col, noise=noise, mat=m,
                          scale_attr="look_scale")
        elif kind == "metal":
            clay_material(name, tier, theme, rough=0.38, color=col, noise=noise, metallic=0.35, mat=m,
                          scale_attr="look_scale")
        elif kind == "glass":
            glass_material(name, theme, mat=m)
        elif kind == "emit":
            emission_material(name, tier, theme, mat=m)


# --------------------------------------------------------------------------- render presets
PRESETS = {
    "draft": dict(res=(640, 480), samples=16, adaptive=0.05, quality="BALANCED"),
    "review": dict(res=(960, 720), samples=64, adaptive=0.02, quality="HIGH"),
    "final": dict(res=(1280, 960), samples=256, adaptive=0.01, quality="HIGH"),
    "web": dict(res=(1280, 960), samples=64, adaptive=0.02, quality="HIGH"),     # V4 finals (2.1 h for both themes)
}


def render_preset(scene, name, res=None, motion_blur=True):
    p = PRESETS[name]
    r = scene.render
    w, h = (int(v) for v in res.split("x")) if res else p["res"]
    r.resolution_x, r.resolution_y, r.resolution_percentage = w, h, 100
    cy = scene.cycles
    cy.samples = p["samples"]
    cy.use_adaptive_sampling = True
    cy.adaptive_threshold = p["adaptive"]
    cy.use_denoising = True
    cy.denoiser = "OPENIMAGEDENOISE"
    for k, v in (("denoising_input_passes", "RGB_ALBEDO_NORMAL"), ("denoising_prefilter", "ACCURATE"),
                 ("denoising_quality", p["quality"]), ("denoising_use_gpu", True)):
        try:
            setattr(cy, k, v)
        except Exception:
            pass
    cy.seed = 0
    cy.use_animated_seed = False
    cy.sample_clamp_direct = 0.0
    cy.sample_clamp_indirect = 10.0      # kills fireflies from small bright emitters
    cy.blur_glossy = 1.0
    r.use_motion_blur = motion_blur
    r.motion_blur_shutter = 0.5
    vs = scene.view_settings
    vs.view_transform = "AgX"
    try:
        vs.look = "AgX - Medium High Contrast" if BS.ARGS.theme == "dark" else "AgX - Base Contrast"
    except Exception:
        pass
    bloom(scene)
    return p


def _comp(scene):
    tree = scene.compositing_node_group
    return tree


def bloom(scene, threshold=None, strength=None, size=0.6):
    tree = _comp(scene)
    gl = next((n for n in tree.nodes if n.bl_idname == "CompositorNodeGlare"), None)
    if gl is None:
        return
    th = BS.TH["bloom"]
    gl.inputs["Threshold"].default_value = th[0] if threshold is None else threshold
    gl.inputs["Strength"].default_value = th[1] if strength is None else strength
    gl.inputs["Size"].default_value = size


HAZE = {}


def _new_node(tree, idnames):
    for idn in idnames:
        try:
            return tree.nodes.new(idn)
        except Exception:
            continue
    raise RuntimeError("no compositor node among %s" % (idnames,))


def haze(scene, strength=0.35, color=(0.02, 0.03, 0.05), start=60.0, depth=900.0):
    """Mist-pass atmosphere: image = mix(image, color, mist * strength). Exteriors only."""
    vl = scene.view_layers[0]
    vl.use_pass_mist = True
    w = scene.world
    w.mist_settings.start = start
    w.mist_settings.depth = depth
    w.mist_settings.falloff = "QUADRATIC"
    tree = _comp(scene)
    rl = next(n for n in tree.nodes if n.bl_idname == "CompositorNodeRLayers")
    out = next(n for n in tree.nodes if n.bl_idname == "NodeGroupOutput")
    last = out.inputs[0].links[0].from_socket
    mul = _new_node(tree, ("CompositorNodeMath", "ShaderNodeMath"))
    mul.operation = "MULTIPLY"
    tree.links.new(rl.outputs["Mist"], mul.inputs[0])
    mul.inputs[1].default_value = strength
    mx = _new_node(tree, ("CompositorNodeMixRGB", "ShaderNodeMix"))
    if mx.bl_idname == "ShaderNodeMix":
        mx.data_type = "RGBA"
        cols = [s for s in mx.inputs if s.type == "RGBA"]
        fac, ca, cb = mx.inputs[0], cols[0], cols[1]
        res = [s for s in mx.outputs if s.type == "RGBA"][0]
    else:
        fac, ca, cb, res = mx.inputs[0], mx.inputs[1], mx.inputs[2], mx.outputs[0]
    tree.links.new(mul.outputs[0], fac)
    tree.links.new(last, ca)
    cb.default_value = (*color, 1)
    tree.links.new(res, out.inputs[0])
    HAZE["mul"] = mul
    return mul


def set_haze(strength):
    if "mul" in HAZE:
        HAZE["mul"].inputs[1].default_value = strength


def dof(cam, focus, fstop=2.8):
    """focus: world Vector, an object, or a distance in metres. Macro: f/1.4-2.8 on the pulse;
    aerial: deep focus (fstop 16+ or use_dof False)."""
    d = cam.data.dof
    d.use_dof = True
    d.aperture_fstop = fstop
    if isinstance(focus, bpy.types.Object):
        d.focus_object = focus
    elif isinstance(focus, Vector):
        d.focus_object = None
        d.focus_distance = max((focus - cam.matrix_world.translation).length, 1e-4)
    else:
        d.focus_object = None
        d.focus_distance = float(focus)


# --------------------------------------------------------------------------- lighting
def _area(name, coll, loc, target, size, energy, color):
    ld = bpy.data.lights.new(name, "AREA")
    ld.size = size
    ld.energy = energy
    ld.color = color
    ob = bpy.data.objects.new(name, ld)
    ob.location = loc
    ob.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    coll.objects.link(ob)
    return ob


def rig(name, target, scale, coll, key=(-35.0, 50.0, 1.0), fill=(145.0, 25.0, 0.25),
        rim=(110.0, 15.0, 0.6), base_energy=400.0, receivers=None):
    """Key/fill/rim area-light rig around `target` for a set of characteristic size `scale`
    (metres or set units). Tuples are (azimuth deg, elevation deg, relative energy). Energy scales
    with scale^2 so the exposure is the same at every scale. receivers: light-link collection."""
    t = Vector(target)
    out = []
    for nm, (az, el, k), col in (("key", key, (1.0, 0.97, 0.94)), ("fill", fill, (0.75, 0.82, 1.0)),
                                  ("rim", rim, (0.65, 0.78, 1.0))):
        a, e = math.radians(az), math.radians(el)
        d = 6.0 * scale
        loc = t + Vector((math.cos(e) * math.cos(a), math.cos(e) * math.sin(a), math.sin(e))) * d
        ob = _area("%s_%s" % (name, nm), coll, loc, t, 2.0 * scale, base_energy * k * scale ** 2, col)
        if receivers is not None:
            ob.light_linking.receiver_collection = receivers
        out.append(ob)
    return out


def room_volume(name, lo, hi, coll, density=0.004, anisotropy=0.3):
    """Subtle volumetric air for interiors (final preset only; doubles render time)."""
    from build_scene import MB
    mb = MB()
    mb.box(lo[0], lo[1], lo[2], hi[0], hi[1], hi[2], "clay")
    me = mb.mesh(name)
    m = bpy.data.materials.new(name + "_vol")
    nt = _tree(m)
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    pv = nt.nodes.new("ShaderNodeVolumePrincipled")
    pv.inputs["Density"].default_value = density
    pv.inputs["Anisotropy"].default_value = anisotropy
    nt.links.new(pv.outputs[0], out.inputs["Volume"])
    me.materials.clear()
    me.materials.append(m)
    ob = bpy.data.objects.new(name, me)
    coll.objects.link(ob)
    return ob


# per-set bevel scale for the shared registry materials (relative to the board = 1): the phone's
# code bars are 4x smaller than the SoC marks, the server modules 30x smaller than the chillers
LOOK_SCALE = {"SET_phone": 0.25, "SET_board": 1.0, "SET_tunnel": 1.0, "SET_hall": 1.0}


def tag_look_scale(collections, special=None):
    """Write object["look_scale"] on every object (the shader reads it; missing = no bevel)."""
    for ob in bpy.data.objects:
        ob["look_scale"] = 1.0
    for cname, k in LOOK_SCALE.items():
        c = collections.get(cname)
        if c is None:
            continue
        for ob in c.all_objects:
            ob["look_scale"] = k
    for ob, k in (special or {}).items():
        ob["look_scale"] = k


WAVE = {}


def add_wave(mat_names, centre, wavelength=1200.0):
    """Emission strength = base * (1 + A * (0.65 sin(T - k d) + 0.35 sin(0.53 T + 1.7 - 0.55 k d))),
    d = distance of the object (or instance) from `centre`. A and T are driven per frame with
    set_wave(); A = 0 leaves the material exactly as before."""
    k = 2.0 * math.pi / wavelength
    for nm in mat_names:
        m = bpy.data.materials.get(nm)
        if m is None or not m.node_tree:
            continue
        nt = m.node_tree
        b = next((n for n in nt.nodes if n.bl_idname == "ShaderNodeBsdfPrincipled"), None)
        if b is None or b.inputs["Emission Strength"].is_linked:
            continue
        base = b.inputs["Emission Strength"].default_value
        n, l = nt.nodes, nt.links
        oi = n.new("ShaderNodeObjectInfo")
        sub = n.new("ShaderNodeVectorMath")
        sub.operation = "SUBTRACT"
        sub.inputs[1].default_value = tuple(centre)
        l.new(oi.outputs["Location"], sub.inputs[0])
        ln = n.new("ShaderNodeVectorMath")
        ln.operation = "LENGTH"
        l.new(sub.outputs[0], ln.inputs[0])
        tA = WAVE.setdefault("A", [])
        tT = WAVE.setdefault("T", [])
        va = n.new("ShaderNodeValue")
        vt = n.new("ShaderNodeValue")
        va.outputs[0].default_value = 0.0
        vt.outputs[0].default_value = 0.0
        tA.append(va)
        tT.append(vt)

        def mth(op, a, b_):
            m_ = n.new("ShaderNodeMath")
            m_.operation = op
            for i, v in enumerate((a, b_)):
                if isinstance(v, (int, float)):
                    m_.inputs[i].default_value = v
                else:
                    l.new(v, m_.inputs[i])
            return m_.outputs[0]
        kd = mth("MULTIPLY", ln.outputs["Value"], k)
        s1 = mth("SINE", mth("SUBTRACT", vt.outputs[0], kd), 0.0)
        ph2 = mth("SUBTRACT", mth("ADD", mth("MULTIPLY", vt.outputs[0], 0.53), 1.7), mth("MULTIPLY", kd, 0.55))
        s2 = mth("SINE", ph2, 0.0)
        mix = mth("ADD", mth("MULTIPLY", s1, 0.65), mth("MULTIPLY", s2, 0.35))
        fac = mth("ADD", mth("MULTIPLY", mix, va.outputs[0]), 1.0)
        out = mth("MULTIPLY", fac, base)
        l.new(out, b.inputs["Emission Strength"])


def set_wave(amplitude, phase):
    for v in WAVE.get("A", []):
        v.outputs[0].default_value = amplitude
    for v in WAVE.get("T", []):
        v.outputs[0].default_value = phase
