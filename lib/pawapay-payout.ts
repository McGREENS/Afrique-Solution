// PawaPay Payouts (B2C) - Send money to customers

const PAWAPAY_CONFIG = {
  API_TOKEN: process.env.PAWAPAY_API_TOKEN,
  BASE_URL: 'https://api.pawapay.io'
};

/**
 * Initiate payout to customer
 * @param {string} phone - Customer phone number
 * @param {number} amount - Amount to send
 * @param {string} currency - Currency (USD, RWF, etc)
 * @param {string} correspondent - Mobile money operator
 * @param {string} payoutId - Unique payout reference
 */
export async function initiatePayout(phone: string, amount: number, currency: string, correspondent: string, payoutId: string) {
  try {
    const requestBody = {
      payoutId: payoutId,
      amount: amount.toString(),
      currency: currency,
      correspondent: correspondent,
      recipient: {
        type: 'MSISDN',
        address: {
          value: phone.replace(/[^0-9]/g, '')
        }
      },
      customerTimestamp: new Date().toISOString(),
      statementDescription: 'Afrique Solution Payout'
    };

    console.log('💸 PawaPay Payout Request:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(`${PAWAPAY_CONFIG.BASE_URL}/payouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PAWAPAY_CONFIG.API_TOKEN}`
      },
      body: JSON.stringify(requestBody)
    });

    const result = await response.json();
    console.log('💸 PawaPay Payout Response:', JSON.stringify(result, null, 2));

    if (response.ok && (result.status === 'ACCEPTED' || result.status === 'SUBMITTED')) {
      return {
        success: true,
        status: result.status,
        payoutId: result.payoutId,
        data: result
      };
    } else {
      return {
        success: false,
        error: result.message || 'Payout failed',
        data: result
      };
    }
  } catch (error) {
    console.error('❌ PawaPay Payout Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Check payout status
 * @param {string} payoutId - Payout reference ID
 */
export async function checkPayoutStatus(payoutId: string) {
  try {
    const response = await fetch(`${PAWAPAY_CONFIG.BASE_URL}/payouts/${payoutId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PAWAPAY_CONFIG.API_TOKEN}`
      }
    });

    const result = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        status: result.status,
        data: result
      };
    } else {
      return {
        success: false,
        error: result.message || 'Failed to check status'
      };
    }
  } catch (error) {
    console.error('❌ Payout Status Check Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Detect correspondent from phone number
 */
export function detectCorrespondent(phone: string): { correspondent: string; currency: string; country: string } | null {
  const phoneStr = phone.replace(/[^0-9]/g, '');
  
  // Rwanda
  if (phoneStr.startsWith('250')) {
    if (phoneStr.startsWith('25078') || phoneStr.startsWith('25079')) {
      return { correspondent: 'MTN_MOMO_RWA', currency: 'RWF', country: 'Rwanda' };
    } else if (phoneStr.startsWith('25072') || phoneStr.startsWith('25073')) {
      return { correspondent: 'AIRTEL_RWA', currency: 'RWF', country: 'Rwanda' };
    }
    return { correspondent: 'MTN_MOMO_RWA', currency: 'RWF', country: 'Rwanda' };
  }
  
  // DRC
  if (phoneStr.startsWith('243')) {
    if (phoneStr.startsWith('243970') || phoneStr.startsWith('243971') || 
        phoneStr.startsWith('243972') || phoneStr.startsWith('243973') ||
        phoneStr.startsWith('243975') || phoneStr.startsWith('243976') ||
        phoneStr.startsWith('243977') || phoneStr.startsWith('243978')) {
      return { correspondent: 'VODACOM_MPESA_COD', currency: 'USD', country: 'DRC' };
    } else if (phoneStr.startsWith('243974') || phoneStr.startsWith('243979') ||
               phoneStr.startsWith('243990') || phoneStr.startsWith('243991') ||
               phoneStr.startsWith('243992') || phoneStr.startsWith('243993') ||
               phoneStr.startsWith('243994') || phoneStr.startsWith('243995') ||
               phoneStr.startsWith('243996') || phoneStr.startsWith('243997') ||
               phoneStr.startsWith('243998') || phoneStr.startsWith('243999')) {
      return { correspondent: 'AIRTEL_COD', currency: 'USD', country: 'DRC' };
    } else if (phoneStr.startsWith('243980') || phoneStr.startsWith('243981') ||
               phoneStr.startsWith('243982') || phoneStr.startsWith('243983') ||
               phoneStr.startsWith('243984') || phoneStr.startsWith('243985')) {
      return { correspondent: 'ORANGE_COD', currency: 'USD', country: 'DRC' };
    }
    return { correspondent: 'VODACOM_MPESA_COD', currency: 'USD', country: 'DRC' };
  }
  
  return null;
}
