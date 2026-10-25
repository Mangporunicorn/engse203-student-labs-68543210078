import fs from 'node:fs/promises';
import path from 'node:path';
import { ROOT, exists, listLabs, listPublishedLabs, readJson } from './common.mjs';

const docs = path.join(ROOT, 'docs');
const errors = [];
const weeks = await listPublishedLabs();
for (const week of await listLabs()) {
  if (!weeks.includes(week) && await exists(path.join(docs, 'labs', week))) errors.push(`Excluded week is still published: ${week}`);
}
const manifest = await readJson(path.join(docs, 'labs.json'));
if (JSON.stringify(manifest.map((x) => x.week)) !== JSON.stringify(weeks)) errors.push('Manifest does not include every week');
let htmlCount = 0, linkCount = 0;
async function scan(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { await scan(file); continue; }
    if (entry.name.endsWith('.js') && /localhost:3001/.test(await fs.readFile(file, 'utf8'))) errors.push(`Local API URL in ${file}`);
    if (!entry.name.endsWith('.html')) continue;
    htmlCount++;
    const html = await fs.readFile(file, 'utf8');
    for (const tag of html.matchAll(/<(?:a|img|script|link)\b[^>]*>/gi)) {
      const attr = tag[0].match(/(?:href|src)=["']([^"']+)["']/i);
      if (!attr || /^(https?:|data:|mailto:|#)/.test(attr[1])) continue;
      const url = new URL(attr[1].replaceAll('&amp;', '&'), `https://portfolio.invalid/${path.relative(docs, file).split(path.sep).join('/')}`);
      const relative = decodeURIComponent(url.pathname.slice(1));
      let target = path.join(docs, relative);
      if (url.pathname.endsWith('/')) target = path.join(target, 'index.html');
      linkCount++;
      if (!(await exists(target))) errors.push(`${path.relative(docs, file)} → missing ${relative}`);
    }
  }
}
for (const week of weeks) {
  const metadata = await readJson(path.join(ROOT, 'labs', week, 'lab-metadata.json'));
  if (metadata.kind === 'exam' && !(await exists(path.join(ROOT, 'labs', week, 'publish/index.html')))) errors.push(`Missing exam build: ${week}`);
  if (metadata.frontendPath && !(await exists(path.join(docs, 'labs', week, 'app/index.html')))) errors.push(`Missing frontend demo: ${week}`);
  for (const file of ['index.html', 'report.html', 'submission.json']) {
    if (!(await exists(path.join(docs, 'labs', week, file)))) errors.push(`Missing ${week}/${file}`);
  }
}
await scan(docs);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else console.log(`Pages verification: PASS — ${weeks.length} weeks, ${htmlCount} HTML pages, ${linkCount} local links/assets`);
