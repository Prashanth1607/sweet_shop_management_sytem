import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '../../hooks/useDebounce'
import api from '../../services/api'

const AdvancedFilters = ({ onFiltersChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    query: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    inStockOnly: false,
    sortBy: 'created_at',
    sortOrder: 'desc',
    ...initialFilters
  })

  const [isExpanded, setIsExpanded] = useState(false)
  
  // Debounce the search query to prevent too many API calls
  const debouncedQuery = useDebounce(filters.query, 500)
  
  // Create a debounced version of filters for API calls
  const debouncedFilters = {
    ...filters,
    query: debouncedQuery
  }

  // Fetch categories and price range
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/sweets/filters/categories')
      return response.data
    }
  })

  const { data: priceRange = { min_price: 0, max_price: 100 } } = useQuery({
    queryKey: ['price-range'],
    queryFn: async () => {
      const response = await api.get('/sweets/filters/price-range')
      return response.data
    }
  })

  useEffect(() => {
    onFiltersChange(debouncedFilters)
  }, [debouncedFilters.query, filters.category, filters.minPrice, filters.maxPrice, filters.minRating, filters.inStockOnly, filters.sortBy, filters.sortOrder]) // Only trigger when actual filter values change

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
      inStockOnly: false,
      sortBy: 'created_at',
      sortOrder: 'desc'
    })
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== false && value !== 'created_at' && value !== 'desc'
  )

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🔍</span>
          <h3 className="text-lg font-bold text-gray-800">Search & Filter</h3>
          {hasActiveFilters && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg 
              className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search Bar - Always Visible */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <input
            type="text"
            placeholder="Search sweets by name..."
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {filters.query !== debouncedQuery && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            </div>
          )}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Advanced Filters - Collapsible */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Category and Stock Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.inStockOnly}
                  onChange={(e) => handleFilterChange('inStockOnly', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  In Stock Only
                </span>
              </label>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range (${priceRange.min_price?.toFixed(2)} - ${priceRange.max_price?.toFixed(2)})
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  placeholder="Min Price"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  min={priceRange.min_price}
                  max={priceRange.max_price}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Max Price"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  min={priceRange.min_price}
                  max={priceRange.max_price}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Rating
            </label>
            <select
              value={filters.minRating}
              onChange={(e) => handleFilterChange('minRating', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Any Rating</option>
              <option value="4">⭐⭐⭐⭐ 4+ Stars</option>
              <option value="3">⭐⭐⭐ 3+ Stars</option>
              <option value="2">⭐⭐ 2+ Stars</option>
              <option value="1">⭐ 1+ Stars</option>
            </select>
          </div>

          {/* Sorting */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="created_at">Date Added</option>
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="rating">Rating</option>
                <option value="category">Category</option>
                <option value="quantity">Stock</option>
              </select>
              
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Quick Filter Chips */}
      {hasActiveFilters && (
        <div className="px-4 pb-4">
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
            {filters.minPrice && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                Min: ${filters.minPrice}
                <button
                  onClick={() => handleFilterChange('minPrice', '')}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.maxPrice && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                Max: ${filters.maxPrice}
                <button
                  onClick={() => handleFilterChange('maxPrice', '')}
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
            {filters.inStockOnly && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800">
                In Stock Only
                <button
                  onClick={() => handleFilterChange('inStockOnly', false)}
                  className="ml-2 text-emerald-600 hover:text-emerald-800"
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

export default AdvancedFilters