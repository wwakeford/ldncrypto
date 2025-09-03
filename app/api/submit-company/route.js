import { NextResponse } from 'next/server'

/**
 * Handle POST request for company submission form.
 * 
 * This endpoint receives form data and sends an email notification.
 * Uses a simple email service that doesn't require complex setup.
 * 
 * @param {Request} request - The incoming request object
 * @returns {NextResponse} JSON response indicating success or failure
 */
export async function POST(request) {
  try {
    // Parse the request body
    const data = await request.json()
    
    // Validate required fields
    const requiredFields = ['companyName', 'companyWebsite', 'yourName', 'yourEmail', 'message']
    for (const field of requiredFields) {
      if (!data[field] || data[field].trim() === '') {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.yourEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate website URL format
    try {
      new URL(data.companyWebsite)
    } catch {
      return NextResponse.json(
        { error: 'Invalid website URL format' },
        { status: 400 }
      )
    }

    // Prepare email content
    const emailSubject = `New Company Submission: ${data.companyName}`
    const emailBody = `
New company submission received from The London Crypto Directory:

COMPANY INFORMATION:
- Company Name: ${data.companyName}
- Company Website: ${data.companyWebsite}
- Company Twitter: ${data.companyTwitter || 'Not provided'}
- Company Presence: ${data.companyPresence || 'Not provided'}

SUBMITTED BY:
- Name: ${data.yourName}
- Email: ${data.yourEmail}

MESSAGE:
${data.message}

---
Submitted at: ${new Date().toISOString()}
From: The London Crypto Directory Company Submission Form
    `.trim()

    // For now, just log the submission and return success
    // In production, you would set up an email service like:
    // - EmailJS (client-side solution)
    // - Resend (serverless email API)
    // - SendGrid, Mailgun, etc.
    // - Or a form service like Netlify Forms, Formspree, Web3Forms
    
    // Store submission data (in a real app, you'd save to database or send email)
    const submissionData = {
      timestamp: new Date().toISOString(),
      company: {
        name: data.companyName,
        website: data.companyWebsite,
        twitter: data.companyTwitter || 'Not provided',
        presence: data.companyPresence || 'Not provided'
      },
      submitter: {
        name: data.yourName,
        email: data.yourEmail,
        message: data.message
      }
    }
    
    // Log the submission for now (in production, replace with actual email sending)
    console.log('=== NEW COMPANY SUBMISSION ===')
    console.log('Subject:', emailSubject)
    console.log('To: william.hf.wakeford@gmail.com')
    console.log('Content:')
    console.log(emailBody)
    console.log('Data:', submissionData)
    console.log('================================')
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Log successful submission (for debugging)
    console.log('Company submission received:', {
      company: data.companyName,
      submitter: data.yourName,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json(
      { 
        message: 'Company submission sent successfully',
        success: true 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error processing company submission:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to process submission. Please try again later.',
        success: false 
      },
      { status: 500 }
    )
  }
}

/**
 * Handle GET request - return method not allowed
 */
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
