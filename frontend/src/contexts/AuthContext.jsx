import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!token && !!user

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      
      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          setToken(storedToken)
          setUser(userData)
          
          // Set the token in API headers
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
        } catch (error) {
          console.error('Error parsing stored user data:', error)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      }
      
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const login = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('token', authToken)
    localStorage.setItem('user', JSON.stringify(userData))
    
    // Set the token in API headers
    api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    // Remove the token from API headers
    delete api.defaults.headers.common['Authorization']
  }

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}