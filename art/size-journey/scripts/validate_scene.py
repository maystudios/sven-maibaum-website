"""Plausibility validator for the size scene. Runs inside Blender after build_scene.py:

  blender -b --factory-startup -P scripts/build_scene.py -- --validate --out renders/validate.txt

For every level (still frame = last frame of its segment) it checks:
  overlap    mesh-mesh intersections between objects (BVH), with an explicit allow-list
  crossing   two different roads overlapping without a junction; drives cutting into roads
  dangling   road ends inside the frame that touch neither road, junction, turning area nor plot
  access     plots / lots without a drive or road; road built after the plot it serves
  rotor      rotor sweep (radius + margin) touching anything; rotor-rotor spacing
  ground     lowest vertex vs. supporting surface (ground, pad, lot, road); roof units on roofs
  cable      overhead-line ends not on a pylon/gantry attach point; chain straight + equal spans;
             line ending at a pylon inside the frame; cable drawn before its pylons stand
  vehicle    vehicles not in a right-hand lane / stall, not aligned, or standing in a junction
  fiber      data lines not orthogonal, cutting through buildings/tanks/trees, loose ends
  trench     buried power routes: turbines/solar -> substation -> data-centre plot
  order      growth logic: feeder before hall, parent before sprout, road before plot
Each check prints 'V L<level> <check>: <detail>'; the total is returned.
"""
import math

import bpy
from mathutils import Vector
from mathutils.bvhtree import BVHTree

TOL_Z = 0.05          # 5 cm: ground-contact tolerance
ROTOR_MARGIN = 3.0    # m around the swept disc
FLAT = {"pad", "lot", "road", "junction", "trench", "fiber", "ground", "pavement"}
SKIP = {"pulse"}
ALLOW = {
    frozenset(p) for p in [
        ("pad", "building"), ("pad", "equip"), ("pad", "tank"), ("pad", "fence"),
        ("pad", "gantry"), ("pad", "bus"), ("pad", "rack"), ("pad", "fiber"), ("pad", "trench"),
        ("pad", "glass"), ("pad", "tree"), ("pad", "roof"),
        ("lot", "vehicle"), ("lot", "fiber"), ("lot", "trench"), ("lot", "tree"),
        ("road", "vehicle"), ("road", "fiber"), ("road", "trench"), ("road", "junction"),
        ("junction", "fiber"), ("junction", "trench"), ("junction", "junction"),
        ("fiber", "fiber"), ("fiber", "trench"), ("trench", "trench"),
        ("fiber", "building"), ("fiber", "tank"),
        ("trench", "turbine"), ("trench", "solar"),
        ("cable", "pylon"), ("cable", "gantry"), ("bus", "gantry"), ("bus", "equip"),
        ("rack", "tank"), ("rack", "rack"),
        ("tree", "tree"),  # touching canopies are natural; clearance rules cover the rest
        ("pavement", "streetlight"), ("pavement", "road"), ("pavement", "junction"),
        ("pavement", "pad"), ("pavement", "lot"), ("pavement", "fiber"), ("pavement", "trench"),
        ("pavement", "tree"),
    ]
}
PARENT_CATS = {"roof", "glass", "fan", "rotor", "fence"}


def in_frame(x, y, margin=0.0):
    u = (x + y) / math.sqrt(2)
    v = (-x + y) / math.sqrt(2)
    return abs(u - 2.0) < 102 + margin and -133 - margin < v - 12.0 < 133 + margin


class Obj:
    __slots__ = ("ob", "name", "cat", "verts", "polys", "lo", "hi", "_bvh")

    def __init__(self, ob, dg):
        ev = ob.evaluated_get(dg)
        me = ev.to_mesh()
        mw = ev.matrix_world.copy()
        self.verts = [mw @ v.co for v in me.vertices]
        self.polys = [tuple(p.vertices) for p in me.polygons]
        ev.to_mesh_clear()
        self.ob, self.name, self.cat = ob, ob.name, ob["cat"]
        if self.verts:
            self.lo = Vector((min(v.x for v in self.verts), min(v.y for v in self.verts),
                              min(v.z for v in self.verts)))
            self.hi = Vector((max(v.x for v in self.verts), max(v.y for v in self.verts),
                              max(v.z for v in self.verts)))
        else:
            self.lo = self.hi = ob.matrix_world.translation.copy()
        self._bvh = None

    @property
    def bvh(self):
        if self._bvh is None:
            self._bvh = BVHTree.FromPolygons(self.verts, self.polys, epsilon=0.0)
        return self._bvh

    def rect(self, m=0.0):
        return (self.lo.x - m, self.lo.y - m, self.hi.x + m, self.hi.y + m)

    def get(self, k, d=None):
        return self.ob.get(k, d)


