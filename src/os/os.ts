import { animate } from 'motion';
import { t, site, stack, type Lang } from '../i18n';
import { ui } from './ui';
import { icon } from './icons';
import { g } from './glyphs';

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
type AppId = 'about' | 'finder' | 'terminal' | 'notes' | 'skills' | 'mail' | 'readme' | 'settings';
interface AppDef { id: AppId; title: string; icon: string; w: number; h: number; render: (win: HTMLElement) => HTMLElement; chrome?: 'sidebar' }

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
  const fr = lang === 'fr';
  const T = {
    title: L.apps.finder,
    recents: fr ? 'Récents' : 'Recents',
    featured: fr ? 'Projets phares' : 'Featured',
    others: fr ? 'Autres projets' : 'Other projects',
    favorites: fr ? 'Favoris' : 'Favorites',
    places: fr ? 'Emplacements' : 'Locations',
    showLess: fr ? 'Afficher moins' : 'Show Less',
    showAll: fr ? 'Tout afficher' : 'Show All',
    selected: (n: number, total: number) => (fr ? `${n} sur ${total} sélectionné${n > 1 ? 's' : ''}` : `${n} of ${total} selected`),
    items: (n: number) => (fr ? `${n} éléments` : `${n} items`),
    disk: fr ? '6 projets · 4 expériences' : '6 projects · 4 experiences',
    search: fr ? 'Rechercher' : 'Search',
  };
  type Item = { id: string; name: string; sub: string; thumb: string; detail?: boolean; group: 'featured' | 'others' };
  const thumbs: Record<string, string> = { tunneleads: '/img/tunneleads-demo.webp' };
  const items: Item[] = [
    ...D.projects.map((p) => ({ id: p.id, name: p.name, sub: p.stack.slice(0, 2).join(' · '), thumb: thumbs[p.id] || '', detail: true, group: 'featured' as const })),
    ...D.more.items.map((m, i) => ({ id: `more-${i}`, name: m.name, sub: m.stack.split(' · ').slice(0, 2).join(' · '), thumb: '', group: 'others' as const })),
  ];
  const side = (key: string, glyph: string, label: string, extra = '') => `<button class="fs-item" data-nav="${key}" ${extra}>${g[glyph]}<span>${label}</span></button>`;
  const el = h(`<div class="fx">
    <aside class="fx-side">
      <div class="fx-side-top" data-drag></div>
      ${side('recents', 'clock', T.recents)}
      ${side('featured', 'star', T.featured)}
      <h5>${T.favorites}</h5>
      ${side('all', 'folderOpen', T.title)}
      ${side('others', 'folder', T.others)}
      ${side('notes', 'briefcase', L.apps.notes, 'data-open="notes"')}
      ${side('skills', 'code', L.apps.skills, 'data-open="skills"')}
      ${side('mail', 'mail', L.apps.mail, 'data-open="mail"')}
      <h5>${T.places}</h5>
      ${side('about', 'house', 'imrane', 'data-open="about"')}
      <a class="fs-item" href="${site.github}" target="_blank" rel="noopener">${g.globe}<span>GitHub</span></a>
      <a class="fs-item" href="${site.linkedin}" target="_blank" rel="noopener">${g.link}<span>LinkedIn</span></a>
      <a class="fs-item" href="${site.whatsapp}" target="_blank" rel="noopener">${g.mail}<span>WhatsApp</span></a>
    </aside>
    <div class="fx-main">
      <div class="fx-toolbar" data-drag>
        <div class="pill nav"><button data-back aria-label="Back">${g.chevronLeft}</button><span class="sep"></span><button data-fwd aria-label="Forward">${g.chevronRight}</button></div>
        <h3 class="fx-title" data-drag>${T.title}</h3>
        <div class="pill views" role="radiogroup">
          <button class="on" data-view="grid" aria-label="Icons">${g.layoutGrid}</button><button data-view="list" aria-label="List">${g.list}</button><button data-view="grid" aria-label="Columns">${g.columns}</button><button data-view="gallery" aria-label="Gallery">${g.gallery}</button>
        </div>
        <div class="pill acts"><button aria-label="Share" data-share>${g.share}</button><button aria-label="Tags">${g.tag}</button><button aria-label="More">${g.ellipsis}</button></div>
        <label class="pill search">${g.search}<input placeholder="${T.search}" aria-label="${T.search}" /></label>
      </div>
      <div class="fx-tabs"><span class="fx-tab">${T.title}</span><button class="fx-add" aria-label="New tab">${g.plus}</button></div>
      <div class="fx-content"></div>
      <div class="fx-path"></div>
      <div class="fx-status"><span class="fx-count"></span><input class="fx-zoom" type="range" min="64" max="140" value="96" aria-label="Icon size" /></div>
    </div>
  </div>`);
  const content = $('.fx-content', el), path = $('.fx-path', el), count = $('.fx-count', el), title = $('.fx-title', el), tab = $('.fx-tab', el);
  let view: 'grid' | 'list' | 'gallery' = 'grid';
  let scope = 'all';
  let query = '';
  let selected = '';
  const collapsed = new Set<string>();
  const histBack: string[] = [], histFwd: string[] = [];

  const thumb = (it: Item, big = false) => it.thumb
    ? `<span class="th photo"><img src="${it.thumb}" alt="" loading="lazy" /></span>`
    : `<span class="th">${icon('folder')}</span>`;
  const setPath = (parts: string[]) => {
    path.innerHTML = ['Macintosh HD', 'Users', 'imrane', ...parts].map((p, i, a) => `<span class="${i === a.length - 1 ? 'cur' : ''}">${i < 3 ? g.folder : ''}${esc(p)}</span>`).join('<i>›</i>');
  };
  const visible = () => items.filter((it) => (scope === 'featured' ? it.group === 'featured' : scope === 'others' ? it.group === 'others' : true) && (!query || it.name.toLowerCase().includes(query)));
  const updateStatus = (list: Item[]) => { count.textContent = selected ? T.selected(1, list.length) : T.items(list.length) + ' — ' + T.disk; };

  const renderList = () => {
    const list = visible();
    const name = scope === 'featured' ? T.featured : scope === 'others' ? T.others : scope === 'recents' ? T.recents : T.title;
    title.textContent = name; tab.textContent = name;
    setPath([L.apps.finder, ...(scope === 'all' ? [] : [name])]);
    content.className = `fx-content view-${view}`;
    const groups: [string, string, Item[]][] = scope === 'recents' || scope === 'all'
      ? [['featured', T.featured, list.filter((i) => i.group === 'featured')], ['others', T.others, list.filter((i) => i.group === 'others')]]
      : [[scope, name, list]];
    if (view === 'list') {
      content.innerHTML = `<div class="fx-table"><div class="fx-row head"><span>${fr ? 'Nom' : 'Name'}</span><span>${fr ? 'Technos' : 'Stack'}</span><span>${fr ? 'Type' : 'Kind'}</span></div>${
        list.map((it) => `<button class="fx-row ${selected === it.id ? 'sel' : ''}" data-item="${it.id}"><span class="nm">${it.thumb ? `<img src="${it.thumb}" alt="" />` : icon('folder')}${esc(it.name)}</span><span>${esc(it.sub)}</span><span>${fr ? 'Dossier' : 'Folder'}</span></button>`).join('')}</div>`;
    } else {
      content.innerHTML = groups.filter(([, , arr]) => arr.length).map(([key, label, arr]) => `
        <section class="fx-group ${collapsed.has(key) ? 'collapsed' : ''}">
          <header><h4>${label}</h4><button data-toggle="${key}">${collapsed.has(key) ? T.showAll : T.showLess}</button></header>
          <div class="fx-grid">${arr.map((it) => `<button class="fx-item ${selected === it.id ? 'sel' : ''}" data-item="${it.id}">${thumb(it)}<span class="nm">${esc(it.name)}</span><small>${esc(it.sub)}</small></button>`).join('')}</div>
        </section>`).join('');
    }
    updateStatus(list);
  };
  const renderDetail = (id: string) => {
    const p = D.projects.find((x) => x.id === id); if (!p) return;
    const m = projectMeta[id] || {};
    title.textContent = p.name; tab.textContent = p.name;
    setPath([L.apps.finder, p.name]);
    content.className = 'fx-content view-detail';
    const links = [
      m.live ? `<a class="mbtn primary" href="${m.live}" target="_blank" rel="noopener">${L.finder.live} ↗</a>` : '',
      m.code ? `<a class="mbtn" href="${m.code}" target="_blank" rel="noopener">${L.finder.code} ↗</a>` : '',
      m.lock ? `<span class="lock">🔒 ${m.lock === 'company' ? L.finder.company : L.finder.private}</span>` : '',
    ].join('');
    content.innerHTML = `<article class="fx-detail">
      <div class="fx-hero">${m.img ? `<img src="${m.img}" alt="${esc(p.name)}" />` : `<span class="big">${icon('folder')}</span>`}</div>
      <div class="fx-info"><span class="tag">${esc(p.tag)}</span><h2>${esc(p.name)}</h2><p>${esc(p.desc)}</p>
      <ul>${p.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
      <div class="chips">${p.stack.map((s) => `<span>${esc(s)}</span>`).join('')}</div>
      <div class="f-foot">${links}</div></div></article>`;
    count.textContent = T.selected(1, items.length);
  };
  const go = (state: string, push = true) => {
    if (push) { histBack.push(cur); histFwd.length = 0; }
    cur = state;
    el.querySelectorAll('.fs-item[data-nav]').forEach((b) => b.classList.toggle('on', (b as HTMLElement).dataset.nav === (state.startsWith('p:') ? '' : state)));
    if (state.startsWith('p:')) renderDetail(state.slice(2)); else { scope = state; renderList(); }
  };
  let cur = 'all';

  el.addEventListener('click', (e) => {
    const tgt = e.target as HTMLElement;
    const nav = tgt.closest<HTMLElement>('.fs-item[data-nav]');
    if (nav && !nav.dataset.open) { selected = ''; go(nav.dataset.nav!); return; }
    const tog = tgt.closest<HTMLElement>('[data-toggle]');
    if (tog) { const k = tog.dataset.toggle!; collapsed.has(k) ? collapsed.delete(k) : collapsed.add(k); renderList(); return; }
    const v = tgt.closest<HTMLElement>('[data-view]');
    if (v) { el.querySelectorAll('[data-view]').forEach((b) => b.classList.toggle('on', b === v)); view = (v.dataset.view as typeof view); if (!cur.startsWith('p:')) renderList(); return; }
    if (tgt.closest('[data-back]')) { if (histBack.length) { histFwd.push(cur); go(histBack.pop()!, false); } return; }
    if (tgt.closest('[data-fwd]')) { if (histFwd.length) { histBack.push(cur); go(histFwd.pop()!, false); } return; }
    if (tgt.closest('[data-share]')) { try { navigator.clipboard.writeText(location.href); } catch {} toast(fr ? 'Lien copié' : 'Link copied'); return; }
    const it = tgt.closest<HTMLElement>('[data-item]');
    if (it) {
      selected = it.dataset.item!;
      el.querySelectorAll('[data-item]').forEach((x) => x.classList.toggle('sel', x === it));
      updateStatus(visible());
      if (isMobile()) { const item = items.find((x) => x.id === selected); if (item?.detail) go('p:' + selected); }
    } else if (tgt.closest('.fx-content') && !tgt.closest('.fx-detail')) {
      selected = ''; el.querySelectorAll('[data-item]').forEach((x) => x.classList.remove('sel')); updateStatus(visible());
    }
  });
  el.addEventListener('dblclick', (e) => {
    const it = (e.target as HTMLElement).closest<HTMLElement>('[data-item]');
    if (!it) return;
    const item = items.find((x) => x.id === it.dataset.item);
    if (item?.detail) go('p:' + item.id);
  });
  ($('.search input', el) as HTMLInputElement).addEventListener('input', (e) => { query = (e.target as HTMLInputElement).value.toLowerCase(); if (cur.startsWith('p:')) go('all'); else renderList(); });
  ($('.fx-zoom', el) as HTMLInputElement).addEventListener('input', (e) => el.style.setProperty('--th', `${(e.target as HTMLInputElement).value}px`));
  (el as any).show = (id: string) => go('p:' + id);
  go('all', false);
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
    <div class="mail-links"><a class="wa" href="${site.whatsapp}" target="_blank" rel="noopener"><span class="mi">${icon('whatsapp')}</span>WhatsApp · ${site.phone}</a><a href="${site.linkedin}" target="_blank" rel="noopener"><span class="mi">${icon('linkedin')}</span>LinkedIn</a><a href="${site.github}" target="_blank" rel="noopener"><span class="mi">${icon('github')}</span>GitHub</a></div>
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

