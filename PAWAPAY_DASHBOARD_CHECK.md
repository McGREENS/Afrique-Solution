# PawaPay Dashboard Investigation

## What to Check:

### 1. WALLETS PAGE
Go to: Finances → Wallets

Look for:
- How many wallets do you see?
- What are the wallet names?
- What currencies are shown?
- Is there a "Status" column? (Active/Inactive/Pending)
- Is there a "Type" or "Owner" column?

Take a screenshot if possible.

---

### 2. DEPOSITS PAGE
Go to: Transactions → Deposits

Filter by:
- Phone: 250780115764 (the working number)
- Check the status of these deposits

Then filter by:
- Any other Rwanda number you tested
- Check the status and failure reasons

---

### 3. SYSTEM CONFIGURATION
Go to: System Configuration → Callback URLs

Check:
- Are there any callback URLs configured?
- What endpoints are set up?

---

### 4. API TOKENS
Go to: System Configuration → API Tokens

Check:
- How many tokens do you have?
- What are their names/descriptions?
- Is there a "Type" or "Environment" column? (Production/Test/Sandbox)

---

## KEY QUESTIONS:

1. In "Wallets" - do you see separate wallets for Rwanda and DRC?
2. In "Deposits" - can you see the deposit we just made (250780115764)?
3. What does it show as the status?
4. Are there any deposits from other numbers that failed?

Please share what you see in these sections.
