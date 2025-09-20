import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import ContactForm from '../Contact/ContactForm'

// Footer component with contact forms and links

const Footer = () => {
  const { isAuthenticated, user } = useAuth()
  const [showContactForm, setShowContactForm] = useState(false)
  const [showBulkOrderForm, setShowBulkOrderForm] = useState(false)

  return (
    <>
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

      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-16">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-2">🍭</span>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Sweet Shop
                </h3>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Your one-stop destination for the finest sweets and treats. 
                From chocolates to gummies, we bring sweetness to every moment.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-pink-400">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-pink-400 transition-colors flex items-center">
                    <span className="mr-2">🏠</span>
                    Home
                  </Link>
                </li>
                {isAuthenticated ? (
                  <>
                    <li>
                      <Link to="/orders" className="text-gray-300 hover:text-pink-400 transition-colors flex items-center">
                        <span className="mr-2">📋</span>
                        My Orders
                      </Link>
                    </li>
                    <li>
                      <Link to="/reviews" className="text-gray-300 hover:text-pink-400 transition-colors flex items-center">
                        <span className="mr-2">⭐</span>
                        My Reviews
                      </Link>
                    </li>
                    <li>
                      <Link to="/cart" className="text-gray-300 hover:text-pink-400 transition-colors flex items-center">
                        <span className="mr-2">🛒</span>
                        My Cart
                      </Link>
                    </li>
                    {user?.is_admin && (
                      <li>
                        <Link to="/admin" className="text-gray-300 hover:text-pink-400 transition-colors flex items-center">
                          <span className="mr-2">⚙️</span>
                          Admin Dashboard
                        </Link>
                      </li>
                    )}
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/login" className="text-gray-300 hover:text-pink-400 transition-colors flex items-center">
                        <span className="mr-2">🔐</span>
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link to="/register" className="text-gray-300 hover:text-pink-400 transition-colors flex items-center">
                        <span className="mr-2">✨</span>
                        Register
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-purple-400">Sweet Categories</h4>
              <ul className="space-y-3">
                <li className="text-gray-300 hover:text-purple-400 transition-colors cursor-pointer flex items-center">
                  <span className="mr-2">🍫</span>
                  Chocolates
                </li>
                <li className="text-gray-300 hover:text-purple-400 transition-colors cursor-pointer flex items-center">
                  <span className="mr-2">🐻</span>
                  Gummy Bears
                </li>
                <li className="text-gray-300 hover:text-purple-400 transition-colors cursor-pointer flex items-center">
                  <span className="mr-2">🍭</span>
                  Hard Candies
                </li>
                <li className="text-gray-300 hover:text-purple-400 transition-colors cursor-pointer flex items-center">
                  <span className="mr-2">🍪</span>
                  Cookies
                </li>
              </ul>
            </div>

            {/* Contact & Support */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-blue-400">Get In Touch</h4>
              <div className="space-y-4">
                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                >
                  <span className="mr-2">💬</span>
                  Contact Us
                </button>
                
                <button
                  onClick={() => setShowBulkOrderForm(true)}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                >
                  <span className="mr-2">📦</span>
                  Bulk Orders
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="border-t border-gray-700 bg-gray-800/50">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2 flex items-center justify-center">
                <span className="mr-3 text-3xl">⭐</span>
                What Our Customers Say
                <span className="ml-3 text-3xl">💬</span>
              </h3>
              <p className="text-gray-400">Real reviews from sweet lovers like you!</p>
            </div>

            {isAuthenticated && (
              <div className="text-center mt-8">
                <p className="text-gray-400 mb-4">Have you tried our sweets? Share your experience!</p>
                <Link 
                  to="/reviews"
                  className="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  <span className="mr-2">✍️</span>
                  Write a Review
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 bg-gray-900">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2024 Sweet Shop. All rights reserved. Made with ❤️ for sweet lovers everywhere.
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
                <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">Terms of Service</span>
                <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">Support</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer