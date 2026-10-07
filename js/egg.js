/* HackHarvard 2026 — footer easter egg: drag the two planets together */
(() => {
  'use strict';

  const footer = document.querySelector('.footer');
  const rose = document.querySelector('.deco--planet-l'), tide = document.querySelector('.deco--planet-r');
  const sol = document.querySelector('.sol');
  if (!footer || !rose || !tide) return;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const center = el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2, r.width]; };

  const notes = [[rose, 'Did you know you can move this around'], [tide, 'There is nothing behind here!']].map(([p, text]) => {
    const n = document.createElement('p');
    n.className = 'egg-note';
    n.textContent = text;
    footer.insertBefore(n, rose);
    return n;
  });
  const placeNotes = () => {
    const f = footer.getBoundingClientRect();
    [rose, tide].forEach((p, i) => {
      const [x, y, w] = center(p), dx = +p.dataset.x || 0, dy = +p.dataset.y || 0, m = notes[i].offsetWidth / 2 + 6;
      notes[i].style.left = clamp(x - dx - f.left, m, f.width - m) + 'px';
      notes[i].style.top = clamp(y - dy - f.top - w * .22, 40, f.height - 40) + 'px';
    });
  };
  placeNotes();
  addEventListener('resize', placeNotes);

  let done = false;
  const merge = () => {
    const [ax, ay, aw] = center(rose), [bx, by, bw] = center(tide);
    if (done || Math.hypot(ax - bx, ay - by) > (aw + bw) * .2) return;
    done = true;
    const f = footer.getBoundingClientRect(), x = (ax + bx) / 2, y = (ay + by) / 2;
    [rose, tide].forEach(p => {
      p.animate({ opacity: [1, 0], transform: ['scale(1)', 'scale(.2)'] }, { duration: reduceMotion ? 1 : 600, easing: 'ease-in', fill: 'forwards' });
      p.style.pointerEvents = 'none';
    });
    if (sol) {
      const s = sol.cloneNode(true);
      s.setAttribute('class', 'deco egg-sol');
      s.removeAttribute('data-depth');
      s.style.cssText = `left:${x - f.left}px;top:${y - f.top}px`;
      footer.append(s);
      if (!reduceMotion) s.animate({ opacity: [0, 1], transform: ['scale(.2)', 'scale(1)'] }, { duration: 1200, easing: 'cubic-bezier(.2,.8,.2,1)' });
    }
    document.dispatchEvent(new CustomEvent('hh:confetti', { detail: { x, y } }));
    console.log('Ohhh you opened this too! Congrats for solving this! Follow us on our Instagram @hhuh.hackathon!');
  };

  [rose, tide].forEach((p, i) => {
    p.classList.add('is-draggable');
    p.addEventListener('pointerdown', e => {
      e.preventDefault();
      p.setPointerCapture(e.pointerId);
      p.classList.add('is-held');
      notes[i].classList.add('is-shown');
      const f = footer.getBoundingClientRect(), [cx, cy] = center(p);
      const x0 = +p.dataset.x || 0, y0 = +p.dataset.y || 0, bx = cx - x0, by = cy - y0, px = e.clientX, py = e.clientY;
      const move = m => {
        const x = clamp(x0 + m.clientX - px, f.left - bx, f.right - bx), y = clamp(y0 + m.clientY - py, f.top - by, f.bottom - by);
        p.dataset.x = x; p.dataset.y = y;
        p.style.translate = `${x}px ${y}px`;
      };
      const up = () => {
        p.classList.remove('is-held');
        p.removeEventListener('pointermove', move);
        p.removeEventListener('pointerup', up);
        p.removeEventListener('pointercancel', up);
        merge();
      };
      p.addEventListener('pointermove', move);
      p.addEventListener('pointerup', up);
      p.addEventListener('pointercancel', up);
    });
  });
})();
