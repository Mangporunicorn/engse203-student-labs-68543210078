/**
 * password.js — เก็บรหัสผ่านอย่างปลอดภัยด้วย scrypt
 */
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const KEY_LENGTH = 64;

export function hashPassword(plain) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(plain, salt, KEY_LENGTH).toString('hex');

  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(plain, stored) {
  try {
    if (typeof stored !== 'string') {
      return false;
    }

    const [scheme, salt, hash] = stored.split('$');

    if (
      scheme !== 'scrypt' ||
      !salt ||
      !hash ||
      !/^[0-9a-f]+$/i.test(hash) ||
      hash.length % 2 !== 0
    ) {
      return false;
    }

    const expected = Buffer.from(hash, 'hex');

    if (expected.length === 0) {
      return false;
    }

    const actual = scryptSync(
      plain,
      salt,
      expected.length
    );

    if (actual.length !== expected.length) {
      return false;
    }

    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}
