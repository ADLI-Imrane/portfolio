import { animate } from 'motion';
import { t, site, stack, type Lang } from '../i18n';
import { ui } from './ui';
import { icon } from './icons';

const lang = (document.documentElement.lang === 'en' ? 'en' : 'fr') as Lang;
const L = ui[lang];
const D = t[lang];
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = () => window.matchMedia('(max-width: 760px)').matches;
const ease = [0.22, 1, 0.36, 1] as const;

const $ = <T extends HTMLElement = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector(s) as T;
const h = (html: string) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild as HTMLElement; };
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

const desktop = $('#desktop');
const photo = '/img/imrane.webp';

/* ---------------- apps ---------------- */
type AppId = 'about' | 'finder' | 'terminal' | 'notes' | 'skills' | 'mail' | 'readme';
interface AppDef { id: AppId; title: string; icon: string; w: number; h: number; render: (win: HTMLElement) => HTMLElement }

const appIcon = (id: AppId) => (id === 'about' ? `<img src="${photo}" alt="" />` : icon(id));

const projectMeta: Record<string, { img?: string; live?: string; code?: string; lock?: 'private' | 'company' }> = {
  tunneleads: { img: '/img/tunneleads-demo.webp', lock: 'private' },
  wrx: { live: 'https://wrx.link', code: 'https://github.com/ADLI-Imrane/wrx-generator-v2' },
  hris: { lock: 'company' },
  workout: { lock: 'private' },
};

function renderAbout(): HTMLElement {
  const specs = L.about.specs.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('');
  const el = h(`<div class="about">
    <div class="about-photo"><img src="${photo}" alt="Imrane Adli" /></div>
    <div>
      <h1>Imrane Adli</h1>
      <div class="ver">${L.about.role} · ${L.about.version}</div>
      <dl class="specs">${specs}</dl>
      <div class="btn-row">
        <button class="mbtn primary" data-open="finder">${L.about.more}</button>
        <button class="mbtn" data-open="mail">${L.about.contact}</button>
      </div>
    </div></div>`);
  return el;
}

function renderFinder(): HTMLElement {
  const folderSvg = `<svg viewBox="0 0 16 16"><path d="M1.5 4a1 1 0 0 1 1-1h3.6l1.4 1.4h5.9a1 1 0 0 1 1 1V12a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1z" fill="#3b82f6"/></svg>`;
  const side = D.projects.map((p) => `<button data-p="${p.id}">${folderSvg}${esc(p.name)}</button>`).join('');
  const el = h(`<div class="finder">
    <aside class="f-side"><h4>${L.finder.sidebar}</h4><button data-p="" class="on">${folderSvg}${L.finder.all}</button>${side}</aside>
    <div class="f-main"><div class="f-bar"><span class="f-crumb">${L.finder.all}</span></div><div class="f-content"></div></div>
  </div>`);
  const content = $('.f-content', el);
  const crumb = $('.f-crumb', el);
  const showGrid = () => {
    crumb.textContent = `${L.finder.all} — ${D.projects.length + D.more.items.length} ${L.finder.items}`;
    content.className = 'f-content f-grid';
    content.innerHTML =
      D.projects.map((p) => `<button class="f-item" data-p="${p.id}"><span class="fi">${icon('folder')}</span><b>${esc(p.name)}</b><small>${esc(p.stack.slice(0, 2).join(' · '))}</small></button>`).join('') +
      D.more.items.map((m) => `<div class="f-item" title="${esc(m.desc)}"><span class="fi">${icon('folder')}</span><b>${esc(m.name)}</b><small>${esc(m.stack.split(' · ').slice(0, 2).join(' · '))}</small></div>`).join('');
  };
  const showProject = (id: string) => {
    const p = D.projects.find((x) => x.id === id);
    if (!p) return showGrid();
    const m = projectMeta[id] || {};
    crumb.innerHTML = `<button class="mbtn" data-p="">← ${L.finder.back}</button>&nbsp; ${esc(p.name)}`;
    content.className = 'f-content f-detail';
    const links = [
      m.live ? `<a class="mbtn primary" href="${m.live}" target="_blank" rel="noopener">${L.finder.live} ↗</a>` : '',
      m.code ? `<a class="mbtn" href="${m.code}" target="_blank" rel="noopener">${L.finder.code} ↗</a>` : '',
      m.lock ? `<span>🔒 ${m.lock === 'company' ? L.finder.company : L.finder.private}</span>` : '',
    ].join('');
    content.innerHTML = `<span class="tag">${esc(p.tag)}</span><h2>${esc(p.name)}</h2>
      ${m.img ? `<div class="shot"><img src="${m.img}" alt="${esc(p.name)}" style="width:100%;display:block" /></div>` : ''}
      <p>${esc(p.desc)}</p><ul>${p.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
      <div class="chips">${p.stack.map((s) => `<span>${esc(s)}</span>`).join('')}</div>
      <div class="f-foot">${links}</div>`;
  };
  el.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-p]');
    if (!b) return;
    const id = b.dataset.p || '';
    el.querySelectorAll('.f-side button').forEach((x) => x.classList.toggle('on', (x as HTMLElement).dataset.p === id));
    id ? showProject(id) : showGrid();
  });
  (el as any).show = (id: string) => { el.querySelectorAll('.f-side button').forEach((x) => x.classList.toggle('on', (x as HTMLElement).dataset.p === id)); showProject(id); };
  showGrid();
  return el;
}

