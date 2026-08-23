import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guard";
import { fetchSubscribers } from "@/lib/turso";

export async function GET(req: NextRequest) {
  const deny = await requireAdmin(req);
  if (deny) return deny;

  const { searchParams } = req.nextUrl;
  const page  = Math.max(1, Number(searchParams.get("page")  ?? 1));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 25)));
  const offset = (page - 1) * limit;

  try {
    const { subscribers, total } = await fetchSubscribers(limit, offset);
    return NextResponse.json({
      subscribers,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (e) {
    console.error("[/api/admin/subscribers]", e);
    return NextResponse.json({ error: "Erreur base de données." }, { status: 500 });
  }
}
