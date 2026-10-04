import { test, before, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { loadSeed } from '../src/services/requestService.js';

let app;
before(async () => {
  await loadSeed();
  app = createApp();
});

const validRequest = {
  requesterName: 'ทดสอบ ระบบ',
  requestType: 'แจ้งซ่อม',
  location: 'C3-401',
  details: 'รายละเอียดยาวพอสมควรจริง',
  priority: 'normal',
};

/**
 * TODO W07-TEST (🏠 CP16) · เขียน test อย่างน้อย 6 เคส
 *
 * ที่ต้องมี
 *   1. GET /api/requests            → 200 และได้ array
 *   2. GET /api/requests/:id พบ      → 200
 *   3. GET /api/requests/:id ไม่พบ   → 404
 *   4. POST ข้อมูลถูกต้อง            → 201 และ status เป็น pending
 *   5. POST ข้อมูลไม่ครบ             → 400
 *   6. CORS header ตอบ origin ที่อนุญาต
 *
 * รันด้วย: npm test
 * ตัวอย่างโครง (ลบคอมเมนต์นี้แล้วเขียนจริง)
 */
describe('GET /api/requests', () => {
  test('คืนรายการทั้งหมด พร้อม status 200', async () => {
    const res = await request(app).get('/api/requests');
    assert.equal(res.status, 200);
    assert.ok(true, 'ยังไม่ได้เขียน test — ดู TODO W07-TEST');
  });
});

describe('GET /api/requests/:id', () => {
  test('เมื่อ ID มีอยู่ ต้องตอบ status 200', async () => {
    const res = await request(app)
      .get('/api/requests/REQ-001');

    assert.equal(res.status, 200);
    assert.equal(res.body.id, 'REQ-001');
  });

  test('เมื่อ ID ไม่มีอยู่ ต้องตอบ status 404', async () => {
    const res = await request(app)
      .get('/api/requests/REQ-999');

    assert.equal(res.status, 404);
    assert.ok(res.body.error);
  });
});

describe('POST /api/requests', () => {
  test('ข้อมูลถูกต้อง ต้องสร้างคำร้องสำเร็จด้วย status 201 และสถานะ pending', async () => {
    const newRequest = {
      requesterName: 'สมชาย ใจดี',
      requestType: 'แจ้งซ่อม',
      location: 'ห้องปฏิบัติการ 301',
      details: 'เครื่องปรับอากาศภายในห้องไม่ทำงาน',
      priority: 'normal',
    };

    const res = await request(app)
      .post('/api/requests')
      .send(newRequest);

    assert.equal(res.status, 201);
    assert.equal(res.body.status, 'pending');
    assert.ok(res.body.id);
  });

test('ข้อมูลไม่ครบ ต้องตอบ status 400', async () => {
    const invalidRequest = {
      requesterName: 'A',
    };

    const res = await request(app)
      .post('/api/requests')
      .send(invalidRequest);

    assert.equal(res.status, 400);
    assert.ok(res.body.error);
  });
});

describe('CORS', () => {
  test('origin ที่อนุญาต ต้องได้รับ Access-Control-Allow-Origin ที่ถูกต้อง', async () => {
    const res = await request(app)
      .get('/api/requests')
      .set('Origin', 'http://localhost:5173');

    assert.equal(res.status, 200);

    assert.equal(
      res.headers['access-control-allow-origin'],
      'http://localhost:5173'
    );
  });
});

