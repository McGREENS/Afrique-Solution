import { NextRequest, NextResponse } from 'next/server';
import { initiateSerdiPayPayment } from '@/lib/serdipay';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, amount, orderId, description } = body;

    // Validate required fields
    if (!phone || !amount || !orderId) {
      return NextResponse.json(
        { error: 'Missing required fields: phone, amount, orderId' },
        { status: 400 }
      );
    }

    // Validate phone number (must be DRC - 243)
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone.startsWith('243')) {
      return NextResponse.json(
        { error: 'SerdiPay only supports DRC phone numbers (243)' },
        { status: 400 }
      );
    }

    // Initiate payment
    const result = await initiateSerdiPayPayment(
      cleanPhone,
      amount,
      orderId,
      description
    );

    if (result.status === 'ACCEPTED') {
      return NextResponse.json({
        success: true,
        status: 'ACCEPTED',
        message: 'Payment request sent successfully',
        data: result.data
      });
    } else {
      return NextResponse.json({
        success: false,
        status: 'FAILED',
        error: result.error,
        data: result.data
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('SerdiPay API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
