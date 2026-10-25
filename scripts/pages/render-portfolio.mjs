import fs from 'node:fs/promises';
import path from 'node:path';
import { ROOT, PLACEHOLDER_FILES, escapeHtml as h, exists, listLabs, meaningfulEntries, readJson, validHttpUrl } from '../common.mjs';

const config = await readJson(path.join(ROOT, 'student-config.json'));
const repoUrl = `https://github.com/${config.githubUsername}/${config.repositoryName}`;
const pagesBase = `https://${config.githubUsername}.github.io/${config.repositoryName}`;
const docsRoot = path.join(ROOT, 'docs');
const css = `*{box-sizing:border-box}body{margin:0;font-family:Tahoma,Arial,sans-serif;line-height:1.65;color:#10253d;background:#eaf1f7}header{padding:38px max(22px,calc((100% - 1160px)/2));color:#fff;background:linear-gradient(135deg,#071f39,#0d4c77 72%,#078386)}header p{margin:8px 0;color:#cfe4f3}h1,h2,h3{line-height:1.35}header h1{margin:10px 0;font-size:clamp(30px,5vw,48px)}a{color:#075ea8}a:focus-visible,button:focus-visible,summary:focus-visible{outline:3px solid #d58710;outline-offset:4px}main{max-width:1160px;margin:auto;padding:26px 22px 48px}.profile,.links,.stats{display:flex;flex-wrap:wrap;gap:10px}.profile span{padding:5px 10px;border:1px solid #ffffff40;border-radius:99px;background:#ffffff12}.notice{padding:15px 18px;border-left:5px solid #d5a223;border-radius:8px;background:#fff8e6}.labs{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:18px;margin-top:24px}.lab-card,.panel{padding:22px;border:1px solid #c4d6e4;border-radius:14px;background:#fff;box-shadow:0 8px 22px #09274609}.lab-card{display:flex;flex-direction:column;border-top:4px solid #1261a6}.lab-card h2{font-size:21px;margin:15px 0 8px}.lab-card .links{margin-top:auto;padding-top:16px}.card-top{display:flex;justify-content:space-between;gap:12px;align-items:center}.week{font-weight:800;color:#1261a6}.pill{padding:4px 9px;border-radius:99px;background:#e7f3ed;font-size:12px;color:#196644;font-weight:700}.links a{display:inline-block;padding:8px 12px;border:1px solid #9fb8cc;border-radius:8px;color:#0b527f;text-decoration:none;background:#fff}.links a.primary{color:#fff;border-color:#1261a6;background:#1261a6}.muted,small{color:#52677c}header small{color:#cfe4f3}.panel{margin:20px 0}.stats{margin:18px 0}.stats span{padding:10px 14px;background:#f1f6fa;border-radius:9px}.gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:16px}.gallery figure{margin:0;border:1px solid #d6e2ec;border-radius:10px;overflow:hidden}.gallery img{display:block;width:100%;aspect-ratio:16/10;object-fit:contain;background:#f2f5f8}.gallery figcaption{padding:10px;overflow-wrap:anywhere;font-size:13px}details{margin:12px 0;border:1px solid #cbdbe7;border-radius:9px;padding:12px 16px}summary{cursor:pointer;font-weight:700;overflow-wrap:anywhere}pre{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.65;font-size:14px;color:#233c54}code{overflow-wrap:anywhere}footer{margin-top:26px;color:#52677c;font-size:13px}.report-intro{max-width:850px}.lab-card p{margin:6px 0 12px}.version{font-size:12px;margin-top:12px}@media(max-width:560px){header{padding-top:26px}.panel,.lab-card{padding:18px}main{padding:18px 14px 36px}}`;
const shell = (title, header, body) => `<!doctype html>
<html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#092746"><title>${h(title)}</title><style>${css}</style></head><body><header>${header}</header><main>${body}</main></body></html>`.replace(/[\t ]+$/gm, '');
const link = (href, label, primary = false) => `<a${primary ? ' class="primary"' : ''} href="${h(href)}">${h(label)}</a>`;

function local(relative) {
  if (path.isAbsolute(relative) || relative.split(/[\\/]/).includes('..')) throw new Error(`Invalid portfolio path: ${relative}`);
  return path.join(ROOT, relative);
}