function renderNotes(): HTMLElement {
  const items = D.experience.items;
  const el = h(`<div class="notes"><div class="n-list"></div><div class="n-page"></div></div>`);
  const list = $('.n-list', el), page = $('.n-page', el);
  list.innerHTML = items.map((e, i) => `<button data-i="${i}" class="${i === 0 ? 'on' : ''}"><b>${esc(e.org)}</b><small>${esc(e.period)}</small></button>`).join('') +
    `<button data-i="edu"><b>${D.experience.education.title}</b><small>EMSI</small></button>`;
  const show = (k: string) => {
    list.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.i === k));
    if (k === 'edu') {
      page.innerHTML = `<h2>${D.experience.education.title}</h2>` +
        D.experience.education.items.map((e) => `<p><b>${esc(e.role)}</b><br><span class="org">${esc(e.org)}</span> · ${esc(e.period)}</p>`).join('') +
        `<h3>${D.experience.certs.title}</h3>` + D.experience.certs.items.map((c) => `<p>🏅 ${esc(c)}</p>`).join('');
      return;
    }
    const e = items[Number(k)];
    page.innerHTML = `<time>${esc(e.period)}</time><h2>${esc(e.role)}</h2><div class="org">${esc(e.org)}</div><p>${esc(e.desc)}</p>`;
  };
  list.addEventListener('click', (ev) => { const b = (ev.target as HTMLElement).closest('button'); if (b) show(b.dataset.i!); });
  show('0');
  return el;
}

function renderSkills(): HTMLElement {
  return h(`<div class="skills-win">${stack.map((g, i) => `<div class="sk-group"><h4>${D.stackGroups[i]}</h4><div class="sk-row">${
    g.map(([ic, n]) => `<span class="sk"><img src="/icons/${ic}.svg" alt="" loading="lazy" />${n}</span>`).join('')}</div></div>`).join('')}</div>`);
}

function renderMail(): HTMLElement {
  const el = h(`<div class="mail">
    <div class="mail-bar"><button class="mbtn" data-copy>${L.mail.copy}</button><button class="mbtn primary" data-send>${L.mail.send} ➤</button></div>
    <div class="mail-field"><label>${L.mail.to}</label><input value="${site.email}" readonly /></div>
    <div class="mail-field"><label>${L.mail.subject}</label><input data-subject value="${esc(L.mail.subjectValue)}" /></div>
    <textarea data-body>${esc(L.mail.body)}</textarea>
    <div class="mail-links"><a href="${site.linkedin}" target="_blank" rel="noopener">LinkedIn ↗</a><a href="${site.github}" target="_blank" rel="noopener">GitHub ↗</a></div>
  </div>`);
  el.querySelector('[data-send]')!.addEventListener('click', () => {
    const s = encodeURIComponent(($('[data-subject]', el) as HTMLInputElement).value);
    const b = encodeURIComponent(($('[data-body]', el) as HTMLTextAreaElement).value);
    location.href = `mailto:${site.email}?subject=${s}&body=${b}`;
  });
  el.querySelector('[data-copy]')!.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(site.email); } catch {}
    toast(L.mail.copied);
  });
  return el;
}

