import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";

export async function POST(req: NextRequest) {
  try {
    const { id, phone, message, direction } = await req.json();

    await db.execute({
      sql: `INSERT INTO whatsapp_messages (id, phone, message, direction, created_at) VALUES (?, ?, ?, ?, ?)`,
      args: [id, phone, message, direction, new Date().toISOString()]
    });

    console.log(`✅ Message tracked: ${direction} from ${phone}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Message tracking error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
