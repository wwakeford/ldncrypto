'use client'

import { useState } from 'react'
import emailjs from '@emailjs/browser'

export default function SubmitCompanyModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    companyName: '',
    companyWebsite: '',
    companyTwitter: '',
    yourName: '',
    yourEmail: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('')

    try {
      // Get EmailJS configuration from environment variables
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

      // Debug: Log configuration (without sensitive data)
      console.log('EmailJS Configuration Check:', {
        serviceId: serviceId ? 'Present' : 'Missing',
        templateId: templateId ? 'Present' : 'Missing',
        publicKey: publicKey ? 'Present' : 'Missing'
      })

      if (!serviceId || !publicKey || !templateId) {
        const missingVars = []
        if (!serviceId) missingVars.push('NEXT_PUBLIC_EMAILJS_SERVICE_ID')
        if (!publicKey) missingVars.push('NEXT_PUBLIC_EMAILJS_PUBLIC_KEY') 
        if (!templateId) missingVars.push('NEXT_PUBLIC_EMAILJS_TEMPLATE_ID')
        throw new Error(`EmailJS configuration missing: ${missingVars.join(', ')}`)
      }

      // Prepare email parameters with all form data
      const emailParams = {
        to_email: 'william.hf.wakeford@gmail.com',
        company_name: formData.companyName,
        company_website: formData.companyWebsite,
        company_twitter: formData.companyTwitter || 'Not provided',
        submitter_name: formData.yourName,
        submitter_email: formData.yourEmail,
        submitter_message: formData.message,
        submission_date: new Date().toISOString(),
        subject: `New Company Submission: ${formData.companyName}`
      }

      // Send email using EmailJS
      console.log('Sending email with params:', {
        serviceId,
        templateId,
        emailParams: { ...emailParams, to_email: '[REDACTED]' }, // Hide email in logs
        publicKey: '[REDACTED]'
      })
      
      const result = await emailjs.send(
        serviceId,
        templateId,
        emailParams,
        publicKey
      )
      
      console.log('EmailJS send result:', result)

      setSubmitStatus('success')
      setFormData({
        companyName: '',
        companyWebsite: '',
        companyTwitter: '',
        yourName: '',
        yourEmail: '',
        message: ''
      })
      setTimeout(() => {
        onClose()
        setSubmitStatus('')
      }, 2000)

    } catch (error) {
      console.error('Error submitting form:', error)
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        ...error
      })
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: 'var(--warm-white)' }}
      >
        {/* Header */}
        <div 
          className="px-8 py-6 border-b"
          style={{ borderColor: 'var(--border-light)' }}
        >
          <div className="flex items-center justify-between">
            <h2 
              className="text-2xl font-bold tracking-tight"
              style={{ color: 'var(--british-racing-green)' }}
            >
              Submit a Company
            </h2>
            <button
              onClick={onClose}
              className="text-2xl font-light hover:opacity-70 transition-opacity"
              style={{ color: 'var(--slate-gray)' }}
            >
              ×
            </button>
          </div>
          <p 
            className="mt-2 text-sm"
            style={{ color: 'var(--slate-gray)' }}
          >
            Help us grow the London blockchain directory by submitting a company
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
          {/* Company Information */}
          <div className="space-y-4">
            <h3 
              className="text-lg font-semibold"
              style={{ color: 'var(--charcoal)' }}
            >
              Company Information
            </h3>
            
            <div>
              <label 
                htmlFor="companyName" 
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--charcoal)' }}
              >
                Company Name *
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                required
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-0"
                style={{ 
                  borderColor: 'var(--border-light)',
                  backgroundColor: 'var(--warm-white)',
                  color: 'var(--charcoal)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--sage-green)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                placeholder="Enter company name"
              />
            </div>

            <div>
              <label 
                htmlFor="companyWebsite" 
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--charcoal)' }}
              >
                Company Website *
              </label>
              <input
                type="url"
                id="companyWebsite"
                name="companyWebsite"
                required
                value={formData.companyWebsite}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-0"
                style={{ 
                  borderColor: 'var(--border-light)',
                  backgroundColor: 'var(--warm-white)',
                  color: 'var(--charcoal)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--sage-green)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                placeholder="https://company.com"
              />
            </div>

            <div>
              <label 
                htmlFor="companyTwitter" 
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--charcoal)' }}
              >
                Company Twitter/X
              </label>
              <input
                type="text"
                id="companyTwitter"
                name="companyTwitter"
                value={formData.companyTwitter}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-0"
                style={{ 
                  borderColor: 'var(--border-light)',
                  backgroundColor: 'var(--warm-white)',
                  color: 'var(--charcoal)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--sage-green)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                placeholder="@companyhandle or https://twitter.com/companyhandle"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 
              className="text-lg font-semibold"
              style={{ color: 'var(--charcoal)' }}
            >
              Your Information
            </h3>
            
            <div>
              <label 
                htmlFor="yourName" 
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--charcoal)' }}
              >
                Your Name *
              </label>
              <input
                type="text"
                id="yourName"
                name="yourName"
                required
                value={formData.yourName}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-0"
                style={{ 
                  borderColor: 'var(--border-light)',
                  backgroundColor: 'var(--warm-white)',
                  color: 'var(--charcoal)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--sage-green)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                placeholder="Your full name"
              />
            </div>

            <div>
              <label 
                htmlFor="yourEmail" 
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--charcoal)' }}
              >
                Your Email *
              </label>
              <input
                type="email"
                id="yourEmail"
                name="yourEmail"
                required
                value={formData.yourEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-0"
                style={{ 
                  borderColor: 'var(--border-light)',
                  backgroundColor: 'var(--warm-white)',
                  color: 'var(--charcoal)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--sage-green)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label 
                htmlFor="message" 
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--charcoal)' }}
              >
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-0 resize-vertical"
                style={{ 
                  borderColor: 'var(--border-light)',
                  backgroundColor: 'var(--warm-white)',
                  color: 'var(--charcoal)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--sage-green)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                placeholder="Tell us about the company, your relationship to it, and any additional information..."
              />
            </div>
          </div>

          {/* Submit Status */}
          {submitStatus === 'success' && (
            <div 
              className="p-4 rounded-lg border"
              style={{ 
                backgroundColor: 'var(--forest-mist)',
                borderColor: 'var(--sage-green)',
                color: 'var(--british-racing-green)'
              }}
            >
              ✓ Thank you! Your submission has been sent successfully.
            </div>
          )}

          {submitStatus === 'error' && (
            <div 
              className="p-4 rounded-lg border"
              style={{ 
                backgroundColor: '#fef2f2',
                borderColor: '#dc2626',
                color: '#dc2626'
              }}
            >
              ✗ There was an error submitting your form. Please try again.
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 text-sm font-medium border-2 rounded-lg transition-all duration-200 hover:opacity-80"
              style={{ 
                color: 'var(--slate-gray)',
                borderColor: 'var(--border-light)',
                backgroundColor: 'transparent'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 text-sm font-medium border-2 rounded-lg transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                color: 'white',
                borderColor: 'var(--british-racing-green)',
                backgroundColor: 'var(--british-racing-green)'
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Company'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
