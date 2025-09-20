import React, { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.id === action.payload.id)
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, cartQuantity: item.cartQuantity + action.payload.quantity }
              : item
          )
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, cartQuantity: action.payload.quantity }]
      }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      }

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, cartQuantity: action.payload.quantity }
            : item
        ).filter(item => item.cartQuantity > 0)
      }

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      }

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload || []
      }

    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('sweetshop_cart')
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: cartData })
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sweetshop_cart', JSON.stringify(state.items))
  }, [state.items])

  const addToCart = (sweet, quantity = 1) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { ...sweet, quantity }
    })
  }

  const removeFromCart = (sweetId) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: sweetId
    })
  }

  const updateQuantity = (sweetId, quantity) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id: sweetId, quantity }
    })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const getCartTotal = () => {
    return state.items.reduce((total, item) => {
      return total + (parseFloat(item.price) * item.cartQuantity)
    }, 0)
  }

  const getCartItemsCount = () => {
    return state.items.reduce((total, item) => total + item.cartQuantity, 0)
  }

  const value = {
    items: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}