# Size journey — polish rules

The owner's verdict on the animatic: the concept and the seams stand, but the look must reach film grade. Polish runs in parallel, one agent per set. The lead integrates.

## 1. Ownership

| Owner | Files | Scope |
|---|---|---|
| phone agent | `scripts/sets/phone.py` | Mini + Klein: phone, app UI, cable, router, desk |
| board agent | `scripts/sets/board.py`, `scripts/sets/tunnel.py` | circuit board, USB-C, fibre tunnel |
| hall agent | `scripts/sets/hall.py` | data hall, racks, trays, open server |
| exterior agent | `scripts/build_scene.py`, `scripts/tile.py` | campus, tiles for Maximal, validator data |
| lead | `scripts/journey.py`, `scripts/look.py`, `scripts/render_shot.py`, `scripts/sets/common.py`, `scripts/validate_scene.py`, seams, camera, timing, finals | integration |

Rules:
- **Edit only your own files.** If you need a change in somebody else's file or in a seam contract (§2), ask the lead.
- **Iterate in a work-in-progress copy.** Copy your module, for example `sets/phone_wip.py`, and render it with `--set-override phone=sets.phone_wip`. Merge into your own file when a review render is good. Keep `sets/<yours>.py` importable at all times; every render builds all sets.
- **Set module API.** It must stay compatible:
  - `build(...) -> dict D` with the contract keys listed below;
  - `state(t, D, ...)` is called every frame and must not touch other sets.
- **Each set stays at its origin** (`P0`, `B0`, `T0`, `H0` in `sets/common.py`).
  - Never add lights that reach another set. Area lights with light linking are fine.
  - Never change the world, the global sun or the rim light; they belong to the lead.
- **GPU runs go only through `scripts/render_shot.py`.** It queues on the GPU lock. Never start `blender.exe` for rendering directly.
- **Write your renders under `renders/<your-set>/…`** so nobody overwrites anyone else's.

## 2. Seam contracts (do not change without the lead)
A seam is a pair of consecutive frames in different sets that must match in shape, colour, direction and speed. Everything listed here is load-bearing.

### Seam 2a: code card (phone, frame 112) == SoC top (board, frame 113), scale ×4
- **Code layout** (`sets/common.py`, owned by the lead):
  - `CODE`, `CARD_W = 0.62`, `CARD_H = 0.40`, `line_y()`;
  - `card_bars()`: bar height 0.032·H, rise 0.0012·scale, gutter, cursor on `CURSOR_LINE = 7`.
- **Phone:**
  - The code card is centred at phone-local `(0, 0.26)` with tile top `z = 0.0845`, and the phone sits at `P0` with yaw 0.
  - Tile material `clay`; bars use `mark`, `line` and `clay2`. Bars run along world +x.
  - The per-line objects `code_line*` must reproduce `card_bars()` exactly.
  - Keys: `card_center`, `lines`, `cursor`, `cable_pts`, `cable_pulse`, `card2`, `card3`, `ring`.
- **Board:**
  - The SoC package is exactly `CARD_W·4 × CARD_H·4` (`S_BOARD = 4.0`), at board-local `(0, -1.4)`, top `z = 0.42`.
  - Its marks come from `card_bars(scale 4)` with the same materials. Key `soc_top`.
- **Light:** the card and the SoC top see the same light.
  - Both are lit only by the global sun and rim today.
  - Any extra light on one must be mirrored on the other: relative placement ×4, energy ×16 (`look.rig` does that by scale).
- **Camera** (lead): top-down with screen-right = +x. At frame 112 the distance is 0.70 above the card; the board continues at ×4.

### Seam 2b: USB-C rear slot (board, 142) == fibre mouth (tunnel, 143)
- **Board:**
  - `slot` = rear plate centre at board-local `(0, 4.45, 0.29)`.
  - Slot opening: x ±0.30, z ±0.07. The camera enters at z = 0.33, above the tongue.
  - The cavity behind the plate stays dark, because the plug is inserted (y 4.9–5.2).
  - The pulse `pulse` (r 0.035, scaled to 0.16 into the slot) runs on the axis x = 0, along `trace_x`, `trace_a0` and `trace_a1`.
  - The corridor |x| < 0.5 between the SoC and the USB-C stays free of tall parts. The camera flies 0.3–1.05 above the board.
  - The trace and the USB-C run +y ("north-up"), so the dive is a pure pitch with no roll.