def rect_overlap(a, b):
    return min(a[2], b[2]) - max(a[0], b[0]), min(a[3], b[3]) - max(a[1], b[1])


def rect_contains(r, x, y, m=0.0):
    return r[0] - m <= x <= r[2] + m and r[1] - m <= y <= r[3] + m


def rect_dist(r, x, y):
    dx = max(r[0] - x, 0.0, x - r[2])
    dy = max(r[1] - y, 0.0, y - r[3])
    return math.hypot(dx, dy)


def seg_dist(p, a, b):
    ab = b - a
    t = 0.0 if ab.length_squared < 1e-9 else max(0.0, min(1.0, (p - a).dot(ab) / ab.length_squared))
    return (a + ab * t - p).length


def poly_pts(o):
    f = list(o.get("path"))
    return [Vector((f[i], f[i + 1])) for i in range(0, len(f), 2)]


def seg_hits_rect(a, b, r, step=0.25):
    n = max(int((b - a).length / step), 1)
    for i in range(n + 1):
        p = a.lerp(b, i / n)
        if rect_contains(r, p.x, p.y):
            return True
    return False


def parts(o):
    f = o.get("parts")
    if f is None:
        return [o.rect()]
    f = list(f)
    return [tuple(f[i:i + 4]) for i in range(0, len(f), 4)]


def cable_ends(o):
    sp = o.ob.data.splines[0]
    mw = o.ob.matrix_world
    return [mw @ Vector(sp.points[0].co[:3]), mw @ Vector(sp.points[-1].co[:3])]


def attached(a, b):
    def lst(o):
        return [s for s in str(o.get("attached", "")).split(",") if s]
    return b.name in lst(a) or a.name in lst(b)


def parented(a, b):
    return a.get("parent") == b.name or b.get("parent") == a.name


