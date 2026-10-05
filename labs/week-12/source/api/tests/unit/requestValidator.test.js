import { describe, test, expect } from 'vitest';
import {
  validateRequestInput,
  isValidStatus,
} from '../../src/validators/requestValidator.js';

// ข้อมูลที่ถูกต้องทุกช่อง
const valid = {
  requesterName: 'สมชาย ใจดี',
  requestType: 'แจ้งซ่อม',
  location: 'ห้อง 301',
  details: 'แอร์ไม่เย็นตั้งแต่เช้า',
  priority: 'normal',
};

const withField = (patch) => ({ ...valid, ...patch });

describe('validateRequestInput — ข้อมูลถูกต้อง', () => {
  test('ทุกช่องถูกต้อง → ไม่มี error', () => {
    expect(validateRequestInput(valid)).toEqual([]);
  });
});

describe('validateRequestInput — รายละเอียด (ค่าขอบ 10 ตัวอักษร)', () => {
  test('9 ตัวอักษร → error', () => {
    expect(
      validateRequestInput(withField({ details: '123456789' }))
    ).toHaveLength(1);
  });

  test('10 ตัวอักษร → ผ่าน (ตรงขอบพอดี)', () => {
    expect(
      validateRequestInput(withField({ details: '1234567890' }))
    ).toEqual([]);
  });

  test('11 ตัวอักษร → ผ่าน', () => {
    expect(
      validateRequestInput(withField({ details: '12345678901' }))
    ).toEqual([]);
  });

  test('ช่องว่างล้วน → error', () => {
    expect(
      validateRequestInput(withField({ details: '          ' }))
    ).toHaveLength(1);
  });
});

describe('validateRequestInput — ชื่อผู้แจ้ง', () => {
  test('1 ตัวอักษร → error', () => {
    expect(
      validateRequestInput(withField({ requesterName: 'ก' }))
    ).toHaveLength(1);
  });

  test('2 ตัวอักษร → ผ่าน', () => {
    expect(
      validateRequestInput(withField({ requesterName: 'กข' }))
    ).toEqual([]);
  });
});

describe('validateRequestInput — ประเภทและความเร่งด่วน', () => {
  test('ประเภทนอกรายการ → error', () => {
    expect(
      validateRequestInput(withField({ requestType: 'งานทั่วไป' }))
    ).toContain('ประเภทคำร้องไม่ถูกต้อง');
  });

  test('priority high → error', () => {
    expect(
      validateRequestInput(withField({ priority: 'high' }))
    ).toContain('ความเร่งด่วนต้องเป็น normal หรือ urgent');
  });
});

describe('validateRequestInput — input ผิดรูปแบบ', () => {
  test.each([null, undefined, 'text', 42, []])(
    'input = %j → error เดียว',
    (input) => {
      expect(validateRequestInput(input)).toEqual([
        'ต้องส่งข้อมูลคำร้องมาด้วย',
      ]);
    }
  );
});

describe('isValidStatus', () => {
  test('"pending" → true', () => {
    expect(isValidStatus('pending')).toBe(true);
  });

  test('"done" → false', () => {
    expect(isValidStatus('done')).toBe(false);
  });
});
