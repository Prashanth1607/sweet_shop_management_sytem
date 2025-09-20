import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { sweetService } from '../services/sweetService'
import toast from 'react-hot-toast'

export const useSweets = (params = {}) => {
  return useQuery({
    queryKey: ['sweets', params],
    queryFn: () => sweetService.getSweets(params)
  })
}

export const useSearchSweets = (searchParams) => {
  return useQuery({
    queryKey: ['sweets', 'search', searchParams],
    queryFn: () => sweetService.searchSweets(searchParams),
    enabled: Object.keys(searchParams).some(key => searchParams[key])
  })
}

export const useSweet = (id) => {
  return useQuery({
    queryKey: ['sweet', id],
    queryFn: () => sweetService.getSweetById(id),
    enabled: !!id
  })
}

export const useCreateSweet = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sweetService.createSweet,
    onSuccess: () => {
      queryClient.invalidateQueries(['sweets'])
      toast.success('Sweet created successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to create sweet')
    }
  })
}

export const useUpdateSweet = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => sweetService.updateSweet(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['sweets'])
      toast.success('Sweet updated successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to update sweet')
    }
  })
}

export const useDeleteSweet = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sweetService.deleteSweet,
    onSuccess: () => {
      queryClient.invalidateQueries(['sweets'])
      toast.success('Sweet deleted successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to delete sweet')
    }
  })
}

export const usePurchaseSweet = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, quantity }) => sweetService.purchaseSweet(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries(['sweets'])
      toast.success('Purchase successful! 🍭')
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Purchase failed')
    }
  })
}

export const useRestockSweet = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, quantity }) => sweetService.restockSweet(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries(['sweets'])
      toast.success('Sweet restocked successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to restock sweet')
    }
  })
}