import fs from 'fs';

export type TrendItem = { title: string; source?: string };

const STARTERS = [
  'POV:',
  'Stop',
  'How to',
  'If you',
  'The',
  'Why',
  'Things I'
];

function clean(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

function normalizeHook(title: string): string {
  let t = clean(title);
  if (!t) return t;
  if (t.length > 120) t = t.slice(0, 117) + '...';

  const hasStarter = STARTERS.some((k) => t.toLowerCase().startsWith(k.toLowerCase()));
  if (!hasStarter) t = `POV: ${t}`;
  return t;
}

export function loadTrendHooks(jsonPath?: string, limit = 40): string[] {
  if (!jsonPath || !fs.existsSync(jsonPath)) return [];
  const raw = fs.readFileSync(jsonPath, 'utf8');
  const parsed = JSON.parse(raw) as { items?: TrendItem[] };
  const items = parsed.items || [];

  const seen = new Set<string>();
  const hooks: string[] = [];

  for (const it of items) {
    const title = clean(it.title || '');
    if (title.length < 20) continue;
    const h = normalizeHook(title);
    const key = h.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    hooks.push(h);
    if (hooks.length >= limit) break;
  }

  return hooks;
}
