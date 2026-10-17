# Size journey: source of the V4 size-slider animation

One unbroken camera move across scales, from a line of code to a planet-scale network, with five slider levels:

| Level | Name | Content |
|---|---|---|
| 1 | Mini | a code card on a phone screen |
| 2 | Klein | the app, with cable and router |
| 3 | Mittel | the data hall |
| 4 | Groß | a campus that builds itself |
| 5 | Maximal | a grid of connected campuses that breathe |

The sets are separate Blender sets at different scales. They are joined by **seam frames**, where both sides match in shape, colour and speed:

| Seam | From → to | Match |
|---|---|---|
| 2a | code card → SoC | ×4 |
| 2b | USB-C slot → fibre | dark, pulse ahead |
| 2c | ferrule bore → patch-panel port | whiteout |
| 3 | server fan modules → rooftop chillers | ×30 |

Everything is procedural (Blender 5.2, Cycles). There are no downloads, people, readable text or logos.

## Files (`scripts/`)

| File | Role |
|---|---|
| `journey.py` | Camera path, seams, timing, per-shot lens/exposure/haze, integration lights, loop mode |
| `look.py` | Look bible: clay tiers, emissives, glass, render presets, depth of field, haze, rigs, emission wave |
| `sets/common.py` | Set origins, code-card layout (`CODE_TABLE`, `card_bars`), helpers |
| `sets/phone.py`, `board.py`, `tunnel.py`, `hall.py` | The indoor sets, each with `build()`, `state(t, …)` and `check(D)` |
| `build_scene.py` | Exterior campus, the four variants and the tile grid; `--validate` |
| `validate_scene.py` | Plausibility validator: roads, junctions, power, rotors, ground contact, tiling, seam 3 … |
| `render_shot.py` | GPU-locked launcher. Every render goes through it (`renders/gpu.lock`). |
| `render_finals.sh` | Renders both themes, then encodes |
| `encode_v4.py` | Writes the player files and `manifest.json` |
| `measure_seam.py` | Seam metrics |
| `tile.py` | Contact sheets |

`POLISH.md` holds the ownership rules, the seam contracts, the quality bar and the integration log.

## Rebuild (run from the folder that contains `scripts/`)
```
blender -b --factory-startup -P scripts/build_scene.py -- --theme dark --validate --out validate.txt   # TOTAL 0
blender -b --factory-startup -P scripts/journey.py -- --theme dark --mode checks --out x               # SETCHECK_TOTAL 0
bash scripts/render_finals.sh <public/assets/size-scene> dark light
```

**Render settings:** preset `web` = 1280×960, 64 samples, adaptive threshold 0.02, OIDN with albedo and normal, seed 0, AgX, motion blur 0.5 with shutter position START. Both themes take about 2 h on an RTX 5080.

## Player contract (`manifest.json`, version 2)
**Journey video:** journey frames 30–360 at 24 fps, so 331 frames and a duration of 13.7917 s.

| Level | Journey frame | Time in `journey-fwd.mp4` |
|---|---|---|
| 1 Mini | 30 | 0.0 s |
| 2 Klein | 66 | 1.5 s |
| 3 Mittel | 186 | 6.5 s |
| 4 Groß | 270 | 10.0 s |
| 5 Maximal | 360 | 13.75 s |

Keyframes are forced at these times. In `journey-rev.mp4` they are forced at the mirrored times.

**Reverse mapping:** a frame shown at time t in `journey-fwd.mp4` is at **t_rev = duration − t − 1/24** in `journey-rev.mp4`. For level k: `t_rev = 13.7917 − levelTimes[k] − 0.04167`.

**Loops (`loop-1..5.mp4`):** 30 frames at 24 fps.
- The camera is frozen at the level pose.
- Structure is frozen at the level frame.
- Only the idle motion runs (pulses, fans, LEDs, breathing glows).
- The last 8 frames crossfade into the 8 frames before the level frame, so the wrap is seamless. The exterior micro periods (15 and 30 frames) wrap exactly.
- Loop frame 0 is the same image as the journey's level frame.

**Stills (`level-1..5.avif`):** the level frames.