- **Tunnel:**
  - The tube runs along +x from `T0` with radius 1.0 (wall 1.05).
  - The entry stays dark until x ≈ 18, where the streaks start.
  - The pulse (r 0.09) rides 3.0 ahead of the camera on the axis. The camera looks +x with up +z.

### Seam 2c: ferrule bore (tunnel, 160) == patch-panel port (hall, 161), whiteout
- **Tunnel:**
  - Ferrule bore r 0.98 from x 60 to 70, open at the end, material `bore`. Keys `len = 70` and `ferrule = 60`.
  - Backdrop disc `haze` at x = 76, at the tone of the hall seen through the port.
- **Hall:**
  - `port_mouth`, `port_r = 0.006`.
  - The adapter sleeve is 0.04 long and stands proud of the patch panel of rack k = 8 in row 2 (y = +1.5, front facing −y). Bore axis −y, material `bore`.
  - The aisle in front of it stays clear.
- **Camera:** on both sides the camera sits 2.5 bore radii inside the mouth, so the dark disc has the same angular size.

### Seam 3: server fan modules (hall, 238) == HA1 rooftop chillers (exterior, 239), scale ×30
- **Hall:**
  - The modules are instances of `BS.proto("chiller")` at scale 1/30, rotation 0.
  - Layout: rows ±3.05/30, columns (c−1.5)·3.1/30 for c = 0–3, around `server_center`.
  - The tray floor is material `clay`. It is the top server of rack k = 3 in row 1, pulled out on rails, floor top z = 1.86.
  - The modules and tray are lit **only** by the light-linked `srv_Sun` and `srv_Rim` (collection `SRV_LINK`). Hall lights receive via `HALL_LIT`, which excludes them. Keep that split.
  - Nothing may enter the camera window: ±0.23 m in x and ±0.17 m in y around `server_center`.
- **Exterior:**
  - HA1 at (−22, 17.5): L36 W13 h9.5, rotation 0.
  - Roof chiller rows at ±3.05, `lx = −15.9 + 3.1k`. The seam window is k = 2–5, centred at W = (−27.05, 17.5, 9.5).
  - Nothing else may sit on the roof inside x −34…−20, y 12.4…22.6.
  - `p_chiller` may gain detail, but not change its 2.5 × 5.4 footprint or its 2-fan top. The server modules follow automatically.
  - The exterior state at the seam is the old frame 80 (L3).
- **Camera:** top-down with screen-right = +y (the direction of travel points up the screen). The rise is exponential, 0.25 → 0.44 m over frames 230–238, and continues at the same log-speed outside.

### Continuous transitions (no cut, but contracts)
- **Mini → Klein:** the code card *is* a card of the phone's app; it stays at `card_center`.
- **Groß → Maximal:** the campus is one tile of a grid, period `DX = 600`, `DY = 460`, bounds `NODE_X0 −324 … NODE_X1 276`, `NODE_Y0 −224 … NODE_Y1 236`.
  - The roads RN1, RW, RE2 and HW and the backbones F0 and F5 end exactly on the tile border.
  - All tile content stays inside the bounds.
  - Every overhead line ends in a switchyard.
- **Exterior timeline:** `LV_START`/`LV_END` in `build_scene.py` and `ext_time()` in `journey.py` (80 → 108 → 136).

## 3. Quality bar (checklist for every hand-in)

### Materials
- [ ] Every hard edge is bevelled, either by the bevel node from `look.clay_material` or by a bevel modifier. Nothing is razor-sharp.
- [ ] Clay uses the three value tiers (`light`, `mid`, `dark`) with micro-variation. No surface is flat grey.
- [ ] Emissives are only blue #3b82f6 or white (`look.ACCENT` kinds), with bloom in comp. No new emissive colours.
- [ ] No fireflies and no noise crawl between frames: fixed seed and denoiser with albedo and normal (presets do this).

### Lighting
- [ ] Every hold frame has one clear focal point, value contrast and visible contact shadows.
- [ ] Exteriors have atmospheric depth (`look.haze`, driven by the lead). Interiors have light falloff and subtle volumetrics (`look.room_volume`, final only).

### Camera (lead)
- [ ] No sudden swoops: velocity stays continuous across segments and seams.
- [ ] Macro shots have shallow depth of field focused on the pulse; aerial shots have deep focus (`look.dof`).

