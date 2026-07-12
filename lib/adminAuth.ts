import crypto from "node:crypto";

export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

// Signed, expiring session token -- NOT the raw password. Previously the
// cookie value literally *was* process.env.ADMIN_PASSWORD, so anything that
// could read the cookie (a future XSS bug, a misconfigured proxy, a log
// line) would leak the actual login credential, not just a revocable
// session. Signing with HMAC over a random nonce + expiry means the cookie
// never contains the password itself, while still being verifiable without
// a database/session store.
function sign(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export function createAdminSessionToken(): string | null {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return null;
  const expiresAt = Date.now() + ADMIN_SESSION_DURATION_MS;
  const nonce = crypto.randomBytes(16).toString("hex");
  const payload = `${expiresAt}.${nonce}`;
  return `${payload}.${sign(payload, secret)}`;
}

export function isValidAdminSession(cookieValue: string | undefined): boolean {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret || !cookieValue) return false;

  const parts = cookieValue.split(".");
  if (parts.length !== 3) return false;
  const [expiresAtStr, nonce, signature] = parts;

  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  const expected = sign(`${expiresAtStr}.${nonce}`, secret);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  // Signature length is fixed (hex-encoded SHA-256), but guard anyway --
  // timingSafeEqual throws on mismatched lengths rather than returning false.
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
