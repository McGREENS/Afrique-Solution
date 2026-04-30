import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";

export async function GET(req: NextRequest) {
  try {
    const session = req.cookies.get("admin_session");
    if (session?.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [totalOrders, completedOrders, pendingOrders, failedOrders, totalUsers, recentOrders] = await Promise.all([
      db.execute("SELECT COUNT(*) as count FROM orders"),
      db.execute("SELECT COUNT(*) as count FROM orders WHERE status = 'paid'"),
      db.execute("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'"),
      db.execute("SELECT COUNT(*) as count FROM orders WHERE status = 'failed'"),
      db.execute("SELECT COUNT(*) as count FROM users"),
      db.execute(`
        SELECT o.*, u.phone 
        FROM orders o 
        LEFT JOIN users u ON o.user_id = u.phone 
        ORDER BY o.created_at DESC 
        LIMIT 10
      `)
    ]);

    return NextResponse.json({
      stats: {
        totalOrders: totalOrders.rows[0].count,
        completedOrders: completedOrders.rows[0].count,
        pendingOrders: pendingOrders.rows[0].count,
        failedOrders: failedOrders.rows[0].count,
        totalUsers: totalUsers.rows[0].count,
      },
      recentOrders: recentOrders.rows
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