/* ---------------- wallpaper settings ---------------- */
const WALLS = [
  { id: 'tahoe', fr: 'Tahoe', en: 'Tahoe' },
  { id: 'dusk', fr: 'Crépuscule', en: 'Dusk' },
  { id: 'aqua', fr: 'Aqua', en: 'Aqua' },
  { id: 'silk', fr: 'Soie', en: 'Silk' },
];
function setWall(id: string) {
  document.documentElement.dataset.wall = id;
  try { localStorage.setItem('wallpaper', id); } catch {}
  document.querySelectorAll('.wp').forEach((b) => b.classList.toggle('on', (b as HTMLElement).dataset.wall === id));
}
function renderSettings(): HTMLElement {
  const cur = document.documentElement.dataset.wall || 'tahoe';
  const el = h(`<div class="settings"><h2>${lang === 'fr' ? 'Fond d’écran' : 'Wallpaper'}</h2>
    <div class="wp-grid">${WALLS.map((w) => `<button class="wp ${w.id === cur ? 'on' : ''}" data-wall="${w.id}"><img src="/img/walls/${w.id}-thumb.jpg" alt="" /><span>${w[lang]}</span></button>`).join('')}</div>
    <h2>${lang === 'fr' ? 'Apparence' : 'Appearance'}</h2>
    <div class="seg"><button data-theme-set="light">${lang === 'fr' ? 'Clair' : 'Light'}</button><button data-theme-set="dark">${lang === 'fr' ? 'Sombre' : 'Dark'}</button></div></div>`);
  el.addEventListener('click', (e) => {
    const w = (e.target as HTMLElement).closest<HTMLElement>('[data-wall]'); if (w) setWall(w.dataset.wall!);
    const th = (e.target as HTMLElement).closest<HTMLElement>('[data-theme-set]');
    if (th && document.documentElement.dataset.theme !== th.dataset.themeSet) toggleTheme();
  });
  return el;
}