function renderReadme(): HTMLElement {
  return h(`<div class="readme"><h1>README.md</h1><p>${esc(D.about.text)}</p>
    <p>${lang === 'fr' ? 'Astuce : ouvrez le <code>Terminal</code> et tapez <code>help</code>, ou glissez les fenêtres où vous voulez.' : 'Tip: open the <code>Terminal</code> and type <code>help</code>, or drag the windows around.'}</p></div>`);
}

/* ---------------- terminal ---------------- */
function renderTerminal(): HTMLElement {
  const el = h(`<div class="term" role="log" aria-live="polite"><div class="out"></div>
    <div class="term-input"><span><span class="ps">imrane</span>@<span class="path">casablanca</span> ~ %</span><input aria-label="Terminal" autocomplete="off" spellcheck="false" /></div></div>`);
  const out = $('.out', el);
  const input = $('input', el) as HTMLInputElement;
  const history: string[] = []; let hi = 0;
  const print = (html: string) => { out.insertAdjacentHTML('beforeend', `<div class="term-line">${html}</div>`); el.scrollTop = el.scrollHeight; };
  const cmds: Record<string, (arg: string) => void> = {
    help: () => print(L.terminal.help.map(([c, d]) => `  <span class="hl">${c.padEnd(16)}</span><span class="dim">${d}</span>`).join('\n')),
    whoami: () => print(`Imrane Adli — ${L.about.role}, Casablanca 🇲🇦`),
    about: () => print(esc(D.about.text)),
    projects: () => print(D.projects.map((p) => `  <span class="hl">${p.id.padEnd(12)}</span>${esc(p.name)} <span class="dim">— ${esc(p.stack.join(', '))}</span>`).join('\n') + `\n<span class="dim">${lang === 'fr' ? 'Tapez « open <id> » pour en ouvrir un.' : 'Type "open <id>" to open one.'}</span>`),
    open: (arg) => {
      const id = arg.trim().toLowerCase();
      const p = D.projects.find((x) => x.id === id || x.name.toLowerCase().startsWith(id));
      if (!id || !p) { print(`<span class="err">${L.terminal.unknownProject}</span>${D.projects.map((x) => x.id).join(', ')}`); return; }
      print(`${L.terminal.opening}${esc(p.name)}…`);
      const w = openApp('finder'); setTimeout(() => (w.querySelector('.finder') as any)?.show(p.id), 50);
    },
    experience: () => print(D.experience.items.map((e) => `  <span class="hl">${esc(e.period.padEnd(22))}</span>${esc(e.role)} <span class="dim">@ ${esc(e.org)}</span>`).join('\n')),
    skills: () => print(stack.map((g, i) => `  <span class="hl">${D.stackGroups[i].padEnd(16)}</span>${g.map((x) => x[1]).join(', ')}`).join('\n')),
    contact: () => print(`  email     <a href="mailto:${site.email}">${site.email}</a>\n  linkedin  <a href="${site.linkedin}" target="_blank" rel="noopener">${site.linkedin.replace('https://www.', '')}</a>\n  github    <a href="${site.github}" target="_blank" rel="noopener">${site.github.replace('https://', '')}</a>`),
    theme: () => toggleTheme(),
    lang: () => { location.href = lang === 'fr' ? '/en/' : '/'; },
    clear: () => { out.innerHTML = ''; },
    ls: () => print('about.txt  projects/  experience/  skills.json  contact.vcf  README.md'),
    pwd: () => print('/Users/imrane'),
    date: () => print(new Date().toString()),
    echo: (a) => print(esc(a)),
    sudo: (a) => { if (/hire/.test(a)) { print(L.terminal.hire); openApp('mail'); } else print('<span class="err">imrane is not in the sudoers file. This incident will be reported. 😄</span>'); },
    exit: () => closeApp('terminal'),
  };
  cmds['cat'] = (a) => (a.includes('about') || a.includes('README') ? cmds.about('') : a.includes('contact') ? cmds.contact('') : a.includes('skills') ? cmds.skills('') : print(`<span class="err">cat: ${esc(a)}: No such file</span>`));
  const run = (raw: string) => {
    const line = raw.trim();
    print(`<span class="ps">imrane</span>@<span class="path">casablanca</span> ~ % ${esc(line)}`);
    if (!line) return;
    history.push(line); hi = history.length;
    const [c, ...rest] = line.split(/\s+/);
    const fn = cmds[c.toLowerCase()];
    fn ? fn(rest.join(' ')) : print(`<span class="err">zsh: ${L.terminal.notFound}${esc(c)}</span>  <span class="dim">${L.terminal.hint}</span>`);
  };
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { run(input.value); input.value = ''; }
    else if (e.key === 'ArrowUp') { if (hi > 0) input.value = history[--hi]; e.preventDefault(); }
    else if (e.key === 'ArrowDown') { input.value = hi < history.length - 1 ? history[++hi] : ((hi = history.length), ''); e.preventDefault(); }
    else if (e.key === 'Tab') {
      e.preventDefault();
      const m = Object.keys(cmds).filter((k) => k.startsWith(input.value));
      if (m.length === 1) input.value = m[0] + ' ';
    }
  });
  el.addEventListener('click', () => input.focus());
  print(`<span class="dim">Last login: ${new Date().toLocaleString(lang)} on ttys001</span>`);
  print(L.terminal.welcome);
  // auto-type a first command
  const demo = 'whoami';
  let i = 0;
  const type = () => { if (i <= demo.length) { input.value = demo.slice(0, i++); setTimeout(type, 70); } else { setTimeout(() => { run(demo); input.value = ''; }, 250); } };
  setTimeout(type, reduce ? 0 : 900);
  return el;
}

