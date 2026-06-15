import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db/client";
import {
  getAdminEmailFromSession,
  hashAdminPassword,
  isAdminSession,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session");

    if (!isAdminSession(sessionCookie?.value)) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const email = await getAdminEmailFromSession(sessionCookie?.value);
    if (!email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const user = await db.execute({
      sql: "SELECT id, password_hash FROM admin_users WHERE email = ?",
      args: [email],
    });

    if (!user.rows || user.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentUser = user.rows[0] as { id: string; password_hash: string };
    const currentPasswordHash = hashAdminPassword(currentPassword);

    if (currentPasswordHash !== currentUser.password_hash) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    const newPasswordHash = hashAdminPassword(newPassword);

    await db.execute({
      sql: "UPDATE admin_users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      args: [newPasswordHash, currentUser.id],
    });

    return NextResponse.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
