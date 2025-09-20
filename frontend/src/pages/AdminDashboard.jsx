import React, { useState, useCallback } from 'react'
import { useSweets, useSearchSweets, useCreateSweet, useUpdateSweet, useDeleteSweet, useRestockSweet } from '../hooks/useSweets'
import { useForm } from 'react-hook-form'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import AdminFilters from '../components/Admin/AdminFilters'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const [filters, setFilters] = useState({})
  
  // Use React Query hooks for data fetching
  const hasFilters = Object.values(filters).some(value => 
    value !== '' && value !== 'created_at' && value !== 'desc'
  )
  
  // Always fetch all sweets for the admin dashboard
  const { data: allSweets, isLoading: isLoadingAll, error } = useSweets()
  const { data: filteredSweets, isLoading: isLoadingFiltered } = useSearchSweets(filters)
  
  const sweets = hasFilters && filteredSweets ? filteredSweets : allSweets || []
  const isLoading = hasFilters ? isLoadingFiltered : isLoadingAll
  
  const createSweetMutation = useCreateSweet()
  const updateSweetMutation = useUpdateSweet()
  const deleteSweetMutation = useDeleteSweet()
  const restockMutation = useRestockSweet()

  const [activeTab, setActiveTab] = useState('overview')
  const [editingSweet, setEditingSweet] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm()

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters)
  }, [])

  if (isLoading) {
    return <LoadingSpinner text="Loading admin dashboard..." />
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading sweets: {error.message}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 btn-primary"
        >
          Retry
        </button>
      </div>
    )
  }

  const handleCreateSweet = (data) => {
    createSweetMutation.mutate({
      ...data,
      price: parseFloat(data.price),
      quantity: parseInt(data.quantity)
    }, {
      onSuccess: () => {
        reset()
        setShowCreateForm(false)
        setActiveTab('overview')
        toast.success('Sweet created successfully!')
      },
      onError: (error) => {
        toast.error(error.response?.data?.detail || 'Failed to create sweet')
      }
    })
  }

  const handleUpdateSweet = (data) => {
    updateSweetMutation.mutate({
      id: editingSweet.id,
      data: {
        ...data,
        price: parseFloat(data.price),
        quantity: parseInt(data.quantity)
      }
    }, {
      onSuccess: () => {
        reset()
        setEditingSweet(null)
        setActiveTab('overview')
        toast.success('Sweet updated successfully!')
      },
      onError: (error) => {
        toast.error(error.response?.data?.detail || 'Failed to update sweet')
      }
    })
  }

  const handleEditSweet = (sweet) => {
    setEditingSweet(sweet)
    setValue('name', sweet.name)
    setValue('category', sweet.category)
    setValue('price', sweet.price)
    setValue('quantity', sweet.quantity)
    setValue('image_url', sweet.image_url || '')
    setValue('description', sweet.description || '')
    setShowCreateForm(false)
  }

  const handleDeleteSweet = (sweetId) => {
    if (window.confirm('Are you sure you want to delete this sweet?')) {
      deleteSweetMutation.mutate(sweetId, {
        onSuccess: () => {
          toast.success('Sweet deleted successfully!')
        },
        onError: (error) => {
          toast.error(error.response?.data?.detail || 'Failed to delete sweet')
        }
      })
    }
  }

  const handleRestock = (sweetId, currentQuantity) => {
    const additionalQuantity = prompt('Enter quantity to add:', '10')
    if (additionalQuantity && !isNaN(additionalQuantity)) {
      restockMutation.mutate({
        id: sweetId,
        quantity: parseInt(additionalQuantity)
      }, {
        onSuccess: () => {
          toast.success('Sweet restocked successfully!')
        },
        onError: (error) => {
          toast.error(error.response?.data?.detail || 'Failed to restock sweet')
        }
      })
    }
  }

  const totalSweets = sweets?.length || 0
  const totalStock = sweets?.reduce((sum, sweet) => sum + (sweet.quantity || 0), 0) || 0
  const lowStockSweets = sweets?.filter(sweet => (sweet.quantity || 0) < 10) || []

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={() => {
            setShowCreateForm(true)
            setEditingSweet(null)
            reset()
          }}
          className="btn-primary"
        >
          Add New Sweet
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview' },
            { id: 'inventory', name: 'Inventory Management' },
            { id: 'form', name: editingSweet ? 'Edit Sweet' : 'Add Sweet' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Sweets</h3>
            <p className="text-3xl font-bold text-primary-600">{totalSweets}</p>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Stock</h3>
            <p className="text-3xl font-bold text-green-600">{totalStock}</p>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Low Stock Items</h3>
            <p className="text-3xl font-bold text-red-600">{lowStockSweets.length}</p>
          </div>

          {lowStockSweets.length > 0 && (
            <div className="md:col-span-3 card">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Low Stock Alerts</h3>
              <div className="space-y-2">
                {lowStockSweets.map((sweet) => (
                  <div key={sweet.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-red-800">{sweet.name}</p>
                      <p className="text-sm text-red-600">Only {sweet.quantity} left in stock</p>
                    </div>
                    <button
                      onClick={() => handleRestock(sweet.id, sweet.quantity)}
                      className="btn-primary text-sm"
                    >
                      Restock
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <AdminFilters onFiltersChange={handleFiltersChange} />
          
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Inventory Management</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sweet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sweets?.map((sweet) => (
                  <tr key={sweet.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {sweet.image_url ? (
                          <img
                            src={sweet.image_url}
                            alt={sweet.name}
                            className="w-10 h-10 object-cover rounded-lg mr-3"
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.nextSibling.style.display = 'flex'
                            }}
                          />
                        ) : null}
                        <div className={`w-10 h-10 bg-gradient-to-br from-sweet-pink to-sweet-purple rounded-lg flex items-center justify-center mr-3 ${sweet.image_url ? 'hidden' : 'flex'}`}>
                          <span className="text-lg">🍭</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{sweet.name}</div>
                          {sweet.description && (
                            <div className="text-xs text-gray-500 max-w-xs truncate">
                              {sweet.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sweet.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${parseFloat(sweet.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <div className="flex">
                          {Array.from({ length: 5 }, (_, index) => (
                            <span
                              key={index}
                              className={`text-xs ${
                                index < Math.floor(sweet.avg_rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ⭐
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">
                          {sweet.avg_rating ? sweet.avg_rating.toFixed(1) : '0.0'} ({sweet.review_count || 0})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        sweet.quantity < 10 
                          ? 'bg-red-100 text-red-800' 
                          : sweet.quantity < 50 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {sweet.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => {
                          handleEditSweet(sweet)
                          setActiveTab('form')
                        }}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleRestock(sweet.id, sweet.quantity)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Restock
                      </button>
                      <button
                        onClick={() => handleDeleteSweet(sweet.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      )}

      {/* Form Tab */}
      {(activeTab === 'form' || showCreateForm || editingSweet) && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
          </h2>
          
          <form onSubmit={handleSubmit(editingSweet ? handleUpdateSweet : handleCreateSweet)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sweet Name
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Sweet name is required' })}
                  className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Enter sweet name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className={`input-field ${errors.category ? 'border-red-500' : ''}`}
                >
                  <option value="">Select category</option>
                  <option value="Chocolate">Chocolate</option>
                  <option value="Gummy">Gummy</option>
                  <option value="Hard Candy">Hard Candy</option>
                  <option value="Cookie">Cookie</option>
                  <option value="Cake">Cake</option>
                  <option value="Ice Cream">Ice Cream</option>
                  <option value="Caramel">Caramel</option>
                  <option value="Soft Candy">Soft Candy</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('price', { 
                    required: 'Price is required',
                    min: { value: 0.01, message: 'Price must be greater than 0' }
                  })}
                  className={`input-field ${errors.price ? 'border-red-500' : ''}`}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Stock Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  {...register('quantity', { 
                    required: 'Quantity is required',
                    min: { value: 0, message: 'Quantity cannot be negative' }
                  })}
                  className={`input-field ${errors.quantity ? 'border-red-500' : ''}`}
                  placeholder="0"
                />
                {errors.quantity && (
                  <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Image URL
                </label>
                <input
                  type="url"
                  {...register('image_url')}
                  className="input-field"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter a URL for the product image (optional)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Description
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Describe this sweet product..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  Add a detailed description of the product (optional)
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={createSweetMutation.isPending || updateSweetMutation.isPending}
                className="btn-primary"
              >
                {createSweetMutation.isPending || updateSweetMutation.isPending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {editingSweet ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  editingSweet ? 'Update Sweet' : 'Create Sweet'
                )}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  reset()
                  setEditingSweet(null)
                  setShowCreateForm(false)
                  setActiveTab('overview')
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard