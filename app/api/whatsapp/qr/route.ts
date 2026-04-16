import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for QR data (simple solution for demo)
let qrData = {
  qrString: '',
  status: 'disconnected',
  lastUpdate: ''
}

export async function GET() {
  try {
    console.log('QR API GET called, current data:', qrData)
    
    return NextResponse.json({
      qrString: qrData.qrString,
      status: qrData.status,
      lastUpdate: qrData.lastUpdate,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error in QR API GET:', error)
    return NextResponse.json(
      { error: 'Failed to get QR code' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { qrString, status } = body
    
    console.log('QR API POST called with:', { qrString: qrString?.substring(0, 50) + '...', status })
    
    qrData = {
      qrString: qrString || '',
      status: status || 'disconnected',
      lastUpdate: new Date().toISOString()
    }
    
    console.log('QR data updated:', { status: qrData.status, hasQR: !!qrData.qrString })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating QR data:', error)
    return NextResponse.json(
      { error: 'Failed to update QR code' },
      { status: 500 }
    )
  }
}