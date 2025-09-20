import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'

const Cart = () => {
  const { items, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some delicious sweets to get started!</p>
        <Link to="/" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-700 text-sm"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="card">
              <div className="flex items-center space-x-4">
                {/* Sweet Image */}
                <div className="w-20 h-20 bg-gradient-to-br from-sweet-pink to-sweet-purple rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🍭</span>
                </div>

                {/* Sweet Details */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.category}</p>
                  <p className="text-lg font-bold text-primary-600">
                    ${parseFloat(item.price).toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.cartQuantity - 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    disabled={item.cartQuantity <= 1}
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.cartQuantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.cartQuantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    disabled={item.cartQuantity >= item.quantity}
                  >
                    +
                  </button>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="font-semibold">
                    ${(parseFloat(item.price) * item.cartQuantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${(getCartTotal() * 0.08).toFixed(2)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${(getCartTotal() * 1.08).toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                to="/checkout"
                className="w-full btn-primary block text-center"
              >
                Proceed to Checkout
              </Link>
              <Link
                to="/"
                className="w-full btn-secondary block text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart