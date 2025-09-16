import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

// --- Access Token ---
export function signAccessToken(payload: object, expiresIn = "30m") {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn });
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, ACCESS_SECRET) as any;
  } catch {
    return null;
  }
}

// --- Refresh Token ---
export function signRefreshToken(payload: object, expiresIn = "30d") {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn });
}

export function verifyRefreshToken(token: string) {
  try {
    return jwt.verify(token, REFRESH_SECRET) as any;
  } catch {
    return null;
  }
}