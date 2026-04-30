import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db/client";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session");

    if (!sessionCookie) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const [email] = sessionCookie.value.split(":");
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const user = await db.execute({
      sql: "SELECT id, password FROM admin_users WHERE email = ?",
      args: [email]
    });

    if (!user.rows || user.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentUser = user.rows[0] as any;
    const currentPasswordHash = crypto.createHash("sha256").update(currentPassword).digest("hex");

    if (currentPasswordHash !== currentUser.password) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }

    const newPasswordHash = crypto.createHash("sha256").update(newPassword).digest("hex");

    await db.execute({
      sql: "UPDATE admin_users SET password = ? WHERE id = ?",
      args: [newPasswordHash, currentUser.id]
    });

    return NextResponse.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