const apps: Record<AppId, AppDef> = {
  about: { id: 'about', title: L.apps.about, icon: appIcon('about'), w: 620, h: 360, render: renderAbout },
  finder: { id: 'finder', title: L.apps.finder, icon: appIcon('finder'), w: 820, h: 520, render: renderFinder },
  terminal: { id: 'terminal', title: `imrane — zsh — 80×24`, icon: appIcon('terminal'), w: 620, h: 380, render: renderTerminal },
  notes: { id: 'notes', title: L.apps.notes, icon: appIcon('notes'), w: 680, h: 420, render: renderNotes },
  skills: { id: 'skills', title: L.apps.skills, icon: appIcon('skills'), w: 640, h: 520, render: renderSkills },
  mail: { id: 'mail', title: L.apps.mail, icon: appIcon('mail'), w: 560, h: 440, render: renderMail },
  readme: { id: 'readme', title: L.apps.readme, icon: appIcon('readme'), w: 560, h: 360, render: renderReadme },
};

/* ---------------- window manager ---------------- */
const wins = new Map<AppId, HTMLElement>();
let z = 100;
let cascade = 0;

function dockRect(id: AppId) { return document.querySelector<HTMLElement>(`.dock-item[data-app="${id}"]`)?.getBoundingClientRect(); }
function setOpenDot(id: AppId, on: boolean) { document.querySelector(`.dock-item[data-app="${id}"]`)?.classList.toggle('open', on); }
function setMenuApp(title: string) { const m = $('#mb-app'); if (m) m.textContent = title; }

function focus(win: HTMLElement) {
  win.style.zIndex = String(++z);
  wins.forEach((w) => w.classList.toggle('inactive', w !== win));
  setMenuApp(win.dataset.title || 'Finder');
}

