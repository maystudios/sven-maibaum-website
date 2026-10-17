"""Player timeline of the V4 size journey (shared by journey.py in Blender and encode_v4.py).

Story frames are the journey's own frame numbers: shots, seams, levels, set animation and the idle
loops all use them (POLISH.md, HERO, SEAMS, `--frames`). Player frames are the frames of the encoded
journey videos (`--player --frames`, `journey-fwd.mp4`).

The two differ in one place. The player shows every step in at most 2.5 s (MAX_MOVE_SECONDS in
journeyPlayer.ts). Mini -> Klein had only 36 story frames, so it was the one step that played at
1x: 24 images/s, 41.7 ms per image, with the code card sliding 26 px per image on average (42 px
peak) - it juddered, while every other step played at 1.4-2x (34-48 images/s). That pull-back
(story 30-66) is therefore rendered over STRETCH more player frames, so the player shows it at 2.1x
(50 images/s, 2.5 s). STRETCH is a multiple of 30: every 15/30-frame idle phase after the stretch is
unchanged, and player frame P >= 66 + STRETCH shows exactly story frame P - STRETCH.
"""
FPS = 24
STORY_LEVELS = {1: 30, 2: 66, 3: 186, 4: 270, 5: 360}     # level frames in story frames
STRETCH_A, STRETCH_B = 30, 66                              # story frames of the stretched pull-back
STRETCH = 90                                               # extra player frames (multiple of 30)
_K = (STRETCH_B - STRETCH_A) / (STRETCH_B - STRETCH_A + STRETCH)   # story frames per player frame


def story(p):
    """Story time shown at player frame p: an int outside the stretch, a float inside it."""
    if p <= STRETCH_A:
        return p
    if p >= STRETCH_B + STRETCH:
        return p - STRETCH
    return STRETCH_A + (p - STRETCH_A) * _K


def player(s):
    """Player frame of story frame s (s must lie outside the open stretch)."""
    if s <= STRETCH_A:
        return s
    if s >= STRETCH_B:
        return s + STRETCH
    raise ValueError("story frame %s lies inside the stretch" % s)


def story_rate(p):
    """Story frames per player frame at player frame p (scales the motion-blur shutter)."""
    return _K if STRETCH_A <= p < STRETCH_B + STRETCH else 1.0


LEVELS = {k: player(s) for k, s in STORY_LEVELS.items()}   # level frames in player frames
START, END = LEVELS[1], LEVELS[5]                          # the journey videos hold START..END