def check_level(lv, scene, objs, report):
    by_name = {o.name: o for o in objs}
    cats = {}
    for o in objs:
        cats.setdefault(o.cat, []).append(o)
    roadlike = cats.get("road", []) + cats.get("junction", [])

    # ------------------------------------------------------------ overlap
    order = sorted((o for o in objs if o.cat not in SKIP and o.cat != "ground"), key=lambda o: o.lo.x)
    active = []
    for o in order:
        active = [a for a in active if a.hi.x >= o.lo.x - 0.01]
        for a in active:
            if a.hi.y < o.lo.y - 0.01 or o.hi.y < a.lo.y - 0.01 or \
               a.hi.z < o.lo.z - 0.01 or o.hi.z < a.lo.z - 0.01:
                continue
            pair = frozenset((a.cat, o.cat))
            if parented(a, o) or attached(a, o):
                continue
            if a.cat == "road" and o.cat == "road":
                continue  # handled by the crossing check
            if "tree" in pair and pair & {"road", "junction"}:
                continue  # handled by the 2D tree clearance check
            if pair in ALLOW:
                continue
            if a.cat == "cable" and o.cat == "cable":
                if any((p - q).length < 0.6 for p in cable_ends(a) for q in cable_ends(o)):
                    continue
            if pair <= {"pad", "lot", "road", "junction"}:
                if not a.bvh.overlap(o.bvh):
                    continue
                w = max(min(rect_overlap(ra, rb)) for ra in parts(a) for rb in parts(o))
                h = w
                if w > 0.3:
                    report(lv, "overlap", "%s (%s) intrudes into %s (%s) by %.1f m"
                           % (a.name, a.cat, o.name, o.cat, min(w, h)))
                continue
            if a.bvh.overlap(o.bvh):
                report(lv, "overlap", "%s (%s) intersects %s (%s)" % (a.name, a.cat, o.name, o.cat))
        active.append(o)

    # trees keep clear of roads and junctions (crown footprint, 2D)
    for t in cats.get("tree", []):
        c = (t.lo + t.hi) / 2
        hx, hy = (t.hi.x - t.lo.x) * 0.42, (t.hi.y - t.lo.y) * 0.42
        cr = (c.x - hx, c.y - hy, c.x + hx, c.y + hy)
        tl = Vector((t.ob.location.x, t.ob.location.y))
        for r in roadlike:
            if any(min(rect_overlap(cr, pr)) > 0 for pr in parts(r)):
                report(lv, "overlap", "tree %s over %s %s" % (t.name, r.cat, r.name))
                break
        for r in cats.get("trench", []) + cats.get("fiber", []):
            pts = poly_pts(r)
            if min(seg_dist(tl, a, b) for a, b in zip(pts[:-1], pts[1:])) < 1.0:
                report(lv, "overlap", "tree %s stands on %s %s" % (t.name, r.cat, r.name))
                break

    # ------------------------------------------------------------ roads
    roads = cats.get("road", [])
    juncs = cats.get("junction", [])
    for i, a in enumerate(roads):
        for b in roads[i + 1:]:
            if a.get("rid") == b.get("rid"):
                continue
            w, h = rect_overlap(a.rect(), b.rect())
            if min(w, h) < -0.3:
                continue
            drive = "drive" in (a.get("kind"), b.get("kind"))
            if drive:
                if min(w, h) > 0.3:
                    report(lv, "crossing", "drive %s cuts into %s" % (a.name, b.name))
                continue
            ra, rb = a.rect(), b.rect()
            cx = (max(ra[0], rb[0]) + min(ra[2], rb[2])) / 2
            cy = (max(ra[1], rb[1]) + min(ra[3], rb[3])) / 2
            if not any(rect_contains(list(j.get("core")), cx, cy, 0.6) for j in juncs):
                report(lv, "crossing", "%s x %s at (%.1f, %.1f) has no junction" % (a.name, b.name, cx, cy))
    for r in roads:
        if r.get("kind") == "turn" or r.get("p0") is None:
            continue
        for key in ("p0", "p1"):
            x, y = list(r.get(key))
            if not in_frame(x, y, 5):
                continue
            ok = any(o is not r and rect_contains(o.rect(), x, y, 0.6) for o in roadlike)
            if not ok and r.get("kind") == "drive":
                m = float(r.get("w", 4)) / 2 + 0.6
                ok = any(rect_contains(o.rect(), x, y, m) for o in cats.get("pad", []) + cats.get("lot", []))
            if not ok:
                report(lv, "dangling", "%s ends loose at (%.1f, %.1f)" % (r.name, x, y))
    for p in cats.get("pad", []) + cats.get("lot", []):
        gap = 2.0 if p.cat == "pad" else 1.0
        acc = [r for r in roadlike + (cats.get("lot", []) if p.cat == "pad" else [])
               if r is not p and min(rect_overlap(p.rect(gap), r.rect())) > 0]
        if not acc:
            report(lv, "access", "%s has no drive or road" % p.name)
        elif min(float(r.get("born", 0)) for r in acc) > float(p.get("born", 0)) + 0.01:
            report(lv, "order", "%s appears before the road that serves it" % p.name)

    # ------------------------------------------------------------ rotors
    rotors = cats.get("rotor", [])
    hubs = []
    for ro in rotors:
        mw = ro.ob.matrix_world
        hub = mw.translation.copy()
        axis = (mw.to_3x3() @ Vector((1, 0, 0))).normalized()
        R = max(((v - hub) - axis * (v - hub).dot(axis)).length for v in ro.verts)
        hubs.append((ro, hub, axis, R))
        RR = R + ROTOR_MARGIN
        for o in objs:
            if o is ro or o.cat in FLAT or o.name == ro.get("parent"):
                continue
            if rect_dist(o.rect(), hub.x, hub.y) > RR or o.hi.z < hub.z - RR:
                continue
            pts = list(o.verts)
            if o.cat == "cable":
                pts = []
                for k in range(len(o.verts) - 1):
                    a, b = o.verts[k], o.verts[k + 1]
                    n = max(int((b - a).length / 0.5), 1)
                    pts += [a.lerp(b, s / n) for s in range(n + 1)]
            for v in pts:
                d = v - hub
                ax = d.dot(axis)
                if abs(ax) < 2.0 + ROTOR_MARGIN and (d - axis * ax).length < RR:
                    report(lv, "rotor", "%s sweep (R %.1f + %.0f m) touches %s" % (ro.name, R, ROTOR_MARGIN, o.name))
                    break
    for i, (a, ha, _, ra) in enumerate(hubs):
        for (b, hb, _, rb) in hubs[i + 1:]:
            if (ha - hb).length < ra + rb + 2 * ROTOR_MARGIN:
                report(lv, "rotor", "%s and %s too close (%.1f m)" % (a.name, b.name, (ha - hb).length))

    # ------------------------------------------------------------ ground contact
    supports = cats.get("pad", []) + cats.get("lot", []) + roads + juncs
    for o in objs:
        if o.cat in SKIP or o.cat in {"ground", "cable", "rotor", "glass", "bus"}:
            continue
        if o.get("floating_ok") or o.get("embedded_ok"):
            continue
        if o.cat == "roof":
            par = by_name.get(o.get("parent"))
            if par is None:
                report(lv, "ground", "%s has no roof under it" % o.name)
                continue
            if abs(o.lo.z - float(par.get("roof_h"))) > TOL_Z:
                report(lv, "ground", "%s not on roof of %s (z %.2f vs %.2f)" % (o.name, par.name, o.lo.z, par.get("roof_h")))
            inv = par.ob.matrix_world.inverted()
            loc = [inv @ v for v in o.verts]
            lr = (min(v.x for v in loc), min(v.y for v in loc), max(v.x for v in loc), max(v.y for v in loc))
            rr, rc = list(par.get("roof_rect")), list(par.get("roof_core"))
            if not (lr[0] >= rr[0] - 0.01 and lr[1] >= rr[1] - 0.01 and lr[2] <= rr[2] + 0.01 and lr[3] <= rr[3] + 0.01):
                report(lv, "ground", "%s overhangs the roof of %s" % (o.name, par.name))
            w, h = rect_overlap(lr, rc)
            if w > 0.01 and h > 0.01:
                report(lv, "overlap", "%s collides with the stair core of %s" % (o.name, par.name))
            continue
        if o.cat == "fan":
            par = by_name.get(o.get("parent"))
            if par is None or abs(o.lo.z - par.hi.z) > TOL_Z:
                report(lv, "ground", "%s not seated on its fan deck" % o.name)
            continue
        if o.cat in FLAT:
            if abs(o.lo.z) > TOL_Z:
                report(lv, "ground", "%s (%s) bottom at %.2f m" % (o.name, o.cat, o.lo.z))
            continue
        c = (o.lo + o.hi) / 2
        cand = [0.0] + [float(s.get("top", 0.0)) for s in supports
                        if rect_contains(s.rect(), c.x, c.y)]
        if min(abs(o.lo.z - z) for z in cand) > TOL_Z:
            report(lv, "ground", "%s (%s) lowest point %.2f m, supports %s" % (
                o.name, o.cat, o.lo.z, ",".join("%.2f" % z for z in sorted(set(cand)))))

    # ------------------------------------------------------------ overhead lines
    attach = []
    for o in cats.get("pylon", []) + cats.get("gantry", []):
        f = list(o.get("attach"))
        attach += [(Vector(f[i:i + 3]), o) for i in range(0, len(f), 3)]
    for cb in cats.get("cable", []):
        sp = cb.ob.data.splines[0]
        mw = cb.ob.matrix_world
        ends = [mw @ Vector(sp.points[0].co[:3]), mw @ Vector(sp.points[-1].co[:3])]
        for e in ends:
            near = [o for (p, o) in attach if (p - e).length < 0.6]
            if not near:
                report(lv, "cable", "%s end (%.1f, %.1f, %.1f) not on a pylon or gantry" % (cb.name, *e))
                continue
            o = near[0]
            half = float(o.get("born", 0)) + 0.5 * (float(o.get("ready", 0)) - float(o.get("born", 0)))
            if float(cb.get("born", 0)) < half - 0.01:
                report(lv, "order", "%s drawn before %s stands" % (cb.name, o.name))
    chains = {}
    for p in cats.get("pylon", []):
        chains.setdefault(p.get("chain"), []).append(p)
    for ch, ps in chains.items():
        ps.sort(key=lambda o: o.ob.location.x)
        ys = [p.ob.location.y for p in ps]
        if max(ys) - min(ys) > 0.01:
            report(lv, "cable", "chain %s not straight" % ch)
        sp = [ps[i + 1].ob.location.x - ps[i].ob.location.x for i in range(len(ps) - 1)]
        if sp and max(sp) - min(sp) > 0.5:
            report(lv, "cable", "chain %s spans uneven %s" % (ch, sp))
        last = ps[-1].ob.location
        if in_frame(last.x, last.y, 3):
            report(lv, "cable", "chain %s ends at a pylon inside the frame" % ch)

    # ------------------------------------------------------------ vehicles
    for v in cats.get("vehicle", []):
        if v.get("stall"):
            if not any(rect_contains(l.rect(0.05), v.lo.x, v.lo.y) and rect_contains(l.rect(0.05), v.hi.x, v.hi.y)
                       for l in cats.get("lot", [])):
                report(lv, "vehicle", "%s parked outside a lot" % v.name)
            continue
        c = (v.lo + v.hi) / 2
        mw = v.ob.matrix_world
        head = (mw.to_3x3() @ Vector((1, 0, 0))).normalized()
        right = Vector((head.y, -head.x, 0))
        host = [r for r in roads if rect_contains(r.rect(), v.lo.x, v.lo.y) and rect_contains(r.rect(), v.hi.x, v.hi.y)
                and r.get("kind") not in ("drive", "turn")]
        if not host:
            report(lv, "vehicle", "%s not fully on a road" % v.name)
            continue
        r = host[0]
        p0, p1 = Vector(list(r.get("p0")) + [0]), Vector(list(r.get("p1")) + [0])
        d = (p1 - p0).normalized()
        if abs(d.x * head.y - d.y * head.x) > 0.05:
            report(lv, "vehicle", "%s not aligned with %s" % (v.name, r.name))
        off = (Vector((c.x, c.y, 0)) - p0).dot(right)
        half_w = min((v.hi - v.lo).x, (v.hi - v.lo).y) / 2
        lanes = list(r.get("lanes", []))
        ok = any(lanes[i] + half_w - 0.05 <= off <= lanes[i + 1] - half_w + 0.05 for i in range(0, len(lanes), 2))
        if not ok:
            report(lv, "vehicle", "%s not in a right-hand lane of %s (offset %.2f)" % (v.name, r.name, off))
        for j in juncs:
            w, h = rect_overlap(v.rect(), list(j.get("rect")))
            if w > 0 and h > 0:
                report(lv, "vehicle", "%s stands in junction %s" % (v.name, j.name))

    # ------------------------------------------------------------ data lines
    solid = cats.get("building", []) + cats.get("tank", []) + cats.get("equip", [])
    fibers = cats.get("fiber", [])
    for f in fibers:
        pts = poly_pts(f)
        for a, b in zip(pts[:-1], pts[1:]):
            if abs(a.x - b.x) > 0.01 and abs(a.y - b.y) > 0.01:
                report(lv, "fiber", "%s segment not orthogonal" % f.name)
            seg = (b - a)
            L = seg.length
            if L < 1.0:
                continue
            a2, b2 = a + seg.normalized() * 0.5, b - seg.normalized() * 0.5
            for o in solid:
                if seg_hits_rect(a2, b2, o.rect(0.15)):
                    report(lv, "fiber", "%s cuts through %s" % (f.name, o.name))
            for t in cats.get("tree", []):
                tl = t.ob.location
                if seg_dist(Vector((tl.x, tl.y)), a, b) < 0.8:
                    report(lv, "fiber", "%s runs through tree %s" % (f.name, t.name))
        for e in (pts[0], pts[-1]):
            ok = not in_frame(e.x, e.y, 5)  # backbone leaving the picture
            ok = ok or any(rect_dist(o.rect(), e.x, e.y) < 1.0 for o in solid)
            ok = ok or any(g is not f and any(seg_dist(e, a, b) < 0.3 for a, b in zip(poly_pts(g)[:-1], poly_pts(g)[1:]))
                           for g in fibers)
            if not ok:
                report(lv, "fiber", "%s has a loose end at (%.1f, %.1f)" % (f.name, e.x, e.y))

    # ------------------------------------------------------------ trenches / power graph
    trenches = cats.get("trench", [])
    nodes = {}
    pads = cats.get("pad", [])
    terminals = pads + cats.get("turbine", []) + cats.get("solar", [])
    adj = {}

    def link(a, b):
        adj.setdefault(a, set()).add(b)
        adj.setdefault(b, set()).add(a)

    for t in trenches:
        pts = poly_pts(t)
        segs = list(zip(pts[:-1], pts[1:]))
        for e in (pts[0], pts[-1]):
            hit = [o for o in terminals
                   if rect_dist(o.rect(), e.x, e.y) < (2.5 if o.cat == "solar" else 1.5)]
            for o in hit:
                link(t.name, o.name)
            for g in trenches:
                if g is not t and any(seg_dist(e, a, b) < 0.6 for a, b in zip(poly_pts(g)[:-1], poly_pts(g)[1:])):
                    link(t.name, g.name)
            if not hit and not any(t.name in adj.get(g.name, ()) for g in trenches):
                report(lv, "trench", "%s end (%.1f, %.1f) connects to nothing" % (t.name, e.x, e.y))
        for s in cats.get("solar", []):
            r = s.rect()
            if any(min(seg_dist(Vector((x, y)), a, b) for a, b in segs) < 2.5
                   for x in (r[0], r[2]) for y in (r[1], r[3])):
                link(t.name, s.name)
    solar = cats.get("solar", [])
    for i, a in enumerate(solar):  # adjacent rows form one field
        for b in solar[i + 1:]:
            if min(rect_overlap(a.rect(2.0), b.rect())) > 0:
                link(a.name, b.name)

    def reach(start, pred):
        seen, todo = {start}, [start]
        while todo:
            n = todo.pop()
            if n != start and pred(n):
                return True
            for m in adj.get(n, ()):
                if m not in seen:
                    seen.add(m)
                    todo.append(m)
        return False

    role = {p.name: p.get("role") for p in pads}
    is_sub = lambda n: role.get(n) == "sub"
    is_dc = lambda n: role.get(n) == "dc"
    for o in cats.get("turbine", []) + solar[:1]:
        if not reach(o.name, is_sub):
            report(lv, "trench", "%s not connected to a substation" % o.name)
    for p in pads:
        if p.get("role") in ("sub", "plant") and p.name not in ("SS2_pad",) and not reach(p.name, is_dc):
            report(lv, "trench", "%s does not feed a data-centre plot" % p.name)
        if p.get("role") == "storage" and p.name.startswith("BESS") and not reach(p.name, is_sub):
            report(lv, "trench", "%s not tied to a substation" % p.name)
    if "SS2_pad" in role and not reach("SS2_pad", is_dc):
        report(lv, "trench", "SS2_pad does not feed a data-centre plot")
    for t in trenches + fibers:
        for e in [poly_pts(t)[0], poly_pts(t)[-1]]:
            for o in objs:
                if o.cat in ("pad", "building", "tank", "turbine") and rect_dist(o.rect(), e.x, e.y) < 1.0:
                    if float(o.get("born", 0)) > float(t.get("born", 0)) + 0.01:
                        report(lv, "order", "%s drawn before its end point %s exists" % (t.name, o.name))

    # ------------------------------------------------------------ growth order
    for o in objs:
        fb = o.get("fed_by")
        if fb:
            f = by_name.get(fb)
            if f is None:
                report(lv, "order", "%s fed by %s which is not built yet" % (o.name, fb))
            elif float(f.get("born", 0)) > float(o.get("born", 0)) + 0.01:
                report(lv, "order", "%s rises before its feeder %s" % (o.name, fb))
        sp = o.get("sprout_from")
        if sp:
            p = by_name.get(sp)
            if p is None:
                report(lv, "order", "%s sprouts from missing %s" % (o.name, sp))
            else:
                half = float(p.get("born", 0)) + 0.5 * (float(p.get("ready", 0)) - float(p.get("born", 0)))
                if float(o.get("born", 0)) < half - 0.01:
                    report(lv, "order", "%s sprouts before %s stands" % (o.name, sp))
                linked = attached(o, p) or any(
                    attached(b, o) and attached(b, p) for b in cats.get("building", []))
                racks = cats.get("rack", [])
                seen = [r for r in racks if r.bvh.overlap(o.bvh)]
                todo = list(seen)
                while todo and not linked:
                    r = todo.pop()
                    if r.bvh.overlap(p.bvh):
                        linked = True
                    for q in racks:
                        if q not in seen and q.bvh.overlap(r.bvh):
                            seen.append(q)
                            todo.append(q)
                if not linked:
                    report(lv, "order", "%s not physically connected to %s" % (o.name, sp))
    rots = {round(s.ob.rotation_euler.z, 4) for s in solar}
    if len(rots) > 1:
        report(lv, "solar", "solar rows face different directions %s" % rots)


