// Lucide icons (ISC license) — clean SF-style line glyphs for system UI.
import clock from 'lucide-static/icons/clock.svg?raw';
import folderOpen from 'lucide-static/icons/folder-open.svg?raw';
import appWindow from 'lucide-static/icons/app-window.svg?raw';
import file from 'lucide-static/icons/file.svg?raw';
import house from 'lucide-static/icons/house.svg?raw';
import chevronLeft from 'lucide-static/icons/chevron-left.svg?raw';
import chevronRight from 'lucide-static/icons/chevron-right.svg?raw';
import layoutGrid from 'lucide-static/icons/layout-grid.svg?raw';
import list from 'lucide-static/icons/list.svg?raw';
import columns from 'lucide-static/icons/columns-3.svg?raw';
import gallery from 'lucide-static/icons/gallery-horizontal-end.svg?raw';
import share from 'lucide-static/icons/share.svg?raw';
import tag from 'lucide-static/icons/tag.svg?raw';
import ellipsis from 'lucide-static/icons/ellipsis.svg?raw';
import search from 'lucide-static/icons/search.svg?raw';
import folder from 'lucide-static/icons/folder.svg?raw';
import briefcase from 'lucide-static/icons/briefcase.svg?raw';
import graduation from 'lucide-static/icons/graduation-cap.svg?raw';
import user from 'lucide-static/icons/user.svg?raw';
import mail from 'lucide-static/icons/mail.svg?raw';
import code from 'lucide-static/icons/code-xml.svg?raw';
import sparkles from 'lucide-static/icons/sparkles.svg?raw';
import star from 'lucide-static/icons/star.svg?raw';
import globe from 'lucide-static/icons/globe.svg?raw';
import link from 'lucide-static/icons/link.svg?raw';
import plus from 'lucide-static/icons/plus.svg?raw';
import x from 'lucide-static/icons/x.svg?raw';

const strip = (s: string) => s.replace(/<!--[\s\S]*?-->/g, '').replace(/class="[^"]*"/, 'class="g"');
export const g = Object.fromEntries(
  Object.entries({ clock, folderOpen, appWindow, file, house, chevronLeft, chevronRight, layoutGrid, list, columns, gallery, share, tag, ellipsis, search, folder, briefcase, graduation, user, mail, code, sparkles, star, globe, link, plus, x })
    .map(([k, v]) => [k, strip(v)])
) as Record<string, string>;
