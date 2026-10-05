// Original squircle app icons (no third-party brand marks).
const sq = (bg: string, inner: string, id: string) => `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>${bg.startsWith('url') ? '' : ''}<linearGradient id="g-${id}" x1="0" y1="0" x2="0" y2="1">${bg}</linearGradient>
  <linearGradient id="s-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
  <rect x="4" y="4" width="92" height="92" rx="22" fill="url(#g-${id})"/>
  ${inner}
  <rect x="4" y="4" width="92" height="92" rx="22" fill="url(#s-${id})"/>
  <rect x="4.5" y="4.5" width="91" height="91" rx="21.5" fill="none" stroke="#000" stroke-opacity=".18"/>
</svg>`;

export const icons: Record<string, string> = {
  finder: sq(
    '<stop offset="0" stop-color="#5AA9FF"/><stop offset="1" stop-color="#1F5BE0"/>',
    `<path d="M22 34a6 6 0 0 1 6-6h14l6 6h24a6 6 0 0 1 6 6v28a6 6 0 0 1-6 6H28a6 6 0 0 1-6-6z" fill="#cfe5ff"/>
     <path d="M22 42h56v26a6 6 0 0 1-6 6H28a6 6 0 0 1-6-6z" fill="#fff"/>
     <path d="M40 56h20" stroke="#1F5BE0" stroke-width="4" stroke-linecap="round"/>`,
    'finder'
  ),
  terminal: sq(
    '<stop offset="0" stop-color="#3a3f47"/><stop offset="1" stop-color="#0d0f12"/>',
    `<rect x="18" y="22" width="64" height="56" rx="8" fill="#111418" stroke="#2c323b"/>
     <path d="M28 40l10 8-10 8" fill="none" stroke="#5CF08A" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M44 58h20" stroke="#E6EDF3" stroke-width="5" stroke-linecap="round"/>`,
    'terminal'
  ),
  notes: sq(
    '<stop offset="0" stop-color="#FFE27A"/><stop offset="1" stop-color="#F6B90C"/>',
    `<rect x="22" y="20" width="56" height="60" rx="6" fill="#fffbea"/>
     <rect x="22" y="20" width="56" height="12" rx="6" fill="#F6B90C" opacity=".55"/>
     <path d="M30 44h40M30 54h40M30 64h26" stroke="#c9b87a" stroke-width="3.5" stroke-linecap="round"/>`,
    'notes'
  ),
  skills: sq(
    '<stop offset="0" stop-color="#A78BFA"/><stop offset="1" stop-color="#6D28D9"/>',
    `<g fill="#fff"><rect x="24" y="24" width="22" height="22" rx="6"/><rect x="54" y="24" width="22" height="22" rx="11" opacity=".85"/>
     <rect x="24" y="54" width="22" height="22" rx="11" opacity=".85"/><rect x="54" y="54" width="22" height="22" rx="6"/></g>`,
    'skills'
  ),
  mail: sq(
    '<stop offset="0" stop-color="#6EE7F9"/><stop offset="1" stop-color="#0EA5E9"/>',
    `<rect x="20" y="30" width="60" height="42" rx="7" fill="#fff"/>
     <path d="M22 34l28 20 28-20" fill="none" stroke="#0EA5E9" stroke-width="4" stroke-linejoin="round"/>`,
    'mail'
  ),
  readme: sq(
    '<stop offset="0" stop-color="#F8FAFC"/><stop offset="1" stop-color="#CBD5E1"/>',
    `<path d="M30 18h28l14 14v50a4 4 0 0 1-4 4H30a4 4 0 0 1-4-4V22a4 4 0 0 1 4-4z" fill="#fff" stroke="#94A3B8"/>
     <path d="M58 18v14h14" fill="#E2E8F0" stroke="#94A3B8"/>
     <text x="49" y="66" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="15" font-weight="700" fill="#334155">MD</text>`,
    'readme'
  ),
  folder: `<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M6 14a6 6 0 0 1 6-6h24l8 8h44a6 6 0 0 1 6 6v6H6z" fill="#7DB7FF"/>
    <rect x="6" y="20" width="88" height="54" rx="6" fill="#9CC9FF"/>
    <rect x="6" y="20" width="88" height="10" rx="5" fill="#B6D7FF"/></svg>`,
};