### Detail density (minimum; add more)
- [ ] **Phone:** bezel, buttons, camera bump, port, speaker grille, a UI hierarchy of abstract blocks.
- [ ] **Board:** solder fillets, vias, non-readable silkscreen marks, shielding cans, component variety.
- [ ] **Tunnel:** cladding layers, varied light dashes.
- [ ] **Hall:** perforated floor tiles and rack doors, cable management, an overhead busway, hot or cold aisle containment, fire-suppression pipes, signs without text.
- [ ] **Exterior:**
  - railings, ladders, pipe bridges, varied rooftop units, kerbs, fences and gates, lamp posts;
  - trees that are less blobby and of varied species;
  - 3–4 campus variants for Maximal, and terrain variation.

### Animation
- [ ] Builds use staggered secondary motion with overshoot.
- [ ] Pulses have trails (`common.window`).
- [ ] Idle loops are seamless, with nothing popping.

### Physical logic (mandatory)
- [ ] **Exterior:** `render_shot.py --validate` reports `TOTAL 0`.
- [ ] **Indoor sets:** add `check(D) -> [violations]` to your module. Board: every part rests on the board top. Hall: racks on the 0.6 m grid, no overlaps, trays hung. Phone: the cable rests on the desk and ends in both plugs. Report it with the hand-in.
- [ ] No people, no readable text, no logos, no downloads, no paid services.

### Hand-in
- [ ] A hero still at `--preset review`.
- [ ] Your seam frames at `--preset draft` (2a: 112/113, 2b: 142/143, 2c: 160/161, 3: 238/239).
- [ ] The checklist above, ticked, with notes.

## 4. Commands (run from `.harness/runs/2026-10-16-size-journey`)
- **Hero still**, using the journey camera at that set's shot:
  ```
  python scripts/render_shot.py --set phone --shot hold --preset review --out renders/phone/hold.png
  ```
  Shots per set:

  | Set | Shots |
  |---|---|
  | phone | `hold`, `mini`, `seam` |
  | board | `hold`, `seam`, `slot` |
  | tunnel | `hold`, `mouth`, `end` |
  | hall | `hold`, `port`, `server` |
  | ext | `hold`, `roof`, `max` |

- **Same, from your work-in-progress copy:**
  ```
  python scripts/render_shot.py --set phone --shot hold --preset review --set-override phone=sets.phone_wip --out renders/phone/hold_wip.png
  ```
- **Seam pair:**
  ```
  python scripts/render_shot.py --frames 112,113 --preset draft --out renders/phone/seam_####.png
  ```
- **Exterior validator:**
  ```
  python scripts/render_shot.py --validate --out renders/exterior/validate.txt
  ```
- **Full animatic** (lead):
  ```
  python scripts/render_shot.py --animatic --preset draft --out renders/anim/f_####.png --encode animatic-dark.mp4
  ```

**Presets** (`look.render_preset`): all use OIDN with albedo and normal, seed 0, AgX Medium High Contrast in dark, motion blur 0.5 START, indirect clamp 10, and bloom.

| Preset | Resolution | Samples | Adaptive threshold |
|---|---|---|---|
| `draft` | 640×480 | 16 | 0.05 |
| `review` | 960×720 | 64 | 0.02 |
| `final` | 1280×960 | 256 | 0.01 |

`--look bible` (the default) upgrades the shared materials to look-bible clay, glass and emissives. `--look legacy` reproduces the old animatic.

## 5. Integration issues and lead edits (2026-10-17)
No contract breaks found in the merged hand-ins; all `check(D)` and the validator report 0. The lead made these edits in set-owned files while the owners were finished. **Keep them when you merge your work-in-progress copies.**
- **`sets/board.py`: `PULSE_END` 0.16 → 0.215.**
  - The coordinator decided 0.24, but with the level end pitch the camera ends 0.25 from the pulse (0.284 in the request). There, 0.24 makes the board pulse 15% *larger* than the tunnel pulse at 143, while 0.215 gives the same angular size.
  - Measured blob diameter at 142/143, as a fraction of frame height (review preset):

    | `PULSE_END` | 142 | 143 | 142/143 |
    |---|---|---|---|
    | 0.16 (before) | 0.054 | 0.069 | 0.78 |
    | 0.24 | 0.081 | 0.069 | 1.17 |
    | 0.215 | 0.074 | 0.069 | 1.07 |
