import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'
import toast from 'react-hot-toast'

const LoginSimple = () => {
  const [email, setEmail] = useState('user@sweetshop.com')
  const [password, setPassword] = useState('user123')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.post('/auth/login', {
        email,
        password
      })
      
      // Use the login function from context
      login(response.data.user, response.data.access_token)
      
      toast.success('Login successful!')
      navigate('/')
      
    } catch (error) {
      console.error('Login error:', error)
      const message = error.response?.data?.detail || error.message || 'Login failed'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdminLogin = () => {
    setEmail('admin@sweetshop.com')
    setPassword('admin123')
  }

  const handleUserLogin = () => {
    setEmail('user@sweetshop.com')
    setPassword('user123')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Login</h1>
          <p className="text-gray-600">Sign in to your sweet account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              <>
                <span className="mr-2">🔐</span>
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4 text-center">Quick Login Options:</p>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleUserLogin}
              className="btn-secondary text-sm"
            >
              👤 User Login
            </button>
            <button
              onClick={handleAdminLogin}
              className="btn-secondary text-sm"
            >
              👑 Admin Login
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign up
            </a>
          </p>
        </div>


      </div>
    </div>
  )
}

export default LoginSimple