/* ---------------- terminal ---------------- */
function renderTerminal(): HTMLElement {
  const fr = lang === 'fr';
  const el = h(`<div class="term" role="log" aria-live="polite"><div class="out"></div>
    <div class="term-input"><span class="prompt"></span><input aria-label="Terminal" autocomplete="off" spellcheck="false" autocapitalize="off" /></div></div>`);
  const out = $('.out', el);
  const input = $('input', el) as HTMLInputElement;
  const promptEl = $('.prompt', el);
  const history: string[] = []; let hi = 0;
  const started = Date.now();
  const print = (html: string) => { out.insertAdjacentHTML('beforeend', `<div class="term-line">${html}</div>`); el.scrollTop = el.scrollHeight; };
  const err = (s: string) => print(`<span class="err">${esc(s)}</span>`);

  /* ---- virtual file system (built from the site data) ---- */
  type Node = { dir: true; kids: Record<string, Node> } | { dir: false; body: () => string };
  const file = (body: () => string): Node => ({ dir: false, body });
  const dir = (kids: Record<string, Node>): Node => ({ dir: true, kids });
  const slug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const projFile = (p: (typeof D.projects)[number]) => () => {
    const m = projectMeta[p.id] || {};
    return [`# ${p.name}`, p.tag, '', p.desc, '', ...p.points.map((x) => `- ${x}`), '', `Stack: ${p.stack.join(', ')}`,
      m.live ? `Live: ${m.live}` : '', m.code ? `Code: ${m.code}` : m.lock ? `Code: ${m.lock === 'company' ? L.finder.company : L.finder.private}` : ''].filter((x, i, a) => x !== '' || a[i - 1] !== '').join('\n');
  };
  const root = dir({
    Users: dir({ imrane: dir({
      'about.txt': file(() => D.about.text),
      'README.md': file(() => `# Imrane Adli\n${L.about.role} — Casablanca\n\n${D.about.text}\n\n${fr ? 'Tapez « help » pour la liste des commandes.' : 'Type "help" for the list of commands.'}`),
      'contact.vcf': file(() => `BEGIN:VCARD\nFN:Imrane Adli\nEMAIL:${site.email}\nTEL:${site.phone}\nURL:${site.linkedin}\nURL:${site.github}\nEND:VCARD`),
      'skills.json': file(() => JSON.stringify(Object.fromEntries(stack.map((g, i) => [D.stackGroups[i], g.map((x) => x[1])])), null, 2)),
      projects: dir(Object.fromEntries(D.projects.map((p) => [`${p.id}.md`, file(projFile(p))]))),
      experience: dir(Object.fromEntries(D.experience.items.map((e) => [`${slug(e.org)}.md`, file(() => `# ${e.role}\n${e.org} · ${e.period}\n\n${e.desc}`)]))),
      education: dir({
        'degrees.md': file(() => D.experience.education.items.map((e) => `- ${e.role} — ${e.org} (${e.period})`).join('\n')),
        'certifications.md': file(() => D.experience.certs.items.map((c) => `- ${c}`).join('\n')),
      }),
    }) }),
  });
  const HOME = ['Users', 'imrane'];
  let cwd = [...HOME];
  const fmt = (p: string[]) => { const s = '/' + p.join('/'); const hm = '/' + HOME.join('/'); return s === hm ? '~' : s.startsWith(hm + '/') ? '~' + s.slice(hm.length) : s; };
  const resolve = (arg = ''): string[] | null => {
    let parts = arg.startsWith('/') ? [] : arg.startsWith('~') ? [...HOME] : [...cwd];
    for (const seg of arg.replace(/^~/, '').split('/')) {
      if (!seg || seg === '.') continue;
      if (seg === '..') parts.pop(); else parts.push(seg);
    }
    return parts;
  };
  const get = (p: string[] | null): Node | null => {
    if (!p) return null; let n: Node = root;
    for (const s of p) { if (!n.dir || !n.kids[s]) return null; n = n.kids[s]; }
    return n;
  };
  const setPrompt = () => { promptEl.innerHTML = `<span class="ps">imrane</span>@<span class="path">casablanca</span> <span class="cwd">${esc(fmt(cwd))}</span> %`; };
  const fsEntry = (name: string, n: Node) => (n.dir ? `<span class="d">${esc(name)}/</span>` : esc(name));
  const sizeOf = (n: Node) => (n.dir ? 4096 : new Blob([n.body()]).size);

  const helpRows: [string, string, string][] = [
    ['help', 'liste des commandes', 'list commands'],
    ['ls [-la] [dir]', 'lister les fichiers', 'list files'],
    ['cd <dir>', 'changer de dossier', 'change directory'],
    ['pwd', 'dossier courant', 'current directory'],
    ['cat <file>', 'afficher un fichier', 'print a file'],
    ['tree', 'arborescence', 'directory tree'],
    ['mkdir / touch / rm', 'gérer des fichiers (en mémoire)', 'manage files (in memory)'],
    ['find <nom>', 'chercher un fichier', 'search for a file'],
    ['grep <mot>', 'chercher dans les fichiers', 'search inside files'],
    ['whoami / about', 'qui suis-je', 'who am I'],
    ['projects / open <id>', 'mes projets', 'my projects'],
    ['experience / skills', 'parcours et stack', 'journey and stack'],
    ['contact / whatsapp', 'me joindre', 'reach me'],
    ['github / linkedin', 'ouvrir mes profils', 'open my profiles'],
    ['neofetch', 'infos système', 'system info'],
    ['history / man <cmd>', 'historique, aide', 'history, manual'],
    ['date / cal / uptime', 'temps', 'time'],
    ['uname / which', 'système', 'system'],
    ['theme / wallpaper / lang', 'apparence', 'appearance'],
    ['clear (Ctrl+L)', 'effacer', 'clear screen'],
    ['exit', 'fermer le terminal', 'close terminal'],
  ];
  const cmds: Record<string, (arg: string) => void> = {
    help: () => print(helpRows.map(([c, f, e]) => `  <span class="hl">${c.padEnd(24)}</span><span class="dim">${fr ? f : e}</span>`).join('\n') + `\n<span class="dim">${fr ? 'Astuces : Tab complète, ↑/↓ historique, Ctrl+C annule.' : 'Tips: Tab completes, ↑/↓ history, Ctrl+C cancels.'}</span>`),
    whoami: () => print(`Imrane Adli — ${L.about.role}, Casablanca 🇲🇦`),
    about: () => print(esc(D.about.text)),
    projects: () => print(D.projects.map((p) => `  <span class="hl">${p.id.padEnd(12)}</span>${esc(p.name)} <span class="dim">— ${esc(p.stack.join(', '))}</span>`).join('\n') + `\n<span class="dim">${fr ? 'Tapez « open <id> » ou « cat projects/<id>.md ».' : 'Type "open <id>" or "cat projects/<id>.md".'}</span>`),
    open: (arg) => {
      const id = arg.trim().toLowerCase();
      if (/^https?:\/\//.test(id)) { window.open(arg.trim(), '_blank', 'noopener'); return; }
      const p = D.projects.find((x) => x.id === id || x.name.toLowerCase().startsWith(id));
      if (!id || !p) { print(`<span class="err">${L.terminal.unknownProject}</span>${D.projects.map((x) => x.id).join(', ')}`); return; }
      print(`${L.terminal.opening}${esc(p.name)}…`);
      const w = openApp('finder'); setTimeout(() => (w.querySelector('.fx') as any)?.show(p.id), 50);
    },
    experience: () => print(D.experience.items.map((e) => `  <span class="hl">${esc(e.period.padEnd(22))}</span>${esc(e.role)} <span class="dim">@ ${esc(e.org)}</span>`).join('\n')),
    skills: () => print(stack.map((g, i) => `  <span class="hl">${D.stackGroups[i].padEnd(18)}</span>${g.map((x) => x[1]).join(', ')}`).join('\n')),
    contact: () => print(`  email     <a href="mailto:${site.email}">${site.email}</a>\n  whatsapp  <a href="${site.whatsapp}" target="_blank" rel="noopener">${site.phone}</a>\n  linkedin  <a href="${site.linkedin}" target="_blank" rel="noopener">${site.linkedin.replace('https://www.', '')}</a>\n  github    <a href="${site.github}" target="_blank" rel="noopener">${site.github.replace('https://', '')}</a>`),
    whatsapp: () => { print(`${L.terminal.opening}WhatsApp…`); window.open(site.whatsapp, '_blank', 'noopener'); },
    github: () => { print(`${L.terminal.opening}GitHub…`); window.open(site.github, '_blank', 'noopener'); },
    linkedin: () => { print(`${L.terminal.opening}LinkedIn…`); window.open(site.linkedin, '_blank', 'noopener'); },
    mail: () => openApp('mail'),
    theme: () => toggleTheme(),
    wallpaper: (a) => { const w = WALLS.find((x) => x.id === a.trim()); if (w) { setWall(w.id); print('✔ ' + w[lang]); } else print(WALLS.map((x) => x.id).join('  ')); },
    lang: () => { location.href = lang === 'fr' ? '/en/' : '/'; },
    clear: () => { out.innerHTML = ''; },
    pwd: () => print('/' + cwd.join('/')),
    cd: (a) => {
      const p = resolve(a.trim() || '~'); const n = get(p);
      if (!n) return err(`cd: no such file or directory: ${a}`);
      if (!n.dir) return err(`cd: not a directory: ${a}`);
      cwd = p!; setPrompt();
    },
    ls: (a) => {
      const args = a.split(/\s+/).filter(Boolean);
      const long = args.some((x) => /^-\w*l/.test(x)), all = args.some((x) => /^-\w*a/.test(x));
      const target = args.find((x) => !x.startsWith('-'));
      const n = get(resolve(target || '')); if (!n) return err(`ls: ${target}: No such file or directory`);
      if (!n.dir) return print(esc(target!));
      const names = Object.keys(n.kids).sort();
      if (long) {
        const d = new Date().toLocaleDateString('en', { month: 'short', day: '2-digit' });
        const rows = (all ? ['.', '..'] : []).map((x) => `drwxr-xr-x  imrane  staff  ${'4096'.padStart(6)}  ${d}  <span class="d">${x}</span>`)
          .concat(names.map((k) => { const c = n.kids[k]; return `${c.dir ? 'drwxr-xr-x' : '-rw-r--r--'}  imrane  staff  ${String(sizeOf(c)).padStart(6)}  ${d}  ${fsEntry(k, c)}`; }));
        print(`total ${names.length}\n` + rows.join('\n'));
      } else print((all ? ['<span class="d">.</span>', '<span class="d">..</span>'] : []).concat(names.map((k) => fsEntry(k, n.kids[k]))).join('   '));
    },
    cat: (a) => {
      if (!a.trim()) return err('usage: cat <file>');
      for (const f of a.split(/\s+/)) { const n = get(resolve(f)); if (!n) err(`cat: ${f}: No such file or directory`); else if (n.dir) err(`cat: ${f}: Is a directory`); else print(esc(n.body())); }
    },
    tree: (a) => {
      const start = get(resolve(a.trim())); if (!start || !start.dir) return err(`tree: ${a || '.'}: not a directory`);
      const lines: string[] = [`<span class="d">${esc(a.trim() || '.')}</span>`]; let dirs = 0, files = 0;
      const walk = (n: Node, pre: string) => { if (!n.dir) return; const ks = Object.keys(n.kids).sort(); ks.forEach((k, i) => { const last = i === ks.length - 1; const c = n.kids[k]; c.dir ? dirs++ : files++; lines.push(`${pre}${last ? '└── ' : '├── '}${fsEntry(k, c)}`); walk(c, pre + (last ? '    ' : '│   ')); }); };
      walk(start, ''); lines.push(`\n${dirs} directories, ${files} files`); print(lines.join('\n'));
    },
    mkdir: (a) => { const name = a.trim(); if (!name) return err('usage: mkdir <dir>'); const n = get(cwd); if (n && n.dir) { if (n.kids[name]) return err(`mkdir: ${name}: File exists`); n.kids[name] = dir({}); } },
    touch: (a) => { const name = a.trim(); if (!name) return err('usage: touch <file>'); const n = get(cwd); if (n && n.dir && !n.kids[name]) n.kids[name] = file(() => ''); },
    rm: (a) => {
      if (/-rf?\s+\/(\s|$)|-rf?\s+~\/?(\s|$)/.test(a)) return print(`<span class="err">${fr ? 'Bien essayé 😄 Ce portfolio est en lecture seule à la racine.' : 'Nice try 😄 This portfolio is read-only at the root.'}</span>`);
      const name = a.split(/\s+/).filter((x) => !x.startsWith('-')).pop() || ''; const n = get(cwd);
      if (!name || !n || !n.dir || !n.kids[name]) return err(`rm: ${name}: No such file or directory`);
      if (n.kids[name].dir && !/-\w*r/.test(a)) return err(`rm: ${name}: is a directory`);
      delete n.kids[name];
    },
    find: (a) => {
      const q = a.trim().toLowerCase(); const res: string[] = [];
      const walk = (n: Node, p: string) => { if (!n.dir) return; for (const [k, c] of Object.entries(n.kids)) { const pp = `${p}/${k}`; if (!q || k.toLowerCase().includes(q)) res.push(pp); walk(c, pp); } };
      walk(get(cwd)!, '.'); print(res.length ? res.map(esc).join('\n') : `<span class="dim">${fr ? 'aucun résultat' : 'no match'}</span>`);
    },
    grep: (a) => {
      const q = a.trim().toLowerCase(); if (!q) return err('usage: grep <word>'); const res: string[] = [];
      const walk = (n: Node, p: string) => { if (!n.dir) { n.body().split('\n').forEach((l) => { if (l.toLowerCase().includes(q)) res.push(`<span class="d">${esc(p)}</span>: ${esc(l.trim()).replace(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), (m) => `<span class="hl">${m}</span>`)}`); }); return; } for (const [k, c] of Object.entries(n.kids)) walk(c, p ? `${p}/${k}` : k); };
      walk(get(cwd)!, ''); print(res.length ? res.join('\n') : `<span class="dim">${fr ? 'aucun résultat' : 'no match'}</span>`);
    },
    history: () => print(history.map((c, i) => `${String(i + 1).padStart(4)}  ${esc(c)}`).join('\n')),
    man: (a) => { const r = helpRows.find(([c]) => c.split(/[\s/]+/).includes(a.trim())); r ? print(`<span class="hl">${esc(r[0])}</span>\n    ${fr ? r[1] : r[2]}`) : err(`No manual entry for ${a}`); },
    date: () => print(new Date().toString()),
    cal: () => {
      const d = new Date(), y = d.getFullYear(), m = d.getMonth();
      const first = (new Date(y, m, 1).getDay() + 6) % 7, days = new Date(y, m + 1, 0).getDate();
      const title = d.toLocaleDateString(lang, { month: 'long', year: 'numeric' });
      let s = title.padStart(Math.floor((20 + title.length) / 2)) + '\n' + (fr ? 'Lu Ma Me Je Ve Sa Di' : 'Mo Tu We Th Fr Sa Su') + '\n' + '   '.repeat(first);
      for (let i = 1; i <= days; i++) { const c = String(i).padStart(2); s += (i === d.getDate() ? `<span class="inv">${c}</span>` : c) + ((first + i) % 7 === 0 ? '\n' : ' '); }
      print(s);
    },
    uptime: () => { const s = Math.floor((Date.now() - started) / 1000); print(`up ${Math.floor(s / 60)} min ${s % 60} s, 1 user, load averages: 0.42 0.37 0.31`); },
    uname: (a) => print(/-a/.test(a) ? 'imrane-os 26.0 Tahoe x86_64 Astro/Motion WebKit-compatible' : 'imrane-os'),
    which: (a) => { const c = a.trim(); c && cmds[c] ? print(`/usr/bin/${esc(c)}`) : err(`${c} not found`); },
    neofetch: () => {
      const W = navigator.userAgent.includes('Firefox') ? 'Firefox' : navigator.userAgent.includes('Edg') ? 'Edge' : navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Safari';
      const logo = ['      .--.      ', '     |o_o |     ', '     |:_/ |     ', '    //   \\ \\    ', '   (|     | )   ', "  /'\\_   _/`\\  ", '  \\___)=(___/  '];
      const info = [`<span class="ps">imrane</span>@<span class="path">casablanca</span>`, '-----------------', `<span class="hl">OS</span>: imrane-os 26 (Tahoe)`, `<span class="hl">Host</span>: ${W}`, `<span class="hl">Resolution</span>: ${innerWidth}x${innerHeight}`, `<span class="hl">Shell</span>: zsh 5.9`, `<span class="hl">Role</span>: ${esc(L.about.role)}`, `<span class="hl">Stack</span>: React · Node.js · GCP · Go`, `<span class="hl">Location</span>: Casablanca 🇲🇦`];
      print(info.map((l, i) => `<span class="path">${esc((logo[i] || '').padEnd(16))}</span>  ${l}`).join('\n'));
    },
    echo: (a) => print(esc(a.replace(/^["']|["']$/g, ''))),
    sudo: (a) => { if (/hire/.test(a)) { print(L.terminal.hire); openApp('mail'); } else print('<span class="err">imrane is not in the sudoers file. This incident will be reported. 😄</span>'); },
    exit: () => closeApp('terminal'),
  };
  cmds.dir = cmds.ls; cmds.ll = (a) => cmds.ls('-la ' + a); cmds.cls = cmds.clear; cmds.vim = cmds.nano = (a) => print(`<span class="dim">${fr ? 'Lecture seule ici — essayez' : 'Read-only here — try'} cat ${esc(a)}</span>`);

  const run = (raw: string) => {
    const line = raw.trim();
    print(`<span class="ps">imrane</span>@<span class="path">casablanca</span> <span class="cwd">${esc(fmt(cwd))}</span> % ${esc(line)}`);
    if (!line) return;
    history.push(line); hi = history.length;
    const [c, ...rest] = line.split(/\s+/);
    const fn = cmds[c.toLowerCase()];
    fn ? fn(rest.join(' ')) : print(`<span class="err">zsh: ${L.terminal.notFound}${esc(c)}</span>  <span class="dim">${L.terminal.hint}</span>`);
  };
  const complete = () => {
    const v = input.value; const parts = v.split(/\s+/);
    if (parts.length <= 1) {
      const m = Object.keys(cmds).filter((k) => k.startsWith(v)).sort();
      if (m.length === 1) input.value = m[0] + ' '; else if (m.length > 1) print(m.join('   '));
      return;
    }
    const word = parts[parts.length - 1]; const slash = word.lastIndexOf('/');
    const base = slash >= 0 ? word.slice(0, slash + 1) : ''; const stem = word.slice(slash + 1);
    const n = get(resolve(base || '.'));
    if (!n || !n.dir) return;
    const m = Object.keys(n.kids).filter((k) => k.startsWith(stem));
    if (m.length === 1) { parts[parts.length - 1] = base + m[0] + (n.kids[m[0]].dir ? '/' : ''); input.value = parts.join(' '); }
    else if (m.length > 1) print(m.map((k) => fsEntry(k, n.kids[k])).join('   '));
  };
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { run(input.value); input.value = ''; }
    else if (e.key === 'ArrowUp') { if (hi > 0) input.value = history[--hi]; e.preventDefault(); }
    else if (e.key === 'ArrowDown') { input.value = hi < history.length - 1 ? history[++hi] : ((hi = history.length), ''); e.preventDefault(); }
    else if (e.key === 'Tab') { e.preventDefault(); complete(); }
    else if (e.ctrlKey && e.key.toLowerCase() === 'l') { e.preventDefault(); out.innerHTML = ''; }
    else if (e.ctrlKey && e.key.toLowerCase() === 'c') { e.preventDefault(); print(`<span class="ps">imrane</span>@<span class="path">casablanca</span> <span class="cwd">${esc(fmt(cwd))}</span> % ${esc(input.value)}^C`); input.value = ''; }
  });
  el.addEventListener('click', () => { if (!getSelection()?.toString()) input.focus(); });
  setPrompt();
  print(`<span class="dim">Last login: ${new Date().toLocaleString(lang)} on ttys001</span>`);
  print(L.terminal.welcome);
  const demo = 'whoami';
  let i = 0;
  const type = () => { if (i <= demo.length) { input.value = demo.slice(0, i++); setTimeout(type, 70); } else { setTimeout(() => { run(demo); input.value = ''; }, 250); } };
  setTimeout(type, reduce ? 0 : 900);
  return el;
}

const apps: Record<AppId, AppDef> = {
  about: { id: 'about', title: L.apps.about, icon: appIcon('about'), w: 620, h: 360, render: renderAbout },
  finder: { id: 'finder', title: L.apps.finder, icon: appIcon('finder'), w: 960, h: 600, render: renderFinder, chrome: 'sidebar' },
  terminal: { id: 'terminal', title: `imrane — zsh — 80×24`, icon: appIcon('terminal'), w: 620, h: 380, render: renderTerminal },
  notes: { id: 'notes', title: L.apps.notes, icon: appIcon('notes'), w: 680, h: 420, render: renderNotes },
  skills: { id: 'skills', title: L.apps.skills, icon: appIcon('skills'), w: 640, h: 520, render: renderSkills },
  mail: { id: 'mail', title: L.apps.mail, icon: appIcon('mail'), w: 560, h: 440, render: renderMail },
  readme: { id: 'readme', title: L.apps.readme, icon: appIcon('readme'), w: 560, h: 360, render: renderReadme },
  settings: { id: 'settings', title: lang === 'fr' ? 'Réglages' : 'Settings', icon: appIcon('settings'), w: 600, h: 590, render: renderSettings },
};

/* ---------------- window manager ---------------- */
const wins = new Map<AppId, HTMLElement>();
let z = 100;
let cascade = 0;

function dockRect(id: AppId) { return document.querySelector<HTMLElement>(`.dock-item[data-app="${id}"]`)?.getBoundingClientRect(); }
function setOpenDot(id: AppId, on: boolean) { document.querySelector(`.dock-item[data-app="${id}"]`)?.classList.toggle('open', on); }
function setMenuApp(title: string) { const m = $('#mb-app'); if (m) m.textContent = title; }

/* ---------- native-feeling motion: physical springs compiled to CSS linear() easings ---------- */
function springEasing(stiffness = 260, damping = 26, mass = 1) {
  let x = 0, v = 0; const dt = 1 / 120; const pts: number[] = [];
  let t = 0;
  for (; t < 3; t += dt) {
    const a = (-stiffness * (x - 1) - damping * v) / mass;
    v += a * dt; x += v * dt; pts.push(x);
    if (t > 0.1 && Math.abs(x - 1) < 0.001 && Math.abs(v) < 0.01) break;
  }
  const step = Math.max(1, Math.floor(pts.length / 60));
  const s = pts.filter((_, i) => i % step === 0).map((p) => +p.toFixed(4));
  s[s.length - 1] = 1;
  return { easing: `linear(0, ${s.join(', ')})`, duration: Math.round(t * 1000) };
}
const supportsLinear = typeof CSS !== 'undefined' && CSS.supports?.('transition-timing-function', 'linear(0, 1)');
const SPRING = supportsLinear ? springEasing(240, 25) : { easing: 'cubic-bezier(.32,.72,0,1)', duration: 520 };   // iOS-like, tiny overshoot
const SNAPPY = supportsLinear ? springEasing(380, 34) : { easing: 'cubic-bezier(.32,.72,0,1)', duration: 380 };
document.documentElement.style.setProperty('--spring', SPRING.easing);
document.documentElement.style.setProperty('--spring-ms', `${SPRING.duration}ms`);

/** macOS "genie" — the window funnels into its Dock icon (or out of it when reversed). */
function genie(win: HTMLElement, reverse = false): Promise<void> {
  const id = win.dataset.app as AppId;
  const r = dockRect(id); const wr = win.getBoundingClientRect();
  const W = wr.width, H = wr.height;
  const icw = r ? r.width * 0.9 : 50;
  const ox = r ? r.left + r.width / 2 - wr.left : W / 2;
  const oy = r ? r.top + r.height * 0.3 - wr.top : H + 200;
  const L = ox - icw / 2, R = ox + icw / 2;
  const rect = `path('M0,0 L${W},0 C${W},${H * 0.5} ${W},${H * 0.5} ${W},${H} L0,${H} C0,${H * 0.5} 0,${H * 0.5} 0,0 Z')`;
  const funnel = (k: number) => `path('M0,0 L${W},0 C${W},${H * (0.55 - 0.15 * k)} ${R},${H * (0.5 + 0.1 * k)} ${R},${H} L${L},${H} C${L},${H * (0.5 + 0.1 * k)} 0,${H * (0.55 - 0.15 * k)} 0,0 Z')`;
  const frames: Keyframe[] = [
    { offset: 0, clipPath: rect, transform: 'translate(0,0) scale(1,1)', opacity: 1 },
    { offset: 0.38, clipPath: funnel(0), transform: 'translate(0,0) scale(1,1)', opacity: 1 },
    { offset: 0.7, clipPath: funnel(1), transform: 'translate(0,0) scale(0.55,0.4)', opacity: 0.9 },
    { offset: 1, clipPath: funnel(1), transform: 'translate(0,0) scale(0.12,0.02)', opacity: 0 },
  ];
  win.style.transformOrigin = `${ox}px ${oy}px`;
  const anim = win.animate(frames, { duration: 600, easing: reverse ? 'cubic-bezier(.25,.8,.35,1)' : 'cubic-bezier(.45,0,.65,.9)', direction: reverse ? 'reverse' : 'normal', fill: 'both' });
  return anim.finished.then(() => { anim.cancel(); win.style.transformOrigin = ''; });
}

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
  if (def.chrome === 'sidebar') win.classList.add('chrome-sidebar');
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
    const fromY = r ? r.top - (wr.top + wr.height / 2) : 60;
    const s = r ? Math.max(0.08, r.width / wr.width) : 0.85;
    win.animate([{ transform: `translate(${fromX}px, ${fromY}px) scale(${s})` }, { transform: 'translate(0,0) scale(1)' }], { duration: SPRING.duration, easing: SPRING.easing });
    win.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, easing: 'ease-out' });
  }
  if (id === 'terminal') setTimeout(() => (win.querySelector('input') as HTMLInputElement)?.focus({ preventScroll: true }), 300);
  return win;
}

function closeApp(id: AppId) {
  const win = wins.get(id); if (!win) return;
  const done = () => { win.remove(); wins.delete(id); setOpenDot(id, false); const top = [...wins.values()].sort((a, b) => +b.style.zIndex - +a.style.zIndex)[0]; top ? focus(top) : setMenuApp('Finder'); };
  if (reduce) return done();
  win.style.pointerEvents = 'none';
  win.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.94)' }], { duration: 200, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' }).finished.then(done);
}

function minimize(win: HTMLElement) {
  if (win.dataset.anim) return;
  const end = () => { win.hidden = true; delete win.dataset.anim; const top = [...wins.values()].filter((w) => !w.hidden).sort((a, b) => +b.style.zIndex - +a.style.zIndex)[0]; top ? focus(top) : setMenuApp('Finder'); };
  if (reduce) return end();
  win.dataset.anim = '1';
  genie(win).then(end);
}
function restore(win: HTMLElement) {
  win.hidden = false;
  if (reduce || win.dataset.anim) return;
  win.dataset.anim = '1';
  genie(win, true).then(() => delete win.dataset.anim);
}
function toggleMax(win: HTMLElement) {
  const before = win.getBoundingClientRect();
  if (win.classList.contains('max')) {
    const prev = JSON.parse(win.dataset.prev || '{}');
    Object.assign(win.style, prev); win.classList.remove('max');
  } else {
    win.dataset.prev = JSON.stringify({ left: win.style.left, top: win.style.top, width: win.style.width, height: win.style.height });
    Object.assign(win.style, { left: '0px', top: '30px', width: `${desktop.clientWidth}px`, height: `${desktop.clientHeight - 30 - 90}px` });
    win.classList.add('max');
  }
  if (reduce) return;
  const after = win.getBoundingClientRect();
  const sx = before.width / after.width, sy = before.height / after.height;
  win.style.transformOrigin = '0 0';
  win.animate([
    { transform: `translate(${before.left - after.left}px, ${before.top - after.top}px) scale(${sx}, ${sy})` },
    { transform: 'translate(0,0) scale(1,1)' },
  ], { duration: SNAPPY.duration, easing: SNAPPY.easing }).finished.then(() => (win.style.transformOrigin = ''));
}

