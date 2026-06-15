import { db } from "@/lib/db/client";
import crypto from "crypto";

export function isAdminSession(value: string | undefined): boolean {
  if (!value) return false;
  return value === "authenticated" || value.includes("@");
}

export function hashAdminPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

/** Resolve admin email from session cookie (supports legacy "authenticated" value). */
export async function getAdminEmailFromSession(
  cookieValue: string | undefined
): Promise<string | null> {
  if (!cookieValue) return null;

  if (cookieValue === "authenticated") {
    const result = await db.execute({
      sql: "SELECT email FROM admin_users ORDER BY created_at ASC LIMIT 1",
    });
    const row = result.rows[0] as { email?: string } | undefined;
    return row?.email ?? null;
  }

  if (cookieValue.includes("@")) {
    return cookieValue.split(":")[0];
  }

  return null;
}
