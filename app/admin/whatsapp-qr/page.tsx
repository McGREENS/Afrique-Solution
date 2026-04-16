'use client'

import { useState, useEffect } from 'react'
import QRCode from 'qrcode'

export default function WhatsAppQRPage() {
  const [qrString, setQrString] = useState('')
  const [qrImage, setQrImage] = useState('')
  const [status, setStatus] = useState('Checking connection...')
  const [lastUpdate, setLastUpdate] = useState('')

  // Generate QR code image from string
  const generateQRImage = async (qrString: string) => {
    try {
      const qrDataURL = await QRCode.toDataURL(qrString, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      setQrImage(qrDataURL)
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  // Fetch QR code from API
  const fetchQRCode = async () => {
    try {
      const response = await fetch('/api/whatsapp/qr')
      const data = await response.json()
      
      if (data.qrString) {
        setQrString(data.qrString)
        setStatus('QR Code Ready - Scan with WhatsApp Business')
        setLastUpdate(new Date().toLocaleString())
        await generateQRImage(data.qrString)
      } else if (data.status === 'authenticated') {
        setStatus('✅ WhatsApp Connected Successfully!')
        setQrImage('')
      } else {
        setStatus('Waiting for QR code...')
      }
    } catch (error) {
      setStatus('Error connecting to WhatsApp service')
      console.error('Error fetching QR code:', error)
    }
  }

  // Auto-refresh every 5 seconds
  useEffect(() => {
    fetchQRCode()
    const interval = setInterval(fetchQRCode, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              WhatsApp Business Setup
            </h1>
            <p className="text-gray-600">
              Scan the QR code below with your WhatsApp Business app
            </p>
          </div>

          <div className="text-center mb-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
              {status}
            </div>
            {lastUpdate && (
              <p className="text-xs text-gray-500 mt-2">
                Last updated: {lastUpdate}
              </p>
            )}
          </div>

          {qrImage ? (
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-xl shadow-sm">
                <img 
                  src={qrImage} 
                  alt="WhatsApp QR Code" 
                  className="w-64 h-64 mx-auto"
                />
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">
                  📱 How to scan:
                </h3>
                <ol className="text-sm text-yellow-700 text-left space-y-1">
                  <li>1. Open WhatsApp <strong>Business</strong> app on your phone</li>
                  <li>2. Go to Settings → Linked Devices</li>
                  <li>3. Tap "Link a Device"</li>
                  <li>4. Scan the QR code above</li>
                  <li>5. Wait for connection confirmation</li>
                </ol>
              </div>
            </div>
          ) : status.includes('Connected') ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">
                WhatsApp Connected!
              </h2>
              <p className="text-gray-600">
                Your bot is now live and ready to receive messages
              </p>
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700">
                  <strong>Test your bot:</strong> Send a message to +250792593786
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Waiting for QR code...</p>
            </div>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={fetchQRCode}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}