import { animate, inView, scroll, stagger } from 'motion';
import Lenis from 'lenis';

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const ease = [0.22, 1, 0.36, 1] as const;

// Theme toggle (with view transition when supported)
const themeBtn = document.getElementById('theme');
themeBtn?.addEventListener('click', () => {
  const root = document.documentElement;
  const next = root.dataset.theme === 'light' ? 'dark' : 'light';
  const apply = () => {
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch {}
  };
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (doc.startViewTransition && !reduce) doc.startViewTransition(apply);
  else apply();
});

// Copy email
const copy = document.getElementById('copy') as HTMLButtonElement | null;
const toast = document.getElementById('toast');
copy?.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(copy.dataset.email || ''); } catch {}
  if (toast) {
    toast.textContent = copy.dataset.done || '';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1800);
  }
});

// Cursor spotlight on bento cells and hero photo
document.querySelectorAll<HTMLElement>('.spot, #photo').forEach((el) => {
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});

if (!reduce) {
  // Smooth scroll
  const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (target) { e.preventDefault(); lenis.scrollTo(target as HTMLElement, { offset: -80 }); }
    });
  });

  // Hero entrance: masked line reveal + springy photo
  animate('[data-line]', { y: ['110%', '0%'] }, { duration: 1, ease, delay: stagger(0.09, { startDelay: 0.15 }) });
  animate('[data-hero]', { opacity: [0, 1], y: [20, 0] }, { duration: 0.9, ease, delay: stagger(0.1, { startDelay: 0.45 }) });
  animate('[data-photo]', { opacity: [0, 1], scale: [0.92, 1], filter: ['blur(12px)', 'blur(0px)'] }, { duration: 1.2, ease, delay: 0.3 });
  animate('[data-chip]', { opacity: [0, 1], y: [16, 0] }, { type: 'spring', stiffness: 220, damping: 18, delay: stagger(0.12, { startDelay: 0.9 }) });
  document.querySelectorAll<HTMLElement>('[data-chip]').forEach((c, i) => {
    animate(c, { y: [0, -8, 0] }, { duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: 2 + i * 0.4 });
  });

  // 3D tilt on the portrait
  const photo = document.getElementById('photo');
  photo?.addEventListener('pointermove', (e) => {
    const r = photo.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    photo.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  });
  photo?.addEventListener('pointerleave', () => { photo.style.transform = ''; });

  // Reveal on scroll
  inView('[data-reveal]', (el) => {
    animate(el, { opacity: [0, 1], y: [28, 0] }, { duration: 0.9, ease });
  }, { margin: '0px 0px -10% 0px' });

  // About: words light up as you scroll
  const para = document.querySelector<HTMLElement>('.about-text');
  if (para) {
    const words = Array.from(para.querySelectorAll<HTMLElement>('.w'));
    scroll((p: number) => {
      const n = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle('on', i < n));
    }, { target: para, offset: ['start 85%', 'end 45%'] });
  }

  // Count-up stats
  inView('[data-count]', (el) => {
    const end = Number((el as HTMLElement).dataset.count);
    animate(0, end, {
      duration: 1.6, ease,
      onUpdate: (v) => { el.textContent = Math.round(v).toLocaleString(document.documentElement.lang); },
    });
  });

  // Magnetic buttons
  document.querySelectorAll<HTMLElement>('.magnetic').forEach((b) => {
    b.addEventListener('pointermove', (e) => {
      const r = b.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      b.style.transform = `translate(${x * 0.18}px, ${y * 0.25}px)`;
    });
    b.addEventListener('pointerleave', () => { b.style.transform = ''; });
  });
} else {
  document.querySelectorAll<HTMLElement>('.about-text .w').forEach((w) => w.classList.add('on'));
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => { el.style.opacity = '1'; el.style.transform = 'none'; });
}
