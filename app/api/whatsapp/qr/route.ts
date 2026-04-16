import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// File path for QR data storage
const QR_DATA_FILE = path.join(process.cwd(), 'qr-data.json')

// Read QR data from file
function readQRData() {
  try {
    if (fs.existsSync(QR_DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(QR_DATA_FILE, 'utf8'))
      return data
    }
  } catch (error) {
    console.error('Error reading QR data:', error)
  }
  return { qrString: '', status: 'disconnected', lastUpdate: '' }
}

// Write QR data to file
function writeQRData(data: any) {
  try {
    fs.writeFileSync(QR_DATA_FILE, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error writing QR data:', error)
  }
}

export async function GET() {
  try {
    const qrData = readQRData()
    
    return NextResponse.json({
      qrString: qrData.qrString,
      status: qrData.status,
      lastUpdate: qrData.lastUpdate,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error in QR API:', error)
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
    
    const qrData = {
      qrString: qrString || '',
      status: status || 'disconnected',
      lastUpdate: new Date().toISOString()
    }
    
    writeQRData(qrData)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating QR data:', error)
    return NextResponse.json(
      { error: 'Failed to update QR code' },
      { status: 500 }
    )
  }
}