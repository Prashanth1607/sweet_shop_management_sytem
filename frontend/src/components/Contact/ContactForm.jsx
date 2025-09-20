import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useContact } from '../../hooks/useContact'

const ContactForm = ({ isBulkOrder = false, onClose }) => {
  const { submitContactForm } = useContact()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    
    try {
      await submitContactForm({
        ...data,
        is_bulk_order: isBulkOrder
      })
      
      toast.success(
        isBulkOrder 
          ? 'Bulk order request submitted successfully! We\'ll contact you soon.' 
          : 'Message sent successfully! We\'ll get back to you soon.'
      )
      reset()
      if (onClose) onClose()
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-auto border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="mr-3 text-3xl">
            {isBulkOrder ? '📦' : '💬'}
          </span>
          {isBulkOrder ? 'Bulk Order Request' : 'Contact Us'}
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ✕
          </button>
        )}
      </div>

      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <p className="text-gray-700">
          {isBulkOrder ? (
            <>
              <span className="font-semibold">🏢 Planning a large order?</span> Fill out this form and we'll provide you with custom pricing and delivery options for bulk purchases.
            </>
          ) : (
            <>
              <span className="font-semibold">👋 We'd love to hear from you!</span> Whether you have questions, feedback, or special requests, don't hesitate to reach out.
            </>
          )}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className={`input-field ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className={`input-field ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number {isBulkOrder && '*'}
            </label>
            <input
              type="tel"
              {...register('phone', isBulkOrder ? { required: 'Phone number is required for bulk orders' } : {})}
              className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
              placeholder="Enter your phone number"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          {isBulkOrder && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company/Organization
              </label>
              <input
                type="text"
                {...register('company')}
                className="input-field"
                placeholder="Enter company name (optional)"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isBulkOrder ? 'Order Details *' : 'Message *'}
          </label>
          <textarea
            {...register('message', { required: 'Message is required' })}
            rows={6}
            className={`input-field resize-none ${errors.message ? 'border-red-500' : ''}`}
            placeholder={
              isBulkOrder 
                ? 'Please describe your bulk order requirements: quantities, specific products, delivery date, event details, etc.'
                : 'Tell us what\'s on your mind...'
            }
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
          )}
        </div>

        {isBulkOrder && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <span className="text-yellow-600 text-xl mr-3">💡</span>
              <div>
                <h4 className="font-semibold text-yellow-800 mb-1">Bulk Order Tips:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Include specific product names and quantities</li>
                  <li>• Mention your preferred delivery date</li>
                  <li>• Let us know about any dietary restrictions</li>
                  <li>• Describe the event or occasion</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </div>
            ) : (
              <>
                <span className="mr-2">{isBulkOrder ? '📦' : '📧'}</span>
                {isBulkOrder ? 'Submit Bulk Order Request' : 'Send Message'}
              </>
            )}
          </button>
          
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default ContactForm