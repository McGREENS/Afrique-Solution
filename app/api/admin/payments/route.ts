import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";

export async function GET(req: NextRequest) {
  try {
    const session = req.cookies.get("admin_session");
    if (session?.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch from local database (populated by PawaPay callbacks)
    const payments = await db.execute(`
      SELECT * FROM orders 
      ORDER BY created_at DESC
    `);

    return NextResponse.json({
      payments: payments.rows
    });
  } catch (error) {
    console.error("Payments fetch error:", error);
    return NextResponse.json(
      { 
        payments: [],
        error: "Failed to fetch payments" 
      },
      { status: 200 }
    );
  }
}
