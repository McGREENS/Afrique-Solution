import { NextRequest, NextResponse } from "next/server";
import { initSchema } from "@/lib/db/schema";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.SETUP_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await initSchema();
  return NextResponse.json({ ok: true, message: "Schema initialized" });
}
