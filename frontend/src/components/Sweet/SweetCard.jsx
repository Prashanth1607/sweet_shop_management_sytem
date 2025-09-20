import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../contexts/CartContext'
import toast from 'react-hot-toast'

const SweetCard = ({ sweet, index = 0 }) => {
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isHovered, setIsHovered] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    if (quantity > sweet.quantity) {
      toast.error('Not enough stock available')
      return
    }
    
    setIsAdding(true)
    
    // Add a small delay for animation effect
    setTimeout(() => {
      addToCart(sweet, quantity)
      toast.success(`Added ${quantity} ${sweet.name}(s) to cart! 🛒`, {
        icon: '🎉',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      })
      setQuantity(1)
      setIsAdding(false)
    }, 300)
  }

  const isOutOfStock = sweet.quantity === 0

  // Sweet emoji based on category
  const getSweetEmoji = (category) => {
    const emojiMap = {
      'Chocolate': '🍫',
      'Gummy': '🐻',
      'Hard Candy': '🍭',
      'Cookie': '🍪',
      'Cake': '🍰',
      'Ice Cream': '🍦',
      'Caramel': '🍯',
      'Soft Candy': '🍬'
    }
    return emojiMap[category] || '🍭'
  }

  return (
    <div 
      className={`card hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${
        index % 2 === 0 ? 'slide-up' : 'fade-in'
      } ${isHovered ? 'pulse-glow' : ''}`}
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sweet Image */}
      <div className="relative w-full h-48 rounded-xl mb-4 overflow-hidden group">
        {sweet.image_url ? (
          <img
            src={sweet.image_url}
            alt={sweet.name}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isHovered ? 'scale-110' : ''
            }`}
            onError={(e) => {
              // Fallback to emoji if image fails to load
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        
        {/* Fallback emoji display */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br from-sweet-pink via-sweet-purple to-sweet-blue flex items-center justify-center ${
            sweet.image_url ? 'hidden' : 'flex'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black opacity-20"></div>
          <span className={`text-6xl transform transition-transform duration-300 ${isHovered ? 'scale-125 rotate-12' : ''} float`}>
            {getSweetEmoji(sweet.category)}
          </span>
        </div>
        
        {/* Stock indicator */}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${
          isOutOfStock 
            ? 'bg-red-500 text-white' 
            : sweet.quantity < 10 
            ? 'bg-yellow-500 text-white' 
            : 'bg-green-500 text-white'
        }`}>
          {isOutOfStock ? 'OUT' : sweet.quantity < 10 ? 'LOW' : 'IN STOCK'}
        </div>
      </div>

      {/* Sweet Info */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800 truncate hover:text-primary-600 transition-colors duration-200">
            {sweet.name}
          </h3>
          <p className="text-sm text-gray-600 flex items-center mb-2">
            <span className="mr-1">{getSweetEmoji(sweet.category)}</span>
            {sweet.category}
          </p>
          
          {/* Rating Display */}
          {sweet.avg_rating > 0 && (
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }, (_, index) => (
                  <span
                    key={index}
                    className={`text-sm ${
                      index < Math.floor(sweet.avg_rating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ⭐
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-600">
                {sweet.avg_rating.toFixed(1)} ({sweet.review_count} review{sweet.review_count !== 1 ? 's' : ''})
              </span>
            </div>
          )}
          
          {sweet.description && (
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {sweet.description}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            ${parseFloat(sweet.price).toFixed(2)}
          </span>
          <div className="text-right">
            <div className={`text-sm font-medium ${
              isOutOfStock ? 'text-red-600' : 'text-green-600'
            }`}>
              {isOutOfStock ? '❌ Out of Stock' : `✅ ${sweet.quantity} available`}
            </div>
          </div>
        </div>

        {/* Add to Cart Section */}
        {isAuthenticated ? (
          <div className="space-y-3">
            {!isOutOfStock && (
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="border-0 bg-white rounded-md px-3 py-1 text-sm font-medium focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                >
                  {[...Array(Math.min(sweet.quantity, 10))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdding}
              className={`w-full py-3 px-4 rounded-xl font-bold transition-all duration-300 transform ${
                isOutOfStock
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : isAdding
                  ? 'bg-green-500 text-white scale-95'
                  : 'btn-primary hover:shadow-lg'
              }`}
            >
              {isAdding ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </div>
              ) : isOutOfStock ? (
                '❌ Out of Stock'
              ) : (
                <>
                  <span className="mr-2">🛒</span>
                  Add to Cart
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="text-center py-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-500 flex items-center justify-center">
              <span className="mr-2">🔐</span>
              Login to add to cart
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default SweetCard