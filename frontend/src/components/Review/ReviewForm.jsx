import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth'
import api from '../../services/api'

const ReviewForm = ({ sweetId, onReviewAdded }) => {
  const { isAuthenticated } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedRating, setSelectedRating] = useState(0)
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    if (!isAuthenticated) {
      toast.error('Please login to leave a review')
      return
    }

    if (selectedRating === 0) {
      toast.error('Please select a rating')
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await api.post('/reviews/', {
        sweet_id: sweetId,
        rating: selectedRating,
        comment: data.comment || null
      })
      
      toast.success('Review added successfully!')
      reset()
      setSelectedRating(0)
      
      if (onReviewAdded) {
        onReviewAdded(response.data)
      }
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to add review'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStarRating = () => {
    return (
      <div className="flex items-center space-x-1 mb-4">
        <span className="text-sm font-medium text-gray-700 mr-2">Rating:</span>
        {Array.from({ length: 5 }, (_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setSelectedRating(index + 1)}
            className={`text-2xl transition-colors duration-200 hover:scale-110 transform ${
              index < selectedRating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
            }`}
          >
            ⭐
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {selectedRating > 0 ? `${selectedRating} star${selectedRating !== 1 ? 's' : ''}` : 'Click to rate'}
        </span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
        <p className="text-gray-600 mb-4">Please login to leave a review</p>
        <button
          onClick={() => window.location.href = '/login'}
          className="btn-primary"
        >
          Login to Review
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <span className="mr-2 text-xl">✍️</span>
        Write a Review
      </h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {renderStarRating()}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comment (Optional)
          </label>
          <textarea
            {...register('comment')}
            rows={4}
            className="input-field resize-none"
            placeholder="Share your thoughts about this sweet..."
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || selectedRating === 0}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting...
            </div>
          ) : (
            <>
              <span className="mr-2">📝</span>
              Submit Review
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default ReviewForm