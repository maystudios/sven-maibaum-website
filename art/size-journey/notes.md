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
| `journey.py` | Camera path, seams, timing, per-shot lens/exposure/haze, integration lights, loop mode, player mode |
| `timeline.py` | Story frames ↔ player frames (the Mini → Klein stretch), shared by `journey.py` and `encode_v4.py` |
| `look.py` | Look bible: clay tiers, emissives, glass, render presets, depth of field, haze, rigs, emission wave |
| `sets/common.py` | Set origins, code-card layout (`CODE_TABLE`, `card_bars`), helpers |
| `sets/phone.py`, `board.py`, `tunnel.py`, `hall.py` | The indoor sets, each with `build()`, `state(t, …)` and `check(D)` |
| `build_scene.py` | Exterior campus, the four variants and the tile grid; `--validate` |
| `validate_scene.py` | Plausibility validator: roads, junctions, power, rotors, ground contact, tiling, seam 3 … |
| `render_shot.py` | GPU-locked launcher. Every render goes through it (`renders/gpu.lock`). |
| `render_finals.sh` | Renders the player frames and loops of the given themes (default dark), then encodes |
| `encode_v4.py` | Writes the player files and `manifest.json` |
| `measure_seam.py` | Seam metrics |
| `tile.py` | Contact sheets |

`POLISH.md` holds the ownership rules, the seam contracts, the quality bar and the integration log.

## Rebuild (run from the folder that contains `scripts/`)
```
blender -b --factory-startup -P scripts/build_scene.py -- --theme dark --validate --out validate.txt   # TOTAL 0
blender -b --factory-startup -P scripts/journey.py -- --theme dark --mode checks --out x               # SETCHECK_TOTAL 0
bash scripts/render_finals.sh <public/assets/size-scene> dark
```

**Render settings:** preset `web` = 1280×960, 64 samples, adaptive threshold 0.02, OIDN with albedo and normal, seed 0, AgX, motion blur 0.5 with shutter position START (scaled to half a player frame inside the stretch). Both themes took about 2 h on an RTX 5080.

## Story frames and player frames (`timeline.py`, 2026-10-17)
Story frames are the journey's own numbers: shots, seams, levels, `HERO`, `--frames` and the loops use them. Player frames are the frames of the journey videos (`render_shot.py --player --frames 30-450`).

They differ in one place. The player shows every step in at most 2.5 s (`MAX_MOVE_SECONDS`), at a rate of at most 3×. Mini → Klein had only 36 story frames, so it was the only step that played at 1×: 24 images per second, 41.7 ms each, with the code card sliding 26 px per image on average and 42 px at the peak. The owner saw it judder; every other step plays at 1.4–2× (34–48 images per second). The pull-back (story 30–66) is therefore spread over 126 player frames: the same move, rendered at story time 30 + (P − 30) × 36/126, so the player shows it at 2.1× (50 images per second, 2.5 s).

- The stretch adds 90 frames, a multiple of 30, so every 15- and 30-frame idle phase after it is unchanged. Player frame P ≥ 156 shows exactly story frame P − 90, and the loops are still rendered at the story level frames.
- Inside the stretch the camera is keyed at every player frame, Blender renders the story time as a subframe, and the shutter covers half a player frame.
- Measurements and frame strips: `renders/smooth/` in the run folder.

## Player contract (`manifest.json`, version 2)
**Journey video:** player frames 30–450 at 24 fps, so 421 frames and a duration of 17.5417 s.

| Level | Story frame | Player frame | Time in `journey-fwd.mp4` |
|---|---|---|---|
| 1 Mini | 30 | 30 | 0.0 s |
| 2 Klein | 66 | 156 | 5.25 s |
| 3 Mittel | 186 | 276 | 10.25 s |
| 4 Groß | 270 | 360 | 13.75 s |
| 5 Maximal | 360 | 450 | 17.5 s |

Keyframes are forced at these times. In `journey-rev.mp4` they are forced at the mirrored times.

**Reverse mapping:** a frame shown at time t in `journey-fwd.mp4` is at **t_rev = duration − t − 1/24** in `journey-rev.mp4`. For level k: `t_rev = 17.5417 − levelTimes[k] − 0.04167`.

**Loops (`loop-1..5.mp4`):** 30 frames at 24 fps.
- The camera is frozen at the level pose.
- Structure is frozen at the level frame.
- Only the idle motion runs (pulses, fans, LEDs, breathing glows).
- The last 8 frames crossfade into the 8 frames before the level frame, so the wrap is seamless. The exterior micro periods (15 and 30 frames) wrap exactly.
- Loop frame 0 is the same image as the journey's level frame.

**Stills (`level-1..5.avif`):** the level frames.
