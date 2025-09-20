import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSweets, useSearchSweets } from '../hooks/useSweets'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../contexts/CartContext'
import SweetGrid from '../components/Sweet/SweetGrid'
import SearchBar from '../components/Sweet/SearchBar'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import CategorySection from '../components/Sweet/CategorySection'
import ReviewsSection from '../components/Review/ReviewsSection'
import ReviewCard from '../components/Review/ReviewCard'
import ContactForm from '../components/Contact/ContactForm'

const Home = () => {
  const [searchParams, setSearchParams] = useState({})
  const [isSearching, setIsSearching] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [showBulkOrderForm, setShowBulkOrderForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  const { isAuthenticated, user } = useAuth()
  const { getCartItemsCount, getCartTotal } = useCart()
  const { data: allSweets, isLoading: loadingAll } = useSweets()
  const { data: searchResults, isLoading: loadingSearch } = useSearchSweets(searchParams)

  const sweets = isSearching ? searchResults : allSweets
  const isLoading = isSearching ? loadingSearch : loadingAll

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleSearch = (params) => {
    setSearchParams(params)
    setIsSearching(Object.keys(params).some(key => params[key]))
  }

  const handleClearSearch = () => {
    setSearchParams({})
    setIsSearching(false)
  }

  // Group sweets by category
  const groupSweetsByCategory = (sweetsArray) => {
    if (!sweetsArray) return {}
    
    return sweetsArray.reduce((groups, sweet) => {
      const category = sweet.category
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(sweet)
      return groups
    }, {})
  }

  const sweetsByCategory = groupSweetsByCategory(sweets)
  const categories = Object.keys(sweetsByCategory).sort()

  // Get recent reviews for featured section
  const [featuredReviews, setFeaturedReviews] = useState([])
  
  useEffect(() => {
    // This would typically fetch recent reviews from all products
    // For now, we'll leave it empty and implement when needed
    setFeaturedReviews([])
  }, [])

  // Group sweets by category
  const groupSweetsByCategory = (sweetsArray) => {
    if (!sweetsArray) return {}
    
    return sweetsArray.reduce((groups, sweet) => {
      const category = sweet.category
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(sweet)
      return groups
    }, {})
  }

  const sweetsByCategory = groupSweetsByCategory(sweets)
  const categories = Object.keys(sweetsByCategory).sort()

  // Get recent reviews for featured section
  const [featuredReviews, setFeaturedReviews] = useState([])
  
  useEffect(() => {
    // This would typically fetch recent reviews from all products
    // For now, we'll leave it empty and implement when needed
    setFeaturedReviews([])
  }, [])

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
      <div className={`relative overflow-hidden text-center py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-3xl shadow-2xl border-2 border-gradient-to-r from-pink-200 to-purple-200 ${isVisible ? 'fade-in' : 'opacity-0'}`}>
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

      {/* Features Section - Only show for guests or customize for users */}
      {!isAuthenticated && (
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${isVisible ? 'slide-up' : 'opacity-0'}`}>
          <div className="group card text-center hover:scale-105 hover:rotate-1 transition-all duration-500 bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 hover-lift">
            <div className="text-6xl mb-4 group-hover:animate-bounce">🛒</div>
            <h3 className="text-xl font-bold mb-3 text-pink-800">Easy Shopping</h3>
            <p className="text-gray-600">Add sweets to cart and checkout seamlessly with our intuitive interface</p>
          </div>
          <div className="group card text-center hover:scale-105 hover:rotate-1 transition-all duration-500 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover-lift">
            <div className="text-6xl mb-4 group-hover:animate-pulse">🔍</div>
            <h3 className="text-xl font-bold mb-3 text-purple-800">Smart Search</h3>
            <p className="text-gray-600">Find your favorite sweets by name, category, or price with advanced filters</p>
          </div>
          <div className="group card text-center hover:scale-105 hover:rotate-1 transition-all duration-500 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover-lift">
            <div className="text-6xl mb-4 group-hover:animate-spin">⚡</div>
            <h3 className="text-xl font-bold mb-3 text-blue-800">Real-time Updates</h3>
            <p className="text-gray-600">Live inventory updates and instant notifications for the best experience</p>
          </div>
        </div>
      )}

      {/* User-specific Quick Stats */}
      {isAuthenticated && !user?.is_admin && (
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${isVisible ? 'slide-up' : 'opacity-0'}`}>
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-center hover-lift">
            <div className="text-4xl mb-3 float">🛒</div>
            <h3 className="text-lg font-bold text-blue-800">Cart Items</h3>
            <p className="text-2xl font-bold text-blue-600">{getCartItemsCount()}</p>
          </div>
          <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200 text-center hover-lift">
            <div className="text-4xl mb-3 heartbeat">💰</div>
            <h3 className="text-lg font-bold text-green-800">Cart Total</h3>
            <p className="text-2xl font-bold text-green-600">${getCartTotal().toFixed(2)}</p>
          </div>
          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 text-center hover-lift">
            <div className="text-4xl mb-3 sparkle">🍬</div>
            <h3 className="text-lg font-bold text-purple-800">Available Sweets</h3>
            <p className="text-2xl font-bold text-purple-600">{sweets?.length || 0}</p>
          </div>
        </div>
      )}

      {/* Admin Quick Stats */}
      {isAuthenticated && user?.is_admin && (
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 ${isVisible ? 'slide-up' : 'opacity-0'}`}>
          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 text-center hover-lift">
            <div className="text-4xl mb-3 float">📦</div>
            <h3 className="text-lg font-bold text-purple-800">Total Products</h3>
            <p className="text-2xl font-bold text-purple-600">{sweets?.length || 0}</p>
          </div>
          <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200 text-center hover-lift">
            <div className="text-4xl mb-3 heartbeat">📊</div>
            <h3 className="text-lg font-bold text-green-800">Total Stock</h3>
            <p className="text-2xl font-bold text-green-600">{sweets?.reduce((sum, s) => sum + s.quantity, 0) || 0}</p>
          </div>
          <div className="card bg-gradient-to-br from-red-50 to-red-100 border-red-200 text-center hover-lift">
            <div className="text-4xl mb-3 wiggle">⚠️</div>
            <h3 className="text-lg font-bold text-red-800">Low Stock</h3>
            <p className="text-2xl font-bold text-red-600">{sweets?.filter(s => s.quantity < 10).length || 0}</p>
          </div>
          <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 text-center hover-lift">
            <div className="text-4xl mb-3 rainbow">💎</div>
            <h3 className="text-lg font-bold text-yellow-800">Categories</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {new Set(sweets?.map(s => s.category)).size || 0}
            </p>
          </div>
        </div>
      )}

      {/* Search Section */}
      <div className={`card bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 hover-lift ${isVisible ? 'slide-up' : 'opacity-0'}`}>
        <h2 className="text-3xl font-bold mb-6 flex items-center justify-center text-orange-800">
          <span className="mr-3 text-4xl float">🔍</span>
          Find Your Perfect Sweet
          <span className="ml-3 text-4xl wiggle">🍭</span>
        </h2>
        <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
      </div>

      {/* Contact Forms Modal */}
      {(showContactForm || showBulkOrderForm) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-4xl w-full max-h-screen overflow-y-auto">
            <ContactForm
              isBulkOrder={showBulkOrderForm}
              onClose={() => {
                setShowContactForm(false)
                setShowBulkOrderForm(false)
              }}
            />
          </div>
        </div>
      )}

      {/* Contact & Bulk Order Section */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${isVisible ? 'slide-up' : 'opacity-0'}`}>
        <div className="card bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 hover-lift">
          <div className="text-center">
            <div className="text-5xl mb-4 float">📧</div>
            <h3 className="text-2xl font-bold text-blue-800 mb-4">Contact Us</h3>
            <p className="text-blue-700 mb-6">
              Have questions or feedback? We'd love to hear from you!
            </p>
            <button
              onClick={() => setShowContactForm(true)}
              className="btn-primary bg-blue-600 hover:bg-blue-700"
            >
              <span className="mr-2">💬</span>
              Send Message
            </button>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200 hover-lift">
          <div className="text-center">
            <div className="text-5xl mb-4 heartbeat">📦</div>
            <h3 className="text-2xl font-bold text-purple-800 mb-4">Bulk Orders</h3>
            <p className="text-purple-700 mb-6">
              Planning a large order? Get custom pricing for bulk purchases!
            </p>
            <button
              onClick={() => setShowBulkOrderForm(true)}
              className="btn-primary bg-purple-600 hover:bg-purple-700"
            >
              <span className="mr-2">🏢</span>
              Request Quote
            </button>
          </div>
        </div>
      </div>

      {/* Contact Forms Modal */}
      {(showContactForm || showBulkOrderForm) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-4xl w-full max-h-screen overflow-y-auto">
            <ContactForm
              isBulkOrder={showBulkOrderForm}
              onClose={() => {
                setShowContactForm(false)
                setShowBulkOrderForm(false)
              }}
            />
          </div>
        </div>
      )}

      {/* Contact & Bulk Order Section */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${isVisible ? 'slide-up' : 'opacity-0'}`}>
        <div className="card bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 hover-lift">
          <div className="text-center">
            <div className="text-5xl mb-4 float">📧</div>
            <h3 className="text-2xl font-bold text-blue-800 mb-4">Contact Us</h3>
            <p className="text-blue-700 mb-6">
              Have questions or feedback? We'd love to hear from you!
            </p>
            <button
              onClick={() => setShowContactForm(true)}
              className="btn-primary bg-blue-600 hover:bg-blue-700"
            >
              <span className="mr-2">💬</span>
              Send Message
            </button>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200 hover-lift">
          <div className="text-center">
            <div className="text-5xl mb-4 heartbeat">📦</div>
            <h3 className="text-2xl font-bold text-purple-800 mb-4">Bulk Orders</h3>
            <p className="text-purple-700 mb-6">
              Planning a large order? Get custom pricing for bulk purchases!
            </p>
            <button
              onClick={() => setShowBulkOrderForm(true)}
              className="btn-primary bg-purple-600 hover:bg-purple-700"
            >
              <span className="mr-2">🏢</span>
              Request Quote
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className={`${isVisible ? 'fade-in' : 'opacity-0'}`}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold flex items-center text-gray-800">
            <span className="mr-3 text-4xl sparkle">{isSearching ? '🎯' : '🍬'}</span>
            {isSearching ? 'Search Results' : 'Our Sweet Collection'}
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
        ) : sweets && sweets.length > 0 ? (
          <div>
            {isSearching ? (
              // Show search results in grid format
              <div className="slide-up">
                <SweetGrid sweets={sweets} />
              </div>
            ) : (
              // Show category-wise display
              <div className="space-y-8">
                {categories.map((category) => (
                  <CategorySection
                    key={category}
                    category={category}
                    sweets={sweetsByCategory[category]}
                    isVisible={isVisible}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 bounce-in">
            <div className="text-9xl mb-8 float">🔍</div>
            <h3 className="text-3xl font-bold text-gray-600 mb-6">
              No sweets found
            </h3>
            <p className="text-gray-500 mb-8 text-xl max-w-md mx-auto">
              {isSearching 
                ? 'Try adjusting your search criteria to find the perfect sweet!' 
                : 'Our sweet collection is being updated. Check back soon for new arrivals!'
              }
            </p>
            {isSearching && (
              <button
                onClick={handleClearSearch}
                className="btn-primary text-xl px-10 py-4 shadow-xl hover:shadow-2xl"
              >
                <span className="mr-3">👀</span>
                View All Sweets
                <span className="ml-3">🍭</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Featured Reviews Section */}
      {!isSearching && sweets && sweets.length > 0 && (
        <div className={`${isVisible ? 'slide-up' : 'opacity-0'}`}>
          <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
                <span className="mr-3 text-4xl sparkle">⭐</span>
                What Our Customers Say
                <span className="ml-3 text-4xl rainbow">💬</span>
              </h2>
              <p className="text-gray-600 mt-2">
                Real reviews from sweet lovers like you!
              </p>
            </div>
            
            {featuredReviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🌟</div>
                <h4 className="text-xl font-semibold text-gray-600 mb-2">
                  Reviews Coming Soon!
                </h4>
                <p className="text-gray-500">
                  Be among the first to share your sweet experience with us.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Home