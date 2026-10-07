# ✦ HackHarvard 2026 — Hack to the Moon ✦

Website for **HackHarvard 2026** · 10/16 – 10/18, 2026 · Harvard University, Cambridge MA.

**This README is the handoff for next year's team.** It has two parts:

- **Part 1: General requirements.** These apply to every HackHarvard landing page, whatever the theme. Keep them.
- **Part 2: This year only (2026).** These are specific to the *Hack to the Moon* theme. Replace them with next year's theme.

---

# Part 1 · General requirements (every year)

## Stack

The site is static, with no build step, dependencies or frameworks. It's plain HTML, CSS and vanilla JS: `index.html`, `css/style.css`, `js/main.js` (plus small standalone scripts such as `js/egg.js`). Don't add npm, TypeScript, React, Tailwind or CDN libraries. Keeping it this simple means anyone can edit it and it never breaks on a dependency.

## Run locally

```sh
python3 -m http.server 5173
# open http://localhost:5173
```

Check every change at desktop width and at 375px. There must be no horizontal scroll and the console must be clean.

## Caching

`index.html` loads `css/style.css?v=…` and `js/main.js?v=…` (along with the other scripts and favicons). Bump them all to the same new value whenever CSS or JS changes, using `YYYYMMDD` + a letter (e.g. `20261005i` → `20261005j`). Otherwise visitors keep stale files.

## Content every landing page needs

| Section | What it must do |
| --- | --- |
| Hero | Event name, dates, location, a countdown to the start, a register / portal CTA |
| About | What HackHarvard is (36-hour undergraduate hackathon, ~500 students, 30+ universities) plus logistics notes |
| Tracks | The prize tracks for the year |
| Schedule | The event timeline |
| Sponsors | Logos ordered by tier (highest first) and a "sponsor us" CTA |
| FAQ | Grouped questions: general, schedule, submission, mentors, travel & lodging |
| Global | Where hackers come from |
| Team | Directors first, then everyone else |
| Footer | Socials (Instagram, LinkedIn, X) and back-to-top |

## Engineering rules

- **Design tokens:** every color is a `:root` token in `css/style.css`. To add a color, add a token instead of hardcoding a hex value.
- **SVGs loaded via `<img>`** can't read CSS variables, so they must use the exact token hex values. Check with `grep -ohiE '#[0-9a-f]{6}' assets/svg/*.svg | sort -u`.
- **Performance:** animate only `transform` and `opacity`. Never animate `filter` on large elements. Prefer gradients and opacity over SVG blur filters.
- **Reduced motion:** every animation needs a still fallback, via the `reduceMotion` flag in JS and the `@media (prefers-reduced-motion: reduce)` block at the end of `style.css`.
- **Mobile:** breakpoints are 1080 / 960 / 900 / 820 / 560px. Desktop-only toys (like the typing test) must switch off on small screens.
- **Fonts:** load them self-hosted as WOFF2 with `font-display: swap`, and **use only licensed full versions**. A trial or demo font can replace characters with watermark glyphs (see the Makcasa note in Part 2).
- **Assets:** use WOFF2 for fonts, WebP/PNG for images and SVG for decorations. Keep files small.
- **Code style:** `main.js` is one IIFE with data at the top, then one `/* ---- Name */` block per feature. Use terse arrow functions, `const` and 2-space indent. Helpers: `$`, `$$`, `clamp`, `svgEl`, `onNear`, `idle`.

## Structure

| Path | What |
| --- | --- |
| `index.html` | All content. Sections in order: hero, `#about`, `#tracks`, `#schedule`, `#sponsors`, `#faq`, `#global`, `#team`, footer |
| `css/style.css` | `@font-face` → `:root` design tokens → sections → media queries → reduced-motion block |
| `js/main.js` | One IIFE. Data at the top (`EVENT_START`, `TRACKS`, `TEAM`, `LINKEDIN`, `LEADS`), then one block per feature |
| `js/egg.js` | Footer easter egg (drag the planets) |
| `assets/fonts/` | WOFF2 fonts |
| `assets/img/` | Moon art, H-mark, favicons/OG image, `team/` photos, `sponsors/` logos |
| `assets/svg/` | Decorative SVGs in use |
| `assets/data/constellations.csv` | Star data for the sky easter egg |
| `review.html` + `assets/svg-review/` | Review gallery of generated art (not live) |

