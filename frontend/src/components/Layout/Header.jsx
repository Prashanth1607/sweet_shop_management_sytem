import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth, useLogout } from '../../hooks/useAuth'
import { useCart } from '../../contexts/CartContext'

// Header component for navigation

const Header = () => {
  const { isAuthenticated, user } = useAuth()
  const { getCartItemsCount } = useCart()
  const logout = useLogout()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }

  const cartItemsCount = getCartItemsCount()

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
          >
            <span className="mr-2">🍭</span>
            Sweet Shop
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-medium transition-all duration-200 hover:text-primary-600 ${
                location.pathname === '/' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-700'
              }`}
            >
              🏠 Home
            </Link>
            
            {isAuthenticated ? (
              <>
                {/* Orders Link */}
                <Link 
                  to="/orders" 
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-all duration-200 font-medium hover:scale-105"
                >
                  <span>📋</span>
                  <span>Orders</span>
                </Link>

                {/* Cart Icon */}
                <Link 
                  to="/cart" 
                  className="relative group"
                >
                  <div className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-all duration-200 transform hover:scale-110">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                    <span className="font-medium">Cart</span>
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
                        {cartItemsCount}
                      </span>
                    )}
                  </div>
                </Link>

                {user?.is_admin && (
                  <Link 
                    to="/admin" 
                    className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-all duration-200 font-medium hover:scale-105"
                  >
                    <span>⚙️</span>
                    <span>Admin</span>
                  </Link>
                )}
                
                <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user?.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-gray-600 font-medium">
                      {user?.email?.split('@')[0]}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn-secondary text-sm"
                  >
                    <span className="mr-1">👋</span>
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                >
                  🔐 Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary"
                >
                  ✨ Register
                </Link>
                <Link 
                  to="/admin-login" 
                  className="text-xs text-gray-500 hover:text-primary-600 transition-colors"
                >
                  Admin Portal
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg 
              className={`w-6 h-6 transition-transform duration-200 ${isMenuOpen ? 'rotate-90' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 slide-up">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>🏠</span>
                <span>Home</span>
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/orders" 
                    className="text-gray-700 hover:text-primary-600 transition-colors flex items-center space-x-2 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>📋</span>
                    <span>My Orders</span>
                  </Link>
                  
                  <Link 
                    to="/cart" 
                    className="text-gray-700 hover:text-primary-600 transition-colors flex items-center space-x-2 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>🛒</span>
                    <span>Cart ({cartItemsCount})</span>
                  </Link>
                  
                  {user?.is_admin && (
                    <Link 
                      to="/admin" 
                      className="text-gray-700 hover:text-primary-600 transition-colors flex items-center space-x-2 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>⚙️</span>
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {user?.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{user?.email?.split('@')[0]}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="btn-secondary w-full"
                    >
                      <span className="mr-2">👋</span>
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <Link 
                    to="/login" 
                    className="text-gray-700 hover:text-primary-600 transition-colors font-medium flex items-center space-x-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>🔐</span>
                    <span>Login</span>
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn-primary w-full text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mr-2">✨</span>
                    Register
                  </Link>
                  <Link 
                    to="/admin-login" 
                    className="text-gray-500 hover:text-primary-600 transition-colors text-sm flex items-center space-x-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>🔑</span>
                    <span>Admin Portal</span>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header