- **`sets/tunnel.py`: `HAZE_K` None → 0.6.** The lead also sets the exit-disc strength absolutely from `journey.py` (0.5 of the shared haze), so your `HAZE_K` value no longer matters for the seam.
- **`sets/hall.py`: the port bore and sleeve use 64 segments instead of 32.** The 32-segment polygon was visible against the round tunnel disc at 161.
- **`build_scene.py`, `main()` only (exterior agent, keep this):** the `--validate` branch passes `validate_tiles` to `validate_scene.run(..., extra=...)`. The tiling and seam-3 checks are now categories in `CHECK … tiling/seam3` and in `TOTAL`, not appended lines.
- **`validate_scene.py`:**
  - categories `tiling` and `seam3`;
  - allow-list entries for a future `pavement` category: pavement with streetlight, road, junction, pad, lot, fiber and trench. The pavements themselves were dropped.
- **Light linking added by the lead in `journey.py`:**
  - the board pulse and trace pulse skip the `usbc` object (no tongue reflections at 2b);
  - the tunnel pulse lights nothing;
  - `lead_ui_soft` lights the phone UI and code lines, mirrored as `lead_soc_soft` on the SoC (×4 placement, ×16 energy);
  - `lead_aisle_fill*` (HALL_LIT) brightens the rack fronts;
  - `lead_srv_rim` (SRV_LINK) rims the server at the Mittel hold and fades to 0 by frame 224, so seam 3 still sees only srv_Sun and srv_Rim.
- **Bevel:**
  - The look-bible shared materials now take their bevel radius × `object["look_scale"]`. Phone 0.25, board 1, server modules 1/30, everything else 1.
  - Every object gets the property at build time. **Do not delete it**; without it the shared materials have no bevel.
- **Emission wave ("wabern", lead):**
  - The `line`, `glass` and `pulse` materials carry a travelling sine wave, amplitude 0 before frame 318, rising to 0.6 by 348, with phase by distance from the hero campus.
  - Exterior agent: if you build per-campus breathing glows, use your own materials, or tell the lead to lower the wave.
- **Requests sent:**
  - `renders/hall/QUESTIONS.md`: a separate aisle-strip material so the lead can dim it over 161–163.
- **Seam 2a contract updated (phone fix-pass requests 1 and 2, approved):**
  - `sets/common.py` now has a fixed `CODE_TABLE`; `CURSOR_LINE` stays 7.
  - `CARD_TILE, CARD_GUTTER = "clay2", "clay"` live in `sets/common.py`, and `card_bars()` takes its gutter from `CARD_GUTTER`.
  - `journey.py` sets `sets.phone.CARD_TILE` and `CARD_GUTTER` from common before `build()`, and overrides the `soc` package's `clay` slot with `CARD_TILE` (object-level material link).
  - **Board agent:** do not rebuild `soc` with a different object-level material. If you prefer, build it with `JC.CARD_TILE` directly; the override then does nothing.
  - All four set `check(D)` functions report 0 on the integrated scene (`journey.py --mode checks`).