function openApp(id: AppId, pos?: { x: number; y: number }): HTMLElement {
  const existing = wins.get(id);
  if (existing) {
    if (existing.hidden) restore(existing);
    focus(existing);
    return existing;
  }
  const def = apps[id];
  const dw = desktop.clientWidth, dh = desktop.clientHeight;
  const w = Math.min(def.w, dw - 40), hgt = Math.min(def.h, dh - 140);
  const x = pos?.x ?? Math.max(20, (dw - w) / 2 - 160 + cascade * 34);
  const y = pos?.y ?? Math.max(44, (dh - hgt) / 2 - 70 + cascade * 28);
  cascade = (cascade + 1) % 6;
  const win = h(`<section class="win" role="dialog" aria-label="${esc(def.title)}">
    <div class="titlebar"><div class="lights">
      <button class="light l-close" aria-label="Close"><svg viewBox="0 0 10 10"><path d="M2 2l6 6M8 2l-6 6" stroke="#4d0000" stroke-width="1.6"/></svg></button>
      <button class="light l-min" aria-label="Minimize"><svg viewBox="0 0 10 10"><path d="M2 5h6" stroke="#5a3d00" stroke-width="1.6"/></svg></button>
      <button class="light l-max" aria-label="Zoom"><svg viewBox="0 0 10 10"><path d="M3 2h5v5M7 8H2V3" fill="none" stroke="#004d00" stroke-width="1.4"/></svg></button>
    </div><div class="win-title">${esc(def.title)}</div></div>
    <div class="win-body"></div><div class="resize" aria-hidden="true"></div></section>`);
  win.dataset.app = id; win.dataset.title = def.title;
  Object.assign(win.style, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${hgt}px` });
  $('.win-body', win).appendChild(def.render(win));
  desktop.appendChild(win);
  wins.set(id, win);
  setOpenDot(id, true);
  focus(win);
  wireWindow(win, id);
  if (!reduce) {
    const r = dockRect(id), wr = win.getBoundingClientRect();
    const fromX = r ? r.left + r.width / 2 - (wr.left + wr.width / 2) : 0;
    const fromY = r ? r.top - (wr.top + wr.height / 2) : 40;
    animate(win, { opacity: [0, 1], transform: [`translate(${fromX}px, ${fromY}px) scale(0.2)`, 'translate(0px, 0px) scale(1)'] }, { duration: 0.45, ease });
  }
  if (id === 'terminal') setTimeout(() => (win.querySelector('input') as HTMLInputElement)?.focus({ preventScroll: true }), 300);
  return win;
}

function closeApp(id: AppId) {
  const win = wins.get(id); if (!win) return;
  const done = () => { win.remove(); wins.delete(id); setOpenDot(id, false); const top = [...wins.values()].sort((a, b) => +b.style.zIndex - +a.style.zIndex)[0]; top ? focus(top) : setMenuApp('Finder'); };
  reduce ? done() : animate(win, { opacity: 0, transform: 'scale(0.92)' }, { duration: 0.18 }).then(done);
}

function minimize(win: HTMLElement) {
  const id = win.dataset.app as AppId;
  const r = dockRect(id), wr = win.getBoundingClientRect();
  const dx = r ? r.left + r.width / 2 - (wr.left + wr.width / 2) : 0;
  const dy = r ? r.top + r.height / 2 - (wr.top + wr.height / 2) : wr.height;
  const end = () => { win.hidden = true; win.style.transform = ''; win.style.opacity = ''; };
  reduce ? end() : animate(win, { transform: `translate(${dx}px, ${dy}px) scale(0.05)`, opacity: 0.2 }, { duration: 0.45, ease: [0.5, 0, 0.75, 0] }).then(end);
}
function restore(win: HTMLElement) {
  win.hidden = false;
  const id = win.dataset.app as AppId;
  const r = dockRect(id), wr = win.getBoundingClientRect();
  const dx = r ? r.left + r.width / 2 - (wr.left + wr.width / 2) : 0;
  const dy = r ? r.top + r.height / 2 - (wr.top + wr.height / 2) : wr.height;
  if (!reduce) animate(win, { transform: [`translate(${dx}px, ${dy}px) scale(0.05)`, 'translate(0,0) scale(1)'], opacity: [0.2, 1] }, { duration: 0.45, ease });
}
function toggleMax(win: HTMLElement) {
  if (win.classList.contains('max')) {
    const prev = JSON.parse(win.dataset.prev || '{}');
    Object.assign(win.style, prev); win.classList.remove('max');
  } else {
    win.dataset.prev = JSON.stringify({ left: win.style.left, top: win.style.top, width: win.style.width, height: win.style.height });
    Object.assign(win.style, { left: '0px', top: '30px', width: `${desktop.clientWidth}px`, height: `${desktop.clientHeight - 30 - 90}px` });
    win.classList.add('max');
  }
}

function wireWindow(win: HTMLElement, id: AppId) {
  win.addEventListener('pointerdown', () => focus(win));
  $('.l-close', win).addEventListener('click', (e) => { e.stopPropagation(); closeApp(id); });
  $('.l-min', win).addEventListener('click', (e) => { e.stopPropagation(); minimize(win); });
  $('.l-max', win).addEventListener('click', (e) => { e.stopPropagation(); toggleMax(win); });
  const bar = $('.titlebar', win);
  bar.addEventListener('dblclick', (e) => { if (!(e.target as HTMLElement).closest('.lights')) toggleMax(win); });
  bar.addEventListener('pointerdown', (e) => {
    if ((e.target as HTMLElement).closest('.lights') || isMobile() || win.classList.contains('max')) return;
    const sx = e.clientX, sy = e.clientY, ox = win.offsetLeft, oy = win.offsetTop;
    bar.setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) => {
      const nx = Math.min(Math.max(ox + ev.clientX - sx, -win.offsetWidth + 80), desktop.clientWidth - 80);
      const ny = Math.min(Math.max(oy + ev.clientY - sy, 30), desktop.clientHeight - 60);
      win.style.left = `${nx}px`; win.style.top = `${ny}px`;
    };
    const up = () => { bar.removeEventListener('pointermove', move); bar.removeEventListener('pointerup', up); };
    bar.addEventListener('pointermove', move); bar.addEventListener('pointerup', up);
  });
  const rz = $('.resize', win);
  rz.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    const sx = e.clientX, sy = e.clientY, ow = win.offsetWidth, oh = win.offsetHeight;
    rz.setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) => { win.style.width = `${Math.max(320, ow + ev.clientX - sx)}px`; win.style.height = `${Math.max(200, oh + ev.clientY - sy)}px`; };
    const up = () => { rz.removeEventListener('pointermove', move); rz.removeEventListener('pointerup', up); };
    rz.addEventListener('pointermove', move); rz.addEventListener('pointerup', up);
  });
  win.addEventListener('click', (e) => {
    const o = (e.target as HTMLElement).closest<HTMLElement>('[data-open]');
    if (o) openApp(o.dataset.open as AppId);
  });
}

/* ---------------- dock ---------------- */
const dockOrder: (AppId | '|')[] = ['about', 'finder', 'terminal', 'notes', 'skills', 'mail', '|', 'readme'];
function buildDock() {
  const dock = $('#dock');
  dock.innerHTML = dockOrder.map((id) => id === '|' ? '<span class="dock-sep"></span>' :
    `<button class="dock-item" data-app="${id}" aria-label="${esc(apps[id].title === 'imrane — zsh — 80×24' ? L.apps.terminal : apps[id].title)}"><span class="ic">${appIcon(id)}</span><span class="tip">${id === 'terminal' ? L.apps.terminal : apps[id].title}</span><span class="dot"></span></button>`).join('');
  dock.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('.dock-item'); if (!b) return;
    const id = b.dataset.app as AppId;
    if (!wins.has(id) && !reduce) { b.classList.add('bounce'); setTimeout(() => b.classList.remove('bounce'), 1200); }
    const w = wins.get(id);
    if (w && !w.hidden && w.style.zIndex === String(z)) minimize(w); else openApp(id);
  });
  // magnification
  const items = [...dock.querySelectorAll<HTMLElement>('.dock-item')];
  const base = () => (isMobile() ? 48 : 56);
  dock.addEventListener('pointermove', (e) => {
    if (reduce || isMobile()) return;
    items.forEach((it) => {
      const r = it.getBoundingClientRect();
      const d = Math.abs(e.clientX - (r.left + r.width / 2));
      const s = Math.max(0, 1 - d / 180);
      const size = base() + 34 * s * s;
      it.style.width = it.style.height = `${size}px`;
    });
  });
  dock.addEventListener('pointerleave', () => items.forEach((it) => (it.style.width = it.style.height = `${base()}px`)));
}

/* ---------------- desktop icons + mobile home ---------------- */
function buildDesktopIcons() {
  const list: { id: AppId; label: string; proj?: string }[] = [
    { id: 'readme', label: 'README.md' },
    { id: 'finder', label: 'Tunneleads', proj: 'tunneleads' },
    { id: 'finder', label: 'WRX Generator', proj: 'wrx' },
    { id: 'terminal', label: 'Terminal' },
  ];
  const box = $('#d-icons');
  box.innerHTML = list.map((it, i) => `<button class="d-icon" data-i="${i}"><span class="ic">${it.proj ? icon('folder') : appIcon(it.id)}</span><span>${it.label}</span></button>`).join('');
  box.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('.d-icon'); if (!b) return;
    box.querySelectorAll('.d-icon').forEach((x) => x.classList.toggle('sel', x === b));
  });
  box.addEventListener('dblclick', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('.d-icon'); if (!b) return;
    const it = list[Number(b.dataset.i)];
    const w = openApp(it.id);
    if (it.proj) setTimeout(() => (w.querySelector('.finder') as any)?.show(it.proj), 30);
  });
  const home = $('#home-grid');
  const homeApps: AppId[] = ['about', 'finder', 'terminal', 'notes', 'skills', 'mail', 'readme'];
  home.innerHTML = homeApps.map((id) => `<button class="home-app" data-app="${id}"><span class="ic">${appIcon(id)}</span>${id === 'terminal' ? L.apps.terminal : apps[id].title}</button>`).join('');
  home.addEventListener('click', (e) => { const b = (e.target as HTMLElement).closest<HTMLElement>('.home-app'); if (b) openApp(b.dataset.app as AppId); });
}

/* ---------------- menubar ---------------- */
function toggleTheme() {
  const root = document.documentElement;
  const next = root.dataset.theme === 'light' ? 'dark' : 'light';
  const apply = () => { root.dataset.theme = next; try { localStorage.setItem('theme', next); } catch {} };
  const d = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  d.startViewTransition && !reduce ? d.startViewTransition(apply) : apply();
}
function toast(msg: string) {
  const el = $('#toast'); el.textContent = msg; el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 1800);
}
function clock() {
  const now = new Date();
  const tz = undefined; // visitor's local time
  const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: tz });
  const mb = now.toLocaleString(lang, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: tz });
  $('#mb-clock').textContent = mb;
  $('#wall-clock').textContent = time;
  $('#wall-date').textContent = now.toLocaleDateString(lang, { weekday: 'long', day: 'numeric', month: 'long', timeZone: tz });
}
function buildMenubar() {
  const menu = $('#brand-menu');
  const btn = $('#brand-btn');
  const items = L.brandMenu;
  menu.innerHTML = `<button data-open="about">${items[0]}</button><hr>
    <button data-open="mail">${items[2]}</button>
    <a href="https://github.com/ADLI-Imrane/portfolio" target="_blank" rel="noopener">${items[3]} ↗</a>`;
  const close = () => { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', (e) => { e.stopPropagation(); const open = menu.hidden; menu.hidden = !open; btn.setAttribute('aria-expanded', String(open)); const r = btn.getBoundingClientRect(); menu.style.left = `${r.left}px`; });
  menu.addEventListener('click', (e) => { const o = (e.target as HTMLElement).closest<HTMLElement>('[data-open]'); if (o) openApp(o.dataset.open as AppId); close(); });
  document.addEventListener('click', close);
  $('#mb-theme').addEventListener('click', toggleTheme);
  document.querySelectorAll<HTMLElement>('[data-menu-open]').forEach((b) => b.addEventListener('click', () => openApp(b.dataset.menuOpen as AppId)));
  clock(); setInterval(clock, 15000);
}

/* ---------------- boot ---------------- */
function boot() {
  buildMenubar();
  buildDock();
  buildDesktopIcons();
  const start = () => {
    const b = $('#boot'); b.classList.add('done'); setTimeout(() => b.remove(), 700);
    if (isMobile()) return;
    openApp('about', { x: Math.max(24, desktop.clientWidth * 0.07), y: 64 });
    setTimeout(() => openApp('terminal', { x: Math.min(desktop.clientWidth - 760, Math.max(60, desktop.clientWidth * 0.46)), y: Math.max(120, Math.min(desktop.clientHeight - 500, desktop.clientHeight * 0.36)) }), reduce ? 0 : 350);
  };
  let seen = false;
  try { seen = sessionStorage.getItem('booted') === '1'; sessionStorage.setItem('booted', '1'); } catch {}
  setTimeout(start, reduce || seen ? 50 : 1450);
}
boot();
