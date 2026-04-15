# Online Deployment Guide

## 🚀 Deploy Your WhatsApp Bot Online

Your bot can be deployed online using your **existing Meta Business API credentials**. No phone required!

## **Option 1: Vercel (Recommended)** ⭐

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
vercel --prod
```

### Step 4: Set Environment Variables
In Vercel dashboard, add these environment variables:

```
WHATSAPP_PHONE_NUMBER_ID=1079018468626430
WHATSAPP_TOKEN=EAAaX9ZAnnYEkBRC6QZAZAf5CBqPhs1Lkv2FIMMaiNYbXJF4lGNKJH0spF29jCGLgdmKltDDIDXNZCONLkOcR2uA2GrvHBVUcIN2zotYgjoF2s6en6g3rFJ41oFvkTtJ98ZAqlZA71S0hjv1oq2hy3kvB2RmR9N5iDwtEwrw7vwRlAZAlH2x67XAWSZC1FPxJjO7hg6DYkHnBhxOvSh3Hmj0TeX7VqeRmSqzBfGKwGAs9i1yjkHlYhZBBs6pRkT7DelFhDY09L81EZCo4hG58V8zhW3VMEmpYSRTodY5Na2lAZDZD
WHATSAPP_VERIFY_TOKEN=afrique_verify_2025
TURSO_DATABASE_URL=libsql://afriquesolution-laurier.aws-us-east-1.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzQ1NTM3NjksImlkIjoiMDE5ZDJiYTMtMmIwMS03NWQ4LTk2NWMtMGNiZTNhMWM1ZGY1IiwicmlkIjoiZTUzMDVhZjUtY2I4Mi00ODUyLWJlZDktMzUxNmY3OWRkOWZmIn0.ZZN38Vur8VvWTNucu_NPS474n08wZ5ifEnqWHHsDZDSSwV-dXX2szxmmjwC8BHkcyh0LeIPeg_daIg3XpKwPCQ
PAWAPAY_API_TOKEN=eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjE4NTc2IiwibWF2IjoiMSIsImV4cCI6MjA5MTUzNjE5MCwiaWF0IjoxNzc1OTE2OTkwLCJwbSI6IkRBRixQQUYiLCJqdGkiOiJmY2FmYjc0ZS1hMzZkLTQ2NmItYTQ5My00YTA2MjFjMjdhYjYifQ.-sc3k3rhPUaFlgOV71DtD7X_E9QZAKz5HByLZbchzZTWMIk79uECuFLcMwtnfVAabXNAwqUD5cYx0AhAFtefYQ
PAWAPAY_BASE_URL=https://api.sandbox.pawapay.io
NEXT_PUBLIC_WHATSAPP_NUMBER=+250792593786
NEXT_PUBLIC_SITE_URL=https://your-app-name.vercel.app
SETUP_SECRET=afrique_setup_2025
```

### Step 5: Configure Meta Webhook
In Meta Business Manager:
1. Go to WhatsApp > Configuration
2. Set Webhook URL: `https://your-app-name.vercel.app/api/webhook/whatsapp`
3. Set Verify Token: `afrique_verify_2025`

## **Option 2: Railway** 🚂

### Step 1: Connect GitHub
1. Push your code to GitHub
2. Go to railway.app
3. Connect your GitHub repository

### Step 2: Deploy
Railway will automatically deploy from your GitHub repo.

### Step 3: Set Environment Variables
Add the same environment variables as above in Railway dashboard.

## **Option 3: DigitalOcean App Platform** 🌊

### Step 1: Create App
1. Go to DigitalOcean App Platform
2. Connect your GitHub repository
3. Choose Node.js environment

### Step 2: Configure
- Build Command: `npm run build`
- Run Command: `npm start`
- Add environment variables

## **Testing Your Online Bot**

### Step 1: Verify Deployment
Visit: `https://your-domain.com/api/debug`

Should return: `{"status": "ok", "timestamp": "..."}`

### Step 2: Test Webhook
Send a message to your WhatsApp Business number (+250792593786)

### Step 3: Check Logs
Monitor your deployment logs for:
```
📨 New message from +250XXXXXXX: Hello
✅ Response sent successfully
```

## **Production Checklist**

- [ ] Environment variables configured
- [ ] Meta webhook URL updated
- [ ] Database connection working
- [ ] PawaPay integration active
- [ ] Test message flow end-to-end
- [ ] Monitor error logs
- [ ] Set up domain (optional)

## **Webhook URLs for Different Platforms**

**Vercel:**
```
https://your-app-name.vercel.app/api/webhook/whatsapp
```

**Railway:**
```
https://your-app-name.up.railway.app/api/webhook/whatsapp
```

**DigitalOcean:**
```
https://your-app-name.ondigitalocean.app/api/webhook/whatsapp
```

## **Advantages of Online Deployment**

✅ **No Phone Required**: Uses Meta Business API directly  
✅ **24/7 Uptime**: Always available  
✅ **Scalable**: Handles multiple customers  
✅ **Professional**: Official WhatsApp Business API  
✅ **Reliable**: No connection issues  
✅ **Real Pricing**: Your Canal+ tariffs included  
✅ **PawaPay Ready**: Automatic payments  

## **Next Steps**

1. **Deploy to Vercel** (easiest)
2. **Update Meta webhook URL**
3. **Test with real customers**
4. **Monitor and optimize**

Your bot will work exactly like the local version but online 24/7!

## **Support**

If you encounter issues:
1. Check deployment logs
2. Verify environment variables
3. Test webhook URL manually
4. Check Meta Business API status