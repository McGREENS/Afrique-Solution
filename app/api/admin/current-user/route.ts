import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db/client";
import { getAdminEmailFromSession, isAdminSession } from "@/lib/admin-auth";

export async function GET() {
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

    const user = await db.execute({
      sql: "SELECT id, email, name, created_at FROM admin_users WHERE email = ?",
      args: [email],
    });

    if (!user.rows || user.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: user.rows[0] });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
