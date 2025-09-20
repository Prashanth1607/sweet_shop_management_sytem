import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'
import toast from 'react-hot-toast'

// Get current user's orders
export const useMyOrders = () => {
  return useQuery({
    queryKey: ['orders', 'my-orders'],
    queryFn: async () => {
      const response = await api.get('/orders/my-orders')
      return response.data
    }
  })
}

// Get a specific order
export const useOrder = (orderId) => {
  return useQuery({
    queryKey: ['orders', orderId],
    queryFn: async () => {
      const response = await api.get(`/orders/${orderId}`)
      return response.data
    },
    enabled: !!orderId
  })
}

// Get all orders (admin only)
export const useAllOrders = () => {
  return useQuery({
    queryKey: ['orders', 'all'],
    queryFn: async () => {
      const response = await api.get('/orders/')
      return response.data
    }
  })
}

// Create a new order
export const useCreateOrder = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (orderData) => {
      const response = await api.post('/orders/', orderData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['orders'])
      queryClient.invalidateQueries(['sweets']) // Refresh sweets to update stock
      toast.success('Order placed successfully! 🎉')
    },
    onError: (error) => {
      const message = error.response?.data?.detail || 'Failed to create order'
      toast.error(message)
    }
  })
}

// Update an order
export const useUpdateOrder = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ orderId, orderData }) => {
      const response = await api.put(`/orders/${orderId}`, orderData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['orders'])
      toast.success('Order updated successfully!')
    },
    onError: (error) => {
      const message = error.response?.data?.detail || 'Failed to update order'
      toast.error(message)
    }
  })
}