def run(scene, apply_frame, LV_END, levels="1,2,3,4,5", out=None, extra=None):
    """extra: callable -> (violations, lines) for the Maximal grid (build_scene.validate_tiles);
    its 'V T<k> tiling', variant-level and 'V seam3' lines count as the categories tiling / seam3."""
    lines = []
    counts = {}

    def report(lv, kind, msg):
        counts[(lv, kind)] = counts.get((lv, kind), 0) + 1
        lines.append("V L%d %-8s %s" % (lv, kind, msg))

    for lv in (int(x) for x in levels.split(",")):
        f = LV_END[lv]
        scene.frame_set(f)
        apply_frame(f)
        bpy.context.view_layer.update()
        dg = bpy.context.evaluated_depsgraph_get()
        objs = [Obj(ob, dg) for ob in bpy.data.objects
                if not ob.hide_render and ob.type in {"MESH", "CURVE"} and "cat" in ob]
        n0 = len(lines)
        check_level(lv, scene, objs, report)
        lines.append("LEVEL %d frame %d objects=%d violations=%d" % (lv, f, len(objs), len(lines) - n0))
    total = sum(counts.values())
    if extra is not None:
        n2, xl = extra()
        for ln in xl:
            if ln.startswith("V seam3"):
                counts[(5, "seam3")] = counts.get((5, "seam3"), 0) + 1
            elif ln.startswith("V T"):
                counts[(5, "tiling")] = counts.get((5, "tiling"), 0) + 1
        lines += xl
        total = sum(counts.values())
    summary = ["CHECK %-8s %d" % (k, sum(v for (l, kk), v in counts.items() if kk == k))
               for k in ("overlap", "crossing", "dangling", "access", "rotor", "ground", "cable",
                         "vehicle", "fiber", "trench", "order", "solar", "tiling", "seam3")]
    txt = "\n".join(lines + summary + ["TOTAL %d" % total])
    print(txt)
    if out:
        with open(out, "w", encoding="utf-8") as fh:
            fh.write(txt + "\n")
    return total


