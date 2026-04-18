import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    console.log('🔔 PawaPay Deposits Callback:', JSON.stringify(body, null, 2));
    
    const {
      depositId,
      status,
      requestedAmount,
      depositedAmount,
      currency,
      correspondent,
      payer,
      created,
      failureReason
    } = body;
    
    console.log(`💰 Payment ${depositId}: ${status}`);
    
    if (status === 'COMPLETED') {
      console.log(`✅ Payment successful: ${depositedAmount} ${currency}`);
      
      // TODO: Send WhatsApp confirmation
      // TODO: Activate service (Canal+, DSTV, etc.)
      // TODO: Update database
      
    } else if (status === 'FAILED') {
      console.log(`❌ Payment failed: ${failureReason}`);
      
      // TODO: Send WhatsApp failure notification
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Deposits callback processed',
      depositId 
    });
    
  } catch (error) {
    console.error('❌ Deposits callback error:', error);
    return NextResponse.json(
      { success: false, error: 'Callback processing failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'PawaPay deposits callback endpoint active',
    timestamp: new Date().toISOString()
  });
}