function wireWindow(win: HTMLElement, id: AppId) {
  win.addEventListener('pointerdown', () => focus(win));
  $('.l-close', win).addEventListener('click', (e) => { e.stopPropagation(); closeApp(id); });
  $('.l-min', win).addEventListener('click', (e) => { e.stopPropagation(); minimize(win); });
  $('.l-max', win).addEventListener('click', (e) => { e.stopPropagation(); toggleMax(win); });
  const bar = $('.titlebar', win);
  bar.addEventListener('dblclick', (e) => { if (!(e.target as HTMLElement).closest('.lights')) toggleMax(win); });
  win.addEventListener('dblclick', (e) => { const tg = e.target as HTMLElement; if (tg.closest('[data-drag]') && !tg.closest('button, input, a, label')) toggleMax(win); });
  win.addEventListener('pointerdown', (e) => {
    const tg = e.target as HTMLElement;
    if (!tg.closest('[data-drag]') || tg.closest('button, input, a, label')) return;
    if (isMobile() || win.classList.contains('max')) return;
    const sx = e.clientX, sy = e.clientY, ox = win.offsetLeft, oy = win.offsetTop;
    win.setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) => {
      win.style.left = `${Math.min(Math.max(ox + ev.clientX - sx, -win.offsetWidth + 80), desktop.clientWidth - 80)}px`;
      win.style.top = `${Math.min(Math.max(oy + ev.clientY - sy, 30), desktop.clientHeight - 60)}px`;
    };
    const up = () => { win.removeEventListener('pointermove', move); win.removeEventListener('pointerup', up); };
    win.addEventListener('pointermove', move); win.addEventListener('pointerup', up);
  });
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
const dockOrder: (AppId | '|' | `link:${string}`)[] = ['about', 'finder', 'terminal', 'notes', 'skills', 'mail', 'settings', '|', 'link:github', 'link:linkedin', 'link:whatsapp', '|', 'readme'];
const dockLinks: Record<string, { href: string; label: string }> = {
  github: { href: site.github, label: 'GitHub' },
  linkedin: { href: site.linkedin, label: 'LinkedIn' },
  whatsapp: { href: site.whatsapp, label: 'WhatsApp' },
};
function buildDock() {
  const dock = $('#dock');
  dock.innerHTML = dockOrder.map((id) => id === '|' ? '<span class="dock-sep"></span>' :
    id.startsWith('link:') ? (() => { const k = id.slice(5), l = dockLinks[k]; return `<a class="dock-item dock-link" href="${l.href}" target="_blank" rel="noopener" aria-label="${l.label}"><span class="ic">${icon(k)}</span><span class="tip">${l.label}</span></a>`; })() :
    `<button class="dock-item" data-app="${id}" aria-label="${esc(apps[id].title === 'imrane — zsh — 80×24' ? L.apps.terminal : apps[id].title)}"><span class="ic">${appIcon(id)}</span><span class="tip">${id === 'terminal' ? L.apps.terminal : apps[id].title}</span><span class="dot"></span></button>`).join('');
  dock.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('.dock-item'); if (!b || !b.dataset.app) return;
    const id = b.dataset.app as AppId;
    if (!wins.has(id) && !reduce) { b.classList.add('bounce'); setTimeout(() => b.classList.remove('bounce'), 1200); }
    const w = wins.get(id);
    if (w && !w.hidden && w.style.zIndex === String(z)) minimize(w); else openApp(id);
  });
  // magnification — macOS-style: sizes are driven from a stable rest layout (no feedback loop)
  // and eased every frame toward their target, so motion stays fluid at any pointer speed.
  const items = [...dock.querySelectorAll<HTMLElement>('.dock-item')];
  const base = () => (isMobile() ? 48 : 56);
  const MAX = 30, RANGE = 150;
  let centers: number[] = [];
  const cur = items.map(() => base());
  const tgt = items.map(() => base());
  let raf = 0, mx: number | null = null;
  const measure = () => {
    items.forEach((it) => (it.style.width = it.style.height = `${base()}px`));
    centers = items.map((it) => { const r = it.getBoundingClientRect(); return r.left + r.width / 2; });
    items.forEach((it, i) => (it.style.width = it.style.height = `${cur[i]}px`));
  };
  const step = () => {
    let moving = false;
    items.forEach((it, i) => {
      if (mx === null) tgt[i] = base();
      else {
        const d = Math.abs(mx - centers[i]);
        tgt[i] = base() + (d < RANGE ? MAX * (Math.cos((d / RANGE) * Math.PI) + 1) / 2 : 0);
      }
      const diff = tgt[i] - cur[i];
      if (Math.abs(diff) > 0.05) { cur[i] += diff * 0.22; moving = true; } else cur[i] = tgt[i];
      it.style.width = it.style.height = `${cur[i].toFixed(2)}px`;
    });
    raf = moving ? requestAnimationFrame(step) : 0;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(step); };
  dock.addEventListener('pointerenter', (e) => { if (reduce || isMobile()) return; measure(); mx = e.clientX; kick(); });
  dock.addEventListener('pointermove', (e) => { if (reduce || isMobile()) return; if (!centers.length) measure(); mx = e.clientX; kick(); });
  dock.addEventListener('pointerleave', () => { mx = null; kick(); });
  addEventListener('resize', () => { centers = []; });
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
    if (it.proj) setTimeout(() => (w.querySelector('.fx') as any)?.show(it.proj), 30);
  });
  const home = $('#home-grid');
  const homeApps: AppId[] = ['about', 'finder', 'terminal', 'notes', 'skills', 'mail', 'settings', 'readme'];
  home.innerHTML = homeApps.map((id) => `<button class="home-app" data-app="${id}"><span class="ic">${appIcon(id)}</span>${id === 'terminal' ? L.apps.terminal : apps[id].title}</button>`).join('')
    + Object.entries(dockLinks).map(([k, l]) => `<a class="home-app" href="${l.href}" target="_blank" rel="noopener"><span class="ic">${icon(k)}</span>${l.label}</a>`).join('');
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
  const wc = $('#wall-clock'); if (wc) wc.textContent = time;
  const wd = $('#wall-date'); if (wd) wd.textContent = now.toLocaleDateString(lang, { weekday: 'long', day: 'numeric', month: 'long', timeZone: tz });
}
function buildMenubar() {
  const menu = $('#brand-menu');
  const btn = $('#brand-btn');
  const items = L.brandMenu;
  menu.innerHTML = `<button data-open="about">${items[0]}</button><button data-open="settings">${lang === 'fr' ? 'Fond d’écran…' : 'Wallpaper…'}</button><hr>
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

/* ---------------- desktop widgets ---------------- */
function buildWidgets() {
  const fr = lang === 'fr';
  const box = $('#widgets'); if (!box) return;
  const stackIcons = ['react', 'nextjs', 'nodejs', 'nestjs', 'ts', 'go', 'gcp', 'docker'];
  box.innerHTML = `
    <div class="wg wg-profile lg" data-open="about">
      <img class="wg-ph" src="${photo}" alt="" />
      <div><b>Imrane Adli</b><span>${L.about.role}</span>
      <span class="wg-status"><i></i>${fr ? 'Disponible · temps plein' : 'Available · full-time'}</span></div>
      <div class="wg-actions"><button class="wg-btn" data-open="finder">${fr ? 'Projets' : 'Projects'}</button><button class="wg-btn ghost" data-open="mail">${fr ? 'Contact' : 'Contact'}</button></div>
    </div>
    <div class="wg wg-clock sm" aria-label="clock">
      <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" class="face"/>
        ${Array.from({ length: 12 }, (_, i) => `<line x1="50" y1="8" x2="50" y2="${i % 3 ? 13 : 16}" transform="rotate(${i * 30} 50 50)" class="tick"/>`).join('')}
        <line id="hh" x1="50" y1="50" x2="50" y2="28" class="hand h"/><line id="mh" x1="50" y1="50" x2="50" y2="17" class="hand m"/>
        <line id="sh" x1="50" y1="58" x2="50" y2="14" class="hand s"/><circle cx="50" cy="50" r="2.6" class="pin"/></svg>
    </div>
    <div class="wg wg-cal sm"><span class="wg-dow" id="wg-dow"></span><b id="wg-day"></b><span class="wg-mon" id="wg-mon"></span></div>
    <div class="wg wg-build md" data-project="tunneleads">
      <span class="wg-k">${fr ? 'En cours' : 'Now building'}</span>
      <b>Tunneleads</b>
      <span class="wg-sub">${fr ? 'SaaS d’analyse d’appels par IA' : 'AI call-analysis SaaS'}</span>
      <div class="wg-meter"><span><b>800+</b>${fr ? 'tests' : 'tests'}</span><span><b>Go</b>mTLS</span><span><b>Gemini</b>${fr ? "analyse IA" : "AI analysis"}</span></div>
    </div>
    <div class="wg wg-stack md" data-open="skills">
      <span class="wg-k">Stack</span>
      <div class="wg-icons">${stackIcons.map((i) => `<img src="/icons/${i}.svg" alt="" />`).join('')}</div>
    </div>
    <a class="wg wg-gh sm" href="${site.github}" target="_blank" rel="noopener">
      <span class="wg-k">GitHub</span><b>1 100+</b><span class="wg-sub">${fr ? 'contributions cette année' : 'contributions this year'}</span>
    </a>`;
  box.addEventListener('click', (e) => {
    const p = (e.target as HTMLElement).closest<HTMLElement>('[data-project]');
    if (p) { const w = openApp('finder'); setTimeout(() => (w.querySelector('.fx') as any)?.show(p.dataset.project), 40); return; }
    const o = (e.target as HTMLElement).closest<HTMLElement>('[data-open]');
    if (o) openApp(o.dataset.open as AppId);
  });
  const tick = () => {
    const d = new Date();
    const s = d.getSeconds(), m = d.getMinutes() + s / 60, hh = (d.getHours() % 12) + m / 60;
    $('#sh')?.setAttribute('transform', `rotate(${s * 6} 50 50)`);
    $('#mh')?.setAttribute('transform', `rotate(${m * 6} 50 50)`);
    $('#hh')?.setAttribute('transform', `rotate(${hh * 30} 50 50)`);
    const dow = $('#wg-dow'); if (dow) dow.textContent = d.toLocaleDateString(lang, { weekday: 'long' });
    const day = $('#wg-day'); if (day) day.textContent = String(d.getDate());
    const mon = $('#wg-mon'); if (mon) mon.textContent = d.toLocaleDateString(lang, { month: 'long', year: 'numeric' });
  };
  tick(); setInterval(tick, 1000);
  document.addEventListener('pointermove', (e) => {
    document.querySelectorAll<HTMLElement>('.wg, .cc, .sp-box').forEach((el) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`); el.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  }, { passive: true });
  if (!reduce) animate('.wg', { opacity: [0, 1], transform: ['translateY(14px) scale(0.96)', 'translateY(0) scale(1)'] }, { duration: 0.6, ease, delay: (i: number) => 0.15 + i * 0.07 } as any);
}

