/* HackHarvard 2026 — interactions & animation (no dependencies) */
(() => {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const svgEl = (tag, attrs = {}) => {
    const el = document.createElementNS(SVG_NS, tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  };

  const EVENT_START = new Date('2026-10-16T17:00:00-04:00');

  // Track names + taglines from hhuh.io
  const TRACKS = [
    { title: 'Money Moves', name: 'Fintech' },
    { title: 'Hardware for Good', name: 'Hardware' },
    { title: 'Code for Care', name: 'Health' },
    { title: '(De)-Cipher', name: 'Cybersecurity' },
    { title: 'Save The Earth', name: 'Sustainability' },
  ];

  // Team roster. The first FEATURED_COUNT people get a featured nova; the rest scroll as stars. Format: [first, last, title, photo (optional, e.g. 'assets/img/team/avery.jpg')]
  const FEATURED_COUNT = 7;
  const TEAM = [
    // directors (featured novas, in this order)
    ['Luna', 'Yin', 'Co-Director', 'assets/img/team/luna.jpg'], ['Ian', 'Park', 'Co-Director', 'assets/img/team/ian.jpg'],
    ['Andy', 'Dieu', 'Director of Finance', 'assets/img/team/andy.jpg'], ['Chi', 'Le', 'Director of Design', 'assets/img/team/chi.jpg'],
    ['Kelly', 'Olmos', 'Director of Logistics & HX', 'assets/img/team/kelly.jpg'],
    ['Jaden', 'Zhang', 'Co-Director of Engineering', 'assets/img/team/jaden.jpg'], ['Eric', 'Xu', 'Co-Director of Engineering', 'assets/img/team/eric.jpg'],
    // everyone else (carousel)
    ['Alyssa', 'Kang', 'Finance', 'assets/img/team/alyssa.jpg'], ['Athena', 'Zhou', 'Finance', 'assets/img/team/athena.jpg'],
    ['Smera', 'Sachin', 'Finance', 'assets/img/team/smera.jpg'], ['Shiwaum', 'Khera', 'Finance', 'assets/img/team/shiwaum.jpg'],
    ['Sophia', 'Zhang', 'Finance', 'assets/img/team/sophia-zhang.jpg'], ['Emilie', 'Efendy', 'Finance', 'assets/img/team/emilie.jpg'],
    ['Eric', 'Gong', 'Logistics', 'assets/img/team/eric-gong.jpg'], ['Gabe', 'Cooper', 'Logistics', 'assets/img/team/gabe.jpg'],
    ['Sophia', 'Liu', 'Logistics'], ['Ha', 'Le', 'Logistics', 'assets/img/team/ha.jpg'],
    ['Amy', 'Zhang', 'Logistics'], ['Joshua', 'Gupta', 'Logistics', 'assets/img/team/joshua.jpg'],
    ['Michael', '', 'Logistics'],
    ['Rick', 'Yang', 'Hacker Experience'], ['Radhik', 'Wickramasinghe', 'Hacker Experience', 'assets/img/team/radhik.jpg'],
    ['Anh', 'Nguyen', 'Hacker Experience', 'assets/img/team/anh.jpg'], ['Katherine', 'Guo', 'Hacker Experience'],
    ['Radha', 'Munver', 'Hacker Experience'], ['Caitlyn', 'Gonzalez', 'Hacker Experience', 'assets/img/team/caitlyn.jpg'],
    ['Ellen', 'Wang', 'Hacker Experience', 'assets/img/team/ellen.jpg'],
    ['Neeraja', 'Kumar', 'Marketing & Design'], ['Hector', 'Montellano-Bahena', 'Marketing & Design', 'assets/img/team/hector.jpg'],
    ['Sophia', 'Liu', 'Technology'], ['Iban', 'Palomanes', 'Technology', 'assets/img/team/iban.jpg'],
    ['Joe', 'Liang', 'Technology', 'assets/img/team/joe.jpg'],
  ];
  // Which member titles each director leads, in TEAM order (null = the whole team). Hovering a director filters the carousel.
  const LEADS = [null, null, ['Finance'], ['Marketing & Design'], ['Logistics', 'Hacker Experience'], ['Technology'], ['Technology']];

  /* ---------------------------------------------------------------- Loader */
  // Beams of light draw out and spin, a small star spins up into the supernova,
  // the moon phases are outlined then filled, and a bright flash reveals the site.
  const buildLoaderArt = svg => {
    const pt = (r, deg) => { const a = deg * Math.PI / 180; return `${(r * Math.cos(a)).toFixed(1)} ${(r * Math.sin(a)).toFixed(1)}`; };
    // six-point star with long, thin, flaring spikes (horizontal tips, like the reference art)
    const star = (tip, base, ctrl, inner, spread = 24) => {
      let d = `M${pt(tip, 0)}`;
      for (let k = 0; k < 6; k++) {
        const a = k * 60, b = a + 60;
        d += ` Q${pt(ctrl, a)} ${pt(base, a + spread)}`;        // down the spike
        d += ` Q${pt(inner, a + 30)} ${pt(base, b - spread)}`;  // concave lobe between spikes
        d += ` Q${pt(ctrl, b)} ${pt(tip, b)}`;                  // back up the next spike
      }
      return d + 'Z';
    };
    const stops = (el, list) => list.forEach(([o, c, op = 1]) => el.append(svgEl('stop', { offset: o, 'stop-color': c, 'stop-opacity': op })));
    const defs = svgEl('defs');
    const gNova = svgEl('radialGradient', { id: 'lbNova', gradientUnits: 'userSpaceOnUse', cx: 0, cy: 0, r: 340 });
    stops(gNova, [[0, '#dbeec2'], [.1, '#f2e9b0'], [.2, '#e0e14f'], [.3, '#fecd6d'], [.45, '#ff0aa8'], [.8, '#ff0aa8', .8], [1, '#0ca550', .7]]);
    const gStar = svgEl('radialGradient', { id: 'lbStar', gradientUnits: 'userSpaceOnUse', cx: 0, cy: 0, r: 120 });
    stops(gStar, [[0, '#dbeec2'], [.3, '#e0e14f'], [.55, '#ff0aa8'], [1, '#0ca550']]);
    const gMoon = svgEl('linearGradient', { id: 'lbMoon', x1: 0, x2: 0, y1: 0, y2: 1 });
    stops(gMoon, [[0, '#13111a'], [.42, '#0ca550', .6], [.76, '#ff0aa8', .65], [1, '#ff0aa8']]);
    defs.append(gNova, gStar, gMoon);
    svg.append(defs);

    // beams of light, drawn outward then slowly spinning
    const beams = svgEl('g', { class: 'lb-beams' });
    const tints = ['#f2e9b0', '#f2e9b0', '#ff0aa8', '#7dffaa'];
    for (let k = 0; k < 36; k++) {
      const deg = k * 10 + (k % 3) * 2.5;
      const len = 250 + ((k * 53) % 170);
      const ray = svgEl('line', { class: 'lb-ray', x1: 0, y1: 0, x2: pt(len, deg).split(' ')[0], y2: pt(len, deg).split(' ')[1], pathLength: 1,
        stroke: tints[k % tints.length], 'stroke-opacity': k % 2 ? .22 : .42 });
      ray.style.setProperty('--i', k);
      beams.append(ray);
    }
    svg.append(beams);

    // small star → supernova, spinning
    const spin = svgEl('g', { class: 'lb-spin' });
    spin.append(
      svgEl('path', { class: 'lb-burst', d: star(340, 68, 92, 54, 16), fill: 'url(#lbNova)' }),
      svgEl('path', { class: 'lb-star', d: star(120, 26, 40, 18), fill: 'url(#lbStar)' }),
    );
    svg.append(spin);

    // moon phases, waxing toward the centre and waning away from it
    const R = 46;
    const phases = [[-300, 'crescent'], [-205, 'half'], [-105, 'gibbous'], [0, 'full'], [105, 'gibbous'], [205, 'half'], [300, 'crescent']];
    phases.forEach(([x, kind], n) => {
      const dir = x < 0 ? 1 : -1;                         // which side the shadow sits on
      const i = Math.abs(n - 3);                          // distance from the centre (animation order)
      const id = `lbMask${n}`;
      const mask = svgEl('mask', { id, maskUnits: 'userSpaceOnUse', x: x - R - 2, y: -R - 2, width: R * 2 + 4, height: R * 2 + 4 });
      mask.append(svgEl('circle', { cx: x, cy: 0, r: R, fill: '#fff' }));
      if (kind === 'crescent') mask.append(svgEl('circle', { cx: x + dir * R * .42, cy: 0, r: R * .98, fill: '#000' }));
      if (kind === 'half') mask.append(svgEl('rect', { x: dir > 0 ? x : x - R - 2, y: -R - 2, width: R + 2, height: R * 2 + 4, fill: '#000' }));
      if (kind === 'gibbous') mask.append(svgEl('circle', { cx: x + dir * R * 1.7, cy: 0, r: R, fill: '#000' }));
      defs.append(mask);
      const fill = svgEl('rect', { class: 'lb-fill', x: x - R, y: -R, width: R * 2, height: R * 2, fill: 'url(#lbMoon)', mask: `url(#${id})` });
      fill.style.setProperty('--i', i);                  // full moon first, then pairs outward
      svg.append(fill);
    });
    svg.append(spin);                                    // star + supernova sit on top of the moons
  };

  const loader = () => {
    const root = $('.loader');
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    if (!location.hash) scrollTo(0, 0);
    const finish = () => {
      document.body.classList.remove('is-loading');
      setTimeout(() => document.body.classList.add('is-ready'), reduceMotion ? 0 : 200);
    };
    if (reduceMotion) { root.remove(); return finish(); }

    buildLoaderArt($('[data-loader-art]'));
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('is-playing')));
    setTimeout(() => root.classList.add('is-boom'), 950);   // moons stay → star, beams, supernova on top
    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    Promise.all([fontsReady, new Promise(r => setTimeout(r, 2150))]).then(() => {
      root.classList.add('is-open');         // flash, then fade into the page
      finish();
      setTimeout(() => root.remove(), 1300);
    });
  };

  /* ------------------------------------------ Starfield (+ cursor shooting star) */
  const starfield = () => {
    const canvas = $('.stars');
    const ctx = canvas.getContext('2d');
    const colors = ['#f4f1e4', '#f4f1e4', '#f4f1e4', '#ffdd00', '#ff0aa8', '#7dffaa', '#5686bb'];
    let w, h, dpr, stars = [], shooting = [];
    let mx = 0, my = 0, tx = 0, ty = 0;
    let trail = [];                      // recent cursor points (canvas px) for the shooting-star tail
    const TAIL_MS = 380;

    let lastW = 0;
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 1.5);   // dots look the same; ~45% fewer pixels to redraw each frame on retina
      h = canvas.height = innerHeight * dpr;
      if (innerWidth === lastW && stars.length) return;    // height-only change (mobile toolbar): keep the field
      lastW = innerWidth;
      w = canvas.width = innerWidth * dpr;
      const n = Math.round((innerWidth * innerHeight) / 4200);
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        z: Math.random() * 0.9 + 0.1,               // depth: drives size, speed, parallax
        r: Math.random() * 1.2 + 0.3,
        c: colors[(Math.random() * colors.length) | 0],
        t: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      tx += (mx - tx) * 0.05; ty += (my - ty) * 0.05;
      const sy = scrollY * dpr;

      for (const s of stars) {
        s.t += 0.02 * s.z;
        const px = (s.x + tx * 30 * s.z * dpr) % w;
        const py = ((s.y - sy * 0.15 * s.z + ty * 30 * s.z * dpr) % h + h) % h;
        ctx.globalAlpha = (0.35 + Math.sin(s.t) * 0.3 + 0.35) * s.z;
        ctx.fillStyle = s.c;
        ctx.beginPath(); ctx.arc(px, py, s.r * s.z * dpr * 1.4, 0, 6.283); ctx.fill();
      }

      // Small shooting star trailing the cursor: tapered tail that fades while the mouse rests
      const now = performance.now();
      trail = trail.filter(p => now - p.t < TAIL_MS);
      if (trail.length > 1) {
        ctx.lineCap = 'round';
        for (let k = 1; k < trail.length; k++) {
          const a = trail[k - 1], b = trail[k], f = 1 - (now - b.t) / TAIL_MS;   // 1 at the head → 0 at the tail
          ctx.globalAlpha = f * .9;
          ctx.strokeStyle = f > .6 ? '#ffdd00' : '#ff0aa8';
          ctx.lineWidth = (.4 + f * 2.2) * dpr;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
        const head = trail[trail.length - 1], f = 1 - (now - head.t) / TAIL_MS;
        const g = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 7 * dpr);
        g.addColorStop(0, 'rgba(242,233,176,1)'); g.addColorStop(.4, 'rgba(255,221,0,.7)'); g.addColorStop(1, 'rgba(255,221,0,0)');
        ctx.globalAlpha = f; ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(head.x, head.y, 7 * dpr, 0, 6.283); ctx.fill();
      }

      // Occasional shooting star
      if (Math.random() < 0.006 && shooting.length < 2) {
        shooting.push({ x: Math.random() * w * 0.8, y: Math.random() * h * 0.4, vx: (6 + Math.random() * 6) * dpr, vy: (2 + Math.random() * 3) * dpr, life: 1 });
      }
      shooting = shooting.filter(s => s.life > 0);
      for (const s of shooting) {
        const g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 14, s.y - s.vy * 14);
        g.addColorStop(0, 'rgba(255,221,0,1)'); g.addColorStop(1, 'rgba(255,10,168,0)');
        ctx.globalAlpha = s.life; ctx.strokeStyle = g; ctx.lineWidth = 1.6 * dpr;
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx * 14, s.y - s.vy * 14); ctx.stroke();
        s.x += s.vx; s.y += s.vy; s.life -= 0.014;
      }
      ctx.globalAlpha = 1;
      if (!reduceMotion) requestAnimationFrame(draw);
    };

    addEventListener('resize', resize);
    addEventListener('pointermove', e => {
      mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5;
      if (e.pointerType === 'mouse') trail.push({ x: e.clientX * dpr, y: e.clientY * dpr, t: performance.now() });
    });
    document.addEventListener('pointerleave', () => { trail = []; });
    resize(); draw();
  };

  /* --------------------------------------------------------------------- Nav */
  const nav = () => {
    const phase = $('.phase'), burger = $('.nav__burger'), menu = $('.menu');

    const onScroll = () => {
      const y = scrollY;
      const max = document.documentElement.scrollHeight - innerHeight;
      phase.style.setProperty('--p', (y / max).toFixed(3));   // moon waxes as you scroll
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const setMenu = open => {
      document.body.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', open);
      menu.setAttribute('aria-hidden', !open);
    };
    burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
    $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
    addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));

    // Active section highlight
    const links = $$('.nav__links a');
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(s => io.observe(s));
  };

  /* --------------------------------------------------------------- Reveals */
  const reveals = () => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    $$('.reveal').forEach(el => io.observe(el));
  };

  /* ----------------------------------------- Scroll-scrubbed word highlight */
  const scrub = () => {
    const el = $('[data-scrub]');
    if (!el) return;
    const highlight = /^(36-hour|500|build,|learn,|create)/i;
    el.innerHTML = el.textContent.trim().split(/\s+/)
      .map(w => `<span class="w${highlight.test(w) ? ' hl' : ''}">${w}</span>`).join(' ');
    const words = $$('.w', el);
    const update = () => {
      const r = el.getBoundingClientRect();
      const p = clamp((innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35), 0, 1);
      const n = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle('on', i < n));
    };
    if (reduceMotion) return words.forEach(w => w.classList.add('on'));
    addEventListener('scroll', update, { passive: true }); update();
  };

  /* -------------------------------------------------------------- Count-up */
  const counters = () => {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      const el = en.target, end = +el.dataset.count, pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
      const t0 = performance.now(), dur = reduceMotion ? 0 : 1600;
      const step = t => {
        const k = dur ? clamp((t - t0) / dur, 0, 1) : 1;
        el.textContent = pre + Math.round(end * (1 - Math.pow(1 - k, 4))) + suf;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }), { threshold: 0.6 });
    $$('[data-count]').forEach(el => io.observe(el));
  };

  /* --------------------------------------------------------------- Countdown */
  const countdown = () => {
    // each [data-cd] becomes two seven-segment digits (segments a–g) plus hidden text for screen readers
    const digit = '<span class="seg" aria-hidden="true">' + 'abcdefg'.split('').map(c => `<i class="${c}"></i>`).join('') + '</span>';
    const els = Object.fromEntries(['d', 'h', 'm', 's'].map(k => {
      const el = $(`[data-cd="${k}"]`);
      el.innerHTML = digit + digit + '<span class="sr"></span>';
      return [k, { segs: $$('.seg', el), sr: $('.sr', el) }];
    }));
    const pad = n => String(n).padStart(2, '0');
    const show = (k, n) => { const t = pad(n); els[k].segs.forEach((s, i) => { s.dataset.n = t[i]; }); els[k].sr.textContent = t; };
    const tick = () => {
      const diff = Math.max(0, EVENT_START - Date.now());
      show('d', Math.min(99, Math.floor(diff / 864e5)));
      show('h', Math.floor(diff / 36e5) % 24);
      show('m', Math.floor(diff / 6e4) % 60);
      show('s', Math.floor(diff / 1e3) % 60);
    };
    tick(); setInterval(tick, 1000);
  };

  /* ------------------------------------------------ Fit the HackHarvard lockup */
  const fitLockups = () => {
    const textWidth = el => { const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect().width; };
    const fit = () => $$('.lockup').forEach(l => {
      const [top, bottom] = $$('.lockup__line', l);
      bottom.classList.add('lockup__line--fit');
      bottom.style.setProperty('--fit', '1em');
      bottom.style.setProperty('--fit', (textWidth(top) / textWidth(bottom)).toFixed(4) + 'em');
      l.style.setProperty('--mark-h', $('.lockup__text', l).getBoundingClientRect().height + 'px');
    });
    fit();
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(fit);
    addEventListener('resize', fit);
  };

  /* ------------------------------------- Subtle scroll parallax on decorations */
  const decoParallax = () => {
    if (reduceMotion) return;
    const els = $$('[data-depth]');
    let queued = false;
    const update = () => {
      queued = false;
      els.forEach(el => {
        const r = el.parentElement.getBoundingClientRect();   // parent isn't translated, so no feedback
        const d = r.top + r.height / 2 - innerHeight / 2;
        el.style.setProperty('--sy', (-d * parseFloat(el.dataset.depth)).toFixed(1) + 'px');
      });
    };
    addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  };

  /* ---------------------------------------------- Interactive track satellite */
  const satellite = () => {
    const root = $('[data-satellite]');
    if (!root) return;
    const svg = $('svg', root), rig = $('[data-rig]', root);
    const title = $('[data-track-title]'), name = $('[data-track-name]');
    const list = $('[data-track-list]');
    const STEP = 360 / TRACKS.length;

    const mods = $('[data-mods]', root);
    const R = 215;
    const diamond = (x, y, sz, fill) => svgEl('path', { d: `M${x} ${y - sz}L${x + sz * .6} ${y}L${x} ${y + sz}L${x - sz * .6} ${y}Z`, fill });
    const arch = (x, y, w, h, fill) => svgEl('path', { d: `M${x} ${y + h}V${y + w / 2}a${w / 2} ${w / 2} 0 0 1 ${w} 0V${y + h}Z`, fill });

    // Rotating frame: ring, spokes and a lantern row
    rig.append(svgEl('circle', { r: R, fill: 'none', stroke: '#5686bb', 'stroke-opacity': .45, 'stroke-width': 2 }));
    TRACKS.forEach((t, i) => {
      const spoke = svgEl('g', { transform: `rotate(${i * STEP})` });
      spoke.append(svgEl('rect', { x: 78, y: -3, width: R - 78, height: 6, rx: 3, fill: 'url(#uSpoke)', opacity: .85 }));
      rig.append(spoke);
    });
    for (let k = 0; k < 40; k++) {
      const a = (k / 40) * Math.PI * 2;
      const d = diamond(+(R * Math.cos(a)).toFixed(1), +(R * Math.sin(a)).toFixed(1), 4, k % 2 ? '#ff0aa8' : '#ffdd00');
      d.setAttribute('class', 'module__lamp');
      d.style.setProperty('--delay', `${(k % 8) * 0.3}s`);
      rig.append(d);
    }

    // One utopian pavilion per track (dome, arched windows, columns, floating rock)
    const pavilion = i => {
      const b = svgEl('g', { class: 'module__body' });
      b.append(
        svgEl('rect', { x: -66, y: -84, width: 132, height: 176, rx: 12, fill: 'transparent' }),
        svgEl('rect', { class: 'module__ring', x: -66, y: -84, width: 132, height: 176, rx: 12 }),
        svgEl('path', { d: 'M-54 44H54L38 60L16 82L-4 72L-24 78L-42 60Z', fill: 'url(#uRock)' }),
        svgEl('rect', { x: -60, y: 36, width: 120, height: 10, rx: 2, fill: 'url(#uBand)' }),
        svgEl('rect', { x: -52, y: -12, width: 10, height: 48, fill: 'url(#uCol)' }),
        svgEl('rect', { x: 42, y: -12, width: 10, height: 48, fill: 'url(#uCol)' }),
        svgEl('rect', { x: -36, y: -14, width: 72, height: 50, fill: 'url(#uBody)' }),
        arch(-27, -4, 12, 34, '#0a0f1c'), arch(-6, -4, 12, 34, '#0a0f1c'), arch(15, -4, 12, 34, '#0a0f1c'),
        svgEl('rect', { x: -25, y: 16, width: 8, height: 12, fill: `url(#m${i})` }),
        svgEl('rect', { x: 17, y: 16, width: 8, height: 12, fill: `url(#m${i})` }),
        svgEl('rect', { x: -58, y: -22, width: 116, height: 9, fill: 'url(#uBand)' }),
        svgEl('path', { d: 'M-32 -22A32 32 0 0 1 32 -22Z', fill: `url(#m${i})` }),
        svgEl('path', { d: 'M0 -54V-22M-17 -49Q-11 -36 -13 -22M17 -49Q11 -36 13 -22', fill: 'none', stroke: '#f2e9b0', 'stroke-opacity': .5, 'stroke-width': 1.5 }),
        svgEl('rect', { x: -1.5, y: -68, width: 3, height: 15, fill: '#f2e9b0' }),
        svgEl('circle', { cy: -71, r: 4, fill: '#ffdd00' }),
      );
      for (let x = -52; x <= 52; x += 13) {
        const lamp = diamond(x, -26, 3, '#ffdd00');
        lamp.setAttribute('class', 'module__lamp');
        lamp.style.setProperty('--delay', `${((x + 52) / 13) * 0.18}s`);
        b.append(lamp);
      }
      return b;
    };

    const modules = TRACKS.map((t, i) => {
      const g = svgEl('g', { class: 'module', tabindex: 0, role: 'button', 'aria-label': `${t.name}: ${t.title}` });
      const float = svgEl('g', { class: 'module__float' });
      float.style.setProperty('--delay', `${i * -1}s`);
      float.append(pavilion(i));
      g.append(float);
      mods.append(g);
      return g;
    });

    TRACKS.forEach((t, i) => {
      const li = document.createElement('li');
      li.innerHTML = `<button type="button">${t.name}</button>`;
      li.firstChild.addEventListener('click', () => { select(i); touch(); });
      list.append(li);
    });
    const listBtns = $$('button', list);

    let active = -1, rot = 0, target = 0, dragging = false, lastInteract = 0;

    let raf = 0;
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
    const select = i => {
      i = ((i % TRACKS.length) + TRACKS.length) % TRACKS.length;
      // rotate the shortest way so the chosen pavilion sits on the right, next to the info panel
      const base = -i * STEP;
      target = base + 360 * Math.round((target - base) / 360);
      kick();
      if (i === active) return;
      active = i;
      modules.forEach((m, k) => m.classList.toggle('is-active', k === i));
      listBtns.forEach((b, k) => b.setAttribute('aria-current', k === i));
      title.textContent = TRACKS[i].title;
      name.textContent = TRACKS[i].name;
      title.classList.remove('swap'); void title.offsetWidth; title.classList.add('swap');
    };
    const touch = () => (lastInteract = performance.now());

    $('[data-track-prev]').addEventListener('click', () => { select(active - 1); touch(); });
    $('[data-track-next]').addEventListener('click', () => { select(active + 1); touch(); });
    modules.forEach((m, i) => m.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(i); touch(); }
    }));

    // Drag to spin, with inertia, then snap to the nearest module
    const center = () => { const r = svg.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
    const angleAt = e => { const [x, y] = center(); return Math.atan2(e.clientY - y, e.clientX - x) * 180 / Math.PI; };
    let startA = 0, startRot = 0, prevA = 0, vel = 0, moved = 0;

    svg.addEventListener('pointerdown', e => {
      dragging = true; moved = 0; vel = 0; touch();
      startA = prevA = angleAt(e); startRot = rot;
      svg.setPointerCapture(e.pointerId);
      root.classList.add('is-dragging');
    });
    svg.addEventListener('pointermove', e => {
      if (!dragging) return;
      const a = angleAt(e);
      let da = a - prevA; if (da > 180) da -= 360; if (da < -180) da += 360;
      prevA = a; moved += Math.abs(da); vel = da;
      rot += da; target = rot; kick();
    });
    const end = e => {
      if (!dragging) return;
      dragging = false; root.classList.remove('is-dragging'); touch();
      if (moved < 4) {                       // a tap, not a drag
        const hit = document.elementFromPoint(e.clientX, e.clientY)?.closest('.module');
        if (hit) return select(modules.indexOf(hit));
        return;
      }
      const flung = rot + vel * 12;
      select(Math.round(-flung / STEP));
    };
    svg.addEventListener('pointerup', end);
    svg.addEventListener('pointercancel', end);

    // Auto-advance while visible and idle
    let visible = false;
    new IntersectionObserver(([en]) => (visible = en.isIntersecting), { threshold: 0.4 }).observe(root);
    if (!reduceMotion) setInterval(() => {
      if (visible && !dragging && performance.now() - lastInteract > 7000) select(active + 1);
    }, 4200);

    function loop() {
      raf = 0;
      if (!dragging) rot += (target - rot) * (reduceMotion ? 1 : 0.08);
      if (!dragging && Math.abs(target - rot) < .02) rot = target;
      rig.setAttribute('transform', `rotate(${rot.toFixed(2)})`);
      modules.forEach((m, i) => {
        const a = (rot + i * STEP) * Math.PI / 180;
        m.setAttribute('transform', `translate(${(R * Math.cos(a)).toFixed(1)} ${(R * Math.sin(a)).toFixed(1)})`);
      });
      if (dragging || rot !== target) kick();             // idle once settled — no per-frame work
    }
    select(0); rot = target; loop();
  };

  /* ------------------------- Team: 7 utopian planets + a carousel of stars (made with ♥) */
  const team = () => {
    const host = $('[data-team]');
    if (!host) return;
    const esc = t => t.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const face = (name, photo) => `<span class="face" role="img" aria-label="Photo of ${name}">${photo ? `<img src="${esc(photo)}" alt="" loading="lazy" />` : ''}</span>`;
    const caption = (name, title) => `<figcaption><b>${name}</b><span>${esc(title)}</span></figcaption>`;

    // Featured seven: each gets its own little nova (spike count, colours, spin) with a ring of thin rays
    const FEATURED = [
      { n: 6, c: ['#f2e9b0', '#ffdd00', '#ff0aa8'], rays: 12 }, { n: 8, c: ['#dbeec2', '#7dffaa', '#0b4a9a'], rays: 16 },
      { n: 5, c: ['#fecd6d', '#e41e2d', '#5b1030'], rays: 10 }, { n: 6, c: ['#f2e9b0', '#5686bb', '#ff0aa8'], rays: 18 },
      { n: 7, c: ['#e0e14f', '#5aff00', '#0ca550'], rays: 14 }, { n: 8, c: ['#fecd6d', '#ff0aa8', '#0b4a9a'], rays: 12 },
      { n: 6, c: ['#dbeec2', '#e0e14f', '#0ca550'], rays: 16 },
    ];
    const pt = (r, a) => `${(r * Math.cos(a)).toFixed(1)} ${(r * Math.sin(a)).toFixed(1)}`;
    const nova = (n, tip, base, ctrl, inner, spread) => {                // n thin spikes with concave lobes
      const step = 2 * Math.PI / n, sp = spread * step;
      let d = `M${pt(tip, -Math.PI / 2)}`;
      for (let k = 0; k < n; k++) {
        const a = -Math.PI / 2 + k * step, b = a + step;
        d += ` Q${pt(ctrl, a)} ${pt(base, a + sp)} Q${pt(inner, a + step / 2)} ${pt(base, b - sp)} Q${pt(ctrl, b)} ${pt(tip, b)}`;
      }
      return d + 'Z';
    };
    const bigStarSVG = ({ n, c, rays }, i) => {
      const lines = Array.from({ length: rays }, (_, k) => {
        const a = (k / rays) * Math.PI * 2 + .2, len = 78 + (k * 37) % 22;
        return `<line x1="${pt(52, a).split(' ')[0]}" y1="${pt(52, a).split(' ')[1]}" x2="${pt(len, a).split(' ')[0]}" y2="${pt(len, a).split(' ')[1]}" stroke="${c[k % 2 ? 1 : 2]}" stroke-width="1" opacity=".55"/>`;
      }).join('');
      return `<svg viewBox="-100 -100 200 200" aria-hidden="true">
        <defs><radialGradient id="fs${i}" gradientUnits="userSpaceOnUse" r="96"><stop offset=".5" stop-color="${c[0]}"/><stop offset=".72" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[2]}"/></radialGradient></defs>
        <g class="uplanet__rays">${lines}</g>
        <g class="uplanet__nova${i % 2 ? ' uplanet__nova--rev' : ''}">
          <path d="${nova(n, 66, 46, 52, 40, .16)}" fill="url(#fs${i})" opacity=".45" transform="rotate(${180 / n})"/>
          <path d="${nova(n, 96, 44, 58, 38, .12)}" fill="url(#fs${i})"/>
        </g>
      </svg>`;
    };

    // Everyone else: a simpler star per person
    const GLOWS = ['#ffdd00', '#ff0aa8', '#7dffaa', '#5686bb', '#fecd6d', '#e0e14f'];
    // each star gets its own gradient id; shared ids only resolve for the first cards that define them
    const starSVG = (k, copy) => {
      const c = GLOWS[k % GLOWS.length], id = `ts${copy}-${k}`;
      return `<svg viewBox="-50 -50 100 100" aria-hidden="true">
        <defs><radialGradient id="${id}"><stop offset="0" stop-color="#f2e9b0"/><stop offset=".45" stop-color="${c}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient></defs>
        <path d="M0 -36Q5 -5 36 0Q5 5 0 36Q-5 5 -36 0Q-5 -5 0 -36Z" fill="url(#${id})" opacity=".55" transform="rotate(45)"/>
        <path d="M0 -50Q6 -6 50 0Q6 6 0 50Q-6 6 -50 0Q-6 -6 0 -50Z" fill="url(#${id})"/>
      </svg>`;
    };

    const featured = document.createElement('div');
    featured.className = 'team__featured';
    featured.innerHTML = TEAM.slice(0, FEATURED_COUNT).map(([first, last, title, photo], i) => {
      const name = `${esc(first)} ${esc(last)}`;
      return `<figure class="uplanet" tabindex="0" data-lead="${i}"><div class="uplanet__art">${bigStarSVG(FEATURED[i], i)}${face(name, photo)}</div>${caption(name, title)}</figure>`;
    }).join('');

    const cards = copy => TEAM.slice(FEATURED_COUNT).map(([first, last, title, photo], k) => {
      const name = `${esc(first)} ${esc(last)}`;
      return `<figure class="tstar" data-title="${esc(title)}" style="--glow:${GLOWS[k % GLOWS.length]};--delay:${-(k % 5) * .8}s"><div class="tstar__art">${starSVG(k, copy)}${face(name, photo)}</div>${caption(name, title)}</figure>`;
    }).join('');
    const row = document.createElement('div');
    row.className = 'team__row';
    // the list is repeated once so the loop is seamless; the copy is hidden from screen readers
    row.innerHTML = `<div class="team__track">${cards(0)}<div style="display:contents" aria-hidden="true">${cards(1)}</div></div>`;

    host.append(featured, row);

    // hover (or focus/tap) a director to show only their members; leaving the team area shows everyone again
    const filter = i => {
      const leads = LEADS[i] ?? null;
      host.classList.toggle('is-filtered', !!leads);
      $$('.uplanet', featured).forEach(u => u.classList.toggle('is-active', !!leads && u.dataset.lead === String(i)));
      $$('.tstar', row).forEach(t => t.classList.toggle('is-out', !!leads && !leads.includes(t.dataset.title)));
      // the track holds two copies so the marquee can loop; a filtered group stands still instead, showing one copy
      host.classList.toggle('is-static', !!leads);
    };
    $$('.uplanet', featured).forEach(u => {
      u.addEventListener('mouseenter', () => filter(+u.dataset.lead));
      u.addEventListener('focus', () => filter(+u.dataset.lead));
    });
    host.addEventListener('mouseleave', () => filter(null));
    host.addEventListener('focusout', e => { if (!host.contains(e.relatedTarget)) filter(null); });
  };

  /* ------------------------------------------------------ Sponsor logo glow */
  const logoGlow = () => {
    if (!finePointer) return;
    $$('.logo, .site, .sponsor-cta').forEach(l => l.addEventListener('pointermove', e => {
      const r = l.getBoundingClientRect();
      l.style.setProperty('--mx', e.clientX - r.left + 'px');
      l.style.setProperty('--my', e.clientY - r.top + 'px');
    }));
  };

  /* ------------------------------------------------- FAQ: animated open/close */
  const faq = () => {
    $$('.faq details').forEach(d => {
      const summary = $('summary', d), body = $('div', d);
      summary.addEventListener('click', e => {
        if (reduceMotion) return;
        e.preventDefault();
        if (d.open) {
          const anim = body.animate({ height: [body.offsetHeight + 'px', '0px'], opacity: [1, 0] }, { duration: 350, easing: 'ease-in-out' });
          anim.onfinish = () => { d.open = false; };
        } else {
          d.open = true;
          body.animate({ height: ['0px', body.offsetHeight + 'px'], opacity: [0, 1] }, { duration: 450, easing: 'cubic-bezier(.2,.8,.2,1)' });
        }
      });
    });
  };

  /* ------------------------------------- FAQ gate: one diamond lamp per question opened */
  const gateLamps = () => {
    const gate = $('[data-gate]'), svg = $('.gate__lamps', gate || document);
    const qs = $$('.faq details');
    if (!gate || !svg || !qs.length) return;
    // lamps hang just outside the arch (centre 300,330 · r 150 in the gate SVG), left to right
    const lamps = qs.map((_, k) => {
      const a = Math.PI + (k + .5) / qs.length * Math.PI, r = 166;
      const x = 300 + r * Math.cos(a), y = 330 + r * Math.sin(a);
      const d = svgEl('path', { class: 'gate__lamp', d: `M${x.toFixed(1)} ${(y - 14).toFixed(1)}Q${(x + 6).toFixed(1)} ${y.toFixed(1)} ${x.toFixed(1)} ${(y + 14).toFixed(1)}Q${(x - 6).toFixed(1)} ${y.toFixed(1)} ${x.toFixed(1)} ${(y - 14).toFixed(1)}Z` });
      svg.append(d);
      return d;
    });
    const read = new Set();
    qs.forEach(d => d.addEventListener('toggle', () => {
      if (!d.open || read.has(d)) return;
      read.add(d);
      lamps[read.size - 1].classList.add('is-lit');
      gate.classList.toggle('is-full', read.size === lamps.length);
    }));
  };

  /* ------------------------------- Global: hover a country to trace its outline as a constellation */
  // Simplified borders [lon, lat]; the capital gets the brand sparkle
  const COUNTRIES = {
    China: { cap: [116.4, 39.9], pts: [[134.7, 48.3], [130.6, 42.4], [124.3, 39.9], [121.6, 38.9], [122.3, 36.9], [120.3, 34.3], [121.9, 31], [121, 28], [119.5, 25.4], [116.6, 23.3], [113.5, 22.2], [110, 20.3], [108, 21.5], [106.7, 22.8], [101, 21.5], [98.7, 24.1], [97.4, 28.3], [92, 27.8], [88.9, 27.9], [81, 30.2], [79.5, 32.5], [74.9, 37.2], [73.5, 39.5], [80.2, 42.2], [82.9, 45.4], [87.3, 49.1], [90.9, 45.3], [97, 42.7], [104.9, 41.6], [111.9, 43.7], [116.7, 46], [119.8, 47], [117.9, 49.6], [121, 53.3], [126.9, 51.4], [130.6, 48.9]] },
    India: { cap: [77.2, 28.6], pts: [[77.5, 35.4], [79, 32.4], [81, 30.2], [84, 27.4], [88.2, 26.7], [88.9, 27.9], [92, 27.8], [97.3, 28.2], [95.2, 26.5], [93.3, 24], [92.6, 21.9], [88.7, 22], [85.8, 20], [82.3, 16.6], [80.3, 13.1], [79.9, 10.3], [77.5, 8.1], [76.3, 9.9], [74.8, 12.9], [73, 19], [72.8, 21.2], [70, 21], [68.6, 23.3], [70.1, 25.8], [71.9, 27.9], [74.5, 31.8], [73.8, 34.5]] },
    Vietnam: { cap: [105.8, 21], pts: [[102.2, 22.4], [105.3, 23.3], [106.7, 22.8], [108, 21.5], [106.8, 20.4], [105.9, 19], [106.6, 17.5], [108.2, 16.1], [109.2, 13.8], [109.2, 12.2], [108.1, 10.9], [107.1, 10.3], [106, 9.2], [104.8, 8.6], [104.5, 10.4], [105.9, 11], [107.5, 12.5], [107.5, 14.6], [106.5, 16.6], [105.6, 18.2], [104, 19.5], [103.2, 20.8]] },
  };
  const constellation = () => {
    const svg = $('[data-constellation]'), section = $('.global');
    if (!svg || !finePointer) return;
    const STAR = ['#f4f1e4', '#f2e9b0', '#ffdd00', '#ff0aa8', '#7dffaa', '#5686bb'];
    const groups = {};
    for (const [name, { cap, pts }] of Object.entries(COUNTRIES)) {
      // equirectangular, squeezed by cos(latitude) so shapes aren't stretched, fitted into the 400×400 box
      const k = Math.cos(pts.reduce((a, p) => a + p[1], 0) / pts.length * Math.PI / 180);
      const xy = ([lo, la]) => [lo * k, -la];
      const all = pts.map(xy), xs = all.map(p => p[0]), ys = all.map(p => p[1]);
      const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
      const sc = 340 / Math.max(x1 - x0, y1 - y0), ox = 200 - (x0 + x1) / 2 * sc, oy = 200 - (y0 + y1) / 2 * sc;
      const P = p => { const [x, y] = xy(p); return [x * sc + ox, y * sc + oy]; };
      const g = svgEl('g');
      g.append(svgEl('path', { d: 'M' + pts.map(p => P(p).map(n => n.toFixed(1)).join(' ')).join('L') + 'Z', pathLength: 1 }));
      pts.forEach((p, i) => {
        const [x, y] = P(p);
        g.append(svgEl('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: (1.3 + (i * 7 % 5) * .45).toFixed(2), fill: STAR[i % STAR.length], style: `--d:${(i / pts.length * 1.4).toFixed(2)}s` }));
      });
      const [cx, cy] = P(cap);
      g.append(svgEl('path', { class: 'cap', d: `M${cx} ${cy - 9}Q${cx + 2} ${cy - 2} ${cx + 9} ${cy}Q${cx + 2} ${cy + 2} ${cx} ${cy + 9}Q${cx - 2} ${cy + 2} ${cx - 9} ${cy}Q${cx - 2} ${cy - 2} ${cx} ${cy - 9}Z` }));
      svg.append(g);
      groups[name] = g;
    }
    $$('.site').forEach(site => {
      const g = groups[$('h3', site).textContent.trim()];
      if (!g) return;
      const on = () => { g.classList.add('is-on'); section.classList.add('is-tracing'); };
      const off = () => { g.classList.remove('is-on'); section.classList.remove('is-tracing'); };
      site.addEventListener('pointerenter', on); site.addEventListener('focus', on);
      site.addEventListener('pointerleave', off); site.addEventListener('blur', off);
    });
  };

  /* -------------------------------------------------------- Rocket back-to-top */
  const rocket = () => {
    const r = $('.rocket');
    r.addEventListener('click', () => {
      if (reduceMotion) return scrollTo(0, 0);
      r.classList.add('is-launching');
      setTimeout(() => scrollTo({ top: 0, behavior: 'smooth' }), 350);
      setTimeout(() => r.classList.remove('is-launching'), 2200);
    });
  };

  fitLockups();
  loader();
  starfield();
  nav();
  reveals();
  scrub();
  counters();
  countdown();
  decoParallax();
  satellite();
  team();
  logoGlow();
  faq();
  gateLamps();
  constellation();
  rocket();
})();
