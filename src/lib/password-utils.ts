import crypto from 'crypto';

/**
 * Hash a password using PBKDF2 with a cryptographically secure random salt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify a plaintext password against a stored PBKDF2 hash
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash) return false;
  
  if (!storedHash.includes(':')) {
    // Fallback for legacy plain text passwords if any
    return storedHash === password;
  }

  const [salt, expectedHash] = storedHash.split(':');
  if (!salt || !expectedHash) return false;

  const actualHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(actualHash), Buffer.from(expectedHash));
}
