# EmailJS Setup Instructions

Your EmailJS integration is now **almost complete**! Here's what I've done and what you need to do to finish the setup:

## ✅ What's Already Done

1. **Installed EmailJS package** (`@emailjs/browser`)
2. **Updated SubmitCompanyModal.js** to use EmailJS instead of the API route
3. **Created environment variables setup**
4. **Prepared all the form data** to be sent via email

## 🔧 What You Need to Do

### Step 1: Get Your EmailJS Public Key
1. Go to your EmailJS dashboard: https://dashboard.emailjs.com/
2. Navigate to the **"API Keys"** section
3. Copy your **Public Key**

### Step 2: Create a Simple Email Template (REQUIRED)
Even though you said you don't need a template, EmailJS still requires one. Here's how to create a simple one:

1. In your EmailJS dashboard, go to **"Email Templates"**
2. Click **"Create New Template"**
3. Use this simple template content:

```
Subject: {{subject}}

New Company Submission from MEMPOOL.LDN:

COMPANY INFORMATION:
- Company Name: {{company_name}}
- Company Website: {{company_website}}
- Company Twitter: {{company_twitter}}

SUBMITTED BY:
- Name: {{submitter_name}}
- Email: {{submitter_email}}

MESSAGE:
{{submitter_message}}

---
Submitted at: {{submission_date}}
```

4. **Save the template** and copy the **Template ID**

### Step 3: Set Up Environment Variables
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and replace the placeholder values:
   ```
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_06edj25
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_actual_public_key_here
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_actual_template_id_here
   ```

### Step 4: Test the Setup
1. Start your development server: `npm run dev`
2. Open http://localhost:3000
3. Click "SUBMIT COMPANY" button
4. Fill out and submit the form
5. Check your email inbox!

## 📧 Email Configuration

The emails will be sent to: **william.hf.wakeford@gmail.com**

The form includes these fields that will be sent in the email:
- Company Name
- Company Website  
- Company Twitter/X (optional)
- Submitter Name
- Submitter Email
- Message
- Submission Date

## 🛠️ Template Variables Available

When creating your EmailJS template, you can use these variables:
- `{{to_email}}` - Recipient email
- `{{company_name}}` - Company name
- `{{company_website}}` - Company website
- `{{company_twitter}}` - Company Twitter handle
- `{{submitter_name}}` - Submitter's name
- `{{submitter_email}}` - Submitter's email
- `{{submitter_message}}` - Submitter's message
- `{{submission_date}}` - Timestamp
- `{{subject}}` - Email subject line

## 🚨 Important Notes

1. The old API route (`/api/submit-company/route.js`) is no longer used
2. All email sending now happens directly from the frontend using EmailJS
3. Make sure your `.env.local` file is not committed to git (it's already in .gitignore)
4. The form will show success/error messages based on EmailJS response

## 🐛 Troubleshooting

If emails aren't sending:
1. Check browser console for errors
2. Verify all environment variables are set correctly
3. Make sure your EmailJS service is properly configured
4. Check that your template ID matches exactly
5. Ensure your EmailJS account has sufficient quota

That's it! Once you complete these steps, your company submission form will send emails directly to your inbox. 🎉
