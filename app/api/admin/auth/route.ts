import { NextRequest, NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";

// ─── Config ───────────────────────────────────────────────────────────────────

const COOKIE_NAME = "afrisol_admin_token";
const MAX_AGE     = Number(process.env.JWT_EXPIRES_IN ?? 28800); // 8 hours

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

// ─── Rate limiter (in-memory, per IP) ─────────────────────────────────────────
// Resets on server restart — sufficient for a single-admin portal.
// Max 5 failed attempts per IP per 15-minute window.

interface RateEntry { attempts: number; resetAt: number }
const rateLimitMap = new Map<string, RateEntry>();
const WINDOW_MS    = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now   = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { attempts: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0 };
  }

  entry.attempts++;
  return { allowed: true, remaining: MAX_ATTEMPTS - entry.attempts };
}

function resetRateLimit(ip: string) {
  rateLimitMap.delete(ip);
}

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

// ─── POST /api/admin/auth — Login ─────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  const { allowed, remaining } = checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez dans 15 minutes." },
      { status: 429, headers: { "Retry-After": "900" } }
    );
  }

  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const { username, password } = body;

  // Constant-time comparison to prevent timing attacks
  const validUser = process.env.ADMIN_USERNAME ?? "";
  const validPass = process.env.ADMIN_PASSWORD ?? "";

  const userMatch = timingSafeEqual(username ?? "", validUser);
  const passMatch = timingSafeEqual(password ?? "", validPass);

  if (!userMatch || !passMatch) {
    return NextResponse.json(
      { error: "Identifiants incorrects.", attemptsLeft: remaining },
      { status: 401 }
    );
  }

  // Credentials valid — clear rate limit and issue JWT
  resetRateLimit(ip);

  const token = await new SignJWT({ sub: username, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(getSecret());

  const response = NextResponse.json({ ok: true });

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly:  true,
    secure:    process.env.NODE_ENV === "production",
    sameSite:  "strict",
    maxAge:    MAX_AGE,
    path:      "/",
  });

  return response;
}

// ─── GET /api/admin/auth — Verify session ─────────────────────────────────────

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return NextResponse.json({ authenticated: true, sub: payload.sub });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

// ─── DELETE /api/admin/auth — Logout ──────────────────────────────────────────

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge:   0,
    path:     "/",
  });
  return response;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Constant-time string comparison — prevents timing-based username/password enumeration.
 * Uses XOR across all characters regardless of early mismatch.
 */
function timingSafeEqual(a: string, b: string): boolean {
  const aBytes = new TextEncoder().encode(a);
  const bBytes = new TextEncoder().encode(b);

  // Pad the shorter array so lengths match without short-circuiting
  const len    = Math.max(aBytes.length, bBytes.length);
  const aPad   = new Uint8Array(len);
  const bPad   = new Uint8Array(len);
  aPad.set(aBytes);
  bPad.set(bBytes);

  let diff = aBytes.length ^ bBytes.length; // non-zero if lengths differ
  for (let i = 0; i < len; i++) {
    diff |= aPad[i] ^ bPad[i];
  }
  return diff === 0;
}
