import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";

export async function POST(req: NextRequest) {
  try {
    const { page } = await req.json();
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    const visitId = `visit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await db.execute({
      sql: `INSERT INTO website_visits (id, page, ip, user_agent, created_at) VALUES (?, ?, ?, ?, ?)`,
      args: [visitId, page, ip, userAgent, new Date().toISOString()]
    });

    console.log(`✅ Visit tracked: ${page} from ${ip}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Visit tracking error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
