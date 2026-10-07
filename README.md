# ✦ HackHarvard 2026 — Hack to the Moon ✦

Website for **HackHarvard 2026** · 10/16 – 10/18, 2026 · Harvard University, Cambridge MA.

The theme is a utopian Harvard drifting through deep space: domes, cupolas, columns and stairs rebuilt as glowing gradient geometry among planets, moons and stars. Design rules (palette, type, motifs, don'ts) live in [`CLAUDE.md`](CLAUDE.md).

Static site. No build step, no dependencies, no frameworks: `index.html`, `css/style.css`, `js/main.js`.

## Run locally

```sh
python3 -m http.server 5173
# open http://localhost:5173
```

Check changes at desktop width and at 375px (no horizontal scroll), with a clean console.

## Caching

`index.html` loads `css/style.css?v=…` and `js/main.js?v=…`. Bump both to the same new value whenever CSS or JS changes, using `YYYYMMDD` + a letter (e.g. `20261005i` → `20261005j`).

## Structure

| Path | What |
| --- | --- |
| `index.html` | All content. Sections in order: hero, `#about`, `#tracks`, `#schedule`, `#sponsors`, `#faq`, `#global`, `#team`, footer |
| `css/style.css` | `:root` design tokens → sections → media queries (1080 / 960 / 900 / 820 / 560px) → reduced-motion block |
| `js/main.js` | One IIFE. Data at the top (`EVENT_START`, `TRACKS`, `TEAM`, `LEADS`), then one `/* ---- */` block per feature |
| `assets/fonts/` | Makcasa (display) + AV Estiana (body), WOFF2 |
| `assets/img/` | Moon art, H-mark, favicons/OG image, `team/` photos, `sponsors/` logos |
| `assets/svg/` | Decorative SVGs in use: ribbons, orbs, planets, islands, utopia buildings, stardust, rocket |
| `review.html` + `assets/svg-review/` | Review gallery of generated art (not live) |

## Sections

- **Hero:** HACK *to the* MOON lockup, LED countdown to `EVENT_START`, drifting Milky Way and canvas starfield.
- **About:** copy set inside a Greek temple on a podium, with a scroll-scrubbed word highlight and count-up stats.
- **Tracks:** a floating park with an interactive satellite. Drag to spin, tap a module, and it auto-advances.
- **Schedule:** the event timeline.
- **Sponsors:** a comet garden of logos ordered by tier, with a hover glow.
- **FAQ:** a solar system of animated questions; each one opened lights a diamond lamp on the arch gate.
- **Global:** hover a country to trace its outline as a constellation.
- **Team ("Made with ♥"):** 7 director planets plus a carousel of stars. Hovering a director filters the carousel to their team.
- **Footer:** socials (Instagram, LinkedIn, X) and the rocket.

## Editing common things

- **Team:** `TEAM` in `js/main.js`, as `[first, last, title, photo?]`. The first `FEATURED_COUNT` (6) are directors. Photos are square crops at `assets/img/team/<first>.jpg`. `LEADS` maps each director to the titles they lead.
- **Event date:** `EVENT_START` in `js/main.js`.
- **Tracks:** the `TRACKS` array in `js/main.js` (one satellite module per track).
- **Sponsors:** add a transparent PNG/SVG to `assets/img/sponsors/` and a `.logo` entry in `#sponsors`, highest tier first. CSS tints logos white.
- **Socials:** `.footer__social` in `index.html`.
- **Colors:** `:root` tokens in `css/style.css`. SVGs loaded via `<img>` must use the exact token hex values.

## Motion

Waxing-moon preloader · starfield with cursor shooting stars · staggered hero reveal · scroll reveals · word-highlight scrub · count-up stats · LED countdown · track satellite · light scroll parallax on decorations · floating islands and orbs · animated FAQ + gate lamps · country constellations · team filter.

Only `transform` and `opacity` are animated. Everything has a still fallback under `prefers-reduced-motion`.

## Hidden features

- **Rocket launch to the top:** click the rocket parked in the footer and it lifts off, carrying the page back to the beginning. Under reduced motion it jumps straight to the top.
- **Confetti clicks** whenever there is a confetti, you can click and it will have a small confetti on the side too.
- **Interactive final piece** small really easy puzzle
- **FAQ Lights** Lights will be lighted in the altar once a question is opened
- **Clicks on noninteractive objects** A realistic constellations will display (information will be in console.log)
- **WPM test in About** *(planned, not built yet):* type the About paragraph inside the temple, with letters lighting up as you go and a live words-per-minute readout on the podium. The copy stays fully readable for anyone who doesn't play.

## To do

- [ ] WPM typing test in the About section
- [ ] Add a calendar to the Schedule
