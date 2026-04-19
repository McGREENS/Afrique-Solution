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
    
    console.log('QR API POST called with:', { 
      hasQrString: !!qrString, 
      qrLength: qrString?.length || 0,
      status 
    })
    
    // Smart update logic - preserve QR string unless explicitly provided
    if (qrString) {
      // New QR code provided
      qrData = {
        qrString: qrString,
        status: status || 'qr_ready',
        lastUpdate: new Date().toISOString()
      }
    } else if (status) {
      // Status update only - preserve existing QR
      qrData = {
        qrString: status === 'connected' || status === 'authenticated' ? '' : qrData.qrString,
        status: status,
        lastUpdate: new Date().toISOString()
      }
    }
    
    console.log('QR data updated:', { 
      status: qrData.status, 
      hasQR: !!qrData.qrString, 
      qrLength: qrData.qrString.length 
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating QR data:', error)
    return NextResponse.json(
      { error: 'Failed to update QR code' },
      { status: 500 }
    )
  }
}