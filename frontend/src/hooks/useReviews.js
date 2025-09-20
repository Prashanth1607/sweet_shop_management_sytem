import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'
import toast from 'react-hot-toast'

// Get reviews for a specific sweet
export const useReviews = (sweetId) => {
  return useQuery({
    queryKey: ['reviews', sweetId],
    queryFn: async () => {
      const response = await api.get(`/reviews/sweet/${sweetId}`)
      return response.data
    },
    enabled: !!sweetId
  })
}

// Get current user's reviews
export const useMyReviews = () => {
  return useQuery({
    queryKey: ['reviews', 'me'],
    queryFn: async () => {
      const response = await api.get('/reviews/user/me')
      return response.data
    }
  })
}

// Create a new review
export const useCreateReview = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (reviewData) => {
      const response = await api.post('/reviews/', reviewData)
      return response.data
    },
    onSuccess: (data) => {
      // Invalidate and refetch reviews for the sweet
      queryClient.invalidateQueries(['reviews', data.sweet_id])
      queryClient.invalidateQueries(['reviews', 'me'])
      toast.success('Review added successfully!')
    },
    onError: (error) => {
      const message = error.response?.data?.detail || 'Failed to add review'
      toast.error(message)
    }
  })
}

// Update a review
export const useUpdateReview = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ reviewId, reviewData }) => {
      const response = await api.put(`/reviews/${reviewId}`, reviewData)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['reviews', data.sweet_id])
      queryClient.invalidateQueries(['reviews', 'me'])
      toast.success('Review updated successfully!')
    },
    onError: (error) => {
      const message = error.response?.data?.detail || 'Failed to update review'
      toast.error(message)
    }
  })
}

// Delete a review
export const useDeleteReview = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (reviewId) => {
      await api.delete(`/reviews/${reviewId}`)
      return reviewId
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews'])
      toast.success('Review deleted successfully!')
    },
    onError: (error) => {
      const message = error.response?.data?.detail || 'Failed to delete review'
      toast.error(message)
    }
  })
}