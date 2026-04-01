import { PaymentMethod } from "@/types";
import { randomUUID } from "crypto";

const BASE_URL = process.env.PAWAPAY_BASE_URL ?? "https://api.sandbox.pawapay.io";

// PawaPay provider codes per payment method + region
const providerMap: Record<PaymentMethod, Record<string, string>> = {
  airtel_money: { drc: "AIRTEL_COD",        rwanda: "AIRTEL_RWA",    burundi: "" },
  mpesa:        { drc: "VODACOM_MPESA_COD",  rwanda: "MTN_MOMO_RWA", burundi: "" },
  orange_money: { drc: "ORANGE_COD",         rwanda: "",              burundi: "" },
};

const currencyMap: Record<string, string> = {
  drc:     "CDF",
  rwanda:  "RWF",
  burundi: "BIF",
};

export interface DepositResult {
  success: boolean;
  depositId?: string;
  message: string;
}

export async function initiateDeposit(params: {
  orderId: string;
  phone: string;
  amount: number;
  paymentMethod: PaymentMethod;
  region: string;
}): Promise<DepositResult> {
  const provider = providerMap[params.paymentMethod]?.[params.region];
  const currency = currencyMap[params.region];

  if (!provider) {
    return { success: false, message: `Payment method not available in ${params.region}` };
  }

  const depositId = randomUUID();
  // Sanitize phone: remove + and leading zeros, keep country code
  const phone = params.phone.replace(/\D/g, "").replace(/^0+/, "");

  const body = {
    depositId,
    payer: {
      type: "MMO",
      accountDetails: {
        phoneNumber: phone,
        provider,
      },
    },
    amount: String(params.amount),
    currency,
    clientReferenceId: params.orderId,
    customerMessage: "Afrique Solution",
  };

  const res = await fetch(`${BASE_URL}/v2/deposits`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.PAWAPAY_API_TOKEN}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (data.status === "ACCEPTED") {
    return { success: true, depositId, message: "Payment initiated" };
  }

  const reason = data.failureReason?.failureMessage ?? data.status ?? "Unknown error";
  return { success: false, message: reason };
}
