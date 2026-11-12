import crypto from 'crypto';

const CURRENT_ITERATIONS = 210_000;
const KEY_LEN = 64;

/**
 * Hash a password with PBKDF2-SHA512 and a random salt.
 * Format: pbkdf2$<iterations>$<salt>$<hash>
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, CURRENT_ITERATIONS, KEY_LEN, 'sha512').toString('hex');
  return `pbkdf2$${CURRENT_ITERATIONS}$${salt}$${hash}`;
}

function safeCompareHex(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

/**
 * Verify a password against a stored hash. Supports the current versioned
 * format and the legacy `salt:hash` (1,000 iterations) format.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || typeof password !== 'string') return false;

  if (storedHash.startsWith('pbkdf2$')) {
    const [, iterStr, salt, expected] = storedHash.split('$');
    const iterations = parseInt(iterStr, 10);
    if (!iterations || !salt || !expected) return false;
    const actual = crypto.pbkdf2Sync(password, salt, iterations, KEY_LEN, 'sha512').toString('hex');
    return safeCompareHex(actual, expected);
  }

  if (storedHash.includes(':')) {
    const [salt, expected] = storedHash.split(':');
    if (!salt || !expected) return false;
    const actual = crypto.pbkdf2Sync(password, salt, 1000, KEY_LEN, 'sha512').toString('hex');
    return safeCompareHex(actual, expected);
  }

  // Plaintext values are no longer accepted.
  return false;
}

/** True when a stored hash should be upgraded to the current format after a successful login. */
export function needsRehash(storedHash: string): boolean {
  return !storedHash?.startsWith(`pbkdf2$${CURRENT_ITERATIONS}$`);
}
