import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useCart } from '../contexts/CartContext'
import { useCreateOrder } from '../hooks/useOrders'
import toast from 'react-hot-toast'

const Checkout = () => {
  const navigate = useNavigate()
  const { items, getCartTotal, clearCart } = useCart()
  const createOrderMutation = useCreateOrder()
  const [isProcessing, setIsProcessing] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  const onSubmit = async (data) => {
    setIsProcessing(true)
    
    try {
      // Prepare order data
      const orderData = {
        items: items.map(item => ({
          sweet_id: item.id,
          quantity: item.cartQuantity,
          unit_price: parseFloat(item.price)
        })),
        shipping_address: `${data.address}, ${data.city}, ${data.state} ${data.zipCode}`,
        payment_method: 'Demo Payment',
        notes: `Customer: ${data.firstName} ${data.lastName}, Phone: ${data.phone}`
      }
      
      // Create order
      await createOrderMutation.mutateAsync(orderData)
      
      // Clear cart after successful order
      clearCart()
      navigate('/orders')
      
    } catch (error) {
      // Error handling is done in the mutation
    } finally {
      setIsProcessing(false)
    }
  }

  const subtotal = getCartTotal()
  const tax = subtotal * 0.08
  const total = subtotal + tax

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Shipping Information</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    {...register('firstName', { required: 'First name is required' })}
                    className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    {...register('lastName', { required: 'Last name is required' })}
                    className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  {...register('address', { required: 'Address is required' })}
                  className={`input-field ${errors.address ? 'border-red-500' : ''}`}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    {...register('city', { required: 'City is required' })}
                    className={`input-field ${errors.city ? 'border-red-500' : ''}`}
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    {...register('state', { required: 'State is required' })}
                    className={`input-field ${errors.state ? 'border-red-500' : ''}`}
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    {...register('zipCode', { required: 'ZIP code is required' })}
                    className={`input-field ${errors.zipCode ? 'border-red-500' : ''}`}
                  />
                  {errors.zipCode && (
                    <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  {...register('phone', { required: 'Phone number is required' })}
                  className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full btn-primary"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing Order...
                  </div>
                ) : (
                  `Place Order - $${total.toFixed(2)}`
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-sweet-pink to-sweet-purple rounded flex items-center justify-center">
                      <span className="text-lg">🍭</span>
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.cartQuantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">
                    ${(parseFloat(item.price) * item.cartQuantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <hr className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold text-gray-800 mb-2">Payment Method</h3>
            <p className="text-sm text-gray-600">
              💳 This is a demo application. No real payment will be processed.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout