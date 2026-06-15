import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { isAdminSession } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  try {
    const session = req.cookies.get("admin_session");
    if (!isAdminSession(session?.value)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get actual counts from database
    const [totalMessages, totalVisits, uniqueCustomers, todayMessages] = await Promise.all([
      db.execute("SELECT COUNT(*) as count FROM whatsapp_messages WHERE direction = 'incoming'"),
      db.execute("SELECT COUNT(*) as count FROM website_visits"),
      db.execute("SELECT COUNT(DISTINCT phone) as count FROM whatsapp_messages"),
      db.execute(`
        SELECT COUNT(*) as count FROM whatsapp_messages 
        WHERE direction = 'incoming' 
        AND DATE(created_at) = DATE('now')
      `)
    ]);

    return NextResponse.json({
      stats: {
        totalMessages: totalMessages.rows[0].count,
        totalVisits: totalVisits.rows[0].count,
        uniqueCustomers: uniqueCustomers.rows[0].count,
        todayMessages: todayMessages.rows[0].count,
      }
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
