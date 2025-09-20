import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../contexts/CartContext'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import SweetCard from '../components/Sweet/SweetCard'
import AdvancedFilters from '../components/Sweet/AdvancedFilters'
import api from '../services/api'

const HomeSimple = () => {
  const [sweets, setSweets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const [filters, setFilters] = useState({})
  
  const { isAuthenticated, user } = useAuth()
  const { getCartItemsCount, getCartTotal } = useCart()

  useEffect(() => {
    setIsVisible(true)
    fetchSweets()
  }, [])



  const fetchSweets = async (searchFilters = {}) => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Check if we have any filters to apply
      const hasFilters = Object.values(searchFilters).some(value => 
        value !== '' && value !== false && value !== 'created_at' && value !== 'desc'
      )
      
      let response
      if (hasFilters) {
        // Use search endpoint with filters
        const params = new URLSearchParams()
        Object.entries(searchFilters).forEach(([key, value]) => {
          if (value !== '' && value !== false) {
            if (key === 'inStockOnly' && value) {
              params.append('in_stock_only', 'true')
            } else if (key === 'minPrice' && value) {
              params.append('min_price', value)
            } else if (key === 'maxPrice' && value) {
              params.append('max_price', value)
            } else if (key === 'minRating' && value) {
              params.append('min_rating', value)
            } else if (key === 'sortBy' && value) {
              params.append('sort_by', value)
            } else if (key === 'sortOrder' && value) {
              params.append('sort_order', value)
            } else if (value) {
              params.append(key, value)
            }
          }
        })
        
        response = await api.get(`/sweets/search?${params.toString()}`)
      } else {
        // Use regular endpoint
        response = await api.get('/sweets/')
      }
      
      setSweets(response.data || [])
    } catch (error) {
      console.error('Error fetching sweets:', error)
      setError(error.message)
      setSweets([]) // Set empty array on error
    } finally {
      setIsLoading(false)
    }
  }

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters)
    fetchSweets(newFilters)
  }, []) // Empty dependency array since fetchSweets doesn't depend on external state

  // Moving sweet emojis for animation
  const movingSweets = ['🍭', '🍫', '🍪', '🧁', '🍰', '🍩', '🍬', '🎂', '🍯', '🍊']

  // Render different hero sections based on authentication status
  const renderHeroSection = () => {
    if (isAuthenticated) {
      return (
        <div className={`relative overflow-hidden py-16 bg-gradient-to-br ${
          user?.is_admin 
            ? 'from-purple-50 via-indigo-50 to-blue-50' 
            : 'from-green-50 via-blue-50 to-purple-50'
        } rounded-3xl shadow-2xl border-2 ${
          user?.is_admin ? 'border-purple-200' : 'border-blue-200'
        } ${isVisible ? 'fade-in' : 'opacity-0'}`}>
          
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            {movingSweets.map((sweet, index) => (
              <div
                key={index}
                className="absolute text-3xl opacity-15 animate-bounce"
                style={{
                  left: `${(index * 12) % 100}%`,
                  top: `${(index * 18) % 80}%`,
                  animationDelay: `${index * 0.3}s`,
                  animationDuration: `${2 + (index % 2)}s`
                }}
              >
                {sweet}
              </div>
            ))}
          </div>

          <div className="relative z-10 text-center">
            {/* Personalized Welcome */}
            <div className="mb-8">
              <div className={`inline-block p-4 rounded-full mb-4 ${
                user?.is_admin 
                  ? 'bg-gradient-to-br from-purple-500 to-indigo-600' 
                  : 'bg-gradient-to-br from-blue-500 to-green-600'
              } float`}>
                <span className="text-4xl">
                  {user?.is_admin ? '👑' : '🍭'}
                </span>
              </div>
              
              <h1 className={`text-4xl md:text-6xl font-black mb-4 ${
                user?.is_admin 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-800 bg-clip-text text-transparent' 
                  : 'bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent'
              }`}>
                Welcome back, {user?.email?.split('@')[0]}!
              </h1>
              
              <p className={`text-xl md:text-2xl font-medium mb-8 ${
                user?.is_admin ? 'text-purple-700' : 'text-blue-700'
              }`}>
                {user?.is_admin 
                  ? '🛠️ Ready to manage your sweet empire?' 
                  : '🛒 Ready to explore our delicious collection?'
                }
              </p>
            </div>

            {/* User-specific Quick Actions */}
            {user?.is_admin ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <Link 
                  to="/admin" 
                  className="group bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-6 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2 group-hover:animate-bounce">⚙️</div>
                    <div className="text-xl">Admin Dashboard</div>
                    <div className="text-sm opacity-80 mt-1">Manage Inventory</div>
                  </div>
                </Link>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-200">
                  <div className="text-center">
                    <div className="text-3xl mb-2">📊</div>
                    <div className="text-lg font-bold text-purple-800">Store Stats</div>
                    <div className="text-sm text-gray-600 mt-2">
                      <div>{sweets?.length || 0} Products</div>
                      <div>{sweets?.reduce((sum, s) => sum + s.quantity, 0) || 0} Total Stock</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <Link 
                  to="/cart" 
                  className="group bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold py-6 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <div className="text-center relative">
                    <div className="text-4xl mb-2 group-hover:animate-bounce">🛒</div>
                    <div className="text-xl">My Cart</div>
                    <div className="text-sm opacity-80 mt-1">
                      {getCartItemsCount()} items • ${getCartTotal().toFixed(2)}
                    </div>
                    {getCartItemsCount() > 0 && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
                        {getCartItemsCount()}
                      </div>
                    )}
                  </div>
                </Link>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-blue-200">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🎯</div>
                    <div className="text-lg font-bold text-blue-800">Your Activity</div>
                    <div className="text-sm text-gray-600 mt-2">
                      <div>Cart: {getCartItemsCount()} items</div>
                      <div>Total: ${getCartTotal().toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )
    }

    // Guest user hero section
    return (
      <div className={`relative overflow-hidden text-center py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-3xl shadow-2xl border-2 border-pink-200 ${isVisible ? 'fade-in' : 'opacity-0'}`}>
        {/* Animated Background Sweets */}
        <div className="absolute inset-0 overflow-hidden">
          {movingSweets.map((sweet, index) => (
            <div
              key={index}
              className="absolute text-4xl opacity-20 animate-bounce"
              style={{
                left: `${(index * 10) % 100}%`,
                top: `${(index * 15) % 80}%`,
                animationDelay: `${index * 0.5}s`,
                animationDuration: `${3 + (index % 3)}s`
              }}
            >
              {sweet}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4 leading-tight">
              Welcome to
            </h1>
            <h2 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent mb-6">
              Sweet Shop! 
            </h2>
            <div className="flex justify-center space-x-4 mb-6">
              {['🍭', '🍫', '🍪', '🧁', '🍰'].map((emoji, index) => (
                <span 
                  key={index}
                  className="text-6xl animate-bounce float"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>
          
          <p className="text-2xl md:text-3xl text-gray-700 mb-12 font-medium slide-up">
            🌟 Discover delicious sweets and treats for every occasion 🌟
          </p>

          {/* Action Buttons for Guests */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto slide-up">
            <Link 
              to="/admin-login" 
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold py-6 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 text-center">
                <div className="text-4xl mb-2 group-hover:wiggle">👑</div>
                <div className="text-xl">Admin Portal</div>
                <div className="text-sm opacity-80 mt-1">Manage Store</div>
              </div>
            </Link>

            <Link 
              to="/login" 
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-6 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 text-center">
                <div className="text-4xl mb-2 group-hover:heartbeat">🔐</div>
                <div className="text-xl">User Login</div>
                <div className="text-sm opacity-80 mt-1">Access Account</div>
              </div>
            </Link>

            <Link 
              to="/register" 
              className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-green-800 text-white font-bold py-6 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 text-center">
                <div className="text-4xl mb-2 group-hover:sparkle">✨</div>
                <div className="text-xl">Register</div>
                <div className="text-sm opacity-80 mt-1">Join Us Today</div>
              </div>
            </Link>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6 max-w-lg mx-auto border-2 border-gray-200 shadow-xl">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center justify-center text-lg">
              <span className="mr-2 text-2xl">🎮</span>
              Demo Credentials
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <div className="font-bold text-purple-800 mb-1">👑 Admin Account</div>
                <div className="text-purple-700">admin@sweetshop.com</div>
                <div className="text-purple-700">admin123</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="font-bold text-blue-800 mb-1">👤 User Account</div>
                <div className="text-blue-700">user@sweetshop.com</div>
                <div className="text-blue-700">user123</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12">


      {/* Dynamic Hero Section */}
      {renderHeroSection()}



      {/* Advanced Filters */}
      {isAuthenticated && (
        <div className={`${isVisible ? 'slide-up' : 'opacity-0'}`}>
          <AdvancedFilters onFiltersChange={handleFiltersChange} />
        </div>
      )}

      {/* Results Section */}
      <div className={`${isVisible ? 'fade-in' : 'opacity-0'}`}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold flex items-center text-gray-800">
            <span className="mr-3 text-4xl sparkle">🍬</span>
            Our Sweet Collection
          </h2>
          {sweets && (
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              {sweets.length} sweet{sweets.length !== 1 ? 's' : ''} available
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner text="Loading delicious sweets..." />
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-red-50 rounded-lg border-2 border-red-200">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-2xl font-bold text-red-600 mb-4">Error Loading Sweets</h3>
            <p className="text-red-500 mb-6">{error}</p>
            <button onClick={() => fetchSweets()} className="btn-primary">
              Try Again
            </button>
          </div>
        ) : sweets && sweets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sweets.map((sweet, index) => (
              <SweetCard key={sweet.id} sweet={sweet} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bounce-in">
            <div className="text-9xl mb-8 float">🔍</div>
            <h3 className="text-3xl font-bold text-gray-600 mb-6">
              No sweets found
            </h3>
            <p className="text-gray-500 mb-8 text-xl max-w-md mx-auto">
              Our sweet collection is being updated. Check back soon for new arrivals!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomeSimple