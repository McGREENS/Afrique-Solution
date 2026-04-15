# WhatsApp Web Setup Instructions

## 🚀 Quick Setup (2-Day Launch)

### Prerequisites
- ✅ WhatsApp Business App installed on your phone
- ✅ Business phone number (dedicated for this service)
- ✅ Node.js and npm installed

### Step 1: Install Dependencies
```bash
npm install whatsapp-web.js qrcode-terminal
```

### Step 2: Connect WhatsApp Business App
```bash
npm run whatsapp:connect
```

This will:
1. Open a browser window
2. Show a QR code in terminal
3. Wait for you to scan with WhatsApp Business App

### Step 3: Scan QR Code
1. Open **WhatsApp Business App** on your phone
2. Go to **Settings** > **Linked Devices**
3. Tap **"Link a Device"**
4. Scan the QR code from terminal/browser
5. Wait for "✅ WhatsApp Web Client is ready!" message

### Step 4: Start Your App
```bash
npm run dev
```

## 🎯 How It Works

### Customer Experience
1. Customer messages your **real business number**
2. Bot responds with language selection
3. Customer goes through normal flow
4. Payment instructions sent automatically

### Technical Flow
```
Customer Message → WhatsApp Web → Your Server → Bot Response → WhatsApp Web → Customer
```

## 📱 Phone Setup Requirements

### Dedicated Business Phone
- ✅ Use a **separate phone/tablet** for business
- ✅ Install **WhatsApp Business App** (not regular WhatsApp)
- ✅ Keep device **connected to internet**
- ✅ Keep WhatsApp Web session **active**

### Phone Number
- ✅ Use your **real business number** (+250732301147)
- ✅ Customers message this number directly
- ✅ No sandbox limitations
- ✅ Professional business profile

## 🔧 Troubleshooting

### QR Code Not Showing
```bash
# Clear cache and retry
rm -rf .wwebjs_auth
npm run whatsapp:connect
```

### Connection Lost
```bash
# Reconnect WhatsApp
npm run whatsapp:connect
```

### Messages Not Working
1. Check WhatsApp Web is connected
2. Check phone has internet
3. Check server is running (`npm run dev`)

## 🚀 Production Deployment

### Environment Variables
```bash
# Add to .env.local
NEXT_PUBLIC_WHATSAPP_NUMBER=+250732301147
NEXT_PUBLIC_SITE_URL=https://afriquesolution.site
```

### Server Setup
1. Deploy to Vercel/Railway/DigitalOcean
2. Run WhatsApp connection on server
3. Keep WhatsApp Web session alive
4. Monitor connection status

## 📊 Monitoring

### Check Connection Status
```bash
# In your app logs, look for:
✅ WhatsApp Web Client is ready!
📨 New message from +250XXXXXXX: Hello
```

### Customer Testing
1. Message your business number from different phone
2. Verify bot responds with language options
3. Test complete flow end-to-end

## 🔄 Migration to Meta API

When Meta approves your Business API:
1. Your code already supports both providers
2. Meta becomes primary, WhatsApp Web becomes fallback
3. No customer experience changes
4. Seamless transition

## ⚡ Quick Commands

```bash
# Setup everything
npm run whatsapp:setup

# Just connect (if already installed)
npm run whatsapp:connect

# Start development server
npm run dev

# Check if working
# Message your business number and check terminal logs
```

## 🎯 Success Checklist

- [ ] Dependencies installed
- [ ] QR code scanned successfully  
- [ ] "WhatsApp Web Client is ready!" message shown
- [ ] Test message from different phone works
- [ ] Bot responds with language selection
- [ ] Complete order flow tested
- [ ] Production deployment ready

## 🆘 Support

If you encounter issues:
1. Check phone internet connection
2. Restart WhatsApp connection script
3. Clear browser cache and retry
4. Ensure WhatsApp Business App is updated

**Ready to launch in 2 days!** 🚀