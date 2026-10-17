#!/usr/bin/env bash
# V4 finals: per theme the journey's player frames 30-450 (timeline.py: story 30-360 with the
# Mini -> Klein pull-back spread over 126 frames) and the five idle loops at the "web" preset
# (1280x960, 64 samples, OIDN albedo+normal, fixed seed), then encode_v4.py into the player folder.
# Usage (run folder): bash scripts/render_finals.sh <dest size-scene folder> [themes...]
set -euo pipefail
DEST="$1"; shift
THEMES="${*:-dark}"
for th in $THEMES; do
  R=renders/final/$th
  mkdir -p $R/player
  python scripts/render_shot.py --theme $th --player --frames 30-450 --preset web --out "$R/player/f_####.png"
  for L in 1 2 3 4 5; do
    mkdir -p $R/loop$L
    python scripts/render_shot.py --theme $th --loop $L --preset web --out "$R/loop$L/f_####.png"
  done
done
for th in $THEMES; do
  M=""; [ "$th" = "dark" ] && M="--manifest --themes $(echo $THEMES | tr ' ' ',')"
  python scripts/encode_v4.py --theme $th --journey renders/final/$th/player --loops renders/final/$th/loop --out "$DEST" $M
done
echo FINALS_DONE
