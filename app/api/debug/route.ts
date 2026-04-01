import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.SETUP_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.PAWAPAY_API_TOKEN ?? "";

  return NextResponse.json({
    pawapay_token_length: token.length,
    pawapay_token_prefix: token.substring(0, 20),
    pawapay_base_url: process.env.PAWAPAY_BASE_URL,
  });
}