/* ---------------- spotlight ---------------- */
type Hit = { kind: string; title: string; sub: string; icon: string; run: () => void };
function spotlightIndex(): Hit[] {
  const fr = lang === 'fr';
  const appHits: Hit[] = (Object.keys(apps) as AppId[]).map((id) => ({
    kind: fr ? 'Applications' : 'Applications', title: id === 'terminal' ? L.apps.terminal : apps[id].title, sub: fr ? 'Application' : 'Application', icon: appIcon(id), run: () => openApp(id),
  }));
  const projHits: Hit[] = D.projects.map((p) => ({
    kind: fr ? 'Projets' : 'Projects', title: p.name, sub: p.stack.join(' · '), icon: icon('folder'),
    run: () => { const w = openApp('finder'); setTimeout(() => (w.querySelector('.fx') as any)?.show(p.id), 40); },
  }));
  const expHits: Hit[] = D.experience.items.map((e) => ({ kind: fr ? 'Parcours' : 'Experience', title: `${e.role} — ${e.org}`, sub: e.period, icon: icon('notes'), run: () => openApp('notes') }));
  const skillHits: Hit[] = stack.flat().map(([i, n]) => ({ kind: fr ? 'Compétences' : 'Skills', title: n, sub: fr ? 'Technologie' : 'Technology', icon: `<img src="/icons/${i}.svg" alt="" />`, run: () => openApp('skills') }));
  const cmdHits: Hit[] = [
    { kind: fr ? 'Actions' : 'Actions', title: fr ? 'Basculer clair / sombre' : 'Toggle light / dark', sub: '⌘ ⇧ L', icon: icon('settings'), run: () => toggleTheme() },
    { kind: fr ? 'Actions' : 'Actions', title: fr ? 'Copier mon e-mail' : 'Copy my email', sub: site.email, icon: icon('mail'), run: async () => { try { await navigator.clipboard.writeText(site.email); } catch {} toast(L.mail.copied); } },
    { kind: 'Contact', title: 'WhatsApp', sub: site.phone, icon: icon('whatsapp'), run: () => window.open(site.whatsapp, '_blank', 'noopener') },
    { kind: 'Contact', title: 'LinkedIn', sub: 'linkedin.com/in/imrane-adli', icon: icon('linkedin'), run: () => window.open(site.linkedin, '_blank', 'noopener') },
    { kind: 'Contact', title: 'GitHub', sub: 'github.com/ADLI-Imrane', icon: icon('github'), run: () => window.open(site.github, '_blank', 'noopener') },
    { kind: fr ? 'Actions' : 'Actions', title: 'Mission Control', sub: 'F3 · Ctrl ↑', icon: icon('finder'), run: () => mission(true) },
    { kind: fr ? 'Actions' : 'Actions', title: fr ? 'Passer en anglais' : 'Switch to French', sub: lang === 'fr' ? 'English' : 'Français', icon: icon('readme'), run: () => { location.href = lang === 'fr' ? '/en/' : '/'; } },
    ...WALLS.map((w) => ({ kind: fr ? 'Fonds d’écran' : 'Wallpapers', title: w[lang], sub: fr ? 'Fond d’écran' : 'Wallpaper', icon: `<img src="/img/walls/${w.id}-thumb.jpg" alt="" />`, run: () => setWall(w.id) })),
  ];
  return [...appHits, ...projHits, ...expHits, ...skillHits, ...cmdHits];
}
function openSpotlight() {
  const ov = $('#spotlight'); if (!ov) return;
  ov.hidden = false;
  const input = $('input', ov) as HTMLInputElement, res = $('.sp-res', ov);
  const all = spotlightIndex();
  let sel = 0, list: Hit[] = [];
  const render = () => {
    const q = input.value.trim().toLowerCase();
    list = q ? all.filter((h) => (h.title + ' ' + h.sub + ' ' + h.kind).toLowerCase().includes(q)).slice(0, 9) : all.filter((h) => h.kind === all[0].kind).slice(0, 6);
    sel = Math.min(sel, Math.max(0, list.length - 1));
    let last = '';
    res.innerHTML = list.length ? list.map((h, i) => {
      const head = h.kind !== last ? `<div class="sp-k">${(last = h.kind)}</div>` : '';
      return `${head}<button class="sp-hit ${i === sel ? 'on' : ''}" data-i="${i}"><span class="sp-ic">${h.icon}</span><span class="sp-t">${esc(h.title)}<small>${esc(h.sub)}</small></span><kbd>↩</kbd></button>`;
    }).join('') : `<div class="sp-empty">${lang === 'fr' ? 'Aucun résultat' : 'No results'}</div>`;
    ov.classList.toggle('has', !!q || true);
  };
  const runSel = () => { const h = list[sel]; if (h) { close(); h.run(); } };
  const close = () => { ov.hidden = true; input.value = ''; };
  input.oninput = () => { sel = 0; render(); };
  input.onkeydown = (e) => {
    if (e.key === 'ArrowDown') { sel = Math.min(list.length - 1, sel + 1); render(); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { sel = Math.max(0, sel - 1); render(); e.preventDefault(); }
    else if (e.key === 'Enter') runSel();
    else if (e.key === 'Escape') close();
  };
  res.onclick = (e) => { const b = (e.target as HTMLElement).closest<HTMLElement>('.sp-hit'); if (b) { sel = Number(b.dataset.i); runSel(); } };
  ov.onclick = (e) => { if (e.target === ov) close(); };
  render();
  setTimeout(() => input.focus(), 10);
  if (!reduce) { const bx = $('.sp-box', ov); bx.animate([{ transform: 'scale(0.94) translateY(-10px)' }, { transform: 'scale(1) translateY(0)' }], { duration: SPRING.duration, easing: SPRING.easing }); bx.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160 }); }
}

