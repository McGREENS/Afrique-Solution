// SerdiPay API Integration

const SERDIPAY_CONFIG = {
  API_ID: process.env.SERDIPAY_API_ID || 'APIJVFVPHT',
  MERCHANT_CODE: process.env.SERDIPAY_MERCHANT_CODE || '415826',
  PIN: process.env.SERDIPAY_PIN || '1234',
  TOKEN_URL: 'https://serdipay.com/api/public-api/v1/merchant/get-token',
  C2B_URL: 'https://serdipay.com/api/public-api/v1/merchant/payment-merchant',
  CALLBACK_URL: process.env.NEXT_PUBLIC_SITE_URL + '/api/payment/callback'
};

// Cache token to avoid requesting it every time
let cachedToken = null;
let tokenExpiry = null;

/**
 * Get authentication token from SerdiPay
 */
export async function getSerdiPayToken() {
  // Return cached token if still valid
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  try {
    const response = await fetch(SERDIPAY_CONFIG.TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        api_id: SERDIPAY_CONFIG.API_ID,
        merchant_code: SERDIPAY_CONFIG.MERCHANT_CODE,
        pin: SERDIPAY_CONFIG.PIN
      })
    });

    const result = await response.json();

    if (response.ok && result.token) {
      cachedToken = result.token;
      // Cache token for 50 minutes (assuming 1 hour expiry)
      tokenExpiry = Date.now() + (50 * 60 * 1000);
      return result.token;
    }

    console.error('SerdiPay token error:', result);
    return null;
  } catch (error) {
    console.error('SerdiPay token request failed:', error);
    return null;
  }
}

/**
 * Initiate C2B payment request
 * @param {string} phone - Customer phone number (243...)
 * @param {number} amount - Amount in USD
 * @param {string} orderId - Unique order reference
 * @param {string} description - Payment description
 */
export async function initiateSerdiPayPayment(phone, amount, orderId, description) {
  try {
    // Get authentication token
    const token = await getSerdiPayToken();
    
    if (!token) {
      return {
        status: 'FAILED',
        error: 'Unable to get authentication token'
      };
    }

    // Prepare payment request
    const paymentData = {
      merchant_code: SERDIPAY_CONFIG.MERCHANT_CODE,
      phone: phone.replace(/[^0-9]/g, ''), // Remove non-numeric characters
      amount: parseFloat(amount).toFixed(2),
      reference: orderId,
      description: description || 'Afrique Solution Payment',
      callback_url: SERDIPAY_CONFIG.CALLBACK_URL
    };

    console.log('SerdiPay payment request:', {
      ...paymentData,
      phone: phone.slice(0, 6) + '******' // Mask phone for logs
    });

    const response = await fetch(SERDIPAY_CONFIG.C2B_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(paymentData)
    });

    const result = await response.json();

    console.log('SerdiPay payment response:', {
      status: response.status,
      result: result
    });

    if (response.ok) {
      return {
        status: 'ACCEPTED',
        data: result
      };
    } else {
      return {
        status: 'FAILED',
        error: result.message || 'Payment request failed',
        data: result
      };
    }
  } catch (error) {
    console.error('SerdiPay payment error:', error);
    return {
      status: 'FAILED',
      error: error.message
    };
  }
}
