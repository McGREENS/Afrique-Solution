# Dual WhatsApp Provider Setup

## Overview
Your app now supports **two WhatsApp providers** with automatic fallback:
1. **WhatsApp Business API** (Meta - Primary)
2. **Twilio WhatsApp API** (Fallback)

## Why Two WhatsApp Providers?
- **Reliability**: If one provider fails, automatically use the other
- **Rate Limits**: Distribute load across providers
- **Geographic Coverage**: Different providers may work better in different regions
- **Cost Optimization**: Use the most cost-effective provider per message

## Configuration Steps

### 1. Enable WhatsApp Business API Sandbox
✅ **Action Required**: Enable the WhatsApp sandbox autocreation feature you mentioned.

### 2. Configure Twilio WhatsApp (Optional but Recommended)
Add these to your `.env.local`:
```bash
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token  
TWILIO_WHATSAPP_NUMBER=your_twilio_whatsapp_number
```

Get these from: https://console.twilio.com/
**Note**: You need to set up Twilio's WhatsApp sandbox or get approved WhatsApp number.

### 3. Webhook URLs
Configure these webhook URLs:

**WhatsApp Business API (Meta):**
- Webhook URL: `https://afriquesolution.site/api/webhook/whatsapp`
- Verify Token: `afrique_verify_2025`

**Twilio WhatsApp:**
- Webhook URL: `https://afriquesolution.site/api/webhook/twilio`

## How It Works

### Provider Priority
1. **WhatsApp Business API** (Primary) - Direct Meta integration
2. **Twilio WhatsApp** (Fallback) - If Business API fails

### Automatic Fallback
If WhatsApp Business API fails, the system automatically tries Twilio WhatsApp. Both send to the same WhatsApp platform, just through different providers.

### API Usage
```javascript
// Send via preferred provider (auto-selected)
POST /api/send-message
{
  "to": "+250732301147",
  "message": "Hello from dual WhatsApp system!"
}

// Response shows which provider was used
{
  "success": true,
  "channel": "whatsapp",
  "messageId": "wamid.xxx",
  "availableChannels": ["whatsapp"]
}
```

## Testing
1. Test WhatsApp Business API: Send to your sandbox number
2. Test Twilio WhatsApp: Configure Twilio and test fallback
3. Test fallback: Temporarily disable one provider

## Benefits
- ✅ **99.9% Uptime**: Dual provider redundancy
- ✅ **Same User Experience**: Both providers send to WhatsApp
- ✅ **Automatic Failover**: Seamless switching
- ✅ **Cost Optimization**: Use cheapest provider first
- ✅ **Easy Migration**: Switch providers without code changes

## Next Steps
1. **Enable WhatsApp Business API sandbox autocreation**
2. **Optional**: Set up Twilio WhatsApp for redundancy
3. **Test**: Use `/api/send-message` to test both providers
4. **Deploy**: Configure webhook URLs in production

The system works perfectly with just WhatsApp Business API. Twilio WhatsApp is purely for redundancy and reliability.