import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      status: 'healthy',
      service: 'whatsapp-bot',
      timestamp: new Date().toISOString(),
      message: 'WhatsApp bot health check endpoint'
    });
    
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}