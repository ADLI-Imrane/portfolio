// Original "liquid glass" style app icons — custom artwork, no third-party marks.
const glass = (id: string, c1: string, c2: string, glyph: string) => `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="b-${id}__U__" x1="0.1" y1="0" x2="0.9" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
    <radialGradient id="h-${id}__U__" cx="0.3" cy="0.05" r="0.75"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".55" stop-color="#fff" stop-opacity=".06"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <linearGradient id="r-${id}__U__" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset=".45" stop-color="#fff" stop-opacity=".1"/><stop offset="1" stop-color="#fff" stop-opacity=".45"/></linearGradient>
    <filter id="g-${id}__U__" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="#000" flood-opacity=".28"/></filter>
  </defs>
  <rect x="5" y="5" width="90" height="90" rx="24" fill="url(#b-${id}__U__)"/>
  <rect x="5" y="5" width="90" height="90" rx="24" fill="url(#h-${id}__U__)"/>
  <g filter="url(#g-${id}__U__)">${glyph}</g>
  <rect x="5.75" y="5.75" width="88.5" height="88.5" rx="23.25" fill="none" stroke="url(#r-${id}__U__)" stroke-width="1.5"/>
</svg>`;

const raw: Record<string, string> = {
  finder: glass('finder', '#6fb6ff', '#2a5cf0',
    `<path d="M24 36a6 6 0 0 1 6-6h12l6 6h22a6 6 0 0 1 6 6v24a6 6 0 0 1-6 6H30a6 6 0 0 1-6-6z" fill="#fff" fill-opacity=".38"/>
     <path d="M24 44h52v22a6 6 0 0 1-6 6H30a6 6 0 0 1-6-6z" fill="#fff"/>
     <path d="M41 57h18" stroke="#2a5cf0" stroke-width="4" stroke-linecap="round"/>`),
  terminal: glass('terminal', '#4b5563', '#0b0e13',
    `<path d="M28 38l11 10-11 10" fill="none" stroke="#7CF5A6" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M46 62h24" stroke="#fff" stroke-width="5.5" stroke-linecap="round"/>`),
  notes: glass('notes', '#ffe58a', '#f2a900',
    `<rect x="26" y="22" width="48" height="56" rx="7" fill="#fff"/>
     <path d="M34 40h32M34 50h32M34 60h20" stroke="#e0b542" stroke-width="4" stroke-linecap="round"/>`),
  skills: glass('skills', '#c4a8ff', '#6a2cf0',
    `<g fill="#fff"><rect x="26" y="26" width="20" height="20" rx="6"/><circle cx="64" cy="36" r="10" fill-opacity=".85"/>
     <circle cx="36" cy="64" r="10" fill-opacity=".85"/><rect x="54" y="54" width="20" height="20" rx="6"/></g>`),
  mail: glass('mail', '#7fe3ff', '#1592e6',
    `<rect x="22" y="32" width="56" height="38" rx="7" fill="#fff"/>
     <path d="M25 36l25 18 25-18" fill="none" stroke="#1592e6" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>`),
  readme: glass('readme', '#f1f5f9', '#b8c4d6',
    `<path d="M32 20h24l14 14v42a4 4 0 0 1-4 4H32a4 4 0 0 1-4-4V24a4 4 0 0 1 4-4z" fill="#fff"/>
     <path d="M56 20v14h14" fill="#e2e8f0"/>
     <text x="49" y="66" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="15" font-weight="800" fill="#475569">MD</text>`),
  folder: `<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs><linearGradient id="fb__U__" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd0ff"/><stop offset="1" stop-color="#4b9bff"/></linearGradient>
    <linearGradient id="ff__U__" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe7ff" stop-opacity=".95"/><stop offset="1" stop-color="#7ab8ff" stop-opacity=".9"/></linearGradient></defs>
    <path d="M6 16a7 7 0 0 1 7-7h22l8 8h44a7 7 0 0 1 7 7v6H6z" fill="url(#fb__U__)"/>
    <rect x="6" y="22" width="88" height="52" rx="8" fill="url(#ff__U__)"/>
    <rect x="6.75" y="22.75" width="86.5" height="50.5" rx="7.25" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.5"/></svg>`,
};

let uid = 0;
/** Returns the icon markup with gradient/filter ids unique to this insertion. */
export const icon = (name: string) => (raw[name] || '').replace(/__U__/g, `-${++uid}`);
