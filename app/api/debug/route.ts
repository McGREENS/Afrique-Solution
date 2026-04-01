import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.SETUP_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.PAWAPAY_API_TOKEN ?? "";
  const baseUrl = process.env.PAWAPAY_BASE_URL ?? "https://api.sandbox.pawapay.io";

  const res = await fetch(`${baseUrl}/v2/active-conf`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  return NextResponse.json(data);
}
