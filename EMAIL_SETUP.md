# Email Setup Instructions for Company Submission Form

The company submission form is now working and will log submissions to the console. To set up actual email delivery, follow one of these options:

## Option 1: EmailJS (Recommended for simple setup)

1. Go to [emailjs.com](https://www.emailjs.com/) and create a free account
2. Create an email service (Gmail, Outlook, etc.)
3. Create an email template
4. Get your Service ID, Template ID, and Public Key
5. Install EmailJS: `npm install @emailjs/browser`
6. Update the form to use EmailJS instead of the API route

## Option 2: Resend (Recommended for production)

1. Go to [resend.com](https://resend.com/) and create an account
2. Get your API key
3. Install Resend: `npm install resend`
4. Update `/app/api/submit-company/route.js` to use Resend:

```javascript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Replace the logging section with:
await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'william.hf.wakeford@gmail.com',
  subject: emailSubject,
  text: emailBody,
  replyTo: data.yourEmail
})
```

## Option 3: Web3Forms (Free, no signup required)

1. Go to [web3forms.com](https://web3forms.com/)
2. Enter your email to get a free access key
3. Update the API route to use the real access key instead of the placeholder

## Option 4: Netlify Forms (if deploying on Netlify)

1. Add `netlify` attribute to form
2. Add hidden form for Netlify to detect
3. No additional setup required

## Current Status

- ✅ Form UI is complete and styled
- ✅ Form validation is working
- ✅ API route is set up
- ⏳ Email service needs to be configured
- ✅ All submissions are logged to console for now

## Testing

1. Open http://localhost:3000
2. Click "SUBMIT COMPANY" button
3. Fill out the form and submit
4. Check the console logs to see the submission data
5. The form will show success message and reset

The form includes all requested fields:
- Company Name (required)
- Company Website (required)
- Company Twitter (optional)
- Your Name (required)
- Your Email (required)
- Message (required)

All fields are validated and the form matches your British Racing Green color scheme.
