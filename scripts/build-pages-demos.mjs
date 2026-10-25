import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { ROOT, listLabs, readJson, exists, escapeHtml } from './common.mjs';

for (const week of await listLabs()) {
  const labRoot = path.join(ROOT, 'labs', week);
  const metadata = await readJson(path.join(labRoot, 'lab-metadata.json'));
  if (metadata.publishOnPages === false || !metadata.frontendPath) continue;
  const frontend = path.join(ROOT, metadata.frontendPath);
  const require = createRequire(path.join(frontend, 'package.json'));
  const { build } = await import(pathToFileURL(require.resolve('vite')).href);
  const seed = await readJson(path.join(frontend, 'public/data/initialRequests.json'));
  const key = `engse203-pages-${week}-requests-v1`;
  const source = `${metadata.sourcePath}/frontend/src/services/apiClient.js`;
  const client = path.join(ROOT, source);
  if (!(await exists(client))) throw new Error(`Missing API client: ${source}`);
  await build({
    root: frontend,
    base: './',
    mode: 'pages',
    define: { __PAGES_SEED__: JSON.stringify(seed), __PAGES_STORAGE_KEY__: JSON.stringify(key) },
    plugins: [
      {
        name: 'pages-browser-api',
        enforce: 'pre',
        resolveId(id, importer) {
          if (importer && id.startsWith('.')
            && path.resolve(path.dirname(importer.split('?')[0]), id) === client) {
            return path.join(ROOT, 'scripts/pages/demo-client.js');
          }
        },
        transform(code, id) {
          const file = id.split('?')[0];
          if (file === path.join(frontend, 'src/services/requestService.js')) {
            return code.replace(/export async function resetRequests\(\)\s*\{[^}]*\}/,
              "export async function resetRequests() { return apiFetch('/api/demo/reset', { method: 'POST' }); }");
          }
          if (file === path.join(frontend, 'src/components/AppHeader.jsx')) {
            return code.replace('ENGSE203 • LAB 05', `ENGSE203 • LAB ${week.slice(-2)}`);
          }
        },
      },
      {
        name: 'pages-demo-notice',
        transformIndexHtml(html) {
          const note = `<aside style="padding:12px 18px;background:#fff5d8;color:#3b310e;font:14px/1.6 Tahoma,Arial,sans-serif;border-bottom:1px solid #dfc875"><strong>${escapeHtml(week)} · เดโมบน GitHub Pages</strong> — ทดลองหน้าจอด้วยข้อมูลในเบราว์เซอร์ของคุณ การเชื่อมฐานข้อมูลและการยืนยันตัวตนดูได้ในโค้ด API ต้นฉบับ <a href="../" style="color:#154e75">ดูรายละเอียดและหลักฐาน</a> · <button id="pages-reset" type="button">คืนข้อมูลตัวอย่าง</button></aside>`;
          const reset = `<script>document.getElementById('pages-reset').addEventListener('click',()=>{try{localStorage.removeItem(${JSON.stringify(key)})}catch{}location.reload()})</script>`;
          return html.replace(/<title>[^<]*<\/title>/, `<title>Campus Service Request · ${week}</title>`)
            .replace(/<body([^>]*)>/, `<body$1>${note}`).replace('</body>', `${reset}</body>`);
        },
      },
    ],
    build: { outDir: path.join(labRoot, 'publish/app'), emptyOutDir: true },
  });
  console.log(`Pages demo: ${week}`);
}
