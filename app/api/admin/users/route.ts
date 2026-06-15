import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { isAdminSession } from "@/lib/admin-auth";
import crypto from "crypto";

// Hash password using SHA256
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// GET - Fetch all admin users
export async function GET(req: NextRequest) {
  try {
    const session = req.cookies.get("admin_session");
    if (!isAdminSession(session?.value)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await db.execute(
      "SELECT id, email, name, created_at FROM admin_users ORDER BY created_at DESC"
    );

    return NextResponse.json({ users: result.rows });
  } catch (error) {
    console.error("Users fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST - Create new admin user
export async function POST(req: NextRequest) {
  try {
    const session = req.cookies.get("admin_session");
    if (!isAdminSession(session?.value)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, name, password } = await req.json();

    if (!email || !name || !password) {
      return NextResponse.json(
        { error: "Email, name, and password are required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await db.execute({
      sql: "SELECT id FROM admin_users WHERE email = ?",
      args: [email]
    });

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const passwordHash = hashPassword(password);

    await db.execute({
      sql: `INSERT INTO admin_users (id, email, name, password_hash, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [id, email, name, passwordHash, new Date().toISOString(), new Date().toISOString()]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("User create error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

// PUT - Update admin user
export async function PUT(req: NextRequest) {
  try {
    const session = req.cookies.get("admin_session");
    if (!isAdminSession(session?.value)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const { email, name, password } = await req.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: "Email and name are required" },
        { status: 400 }
      );
    }

    // Check if email is taken by another user
    const existing = await db.execute({
      sql: "SELECT id FROM admin_users WHERE email = ? AND id != ?",
      args: [email, id]
    });

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // Update with or without password
    if (password) {
      const passwordHash = hashPassword(password);
      await db.execute({
        sql: `UPDATE admin_users SET email = ?, name = ?, password_hash = ?, updated_at = ? WHERE id = ?`,
        args: [email, name, passwordHash, new Date().toISOString(), id]
      });
    } else {
      await db.execute({
        sql: `UPDATE admin_users SET email = ?, name = ?, updated_at = ? WHERE id = ?`,
        args: [email, name, new Date().toISOString(), id]
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE - Delete admin user
export async function DELETE(req: NextRequest) {
  try {
    const session = req.cookies.get("admin_session");
    if (!isAdminSession(session?.value)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Prevent deleting the last admin
    const count = await db.execute("SELECT COUNT(*) as count FROM admin_users");
    if (count.rows && count.rows[0] && (count.rows[0] as any).count <= 1) {
      return NextResponse.json(
        { error: "Cannot delete the last admin user" },
        { status: 400 }
      );
    }

    await db.execute({
      sql: "DELETE FROM admin_users WHERE id = ?",
      args: [id]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("User delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
