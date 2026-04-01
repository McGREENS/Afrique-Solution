import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.SETUP_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.PAWAPAY_API_TOKEN ?? "";
  const baseUrl = process.env.PAWAPAY_BASE_URL ?? "https://api.sandbox.pawapay.io";

  // Test a real deposit call with PawaPay sandbox test number
  const body = {
    depositId: "test-" + Date.now() + "-0000-0000-0000-000000000000",
    payer: {
      type: "MMO",
      accountDetails: {
        phoneNumber: "243978654321",
        provider: "AIRTEL_MONEY_COD",
      },
    },
    amount: "100",
    currency: "CDF",
    clientReferenceId: "debug-test",
    customerMessage: "Afrique Solution",
  };

  const res = await fetch(`${baseUrl}/v2/deposits`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  return NextResponse.json({
    http_status: res.status,
    pawapay_response: data,
  });
}
