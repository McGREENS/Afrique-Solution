import { NextRequest, NextResponse } from 'next/server';
import { initiatePayout, detectCorrespondent } from '@/lib/pawapay-payout';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, amount, payoutId } = body;

    if (!phone || !amount || !payoutId) {
      return NextResponse.json(
        { error: 'Missing required fields: phone, amount, payoutId' },
        { status: 400 }
      );
    }

    // Auto-detect correspondent and currency from phone number
    const paymentInfo = detectCorrespondent(phone);
    
    if (!paymentInfo) {
      return NextResponse.json(
        { error: 'Invalid phone number or unsupported country' },
        { status: 400 }
      );
    }

    console.log(`💸 Initiating payout to ${paymentInfo.country} - ${paymentInfo.correspondent}`);

    // Convert amount if Rwanda (USD to RWF)
    let finalAmount = parseFloat(amount);
    if (paymentInfo.currency === 'RWF') {
      finalAmount = Math.round(finalAmount * 1400); // 1 USD = 1400 RWF
      console.log(`💱 Converted ${amount} USD to ${finalAmount} RWF`);
    }

    // Initiate payout
    const result = await initiatePayout(
      phone,
      finalAmount,
      paymentInfo.currency,
      paymentInfo.correspondent,
      payoutId
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Payout initiated successfully',
        payoutId: result.payoutId,
        status: result.status,
        country: paymentInfo.country,
        correspondent: paymentInfo.correspondent,
        amount: finalAmount,
        currency: paymentInfo.currency
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        data: result.data
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Payout API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