def selftest(scene, apply_frame, LV_END, out=None):
    """Inject one known fault per check into the Maximal frame and confirm each is caught."""
    f = LV_END[5]
    scene.frame_set(f)
    apply_frame(f)
    O = bpy.data.objects
    faults = {
        "rotor": lambda: (O["WT1"].location.__setitem__(0, 70.0), O["WT1"].location.__setitem__(1, 30.0),
                          O["WTr1"].location.__setitem__(0, 72.8), O["WTr1"].location.__setitem__(1, 28.0)),
        "crossing": lambda: setattr(O["J_N"], "hide_render", True),
        "vehicle": lambda: O["truck0"].location.__setitem__(0, 16.0),
        "ground": lambda: O["A1_gen1_0"].location.__setitem__(2, 0.75),
        "overlap": lambda: (O["x_trees_0"].location.__setitem__(0, 16.0), O["x_trees_0"].location.__setitem__(1, 30.0)),
        "cable": lambda: O["PySL0_0"].location.__setitem__(2, 3.0),
        "fiber": lambda: (O["TF7"].location.__setitem__(0, 47.0), O["TF7"].location.__setitem__(1, -23.0)),
        "dangling": lambda: setattr(O["J_A"], "hide_render", False) or O["A_turn"].__setattr__("hide_render", True),
    }
    lines = []
    for k, fn in faults.items():
        fn()
    # an extra overhanging roof unit
    O["HA1_ch0"].location.x -= 3.0
    bpy.context.view_layer.update()
    dg = bpy.context.evaluated_depsgraph_get()
    objs = [Obj(ob, dg) for ob in bpy.data.objects
            if not ob.hide_render and ob.type in {"MESH", "CURVE"} and "cat" in ob]
    found = {}

    def report(lv, kind, msg):
        found.setdefault(kind, []).append(msg)

    check_level(5, scene, objs, report)
    for k in list(faults) + ["roof-overhang"]:
        key = "ground" if k == "roof-overhang" else k
        hits = found.get(key, [])
        if k == "roof-overhang":
            hits = [h for h in hits if "overhangs" in h]
        lines.append("SELFTEST %-13s %s  e.g. %s" % (k, "CAUGHT" if hits else "MISSED", hits[0] if hits else "-"))
    txt = "\n".join(lines)
    print(txt)
    if out:
        with open(out, "w", encoding="utf-8") as fh:
            fh.write(txt + "\n")