async function filesBelow(directory) {
  if (!(await exists(directory))) return [];
  const found = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || ['node_modules', 'dist'].includes(entry.name)) continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) found.push(...await filesBelow(file));
    else if (entry.isFile()) found.push(file);
  }
  return found.sort();
}

await fs.rm(docsRoot, { recursive: true, force: true });
await fs.mkdir(path.join(docsRoot, 'labs'), { recursive: true });
await fs.writeFile(path.join(docsRoot, '.nojekyll'), '');
const cards = [], summaries = [];

for (const week of await listLabs()) {
  const labRoot = path.join(ROOT, 'labs', week);
  const metadata = await readJson(path.join(labRoot, 'lab-metadata.json'));
  const target = path.join(docsRoot, 'labs', week);
  const sourcePath = metadata.sourcePath ?? `labs/${week}/source`;
  const sourceRef = metadata.sourceRef ?? 'main';
  const sourceUrl = `${repoUrl}/tree/${sourceRef}/${sourcePath}`;
  const evidencePaths = metadata.evidencePaths ?? [`labs/${week}/evidence`];
  const evidenceUrls = evidencePaths.map((p) => `${repoUrl}/tree/${metadata.evidenceRef ?? sourceRef}/${p}`);
  const publish = path.join(labRoot, 'publish');
  const hasPublish = await exists(path.join(publish, 'index.html'));
  const hasDemo = await exists(path.join(publish, 'app/index.html'));
  await fs.mkdir(target, { recursive: true });
  if (await exists(publish)) {
    await fs.cp(publish, target, { recursive: true, filter: (file) =>
      !path.relative(publish, file).split(path.sep).some((part) => (part.startsWith('.') && part !== '.nojekyll') || part === 'node_modules' || PLACEHOLDER_FILES.has(part)) });
  }

  const screenshots = [], documents = [], seenDocuments = new Set();
  async function document(file, label) {
    if (seenDocuments.has(file) || !(await exists(file))) return;
    seenDocuments.add(file);
    const text = await fs.readFile(file, 'utf8');
    documents.push(`<details><summary>${h(label)}</summary><pre>${h(text)}</pre></details>`);
  }
  for (let i = 0; i < evidencePaths.length; i++) {
    const directory = local(evidencePaths[i]);
    for (const file of await filesBelow(directory)) {
      const relative = path.relative(directory, file);
      const extension = path.extname(file).toLowerCase();
      if (/\.(png|jpe?g|webp|gif)$/.test(extension)) {
        const href = `evidence/${i}/${relative.split(path.sep).map(encodeURIComponent).join('/')}`;
        const destination = path.join(target, 'evidence', String(i), relative);
        await fs.mkdir(path.dirname(destination), { recursive: true });
        await fs.copyFile(file, destination);
        screenshots.push(`<figure><a href="${h(href)}"><img loading="lazy" src="${h(href)}" alt="${h(week + ' — ' + relative)}"></a><figcaption>${h(relative)}</figcaption></figure>`);
      } else if (['.md', '.txt', '.sql'].includes(extension)) await document(file, relative);
    }
  }
  for (const relative of metadata.documents ?? [`${sourcePath}/README.md`]) await document(local(relative), path.basename(relative));

  const links = [hasDemo ? link('app/', 'ทดลองแอป', true) : '', hasPublish ? link('./', 'เปิดผลงาน', true) : '',
    link(sourceUrl, 'Source Code'), ...evidenceUrls.map((url, i) => link(url, evidenceUrls.length > 1 ? `Evidence ${i + 1}` : 'Evidence')),
    validHttpUrl(metadata.pullRequestUrl) ? link(metadata.pullRequestUrl, 'Pull Request') : ''].join('');
  const report = shell(`${week} — ${metadata.title}`, `<small>ENGSE203 · ${h(week)}</small><h1>${h(metadata.title)}</h1><p>${h(config.studentId)} · ${h(config.section)}</p>`,
    `<p>${link('../../index.html', '← กลับหน้า Portfolio')}</p><section class="panel report-intro"><span class="pill">${h(metadata.kind === 'exam' ? 'สอบกลางภาค' : 'LAB Portfolio')}</span><h2>รายละเอียดผลงาน</h2><p>${h(metadata.notes ?? '')}</p>
    <div class="stats"><span>ผลตรวจ: <strong>${h(metadata.testSummary ?? metadata.testStatus)}</strong></span>${metadata.submissionTag ? `<span>Version: <code>${h(metadata.submissionTag)}</code></span>` : ''}</div>
    ${hasDemo ? '<p class="notice">เดโมนี้ใช้ข้อมูลในเบราว์เซอร์ แยกจาก API และฐานข้อมูลจริง ดูการทำงานฝั่งเซิร์ฟเวอร์และผลทดสอบได้จาก Source Code และหลักฐานด้านล่าง</p>' : ''}<div class="links">${links}</div></section>
    ${screenshots.length ? `<section class="panel"><h2>ภาพหลักฐาน (${screenshots.length})</h2><div class="gallery">${screenshots.join('')}</div></section>` : ''}
    ${documents.length ? `<section class="panel"><h2>เอกสารและผลการทดสอบ</h2>${documents.join('')}</section>` : ''}
    <footer>ENGSE203 · ${h(week)} · ${h(config.repositoryName)}</footer>`);
  await fs.writeFile(path.join(target, 'report.html'), report);
  if (!hasPublish) await fs.writeFile(path.join(target, 'index.html'), report);

  const summary = { ...metadata, pageUrl: `${pagesBase}/labs/${week}/`, sourceUrl, evidenceUrls,
    hasPublish, hasDemo, sourceEntries: (await meaningfulEntries(local(sourcePath))).length };
  summaries.push(summary);
  await fs.writeFile(path.join(target, 'submission.json'), JSON.stringify(summary, null, 2) + '\n');
  const mode = hasDemo ? 'เดโมแอป + หลักฐาน' : hasPublish ? 'เว็บแอป + หลักฐาน' : 'โค้ด + รายงาน + หลักฐาน';
  cards.push(`<article class="lab-card"><div class="card-top"><span class="week">${h(week)}</span><span class="pill">${h(metadata.kind === 'exam' ? 'สอบกลางภาค' : 'เผยแพร่แล้ว')}</span></div><h2>${h(metadata.title)}</h2><p class="muted">${h(mode)}</p><p>ผลตรวจ: <strong>${h(metadata.testSummary ?? metadata.testStatus)}</strong></p><div class="links">${link(`labs/${week}/`, hasPublish ? 'เปิดผลงาน' : 'ดูรายละเอียด', true)}${hasDemo ? link(`labs/${week}/app/`, 'ทดลองแอป') : ''}${link(`labs/${week}/report.html`, 'หลักฐาน')}${link(sourceUrl, 'Source')}</div>${metadata.submissionTag ? `<small class="version">${h(metadata.submissionTag)}</small>` : ''}</article>`);
}

const dashboard = shell(`ENGSE203 LAB Portfolio — ${config.studentId}`,
  `<small>ENGSE203 · Student LAB Repository</small><h1>LAB Portfolio</h1><p>${h(config.studentName)} · ${h(config.studentId)}</p><div class="profile"><span>${h(config.section)}</span><span>@${h(config.githubUsername)}</span><span>${summaries.length} สัปดาห์</span></div>`,
  `<div class="notice">รวมผลงาน LAB และสอบกลางภาค เปิดเว็บแอป ทดลองเดโม ดู Source Code และอ่านหลักฐานของแต่ละสัปดาห์ได้จากหน้านี้</div><section class="labs" aria-label="ผลงานแต่ละสัปดาห์">${cards.join('\n')}</section><footer>${link(repoUrl, 'GitHub Repository')} · ${h(config.repositoryName)}</footer>`);
await fs.writeFile(path.join(docsRoot, 'index.html'), dashboard);
await fs.writeFile(path.join(docsRoot, 'labs.json'), JSON.stringify(summaries, null, 2) + '\n');
console.log(`Build Pages Hub: PASS — ${summaries.length} weeks`);
console.log(`Preview: ${pagesBase}/`);
