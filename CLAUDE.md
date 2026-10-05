# ✦ HACK *to the* MOON ✦

**HackHarvard 2026** · Oct 16–18 · Harvard University, Cambridge MA
☽ ◐ ● ◑ ☾  *the site for this year's theme. It's live, so make small, careful edits and don't rewrite things.*

---

## ✦ The aesthetic

Source art: `/Users/chi/Desktop/HackHarvard/` (merch, stickers, banners, `300ppi/` logo + LinkedIn cover). **Look at it before any visual change.** The site should look like it came from the same print run.

**The world:** a *utopian Harvard drifting through deep space.* Harvard architecture (domes, cupola spires, columns, arched windows, stepped stairs) is rebuilt as glowing, gradient-filled geometry and set among planets, moons and stars.

**Mood:** dreamy and nocturnal, with a retro-futurist editorial feel. Elegant, not cartoonish or "techy". Think luminous gig poster, not SaaS landing page.

### Palette
| Role | Look | Token |
| --- | --- | --- |
| Space (background) | near-black navy, never pure black | `--space` `#01151e`, `--space-2` |
| Wordmark | electric yellow, *only* for the HACK *to the* MOON lockup | `--yellow` `#ffdd00` |
| Heat | hot pink / magenta, the dominant accent | `--magenta` `#ff0aa8` |
| Cool | teal → deep ocean blue | `--green` `#0ca550`, `--blue` `#0b4a9a`, `--blue-l` |
| Glow | pale cream / butter, the bright core of every orb | `--cream` `#f2e9b0` |
| Brand mark | red H-mark on navy (sticker variant) | `--red` `#e41e2d` |
| Mid-tones | orb cores, warm dome glow, deep mauve gradient ends | `--glow` `#dbeec2`, `--butter` `#fecd6d`, `--wine` `#5b1030` |
| Dark detail | linework and shadows inside illustrations | `--ink` `#0a0f1c` |
| Starlight | body text and tiny star dots | `--text` `#f4f1e4` |

**The signature gradient** runs vertically: **navy → ocean blue → teal → dusty mauve → hot pink**. It fills the H-mark and every building. Use it for big shapes instead of flat fills.

**Orbs** are radial: a cream/yellow core blooming into pink or teal and fading into space, with a soft blur halo. A few big ones, many tiny ones.

### Type
- **Makcasa** (`--serif`): a high-contrast, hairline display serif with ligatures (the crossed **H**, the interlocked **OO** in MOON). Use it for headlines and the lockup only. Set it big, in caps, with generous tracking.
- **AV Estiana** (`--sans`): a grotesk used for body, dates, numbers and labels. Pair a bold upright **HACK** with a bold italic ***HARVARD***.
- Small labels use wide-tracked caps, like **T O T H E**. "*to the*" can sit in a slanted pink/teal ribbon tag.
- Dates are written `10/16 – 10/18, 2026`.

### Motifs (reuse these; don't invent new ones)
✦ four-point sparkle stars, with long thin flares on the hero ones
☽ moon-phase sequences (a row or column of crescents → full)
🪐 ringed planets and gradient orbs · ☄ small rockets with dotted stardust trails
⌂ domes, cupolas, columns, arches, stepped stairs · ◇ rows of diamond "bulb" lights along ledges
✧ golden dust / particle sprays · ⊙ starburst sun with thin radiating rays · ⋆ constellation lines
〰 big banded gradient petals / ribbons with cream crescent slivers (section backdrops: `assets/svg/ribbons-*.svg`, one composition per section)

### Don'ts
✕ pure `#000` or white backgrounds · ✕ flat, single-color fills on big shapes · ✕ neon-cyberpunk or glassmorphism-SaaS looks
✕ emoji or stock icon sets in the UI · ✕ rounded "friendly" sans for headlines · ✕ yellow anywhere except the wordmark and tiny star accents

---

## ✦ Hard rules

- **No build step, no dependencies, no frameworks.** Use plain HTML, CSS and vanilla JS. Don't add npm, TypeScript, React, Tailwind or CDN libraries unless asked.
- **Bump the cache version on every CSS/JS change.** `index.html` has `css/style.css?v=…` and `js/main.js?v=…` (two places, same value), in the format `YYYYMMDD` + a letter, e.g. `20261005i` → `20261005j`.
- **Respect `prefers-reduced-motion`.** Every animation needs a still fallback: the `reduceMotion` flag in JS and the `@media (prefers-reduced-motion: reduce)` block at the end of `style.css`.
- **Mobile matters.** Breakpoints are 1080 / 960 / 900 / 820 / 560px, with no horizontal scroll at 375px.
- Colors come only from the `:root` tokens; add a new token rather than hardcoding a hex.
- **SVG files** (loaded via `<img>`, so they can't read CSS variables) must use the exact token hex values from the table above, and nothing else. Prefer gradients and opacity over `<filter>`/blur, which are expensive to animate. Check with: `grep -ohiE '#[0-9a-f]{6}' assets/svg/*.svg | sort -u`
- **Performance:** animate only `transform` and `opacity`. Never animate `filter` on large elements (it repaints the whole layer every frame).
- When exporting art from the brand folder, use WOFF2 for fonts, WebP/PNG for images and SVG for decorations. Keep files small.

---

## ✦ Map of the station

| Path | What |
| --- | --- |
| `index.html` | All content. Sections in order: hero, `#about`, `#tracks`, `#sponsors`, `#schedule`, `#faq`, `#global`, `#team` |
| `js/main.js` | One IIFE. Data at the top: `EVENT_START`, `TRACKS`, `TEAM` = `[first, last, title, photo?]` (the first `FEATURED_COUNT` = 6 are directors). Feature blocks are marked `/* ---- Name */`: Loader, Starfield, Nav, Reveals, Countdown, Track satellite, Team, FAQ, Rocket… Helpers: `$`, `$$`, `clamp`, `svgEl` |
| `css/style.css` | `:root` tokens → sections → media queries at the end |
| `assets/img/team/` | square director photos, `<first>.jpg` |
| `assets/img/sponsors/` | transparent PNG/SVG logos, tinted white by CSS, ordered by tier (highest first) |
| `assets/svg/` | decorative SVGs in use (`review.html` + `assets/svg-review/` are a review gallery, not live) |

---

## ✦ Launch & check

```sh
python3 -m http.server 5173
```

Open http://localhost:5173 and check the changed section at desktop and 375px. Make sure the console is clean, then compare it side by side with the brand art: *does it look like the same poster?*

## ✦ Code style

Match `main.js`: terse arrow functions, `const`, 2-space indent, short `//` comments only where intent isn't obvious. Keep each feature inside its own `/* ---- */` block.

## ✦ Commit cadence

**Every 3 user prompts, commit and push everything** (`git add -A`, a short descriptive message, `git push` to `main`) without asking. Count prompts within the session; before committing, check that the cache version is bumped if CSS/JS changed.