/* ---------------- control center ---------------- */
function buildControlCenter() {
  const fr = lang === 'fr';
  const cc = $('#cc'); const btn = $('#mb-cc'); if (!cc || !btn) return;
  cc.innerHTML = `
    <div class="cc-grid">
      <div class="cc-tile cc-wide">
        <button class="cc-row" data-cc="theme"><span class="cc-dot">${g.sparkles}</span><span><b>${fr ? 'Apparence' : 'Appearance'}</b><small data-cc-label="theme"></small></span></button>
        <button class="cc-row" data-cc="lang"><span class="cc-dot">${g.globe}</span><span><b>${fr ? 'Langue' : 'Language'}</b><small>${fr ? 'Français' : 'English'}</small></span></button>
        <button class="cc-row" data-cc="dnd"><span class="cc-dot">${g.clock}</span><span><b>${fr ? 'Concentration' : 'Focus'}</b><small data-cc-label="dnd"></small></span></button>
      </div>
      <button class="cc-tile cc-sq" data-cc="mission">${g.layoutGrid}<span>Mission Control</span></button>
      <button class="cc-tile cc-sq" data-cc="spot">${g.search}<span>Spotlight</span></button>
      <div class="cc-tile cc-full"><b>${fr ? 'Luminosité' : 'Display'}</b><input type="range" min="40" max="100" value="100" data-cc="bright" aria-label="Brightness" /></div>
      <div class="cc-tile cc-full"><b>${fr ? 'Fond d’écran' : 'Wallpaper'}</b><div class="cc-walls">${WALLS.map((w) => `<button data-cc-wall="${w.id}" style="background-image:url(/img/walls/${w.id}-thumb.jpg)" aria-label="${w[lang]}"></button>`).join('')}</div></div>
    </div>`;
  const labels = () => {
    const t = cc.querySelector('[data-cc-label="theme"]'); if (t) t.textContent = document.documentElement.dataset.theme === 'light' ? (fr ? 'Clair' : 'Light') : (fr ? 'Sombre' : 'Dark');
    const d = cc.querySelector('[data-cc-label="dnd"]'); if (d) d.textContent = dnd ? (fr ? 'Ne pas déranger' : 'Do Not Disturb') : (fr ? 'Désactivé' : 'Off');
    cc.querySelector('[data-cc="dnd"]')?.classList.toggle('on', dnd);
    cc.querySelector('[data-cc="theme"]')?.classList.toggle('on', document.documentElement.dataset.theme !== 'light');
  };
  const toggle = (open?: boolean) => {
    const o = open ?? cc.hidden; cc.hidden = !o; btn.setAttribute('aria-expanded', String(o));
    if (o) { $('#notifs').innerHTML = ''; labels(); if (!reduce) { cc.style.transformOrigin = 'top right'; cc.animate([{ transform: 'scale(0.9)' }, { transform: 'scale(1)' }], { duration: SPRING.duration, easing: SPRING.easing }); cc.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160 }); } }
  };
  btn.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
  document.addEventListener('click', (e) => { if (!cc.hidden && !(e.target as HTMLElement).closest('#cc')) toggle(false); });
  cc.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-cc], [data-cc-wall]'); if (!b) return;
    if (b.dataset.ccWall) { setWall(b.dataset.ccWall); return; }
    const k = b.dataset.cc;
    if (k === 'theme') { toggleTheme(); setTimeout(labels, 50); }
    if (k === 'lang') location.href = lang === 'fr' ? '/en/' : '/';
    if (k === 'dnd') { dnd = !dnd; labels(); }
    if (k === 'mission') { toggle(false); mission(true); }
    if (k === 'spot') { toggle(false); openSpotlight(); }
  });
  cc.querySelector<HTMLInputElement>('[data-cc="bright"]')!.addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--dim', String(1 - Number((e.target as HTMLInputElement).value) / 100));
  });
}
let dnd = false;