## 6. Contract questions and answers
Put questions in `renders/<your-set>/QUESTIONS.md`; the lead answers here.
- **Loop period (exterior agent, B1; answered by the lead 2026-10-17).**
  - **Final (after the exterior's B1 fix):** the V4 idle loops are **30 frames** plus 8 pre-roll frames. The last 8 loop frames crossfade frame TL+j with TL+j−30, so micro-motion with a period of 15 or 30 (the exterior `LOOP` = 15, `WAB_PERIOD` = 30) wraps exactly.
  - The lead's emission wave on `line`, `glass` and `pulse` now also has a 30-frame period.
  - In loop mode the clock you get is the journey frame t (`apply_frame(ext_time(TL), t)`).
- *(no questions yet)*

## 7. Lead camera track (done 2026-10-17) — what set agents should know
- **Frame indices are unchanged.** All seams are still 112/113, 142/143, 160/161 and 238/239.
- **Depth of field is now on** in every non-legacy preset, so hero stills show it:
  - phone f/2 on the code card, then on the phone;
  - board f/1.8 on the pulse;
  - tunnel f/2.8, deep focus (f/11) into the bore before seam 2c;
  - hall: deep focus out of the port, then f/2.8 at 4 m in the aisle, f/11 over the server;
  - exterior: deep focus.

  If you need a sharp detail check, render frames with `--preset draft --res 1280x960` and judge the in-focus area.
- **Exposure dip** of up to −1.5 EV across frames 139–146 (seam 2b), so both sides sink into the same darkness. The tunnel's first frames will look darker than in your standalone renders; that is intended.
- **Camera moves are analytic** (no roll, eased pitch and yaw) for:
  - the board dive (113–143): keep falling at the phone's log-rate, then fly north along the trace;
  - the hall exit (161–186): scale-relative exponential exit from the bore, then yaw −y → −x;
  - the aisle → server move (186–230): pure pitch-down, climbing over the tray before reaching it.

  The maximum turn rate is 7.8°/frame (it was 17). Keep the corridors free:
  - board: |x| < 0.5, the camera flies 0.3–1.05 above the board top;
  - hall: the central aisle, plus the camera passing 0.2 m above the pulled-out tray at x −3.55…−3.05, y −1.0…−0.25.
- **Camera check without rendering:**
  ```
  blender -b --factory-startup -P scripts/journey.py -- --mode camcheck --out x
  ```
  It lists velocity and turn-rate jumps.

## Contract requests

### Hall agent (2026-10-17), seam 2c — for the lead and the tunnel owner
No hall geometry in the contract changed: `port_mouth`, `port_r = 0.006`, the 0.04 sleeve on rack k=8 row 2 and the clear aisle are all unchanged and machine-checked by `sets/hall.py check()`.
1. **Disc size at the cut (camera, lead).** In the draft renders the dark disc is 336 px wide at frame 160 and 376 px at frame 161 (640 px frames, `renders/hall/seam_0160/0161.png`). The likely cause: at frame 160 the tunnel camera sits about 3.2 bore radii inside the mouth (Hermite at u = 0.972 gives x ≈ 66.9), while the hall key at 161 is at 2.5 radii. Suggested fix: either the tunnel end timing or the hall key at 161 (about `pm + (0, 0.019, 0)`).
2. **Disc tone (tunnel owner).** The hall seen through the port is now darker and has one feature. The centre grey is 150 at 161 against 198 for the tunnel's `haze` disc at 160. One thin white line crosses the disc about 4° above its axis: the light strip on the opposite rack tops. Suggestion: darken `haze` by about 25% and give it a soft horizontal light line slightly above centre. Alternatively, the lead can ask me to dim that strip.

### Phone agent (2026-10-17), seam 2a and Mini/Klein — for the lead (and the board owner on 2a)
No contract element changed: the code card is still centred at phone-local (0, 0.26), its tile top is z 0.0845 in `clay`, and the phone sits at P0 with yaw 0. `code_line*` and `code_cursor` equal `card_bars()` exactly at frame 112. All contract keys are present. `sets/phone.py check(D)` machine-checks all of this, reports 0 violations (`renders/phone/check.txt`), and caught every fault in an injected self-test.
1. **Depth of field (camera, lead). Suggestion only.** Mini: focus on `card_center`, f/2.0, so the card's top and bottom edges soften slightly. Klein: focus on `card_center`, f/2.8, so the router softens a little. Frames 105–112: f/4 or deeper, so the card is sharp at the seam. The board side at 113 then needs the same relative depth of field (the camera distance is ×4).
2. **UI light (seam 2a, lead and board owner).** The UI, the code card and the code lines get only the global sun and rim, as the contract requires. My light-linked rig and the glint strip reach only desk, mat, phone body, glass, cable and router. As a result the screen reads somewhat dim at Klein. If the lead wants a brighter screen, add one light-linked soft light for the UI and the card, mirrored on the SoC (×4 placement, ×16 energy). Until then I keep the screen sun-only.
3. **Material bevel radius (look, lead). An observation.** `look.clay_material` uses a bevel radius in world units (0.008). The code bars on the card are 0.0012 tall, the SoC marks 0.0048, so the same `mark`/`line` materials round the phone bars relatively 4× more than the SoC marks. At 112/113 this is subtle (`renders/phone/seam_pair.png`). Scaling the bevel radius per set would make the match exact.
4. **Bevel shader trap (look). For everyone.** In one mesh, a second stacking level (a glyph on a raised element on a tile) shades black, because the bevel node probes the coincident faces. I build each stacking level as its own object; separate objects (like `code_line*` on `ui_code`) are fine.
5. **Camera bump and physics. No contract change.** The phone has a camera bump on its back (invisible from every journey angle). To keep the phone level, its back rests on a 0.02-thick desk mat, and the bump (0.02 tall) lies past the mat's north edge (y 0.40) on the desk. The mat edge is visible as a soft line behind the phone at Klein.

### Exterior agent (2026-10-17), seam 3 and Groß → Maximal — for the lead (and the hall owner on seam 3)
No contract element changed. `--validate` now also machine-checks the seam and tiling contracts. It reports TOTAL 0 on L1–L5 and TILES_TOTAL 0 (`renders/exterior/validate.txt`, sections `VARIANT`, `TILING`, `SEAM3`). The checks cover:
- HA1 at (−22, 17.5): 18 `HA1_ch*` chillers of the `chiller` mesh at scale 1, z 9.5, rows ±3.05, `lx = −15.9 + 3.1k`.
- The empty HA1 roof window (x −34…−20, y 12.4…22.6).
- The tile trunk: RN1, RW, RE2, HW, F0 and F5 are identical in every variant and end exactly on the tile border.
- All tile content inside the bounds, and every overhead line ending on a `GRID_*` switchyard gantry.
1. **Seam 3 (hall owner, FYI). `p_chiller` gained detail; the contract is unchanged.** New details: fan guards (3 rings + 4 spokes), 5 pitched blades, coil fin slats, corner posts, a control panel and a deck seam. The 2.5 × 5.4 footprint and the 2-fan top are unchanged. The server modules follow automatically (`renders/exterior/seam3_pair.png`). The top rises from z 2.12 to 2.13 because of the guard rings.
2. **Campus variants for Maximal (lead).**
   - `build_world()` also builds four static variants, the collections `Campus_v1`…`Campus_v4`. They are not linked to the scene. They have other plots, a second data campus D, other hall styles and heights, other stack heights, no wind farm or tank farm in some variants, and their own woods.
   - The centre stays the hero campus, the only one with glowing tank bands, so it is the focal point.
   - Until `journey.py` selects the variants itself, `BS.apply_frame()` reassigns the `node_i_j` instances once (`BS.assign_tiles()`). The pattern comes from `BS.tile_variant(i, j)`: centre = hero, then a 2 × 2 pattern, so no two touching tiles (diagonals included) share a variant.
   - **Request:** create the nodes with `e.instance_collection = BS.VARIANT_COLLS.get(BS.tile_variant(i, j), campus)`, and I will drop the hook.
3. **Validator category (lead).** Please fold `BS.validate_tiles()` into `validate_scene.py` as the categories `tiling` and `seam3`, or keep calling it from `build_scene.main()` as now. Its lines are appended to the `--validate` output, and `VALIDATION_TOTAL` includes them.
4. **Allow-list for pavements (lead).** Kerbs are done, inside the road width with drops at junctions, drives and lots. Pavements are blocked by the allow-list: a footpath has to be `road` or `pad`, and the lamp posts stand where the pavement would go, but `("road", "streetlight")` and `("pad", "streetlight")` are not allowed. Allow one of them and I can add pavements along RN1, RE2 and HW.
5. **Work-in-progress hook in `build_scene.py` (FYI).** `EXT_BUILD_WIP=<path to a copy>` makes every importer and `--validate` use that copy. `render_shot.py` passes the environment through. When the variable is unset, the hook has no effect. This is how I iterated without putting other agents' renders at risk.
6. **Terrain (lead), a decision to confirm.** The terrain variation is shading only: rectangular field patchwork, crop rows, farm tracks and large-scale value/bump undulation, non-periodic, so every tile differs. There is no real displacement, because every object is ground-checked against z = 0. Real relief would need the validator to sample a height function.
7. **Haze (lead), an observation.** In my review renders the haze at Groß is hardly visible against the near-black ground. If you want depth behind the campus, the mist colour or strength at frames 270–300 has the room.

### Board agent (2026-10-17), seams 2a / 2b / 2c — for the lead (and the hall owner on 2c)
No contract element changed, and `check(D)` machine-checks each of them: SoC exactly `CARD_W·4 × CARD_H·4` at (0, −1.4), top z 0.42, `card_bars(scale 4)` marks; `slot` (0, 4.45, 0.29) with the opening x ±0.30, z ±0.07; pulse r 0.035 → ×0.16 on x = 0 ending at (0, 4.87, 0.33); the |x| < 0.5 corridor free of tall parts; tunnel R 1.0 / wall 1.05, light from x 18, pulse r 0.09 three ahead; bore r 0.98 at x 60–70 in `bore`, `len` 70, `ferrule` 60, `haze` disc at x 76. Results: `renders/board/check.txt`, `renders/tunnel/check.txt` (both 0).
1. **Seam 2b pulse size (contract).** At 142 the board pulse subtends 0.0056 / 0.284 = 0.020 rad; at 143 the tunnel pulse subtends 0.09 / 3.0 = 0.030 rad, 1.5× larger on screen (`renders/board/seam2b_0142/0143.png`). Request one of: board end scale 0.16 → 0.24 (`PULSE_END` in `sets/board.py`; r 0.0084 still clears the tongue top 0.302 at z 0.33), or tunnel pulse r 0.09 → 0.06 (`PULSE_R` in `sets/tunnel.py`). Each is a one-constant change; I prefer the board side.
2. **Seam 2b pitch (camera).** `board_move` ends with a 4° pitch-down at 142 (`a → 4.0`) while the tunnel looks level, so the board pulse sits 0.07 rad (≈ 38 px at 640) above centre at 142 and centred at 143. Suggest easing `a` to 0 by about 141. Alternative (contract change): lower the pulse end to z 0.312, still 0.004 above the tongue.
3. **Focus lag (fixed on my side, check others).** `focus_at` reads `BD["pulse"].matrix_world` right after `state()`; `matrix_world` was only refreshed by the depsgraph, so in multi-frame runs the focus lagged one rendered frame (soft pulse, over-blurred corridor). `board.py` and `tunnel.py` now write `matrix_world` in `state()`. Any other focus object read the same way has the same lag.
4. **Pulse motion blur.** Both pulses are keyed (linear) at t and t + 0.5, so the shutter sees them travel with the camera: crisp pulses instead of smears. The tunnel dashes are keyed in four speed classes.
5. **DOF (suggestion).** Board f/1.8 on the pulse reads well now (`renders/board/hero_hold_0126.png`). For more macro fall-off at 121–134, f/1.2. Shutter 0.5 at this speed smears the periphery of 121–134; 0.3 for the board shot only would show more of the detail.
6. **Seam 2c tone (hall owner's item 2).** `sets/tunnel.py` has `HAZE_K` (None = shared `haze`, the contract). Measured disc centre at 160: 198 (contract), 190 at ×0.6, 182 at ×0.25, against 151 at 161. Glare from the bright rim dominates the disc, so the disc-size mismatch (hall owner's item 1, camera) is the real lever; after that, `HAZE_K` ≈ 0.5 should close the gap. Not applied without your OK.
8. **Haze numbers for item 7 (lead), a suggestion only.** With `look.haze` at its defaults (start 60, depth 900, QUADRATIC) and the camera about 295 m from the campus, the mist factor is about 0.07, so `haze_at` (0.47) adds about 3 % at the campus. If you want more depth, try start 150, depth 600, LINEAR, and a mist colour a little above the ground tone, for example (0.03, 0.04, 0.065). That gives about 0.1 at the campus and 0.3 or more on the far fields. The values are not tested, because the world belongs to you.
9. **Hand-in (exterior).** All of these are in `renders/exterior/`:
   - Review stills: `review_0285.png` (Groß), `review_0378.png` (Maximal), `review_0313.png` (mid-build L5).
   - Seam 3 drafts: `seam3_0238.png`, `seam3_0239.png`, `seam3_pair.png`.
   - Crops: junction, substation and woods, roofs; `smallsize.png` (400 px check); `handin_sheet.png`.
   - `validate.txt`, and `build_scene_before.py.txt` (the pre-polish file, for diffing).

### Phone agent, fix pass (2026-10-17): Mini, for the lead (seam 2a, the board follows via `card_bars()`)
The review asks for three Mini changes. Two of them touch contract elements owned by the lead (`CODE` in `sets/common.py`, and the tile and bar materials), so I propose them here and have not made them:
1. **Rebalanced code block.** Today the lower-right 40 % of the card is empty. Replace the random `code_lines()` with a fixed table. The mass then reaches x ≈ 0.74 on the middle and lower lines, and the cursor (line 7, end 0.64 → cursor at x 0.66, y 0.306) sits on the lower-right third intersection. Only one blue token remains, on line 6 next to the cursor, so the blue reads as one focal cluster. Card coordinates, every segment `mark` unless marked:
   `0: (.10,.22) (.245,.44) | 1: (.17,.39) (.415,.52) | 2: (.24,.40) (.425,.66) | 3: (.24,.47) (.495,.60) | 4: (.17,.42) (.445,.74) | 5: (.24,.46) (.485,.62) | 6: (.31,.50) (.525,.60) (.625,.74 line) | 7: (.31,.47) (.495,.64) | 8: (.24,.45) (.475,.58) | 9: (.17,.38)`
   `CURSOR_LINE` stays 7. My typing animation reads `CODE`, so it adapts without changes. The SoC follows through `card_bars()`.
2. **Mini contrast.** Make the card one tier darker and the bars relatively brighter: the tile becomes `clay2` and the gutter `clay`, with the bars staying `mark` (contrast 4:1 instead of 2.7:1). This must change on both sides at once. On the phone side, set `sets.phone.CARD_TILE = "clay2"` and `CARD_GUTTER = "clay"` before `build()`. On the SoC side, `soc` uses `clay2` and the `card_bars()` gutter uses `clay`.
3. **Already done in `sets/phone.py`, no contract change.** During Mini the cursor leads at ×1.6 and the blue tokens recede to ×0.4, through object-level material overrides. Both ease back to the plain `line` material over frames 30–60, so the loops stay seamless and frame 112 is unchanged; `check(D)` verifies all of this.

### Exterior agent, fix pass after the independent review (2026-10-17) — for the lead
No contract element changed. `--validate`: TOTAL 0 on L1–L5, TILES_TOTAL 0, SEAM3 0, and every variant is at 0.
1. **Pavement category (lead, `validate_scene.py`). Exact change requested:**
   ```python
   FLAT = {"pad", "lot", "road", "junction", "trench", "fiber", "ground", "pavement"}
   # in ALLOW:
   ("pavement", "road"), ("pavement", "junction"), ("pavement", "streetlight"),
   ("pavement", "fiber"), ("pavement", "trench"), ("pavement", "tree"),
   ```
   The build already emits `cat="pavement"` footways along RE2 (south side) and HW (north side). They are cut at plots, junctions, drives and cable crossings.
   - **Until the change lands,** `build_scene.pave_on_edge()` sees that the pairs are missing, so the footway runs behind the lamp verge (1.35 m off the kerb) and touches nothing.
   - **Once you add the pairs,** the same build automatically places the footway against the kerb, with the lamp posts standing on it (posts rooted at z 0). No further change from me is needed.
2. **The Maximal variant hook is now a no-op.** `journey.py` already picks `BS.VARIANT_COLLS` / `BS.tile_variant`, so `assign_tiles()` finds nothing to reassign. I left it in place because it is harmless.
3. **New exterior-only emissives:** `wab` (roof-edge strips), `halo` (ground glow under each data campus) and `band` (glow corridor along the trunk backbones F0 and F5). All are blue, flashing toward white. They are not in `look.UPGRADE` and are driven by `apply_frame` (a clock value). Their period is 32 frames, and the breathing phase is hashed from the tile index of the instance. A flash fires every 16 frames, when a backbone pulse reaches the campus. Your `add_wave` on `line`/`glass`/`pulse` stays untouched.

### Exterior agent, B1 fix (2026-10-17) — for the lead
1. **The campus flash is now a wave, blue only.** Each campus flashes `WAB_DELAY` = 4 frames per tile of distance after the hero campus, with a 3.5-frame smoothstep rise and an 11.5-frame fade. The peak is 1.3× the breathing level (`WAB_PEAK`). The flash adds no white. The halo strength is down 30% (0.42 → 0.29).
2. **Loop periods now divide your 30-frame loops (`LOOP_N` 30).** Exterior micro-motion uses `LOOP` = 15: pulses, fan and rotor spins, beacons and the flash. The campus breathing uses `WAB_PERIOD` = 30. At the level frame and again 30 frames later the exterior is identical, so the 8-frame pre-roll crossfades between matching states.
   - **Your side:** `LB.set_wave(..., 2π t / 32)` in `journey.py` has a period of 32 frames, which does not wrap in 30. A period of 30 (or 15) would make the whole exterior loop exact.
3. **Measured at draft, 640 px** (`renders/exterior/flash/luma.txt`): the largest frame-to-frame change in mean luma is 1.80% over 276–300 and 0.79% over 352–380.
   - The 1.80% at 287 is a backbone pulse head entering the bottom edge plus the hold orbit, not the campus flash.
   - `--validate` still reports TOTAL 0, TILES_TOTAL 0.
