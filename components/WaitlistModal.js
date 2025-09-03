'use client'

import { useState } from 'react'
import emailjs from '@emailjs/browser'

export default function WaitlistModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
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

      // Prepare email parameters for waitlist signup
      const emailParams = {
        to_email: 'william.hf.wakeford@gmail.com',
        subject: 'New People Directory Waitlist Signup',
        user_name: formData.name,
        user_email: formData.email,
        submitter_name: formData.name,
        submitter_email: formData.email,
        submitter_message: `New waitlist signup for the People Directory feature.\n\nName: ${formData.name}\nEmail: ${formData.email}\n\nThe user is interested in being notified when the People Directory launches.`,
        submission_date: new Date().toISOString()
      }

      // Initialize EmailJS
      try {
        emailjs.init(publicKey)
        console.log('EmailJS initialized successfully')
      } catch (initError) {
        console.error('EmailJS initialization error:', initError)
      }

      // Send email using EmailJS
      console.log('Sending waitlist email with params:', {
        serviceId,
        templateId,
        emailParams: { ...emailParams, to_email: '[REDACTED]' },
        publicKey: '[REDACTED]'
      })
      
      let result
      try {
        console.log('About to call emailjs.send for waitlist...')
        result = await emailjs.send(
          serviceId,
          templateId,
          emailParams,
          publicKey
        )
        console.log('EmailJS call completed successfully for waitlist')
      } catch (emailError) {
        console.error('EmailJS send failed for waitlist:', emailError)
        
        if (emailError.status === 400) {
          throw new Error(`EmailJS Bad Request (400): ${emailError.text || 'Invalid parameters or template'}`)
        } else if (emailError.status === 401) {
          throw new Error(`EmailJS Unauthorized (401): ${emailError.text || 'Invalid public key or service ID'}`)
        } else if (emailError.status === 404) {
          throw new Error(`EmailJS Not Found (404): ${emailError.text || 'Service or template not found'}`)
        } else if (emailError.status === 422) {
          throw new Error(`EmailJS Unprocessable Entity (422): ${emailError.text || 'Template variables issue'}`)
        } else {
          throw new Error(`EmailJS Error (${emailError.status || 'Unknown'}): ${emailError.text || emailError.message || 'Unknown error'}`)
        }
      }
      
      console.log('EmailJS send result for waitlist:', result)

      setSubmitStatus('success')
      setFormData({
        name: '',
        email: ''
      })
      
      setTimeout(() => {
        onClose()
        setSubmitStatus('')
      }, 2000)

    } catch (error) {
      console.error('Error submitting waitlist signup:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{ 
        background: 'linear-gradient(rgba(232, 240, 230, 0.8), rgba(232, 240, 230, 0.8)), white'
      }}
    >
      <div 
        className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
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
              People Directory
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
            Coming Soon - Join our waitlist for early access
          </p>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          <div className="text-center mb-6">
            <div 
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--forest-mist)' }}
            >
              <span className="text-2xl">👥</span>
            </div>
            <h3 
              className="text-xl font-semibold mb-3"
              style={{ color: 'var(--charcoal)' }}
            >
              Building London's Crypto People Directory
            </h3>
            <p 
              className="text-sm leading-relaxed mb-6"
              style={{ color: 'var(--slate-gray)' }}
            >
              We're creating a comprehensive directory of crypto professionals in London. 
              Join our waitlist to get early access and connect with the most influential 
              people in London's blockchain ecosystem.
            </p>
          </div>

          {/* Waitlist Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label 
                htmlFor="name" 
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--charcoal)' }}
              >
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
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
                htmlFor="email" 
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--charcoal)' }}
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
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

            {/* Submit Status */}
            {submitStatus === 'success' && (
              <div 
                className="p-4 rounded-lg border text-center"
                style={{ 
                  backgroundColor: 'var(--forest-mist)',
                  borderColor: 'var(--sage-green)',
                  color: 'var(--british-racing-green)'
                }}
              >
                ✓ Thank you! You've been added to the waitlist. We'll be in touch soon!
              </div>
            )}

            {submitStatus === 'error' && (
              <div 
                className="p-4 rounded-lg border text-center"
                style={{ 
                  backgroundColor: '#fef2f2',
                  borderColor: '#dc2626',
                  color: '#dc2626'
                }}
              >
                ✗ There was an error adding you to the waitlist. Please try again.
              </div>
            )}

            {/* Buttons */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 text-sm font-medium border-2 rounded-lg transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  color: 'white',
                  borderColor: 'var(--british-racing-green)',
                  backgroundColor: 'var(--british-racing-green)'
                }}
              >
                {isSubmitting ? 'Joining...' : 'Join Waitlist'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
