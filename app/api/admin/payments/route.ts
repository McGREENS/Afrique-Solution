import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";

export async function GET(req: NextRequest) {
  try {
    const session = req.cookies.get("admin_session");
    if (session?.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await db.execute(
      "SELECT * FROM manual_payments ORDER BY created_at DESC"
    );

    return NextResponse.json({ payments: result.rows });
  } catch (error) {
    console.error("Payments fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = req.cookies.get("admin_session");
    if (session?.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { service, package_name, amount, phone } = await req.json();
    const id = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await db.execute({
      sql: `INSERT INTO manual_payments (id, service, package_name, amount, phone, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [id, service, package_name, parseFloat(amount), phone, new Date().toISOString()]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment add error:", error);
    return NextResponse.json(
      { error: "Failed to add payment" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = req.cookies.get("admin_session");
    if (session?.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Payment ID required" }, { status: 400 });
    }

    await db.execute({
      sql: "DELETE FROM manual_payments WHERE id = ?",
      args: [id]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete payment" },
      { status: 500 }
    );
  }
}
