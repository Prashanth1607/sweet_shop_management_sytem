import React, { useState, useEffect } from 'react'
import ReviewCard from './ReviewCard'
import ReviewForm from './ReviewForm'
import LoadingSpinner from '../UI/LoadingSpinner'
import { useReviews } from '../../hooks/useReviews'

const ReviewsSection = ({ sweetId, sweetName }) => {
  const { data: reviews, isLoading, refetch } = useReviews(sweetId)
  const [showReviewForm, setShowReviewForm] = useState(false)

  const handleReviewAdded = (newReview) => {
    refetch()
    setShowReviewForm(false)
  }

  const averageRating = reviews?.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    
    return (
      <div className="flex items-center">
        {Array.from({ length: fullStars }, (_, index) => (
          <span key={index} className="text-yellow-400 text-lg">⭐</span>
        ))}
        {hasHalfStar && <span className="text-yellow-400 text-lg">⭐</span>}
        {Array.from({ length: 5 - Math.ceil(rating) }, (_, index) => (
          <span key={index + fullStars} className="text-gray-300 text-lg">⭐</span>
        ))}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <LoadingSpinner text="Loading reviews..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="mr-3 text-3xl">⭐</span>
            Reviews for {sweetName}
          </h2>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="btn-primary"
          >
            {showReviewForm ? 'Cancel' : 'Write Review'}
          </button>
        </div>

        {reviews?.length > 0 ? (
          <div className="flex items-center space-x-4">
            {renderStars(parseFloat(averageRating))}
            <span className="text-lg font-semibold text-gray-700">
              {averageRating} out of 5
            </span>
            <span className="text-gray-500">
              ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
            </span>
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <ReviewForm 
          sweetId={sweetId} 
          onReviewAdded={handleReviewAdded}
        />
      )}

      {/* Reviews List */}
      {reviews?.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No reviews yet
          </h3>
          <p className="text-gray-500 mb-4">
            Be the first to share your experience with this sweet!
          </p>
          <button
            onClick={() => setShowReviewForm(true)}
            className="btn-primary"
          >
            Write First Review
          </button>
        </div>
      )}
    </div>
  )
}

export default ReviewsSection