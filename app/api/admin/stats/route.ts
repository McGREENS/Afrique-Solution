import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guard";
import { fetchStats } from "@/lib/turso";

export async function GET(req: NextRequest) {
  const deny = await requireAdmin(req);
  if (deny) return deny;

  try {
    const stats = await fetchStats();
    return NextResponse.json(stats);
  } catch (e) {
    console.error("[/api/admin/stats]", e);
    return NextResponse.json({ error: "Erreur base de données." }, { status: 500 });
  }
}
