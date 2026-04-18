import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    console.log('🔔 PawaPay Payouts Callback:', JSON.stringify(body, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      message: 'Payouts callback processed'
    });
    
  } catch (error) {
    console.error('❌ Payouts callback error:', error);
    return NextResponse.json(
      { success: false, error: 'Callback processing failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'PawaPay payouts callback endpoint active',
    timestamp: new Date().toISOString()
  });
}