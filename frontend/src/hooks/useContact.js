import { useMutation } from '@tanstack/react-query'
import api from '../services/api'
import toast from 'react-hot-toast'

// Submit contact form
export const useContact = () => {
  const submitContactForm = useMutation({
    mutationFn: async (contactData) => {
      const response = await api.post('/contact/', contactData)
      return response.data
    },
    onSuccess: (data) => {
      const message = data.is_bulk_order 
        ? 'Bulk order request submitted successfully! We\'ll contact you soon.'
        : 'Message sent successfully! We\'ll get back to you soon.'
      toast.success(message)
    },
    onError: (error) => {
      const message = error.response?.data?.detail || 'Failed to send message'
      toast.error(message)
    }
  })

  return {
    submitContactForm: submitContactForm.mutateAsync,
    isSubmitting: submitContactForm.isPending
  }
}