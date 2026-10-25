// Browser-only adapter used exclusively in the GitHub Pages build.
// The coursework API and its authentication remain in their original source files.
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function createDemoApi({ seed, storage, key }) {
  const clone = (value) => structuredClone(value);
  const statuses = ['pending', 'in-progress', 'completed'];
  let memory = clone(seed);
  const read = () => {
    try {
      const saved = JSON.parse(storage?.getItem(key) ?? 'null');
      if (Array.isArray(saved) && saved.every((r) => r && typeof r.id === 'string'
        && typeof r.details === 'string' && statuses.includes(r.status))) memory = saved;
    } catch { /* Recover from unavailable storage or malformed JSON. */ }
    return clone(memory);
  };
  const save = (rows) => {
    memory = clone(rows);
    try { storage?.setItem(key, JSON.stringify(rows)); } catch { /* Keep this tab usable. */ }
  };
  return async function apiFetch(route, options = {}) {
    const url = new URL(route, 'https://pages-demo.invalid');
    const method = (options.method ?? 'GET').toUpperCase();
    if (url.pathname === '/api/demo/reset' && method === 'POST') {
      save(clone(seed));
      return clone(seed);
    }
    const match = url.pathname.match(/^\/api\/requests(?:\/([^/]+))?$/);
    if (!match) throw new ApiError('ไม่พบเส้นทางนี้ในเดโม', 404);
    const rows = read();
    const id = match[1] ? decodeURIComponent(match[1]) : null;
    const index = rows.findIndex((row) => row.id === id);
    if (method === 'GET') {
      if (id) {
        if (index < 0) throw new ApiError('ไม่พบคำร้องนี้', 404);
        return rows[index];
      }
      const status = url.searchParams.get('status');
      return status ? rows.filter((row) => row.status === status) : rows;
    }
    let body;
    try { body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body; }
    catch { throw new ApiError('รูปแบบข้อมูลไม่ถูกต้อง', 400); }
    if (method === 'POST' && !id) {
      const text = (field) => typeof body?.[field] === 'string' ? body[field].trim() : '';
      const data = Object.fromEntries(['requesterName', 'requestType', 'location', 'details', 'priority']
        .map((field) => [field, text(field)]));
      if (data.requesterName.length < 2 || data.requesterName.length > 100
        || !data.location || data.location.length > 100
        || data.details.length < 10 || data.details.length > 1000
        || !['แจ้งซ่อม', 'บริการบัญชีผู้ใช้', 'ขอใช้ห้อง', 'ขอใช้อุปกรณ์', 'อื่น ๆ'].includes(data.requestType)
        || !['normal', 'urgent'].includes(data.priority)) {
        throw new ApiError('กรุณากรอกข้อมูลคำร้องให้ครบและตรวจสอบความยาวข้อความ', 400);
      }
      const next = Math.max(0, ...rows.map((row) => Number(row.id.replace(/^REQ-/, '')) || 0)) + 1;
      const created = { ...data, id: `REQ-${String(next).padStart(3, '0')}`,
        status: 'pending', createdAt: new Date().toISOString() };
      save([...rows, created]);
      return clone(created);
    }
    if (id && index < 0) throw new ApiError('ไม่พบคำร้องนี้', 404);
    if (method === 'PUT' && id) {
      if (!statuses.includes(body?.status)) throw new ApiError('สถานะไม่ถูกต้อง', 400);
      rows[index] = { ...rows[index], status: body.status };
      save(rows);
      return clone(rows[index]);
    }
    if (method === 'DELETE' && id) {
      rows.splice(index, 1);
      save(rows);
      return null;
    }
    throw new ApiError('ไม่รองรับคำขอนี้ในเดโม', 405);
  };
}
