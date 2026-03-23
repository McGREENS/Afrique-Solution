import { PaymentMethod } from "@/types";

const FLW_URL = "https://api.flutterwave.com/v3/charges";

const networkMap: Record<PaymentMethod, { network: string; country: string; currency: string }> = {
  airtel_money: { network: "AIRTEL",  country: "CD", currency: "CDF" },
  mpesa:        { network: "MPESA",   country: "CD", currency: "CDF" },
  orange_money: { network: "ORANGE",  country: "CD", currency: "CDF" },
};

export interface ChargeResult {
  success: boolean;
  flw_ref?: string;
  message: string;
}

export async function initiateCharge(params: {
  orderId: string;
  phone: string;
  amount: number;
  currency: string;
  network: string;
  country: string;
  email: string;
}): Promise<ChargeResult> {
  const res = await fetch(`${FLW_URL}?type=mobile_money_${params.country.toLowerCase()}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
    },
    body: JSON.stringify({
      tx_ref: params.orderId,
      amount: params.amount,
      currency: params.currency,
      email: params.email,
      phone_number: params.phone,
      network: params.network,
    }),
  });

  const data = await res.json();

  if (data.status === "success") {
    return { success: true, flw_ref: data.data?.flw_ref, message: data.message };
  }
  return { success: false, message: data.message ?? "Payment initiation failed" };
}

export function getNetworkInfo(method: PaymentMethod, region: string) {
  const base = networkMap[method];
  // Adjust country/currency per region
  if (region === "rwanda") return { ...base, country: "RW", currency: "RWF" };
  if (region === "burundi") return { ...base, country: "BI", currency: "BIF" };
  return base;
}
