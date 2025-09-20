import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '../../hooks/useDebounce'
import api from '../../services/api'

const AdminFilters = ({ onFiltersChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    query: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    stockStatus: '', // all, in_stock, low_stock, out_of_stock
    sortBy: 'created_at',
    sortOrder: 'desc',
    ...initialFilters
  })

  // Debounce the search query to prevent too many API calls
  const debouncedQuery = useDebounce(filters.query, 500)
  
  // Create a debounced version of filters for API calls
  const debouncedFilters = {
    ...filters,
    query: debouncedQuery
  }

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/sweets/filters/categories')
      return response.data
    }
  })

  useEffect(() => {
    onFiltersChange(debouncedFilters)
  }, [debouncedFilters.query, filters.category, filters.minPrice, filters.maxPrice, filters.minRating, filters.stockStatus, filters.sortBy, filters.sortOrder]) // Only trigger when actual filter values change

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      query: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      stockStatus: '',
      sortBy: 'created_at',
      sortOrder: 'desc'
    })
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== 'created_at' && value !== 'desc'
  )

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">⚙️</span>
          <h3 className="text-lg font-bold text-gray-800">Admin Filters & Search</h3>
          {hasActiveFilters && (
            <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Clear All Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Products
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by product name..."
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {filters.query !== debouncedQuery && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
              </div>
            )}
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Price ($)
          </label>
          <input
            type="number"
            placeholder="0.00"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Price ($)
          </label>
          <input
            type="number"
            placeholder="999.99"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Rating
          </label>
          <select
            value={filters.minRating}
            onChange={(e) => handleFilterChange('minRating', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Any Rating</option>
            <option value="4">⭐⭐⭐⭐ 4+ Stars</option>
            <option value="3">⭐⭐⭐ 3+ Stars</option>
            <option value="2">⭐⭐ 2+ Stars</option>
            <option value="1">⭐ 1+ Stars</option>
          </select>
        </div>

        {/* Stock Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock Status
          </label>
          <select
            value={filters.stockStatus}
            onChange={(e) => handleFilterChange('stockStatus', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All Products</option>
            <option value="in_stock">In Stock (10+)</option>
            <option value="low_stock">Low Stock (1-9)</option>
            <option value="out_of_stock">Out of Stock (0)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="created_at">Date Added</option>
            <option value="name">Product Name</option>
            <option value="price">Price</option>
            <option value="rating">Average Rating</option>
            <option value="category">Category</option>
            <option value="quantity">Stock Quantity</option>
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort Order
          </label>
          <select
            value={filters.sortOrder}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.query && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                Search: "{filters.query}"
                <button
                  onClick={() => handleFilterChange('query', '')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                Category: {filters.category}
                <button
                  onClick={() => handleFilterChange('category', '')}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.stockStatus && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                Stock: {filters.stockStatus.replace('_', ' ')}
                <button
                  onClick={() => handleFilterChange('stockStatus', '')}
                  className="ml-2 text-orange-600 hover:text-orange-800"
                >
                  ×
                </button>
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                Price: ${filters.minPrice || '0'} - ${filters.maxPrice || '∞'}
                <button
                  onClick={() => {
                    handleFilterChange('minPrice', '')
                    handleFilterChange('maxPrice', '')
                  }}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.minRating && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                Rating: {filters.minRating}+ ⭐
                <button
                  onClick={() => handleFilterChange('minRating', '')}
                  className="ml-2 text-yellow-600 hover:text-yellow-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminFilters