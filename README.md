# HackHarvard 2026 — Hack to the Moon

Prototype website for HackHarvard 2026 (October 16–18, 2026 · Harvard University, Cambridge MA).

Static site, no build step and no dependencies: `index.html`, `css/style.css`, `js/main.js`.

## Run locally

```sh
python3 -m http.server 5173
# open http://localhost:5173
```

## Structure

| Path | What |
| --- | --- |
| `index.html` | All content (hero, about, tracks, sponsors, global, FAQ, footer) — sourced from hhuh.io |
| `css/style.css` | Design tokens (`:root`), layout, animations |
| `js/main.js` | Loader, starfield, lockup fitting, track station, scroll effects, countdown, FAQ |
| `assets/fonts` | Makcasa (display) + AV Estiana (body), converted to WOFF2 |
| `assets/img` | Theme illustration, icons, sponsor logos |

## Editing common things

- **Team ("Made with ♥"):** the `TEAM` list at the top of `js/main.js` — `[first, last, title, photo]`. The first seven (directors) are real and shown as featured novas; the rest are placeholders in the scrolling row; add a photo path (e.g. `assets/img/team/name.jpg`, square crop) and it appears inside that person's planet.
- **Event date (countdown):** `EVENT_START` at the top of `js/main.js`.
- **Tracks:** the `TRACKS` array in `js/main.js` (the satellite builds one module per track).
- **Sponsors:** ordered by sponsorship level, highest first. Add a transparent PNG/SVG to `assets/img/sponsors/` and a `<div class="logo">` entry (logos are tinted white in CSS).
- **Colors:** CSS custom properties in `:root` in `css/style.css`.

## Animations

Preloader (waxing moon) · canvas starfield with shooting stars, plus star links that follow the cursor · drifting Milky Way behind the hero ·
staggered hero reveal · scroll-scrubbed word highlight in the about console · count-up stats ·
utopian track station (drag to spin, tap a pavilion, auto-advances) · floating/drifting decorative SVGs with light scroll parallax ·
moon-phase scroll indicator · marquee band · animated FAQ · rocket back-to-top. All motion respects `prefers-reduced-motion`.

Decorative SVGs live in `assets/svg/`; `review.html` + `assets/svg-review/` hold the full generated set for review.
