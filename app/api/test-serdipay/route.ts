import { NextResponse } from 'next/server';

export async function GET() {
  const API_ID = 'APIJVFVPHT';
  const MERCHANT_CODE = '415826';
  const PIN = '1234';

  const TOKEN_URL = 'https://serdipay.com/api/public-api/v1/merchant/get-token';
  const C2B_URL = 'https://serdipay.com/api/public-api/v1/merchant/payment-merchant';

  const results = {
    timestamp: new Date().toISOString(),
    tests: []
  };

  const tokenAttempts = [
    { name: 'API_ID only', body: { api_id: API_ID } },
    { name: 'API_ID + Merchant Code', body: { api_id: API_ID, merchant_code: MERCHANT_CODE } },
    { name: 'With PIN', body: { api_id: API_ID, merchant_code: MERCHANT_CODE, pin: PIN } }
  ];

  for (const attempt of tokenAttempts) {
    try {
      const response = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(attempt.body)
      });

      const result = await response.json();
      
      results.tests.push({
        type: 'Token Request',
        attempt: attempt.name,
        status: response.status,
        request: attempt.body,
        response: result
      });

      if (response.ok && result.token) {
        const paymentBody = {
          merchant_code: MERCHANT_CODE,
          phone: '243978993445',
          amount: 1,
          reference: 'TEST-' + Date.now(),
          description: 'Test payment'
        };

        const paymentResponse = await fetch(C2B_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${result.token}`
          },
          body: JSON.stringify(paymentBody)
        });

        const paymentResult = await paymentResponse.json();

        results.tests.push({
          type: 'Payment Request',
          status: paymentResponse.status,
          request: paymentBody,
          response: paymentResult
        });
      }
    } catch (error: any) {
      results.tests.push({
        type: 'Token Request',
        attempt: attempt.name,
        error: error.message
      });
    }
  }

  return NextResponse.json(results, { status: 200 });
}
