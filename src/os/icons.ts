// App icons from MacTahoe-icon-theme by vinceliuice (GPL-3.0) — https://github.com/vinceliuice/MacTahoe-icon-theme
// Files live in /public/icons/os (license copy: COPYING.txt).
const names = ['finder', 'terminal', 'notes', 'skills', 'mail', 'readme', 'settings', 'folder', 'linkedin', 'whatsapp', 'github'] as const;
export const icon = (name: string) =>
  (names as readonly string[]).includes(name) ? `<img class="osi" src="/icons/os/${name}.svg" alt="" draggable="false" />` : '';
