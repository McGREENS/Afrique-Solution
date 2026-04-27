# PawaPay Currency Conversion Implementation

## Problem Identified
PawaPay account configuration only supports:
- **DRC (COD)**: USD, CDF
- **Rwanda (RWA)**: RWF only (NOT USD)

When trying to charge USD for Rwanda customers, PawaPay rejected with:
```
"No active deposit flow configuration found for MTN_MOMO_RWA / RWA / USD"
```

## Solution Implemented
Automatic currency detection and conversion based on phone number country code.

### Currency Rules:
1. **Rwanda (250)**: Convert USD to RWF
   - Exchange rate: 1 USD = 1,400 RWF
   - Example: $7.80 → 10,920 RWF

2. **DRC (243)**: Keep USD
   - No conversion needed
   - Example: $7.80 → $7.80 USD

3. **Burundi (257)**: Not supported yet
   - Returns error message

### Correspondent Mapping:

#### Rwanda (RWF):
- `MTN_MOMO_RWA` - MTN Mobile Money (250-78, 250-79)
- `AIRTEL_RWA` - Airtel Money (250-72, 250-73)

#### DRC (USD):
- `VODACOM_MPESA_COD` - Vodacom M-Pesa (243-970 to 243-978)
- `AIRTEL_COD` - Airtel Money (243-974, 243-979, 243-990 to 243-999)
- `ORANGE_COD` - Orange Money (243-980 to 243-985)

## How It Works:

1. **Phone Number Detection**:
   - Extracts country code from phone number
   - 250 = Rwanda, 243 = DRC, 257 = Burundi

2. **Currency Selection**:
   - Rwanda → RWF (with conversion)
   - DRC → USD (no conversion)

3. **Amount Conversion**:
   - Rwanda: `amount_rwf = amount_usd * 1400`
   - DRC: `amount_usd = amount_usd` (unchanged)

4. **Correspondent Selection**:
   - Based on phone prefix (operator detection)
   - Automatic selection of correct mobile money provider

## Example Transactions:

### Rwanda Customer:
```
Input: $7.80 USD, Phone: 250780115764
Output: 10,920 RWF via MTN_MOMO_RWA
```

### DRC Customer:
```
Input: $10.00 USD, Phone: 243970123456
Output: $10.00 USD via VODACOM_MPESA_COD
```

## Transaction Limits:

### Rwanda (RWF):
- **MTN Mobile Money**: 5 - 2,000,000 RWF
- **Airtel Money**: 100 - 1,500,000 RWF

### DRC (USD):
- **Vodacom M-Pesa**: $0.50 - $2,500
- **Airtel Money**: $0.10 - $2,500
- **Orange Money**: $0.01 - $2,500

## Testing:
Run the test script to verify active correspondents:
```bash
node scripts/test-pawapay-correspondents.js
```

## Status:
✅ **PRODUCTION READY**
- Rwanda payments: RWF with auto-conversion
- DRC payments: USD (no conversion)
- Burundi: Not yet supported (requires PawaPay activation)
