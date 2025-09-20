import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMyOrders } from '../hooks/useOrders'
import { useReviews } from '../hooks/useReviews'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import ReviewForm from '../components/Review/ReviewForm'
import api from '../services/api'

const Orders = () => {
  const { data: orders, isLoading } = useMyOrders()
  const [selectedOrderForReview, setSelectedOrderForReview] = useState(null)
  const [reviewableItems, setReviewableItems] = useState([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [selectedItemForReview, setSelectedItemForReview] = useState(null)

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusEmoji = (status) => {
    const emojis = {
      pending: '⏳',
      confirmed: '✅',
      processing: '🔄',
      shipped: '🚚',
      delivered: '📦',
      cancelled: '❌'
    }
    return emojis[status] || '📋'
  }

  const handleWriteReview = async (orderId) => {
    try {
      const response = await api.get('/reviews/purchasable-items')
      const items = response.data.filter(item => 
        orders.find(order => 
          order.id === orderId && 
          order.order_items.some(orderItem => orderItem.sweet_id === item.sweet_id)
        )
      )
      setReviewableItems(items)
      setSelectedOrderForReview(orderId)
      if (items.length > 0) {
        setSelectedItemForReview(items[0])
        setShowReviewForm(true)
      }
    } catch (error) {
      console.error('Error fetching reviewable items:', error)
    }
  }

  const handleReviewAdded = () => {
    setShowReviewForm(false)
    setSelectedItemForReview(null)
    setSelectedOrderForReview(null)
    setReviewableItems([])
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner text="Loading your orders..." />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Review Form Modal */}
      {showReviewForm && selectedItemForReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Write Review</h3>
              <button
                onClick={() => setShowReviewForm(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {selectedItemForReview.sweet_image_url ? (
                  <img
                    src={selectedItemForReview.sweet_image_url}
                    alt={selectedItemForReview.sweet_name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🍭</span>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold">{selectedItemForReview.sweet_name}</h4>
                  <p className="text-sm text-gray-600">{selectedItemForReview.sweet_category}</p>
                  <p className="text-xs text-gray-500">
                    Purchased: {new Date(selectedItemForReview.purchase_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <ReviewForm
              sweetId={selectedItemForReview.sweet_id}
              onReviewAdded={handleReviewAdded}
            />
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <span className="mr-3 text-4xl">📋</span>
          My Orders
        </h1>
        <Link to="/cart" className="btn-primary">
          <span className="mr-2">🛒</span>
          Continue Shopping
        </Link>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-9xl mb-8">📦</div>
          <h2 className="text-3xl font-bold text-gray-600 mb-4">No Orders Yet</h2>
          <p className="text-gray-500 mb-8 text-xl max-w-md mx-auto">
            You haven't placed any orders yet. Start shopping to see your order history here!
          </p>
          <Link to="/" className="btn-primary text-xl px-8 py-4">
            <span className="mr-2">🍭</span>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="card hover-lift">
              {/* Order Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-800">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusEmoji(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                
                <div className="flex flex-col md:items-end">
                  <div className="text-2xl font-bold text-primary-600 mb-2">
                    ${parseFloat(order.total_amount).toFixed(2)}
                  </div>
                  {(order.status === 'delivered' || order.status === 'confirmed') && (
                    <button
                      onClick={() => handleWriteReview(order.id)}
                      className="btn-secondary text-sm"
                    >
                      <span className="mr-1">⭐</span>
                      Write Review
                    </button>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 flex items-center">
                  <span className="mr-2">📦</span>
                  Items ({order.order_items.length})
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      {item.sweet_image_url ? (
                        <img
                          src={item.sweet_image_url}
                          alt={item.sweet_name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg flex items-center justify-center">
                          <span className="text-lg">🍭</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">
                          {item.sweet_name || 'Sweet Item'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} × ${parseFloat(item.unit_price).toFixed(2)}
                        </p>
                        <p className="text-sm font-semibold text-primary-600">
                          ${parseFloat(item.total_price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Info */}
              {order.shipping_address && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <span className="mr-2">🚚</span>
                    Shipping Address
                  </h4>
                  <p className="text-gray-600">{order.shipping_address}</p>
                </div>
              )}

              {/* Order Notes */}
              {order.notes && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <span className="mr-2">📝</span>
                    Notes
                  </h4>
                  <p className="text-gray-600 text-sm">{order.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders