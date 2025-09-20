import React from 'react'

const ReviewCard = ({ review }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-lg ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ⭐
      </span>
    ))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {review.user_email?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-800">
              {review.user_email?.split('@')[0] || 'Anonymous'}
            </p>
            <p className="text-sm text-gray-500">
              {formatDate(review.created_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {renderStars(review.rating)}
        </div>
      </div>
      
      {review.comment && (
        <p className="text-gray-700 leading-relaxed">
          "{review.comment}"
        </p>
      )}
    </div>
  )
}

export default ReviewCard