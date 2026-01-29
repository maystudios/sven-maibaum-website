# Mobile Audit

## 2026-01-29

### Hamburger menu
- Added `aria-controls`, `aria-current` state, and active-route highlighting for both desktop and mobile links in `src/components/Header.tsx`.
- Added click-outside-to-close handling for the mobile menu overlay in `src/components/Header.tsx`.
- Preserved focus trapping, ESC close, and 44px hit targets (from prior pass) and aligned styles with existing palette.

### Mobile styling fixes
- Ensured media/embeds never overflow by constraining `img`, `video`, and `iframe` to `max-width: 100%` in `src/index.css`.
- Added safe word wrapping for long subtitles and project detail text to prevent overflow on 320–414px widths in `src/index.css`.

### Notes
- Blog/Visitenkarte routes are not present in `src/pages` of this app; no mobile adjustments were applied there.
