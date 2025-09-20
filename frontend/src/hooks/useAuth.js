import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '../services/authService'
import { useAuth as useAuthContext } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export const useAuth = () => {
  return useAuthContext()
}

export const useLogin = () => {
  const { login } = useAuthContext()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      login(data.user, data.access_token)
      queryClient.invalidateQueries(['user'])
      toast.success('Login successful!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Login failed')
    }
  })
}

export const useRegister = () => {
  return useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      toast.success('Registration successful! Please login.')
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Registration failed')
    }
  })
}

export const useLogout = () => {
  const { logout } = useAuthContext()
  const queryClient = useQueryClient()

  return () => {
    logout()
    queryClient.clear()
    toast.success('Logged out successfully')
  }
}

export const useCurrentUser = () => {
  const { isAuthenticated } = useAuthContext()

  return useQuery({
    queryKey: ['user'],
    queryFn: authService.getCurrentUser,
    enabled: isAuthenticated,
    retry: false
  })
}