/* ---------------- notifications ---------------- */
function notify(title: string, body: string, appId: AppId = 'about', onClick?: () => void) {
  if (dnd) return;
  const stack = $('#notifs'); if (!stack) return;
  const n = h(`<button class="notif"><span class="n-ic">${appIcon(appId)}</span><span class="n-t"><b>${esc(title)}</b><span>${esc(body)}</span></span><small>${lang === 'fr' ? 'maintenant' : 'now'}</small></button>`);
  stack.appendChild(n);
  if (!reduce) { n.animate([{ transform: 'translateX(110%)' }, { transform: 'translateX(0)' }], { duration: SPRING.duration, easing: SPRING.easing }); }
  const kill = () => { if (!n.isConnected) return; reduce ? n.remove() : animate(n, { opacity: 0, transform: 'translateX(40px)' }, { duration: 0.25 }).then(() => n.remove()); };
  n.addEventListener('click', () => { onClick?.(); kill(); });
  setTimeout(kill, 7000);
}

/* ---------------- mission control ---------------- */
let missionOn = false;
function mission(on: boolean) {
  const open = [...wins.values()].filter((w) => !w.hidden);
  if (on === missionOn) return;
  missionOn = on;
  document.body.classList.toggle('mission', on);
  if (!on) { open.forEach((w) => { w.style.transition = reduce ? '' : `transform ${SPRING.duration}ms ${SPRING.easing}`; w.style.transform = ''; setTimeout(() => (w.style.transition = ''), SPRING.duration + 50); }); return; }
  if (!open.length) { missionOn = false; document.body.classList.remove('mission'); toast(lang === 'fr' ? 'Aucune fenêtre ouverte' : 'No open windows'); return; }
  const W = desktop.clientWidth, H = desktop.clientHeight - 140;
  const cols = Math.ceil(Math.sqrt(open.length)), rows = Math.ceil(open.length / cols);
  const cw = W / cols, ch = H / rows;
  open.forEach((w, i) => {
    const c = i % cols, r = Math.floor(i / cols);
    const s = Math.min((cw - 60) / w.offsetWidth, (ch - 60) / w.offsetHeight, 0.85);
    const tx = c * cw + cw / 2 - (w.offsetLeft + w.offsetWidth / 2);
    const ty = 60 + r * ch + ch / 2 - (w.offsetTop + w.offsetHeight / 2);
    w.style.transition = reduce ? '' : `transform ${SPRING.duration}ms ${SPRING.easing}`;
    w.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
    w.dataset.title && w.setAttribute('data-mc', w.dataset.title);
  });
}
function wireMission() {
  desktop.addEventListener('click', (e) => {
    if (!missionOn) return;
    const w = (e.target as HTMLElement).closest<HTMLElement>('.win');
    e.stopPropagation(); e.preventDefault();
    mission(false);
    if (w) focus(w);
  }, true);
}

/* ---------------- context menu ---------------- */
function wireContextMenu() {
  const fr = lang === 'fr';
  const menu = $('#ctx'); if (!menu) return;
  menu.innerHTML = `
    <button data-act="terminal">${fr ? 'Nouvelle fenêtre Terminal' : 'New Terminal Window'}</button>
    <button data-act="spot">${fr ? 'Rechercher…' : 'Search…'} <kbd>⌘K</kbd></button>
    <button data-act="mission">Mission Control <kbd>F3</kbd></button><hr>
    <button data-act="widgets">${fr ? 'Afficher / masquer les widgets' : 'Show / Hide Widgets'}</button>
    <button data-act="wall">${fr ? 'Changer le fond d’écran…' : 'Change Wallpaper…'}</button>
    <button data-act="theme">${fr ? 'Basculer clair / sombre' : 'Toggle Light / Dark'}</button>`;
  desktop.addEventListener('contextmenu', (e) => {
    if ((e.target as HTMLElement).closest('.win, .wg, .d-icon')) return;
    e.preventDefault();
    menu.hidden = false;
    const x = Math.min(e.clientX, innerWidth - 250), y = Math.min(e.clientY, innerHeight - 230);
    menu.style.left = `${x}px`; menu.style.top = `${y}px`;
  });
  document.addEventListener('click', () => (menu.hidden = true));
  menu.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLElement>('[data-act]')?.dataset.act;
    if (a === 'terminal') openApp('terminal');
    if (a === 'spot') openSpotlight();
    if (a === 'mission') setTimeout(() => mission(true), 10);
    if (a === 'widgets') document.body.classList.toggle('no-widgets');
    if (a === 'wall') openApp('settings');
    if (a === 'theme') toggleTheme();
  });
}

/* ---------------- keyboard ---------------- */
function wireKeys() {
  document.addEventListener('keydown', (e) => {
    const mod = e.metaKey || e.ctrlKey;
    if (mod && (e.key.toLowerCase() === 'k' || e.key === ' ')) { e.preventDefault(); openSpotlight(); }
    else if (e.key === 'F3' || (e.ctrlKey && e.key === 'ArrowUp')) { e.preventDefault(); mission(!missionOn); }
    else if (e.key === 'Escape' && missionOn) mission(false);
    else if (mod && e.shiftKey && e.key.toLowerCase() === 'l') { e.preventDefault(); toggleTheme(); }
  });
  $('#mb-search')?.addEventListener('click', (e) => { e.stopPropagation(); openSpotlight(); });
}


/* ---------------- boot ---------------- */
function boot() {
  buildMenubar();
  buildDock();
  buildDesktopIcons();
  buildControlCenter();
  wireContextMenu();
  wireKeys();
  wireMission();
  const start = () => {
    const b = $('#boot'); b.classList.add('done'); setTimeout(() => b.remove(), 700);
    if (isMobile()) return;
    buildWidgets();
    setTimeout(() => openApp('terminal', { x: Math.min(desktop.clientWidth - 760, Math.max(420, desktop.clientWidth * 0.42)), y: Math.max(90, desktop.clientHeight * 0.14) }), reduce ? 0 : 500);
    setTimeout(() => notify(lang === 'fr' ? 'Bienvenue sur imrane-os 👋' : 'Welcome to imrane-os 👋', lang === 'fr' ? 'Appuyez sur ⌘K pour tout rechercher, F3 pour Mission Control, clic droit sur le bureau pour plus.' : 'Press ⌘K to search everything, F3 for Mission Control, right-click the desktop for more.', 'about', openSpotlight), reduce ? 0 : 1600);
  };
  let seen = false;
  try { seen = sessionStorage.getItem('booted') === '1'; sessionStorage.setItem('booted', '1'); } catch {}
  setTimeout(start, reduce || seen ? 50 : 1450);
}
boot();