## Editing common things

- **Team:** `TEAM` in `js/main.js`, as `[first, last, title, photo?]`. The first `FEATURED_COUNT` (6) are directors. Photos are square crops at `assets/img/team/<first>.jpg`. `LEADS` maps each director to the titles they lead, and `LINKEDIN` adds profile links.
- **Event date:** `EVENT_START` in `js/main.js` drives the countdown.
- **Tracks:** the `TRACKS` array in `js/main.js`.
- **Sponsors:** add a transparent PNG/SVG to `assets/img/sponsors/` and a `.logo` entry in `#sponsors`, highest tier first. CSS tints logos white.
- **Socials:** `.footer__social` in `index.html`.
- **Colors:** `:root` tokens in `css/style.css`.

---

# Part 2 · This year only (2026: Hack to the Moon)

Replace everything in this part for next year's theme. The full design rules (palette, type, motifs, don'ts) live in [`CLAUDE.md`](CLAUDE.md).

## Theme

A utopian Harvard drifting through deep space: domes, cupolas, columns and stairs rebuilt as glowing gradient geometry among planets, moons and stars. The source art lives in the brand folder (merch, stickers, banners, logo).

- **Palette:** a near-black navy background, a hot magenta accent, teal → ocean blue, cream glows, and yellow only for the wordmark and small highlights. The signature gradient runs navy → ocean blue → teal → mauve → pink.
- **Type: only two fonts on the whole site.**
  - **Makcasa** (`--serif`): display headlines and the HACK *to the* MOON lockup.
  - **AV Estiana** (`--sans`): body, labels, dates and **all numbers**.
  - ⚠ Our `Makcasa-Regular.woff2` is a trial build: its digits are "Timeless type.co" watermarks. The `@font-face` uses `unicode-range` to exclude 0–9, so digits always render in Estiana. Remove that once a licensed file is in place.

## Sections (2026 designs)

- **Hero:** HACK *to the* MOON lockup, LED countdown, drifting Milky Way and canvas starfield.
- **About:** copy set inside a Greek temple on a podium, with a scroll-scrubbed word highlight, count-up stats and a bell tower beside it.
- **Tracks:** a floating park with an interactive satellite. Drag to spin, tap a module, and it auto-advances.
- **Schedule:** the event timeline.
- **Sponsors:** a comet garden of logos, with a hover glow.
- **FAQ:** grouped questions with moon-phase labels; each one opened lights a diamond lamp on the arch gate.
- **Global:** a garden backdrop; hover a country to trace its outline as a constellation.
- **Team ("Made with ♥"):** director planets plus a carousel of stars. Hovering a director filters the carousel to their team.
- **Footer:** socials, draggable planets and the rocket.

## Motion

Waxing-moon preloader · starfield with cursor shooting stars · staggered hero reveal · scroll reveals · word-highlight scrub · count-up stats · LED countdown · track satellite · light scroll parallax on decorations · floating islands and orbs · animated FAQ + gate lamps · country constellations · team filter · bell ring.

## Hidden features

- **Rocket launch to the top:** click the rocket in the footer and it lifts off, carrying the page back to the top. Under reduced motion it jumps straight there.
- **Garden confetti:** click inside the Sponsors or Global garden art for a burst of stardust confetti.
- **Footer planets:** drag the two footer planets together for a small, easy puzzle (`js/egg.js`).
- **FAQ lights:** each question opened lights a lamp on the arch gate.
- **Sky constellations:** hold a click on empty space to flash a real constellation (its name is logged to the console).
- **Typing test in the bell tower** (desktop only, 961px and up with a mouse):
  - With the About paragraph on screen, press **H** to start. You type the paragraph itself: typed letters light up and a wrong key turns that letter pink (you can't advance until you hit the right key). **Esc** cancels.
  - When you finish, the bell tower's arch window shows your **WPM** in yellow, with the **accuracy** below it. Accuracy = correct ÷ (correct + wrong keys).
  - Click the **bell** in the lower window to ring it and reset everything.
  - Scrolling away mid-test resets it too. If nobody presses H, the paragraph behaves normally with the scroll highlight.
  - Code: the `Typing test` block in `js/main.js`, the `.tower__*` and `.scrub .c` rules in `css/style.css`, and `assets/svg/utopia-tower.svg` (whose arch is a see-through cutout).
