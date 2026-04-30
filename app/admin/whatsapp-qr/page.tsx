'use client'

import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import AdminLayout from '@/components/AdminLayout'

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
    <AdminLayout>
      <style jsx>{`
        .qr-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .qr-card {
          background: white;
          border-radius: 24px;
          border: 1px solid #11111a;
          box-shadow: 0 4px 0 #11111a;
          padding: 40px;
        }

        .section-header {
          display: inline-block;
          border-radius: 6px;
          background: #b4f75f;
          padding: 4px 8px;
          font-size: 28px;
          font-weight: 500;
          color: #11111a;
          margin-bottom: 32px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 12px 24px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 24px;
        }

        .status-waiting {
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #92400e;
        }

        .status-ready {
          background: #b4f75f;
          color: #11111a;
          border: 1px solid #11111a;
        }

        .status-connected {
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #065f46;
        }

        .qr-image-container {
          display: inline-block;
          padding: 20px;
          background: white;
          border: 2px solid #11111a;
          border-radius: 20px;
          margin-bottom: 24px;
        }

        .instructions {
          background: #fef3c7;
          border: 1px solid #92400e;
          border-radius: 16px;
          padding: 24px;
          margin-top: 24px;
        }

        .instructions h3 {
          font-size: 18px;
          font-weight: 600;
          color: #92400e;
          margin-bottom: 16px;
        }

        .instructions ol {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .instructions li {
          font-size: 15px;
          color: #92400e;
          margin-bottom: 8px;
          padding-left: 24px;
          position: relative;
        }

        .instructions li:before {
          content: "→";
          position: absolute;
          left: 0;
          font-weight: 600;
        }

        .success-container {
          text-align: center;
          padding: 60px 20px;
        }

        .success-icon {
          font-size: 80px;
          margin-bottom: 20px;
        }

        .success-title {
          font-size: 32px;
          font-weight: 600;
          color: #065f46;
          margin-bottom: 12px;
        }

        .success-text {
          font-size: 16px;
          color: #343438;
          margin-bottom: 24px;
        }

        .success-info {
          background: #d1fae5;
          border: 1px solid #065f46;
          border-radius: 16px;
          padding: 20px;
          display: inline-block;
        }

        .success-info p {
          font-size: 15px;
          color: #065f46;
          margin: 0;
        }

        .loading-container {
          text-align: center;
          padding: 60px 20px;
        }

        .spinner {
          display: inline-block;
          width: 48px;
          height: 48px;
          border: 4px solid #e5e5e5;
          border-top-color: #11111a;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .refresh-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: #b4f75f;
          color: #11111a;
          border: 2px solid #11111a;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 3px 0 #11111a;
          margin-top: 24px;
        }

        .refresh-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 0 #11111a;
        }

        .refresh-btn:active {
          transform: translateY(1px);
          box-shadow: 0 2px 0 #11111a;
        }

        .last-update {
          font-size: 13px;
          color: #343438;
          margin-top: 8px;
        }
      `}</style>

      <div className="qr-container">
        <h2 className="section-header">WhatsApp QR Code</h2>

        <div className="qr-card">
          <div style={{ textAlign: 'center' }}>
            <div className={`status-badge ${
              status.includes('Connected') ? 'status-connected' :
              status.includes('Ready') ? 'status-ready' :
              'status-waiting'
            }`}>
              {status}
            </div>
            {lastUpdate && (
              <p className="last-update">
                Last updated: {lastUpdate}
              </p>
            )}
          </div>

          {qrImage ? (
            <div style={{ textAlign: 'center' }}>
              <div className="qr-image-container">
                <img 
                  src={qrImage} 
                  alt="WhatsApp QR Code" 
                  style={{ width: '300px', height: '300px', display: 'block' }}
                />
              </div>
              
              <div className="instructions">
                <h3>📱 How to scan:</h3>
                <ol>
                  <li>Open WhatsApp Business app on your phone</li>
                  <li>Go to Settings → Linked Devices</li>
                  <li>Tap "Link a Device"</li>
                  <li>Scan the QR code above</li>
                  <li>Wait for connection confirmation</li>
                </ol>
              </div>
            </div>
          ) : status.includes('Connected') ? (
            <div className="success-container">
              <div className="success-icon">✅</div>
              <h2 className="success-title">WhatsApp Connected!</h2>
              <p className="success-text">
                Your bot is now live and ready to receive messages
              </p>
              <div className="success-info">
                <p>
                  <strong>Test your bot:</strong> Send a message to +250792593786
                </p>
              </div>
            </div>
          ) : (
            <div className="loading-container">
              <div className="spinner"></div>
              <p style={{ fontSize: '16px', color: '#343438' }}>Waiting for QR code...</p>
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={fetchQRCode}
              className="refresh-btn"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}