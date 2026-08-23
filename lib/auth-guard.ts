/**
 * Server-side auth guard for admin API routes.
 * Verifies the JWT cookie and returns null if valid,
 * or a 401 NextResponse if not.
 */
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "afrisol_admin_token";

function getSecret(): Uint8Array {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(s);
}

export async function requireAdmin(
  req: NextRequest
): Promise<NextResponse | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }
  try {
    await jwtVerify(token, getSecret());
    return null; // valid — proceed
  } catch {
    return NextResponse.json({ error: "Session expirée." }, { status: 401 });
  }
}
