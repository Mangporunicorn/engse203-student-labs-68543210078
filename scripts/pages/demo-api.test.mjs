import test from 'node:test';
import assert from 'node:assert/strict';
import { createDemoApi } from './demo-api.mjs';

const seed = [{ id: 'REQ-001', requesterName: 'ตัวอย่าง', requestType: 'แจ้งซ่อม', location: '301',
  details: 'เครื่องปรับอากาศไม่เย็น', priority: 'normal', status: 'pending' }];
const store = () => {
  const data = new Map();
  return { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
};
const valid = { requesterName: 'ทดสอบ', requestType: 'แจ้งซ่อม', location: '302', details: 'อุปกรณ์ในห้องมีปัญหา', priority: 'urgent' };

test('CRUD survives reopening the demo and does not mutate seed data', async () => {
  const storage = store();
  const api = createDemoApi({ seed, storage, key: 'week-07' });
  const created = await api('/api/requests', { method: 'POST', body: JSON.stringify(valid) });
  assert.equal(created.id, 'REQ-002');
  await api(`/api/requests/${created.id}`, { method: 'PUT', body: JSON.stringify({ status: 'completed' }) });
  const reopened = createDemoApi({ seed, storage, key: 'week-07' });
  assert.equal((await reopened(`/api/requests/${created.id}`)).status, 'completed');
  assert.equal((await reopened('/api/requests?status=completed')).length, 1);
  assert.equal(await reopened(`/api/requests/${created.id}`, { method: 'DELETE' }), null);
  assert.equal((await reopened('/api/requests')).length, 1);
  assert.equal(seed.length, 1);
  assert.equal(seed[0].status, 'pending');
});

test('different weeks keep separate browser data', async () => {
  const storage = store();
  const first = createDemoApi({ seed, storage, key: 'week-07' });
  const other = createDemoApi({ seed, storage, key: 'week-13' });
  await first('/api/requests/REQ-001', { method: 'DELETE' });
  assert.equal((await first('/api/requests')).length, 0);
  assert.equal((await other('/api/requests')).length, 1);
});

test('the form request types work and reset restores the original dataset', async () => {
  const storage = store();
  const api = createDemoApi({ seed, storage, key: 'test' });
  await api('/api/requests', { method: 'POST', body: JSON.stringify({ ...valid, requestType: 'ขอใช้ห้อง' }) });
  assert.equal((await api('/api/requests')).length, 2);
  assert.deepEqual(await api('/api/demo/reset', { method: 'POST' }), seed);
  const reopened = createDemoApi({ seed, storage, key: 'test' });
  assert.deepEqual(await reopened('/api/requests'), seed);
});

test('invalid requests and missing IDs preserve error status semantics', async () => {
  const api = createDemoApi({ seed, storage: store(), key: 'test' });
  await assert.rejects(api('/api/requests', { method: 'POST', body: '{}' }), { status: 400 });
  await assert.rejects(api('/api/requests/REQ-001', { method: 'PUT', body: '{"status":"unknown"}' }), { status: 400 });
  await assert.rejects(api('/api/requests/REQ-999'), { status: 404 });
  await assert.rejects(api('/api/requests/REQ-999', { method: 'DELETE' }), { status: 404 });
});

test('corrupted or unavailable browser storage recovers to usable seed data', async () => {
  const corrupt = createDemoApi({ seed, storage: { getItem: () => '{broken' }, key: 'test' });
  assert.equal((await corrupt('/api/requests')).length, 1);
  const unavailable = createDemoApi({ seed, key: 'test' });
  await unavailable('/api/requests', { method: 'POST', body: JSON.stringify(valid) });
  assert.equal((await unavailable('/api/requests')).length, 2);
});
