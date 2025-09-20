import React, { useState } from 'react'

const SearchBar = ({ onSearch, onClear }) => {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const categories = [
    'Chocolate',
    'Gummy',
    'Hard Candy',
    'Cookie',
    'Cake',
    'Ice Cream',
    'Candy Bar'
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    
    const searchParams = {}
    if (query.trim()) searchParams.query = query.trim()
    if (category) searchParams.category = category
    if (minPrice) searchParams.min_price = parseFloat(minPrice)
    if (maxPrice) searchParams.max_price = parseFloat(maxPrice)
    
    onSearch(searchParams)
  }

  const handleClear = () => {
    setQuery('')
    setCategory('')
    setMinPrice('')
    setMaxPrice('')
    onClear()
  }

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      {/* Search Query */}
      <div>
        <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-1">
          Search by name
        </label>
        <input
          type="text"
          id="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter sweet name..."
          className="input-field"
        />
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Min Price ($)
          </label>
          <input
            type="number"
            id="minPrice"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            min="0"
            step="0.01"
            placeholder="0.00"
            className="input-field"
          />
        </div>

        {/* Max Price */}
        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Max Price ($)
          </label>
          <input
            type="number"
            id="maxPrice"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            min="0"
            step="0.01"
            placeholder="100.00"
            className="input-field"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          className="btn-primary flex-1"
        >
          🔍 Search Sweets
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="btn-secondary flex-1"
        >
          Clear Filters
        </button>
      </div>
    </form>
  )
}

export default SearchBar