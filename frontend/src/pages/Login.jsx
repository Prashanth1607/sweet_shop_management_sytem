import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useLogin, useAuth } from '../hooks/useAuth'

const Login = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const loginMutation = useLogin()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const onSubmit = (data) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        navigate('/')
      }
    })
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="card hover-lift glass-effect bg-gradient-to-br from-white/90 to-blue-50/90 border-2 border-blue-200">
        <div className="text-center mb-8 fade-in">
          <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 float">
            <span className="text-4xl">🔐</span>
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-3">Welcome Back!</h1>
          <p className="text-gray-600 text-lg">Sign in to your sweet shop account</p>
        </div>

        {/* Demo Credentials */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6 slide-up">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">🎮</span>
            <h3 className="font-bold text-blue-800">Demo User Account</h3>
          </div>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>Email:</strong> user@sweetshop.com</p>
            <p><strong>Password:</strong> user123</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div className="slide-in-left">
            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
              <span className="mr-2">📧</span>
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className={`input-field pl-12 text-lg ${errors.email ? 'border-red-500 shake' : 'border-blue-300'}`}
                placeholder="Enter your email"
                defaultValue="user@sweetshop.com"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 font-medium animate-pulse">
                <span className="mr-1">⚠️</span>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="slide-in-right">
            <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
              <span className="mr-2">🔒</span>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 1,
                    message: 'Password must be at least 1 character'
                  }
                })}
                className={`input-field pl-12 pr-12 text-lg ${errors.password ? 'border-red-500 shake' : 'border-blue-300'}`}
                placeholder="Enter your password"
                defaultValue="user123"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-600 font-medium animate-pulse">
                <span className="mr-1">⚠️</span>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginMutation.isPending ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                <span className="loading-dots">Signing In</span>
              </div>
            ) : (
              <>
                <span className="mr-2">🚀</span>
                Sign In to Sweet Shop
                <span className="ml-2">🍭</span>
              </>
            )}
          </button>
        </form>

        {/* Links */}
        <div className="mt-8 text-center space-y-4 fade-in">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-purple-600 font-bold transition-colors duration-200 hover:underline">
              Sign up here! ✨
            </Link>
          </p>
          <div className="flex justify-center space-x-4 text-sm">
            <Link to="/admin-login" className="text-purple-600 hover:text-purple-800 font-medium transition-colors">
              👑 Admin Portal
            </Link>
            <span className="text-gray-400">|</span>
            <Link to="/" className="text-gray-600 hover:text-gray-800 transition-colors">
              🏠 Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login