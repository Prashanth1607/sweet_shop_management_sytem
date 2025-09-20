import React from 'react'

const PurchaseButton = ({ onPurchase, isOutOfStock, isPurchasing }) => {
  return (
    <button
      onClick={onPurchase}
      disabled={isOutOfStock || isPurchasing}
      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
        isOutOfStock
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : isPurchasing
          ? 'bg-primary-400 text-white cursor-wait'
          : 'bg-primary-600 hover:bg-primary-700 text-white'
      }`}
    >
      {isPurchasing ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Purchasing...
        </div>
      ) : isOutOfStock ? (
        'Out of Stock'
      ) : (
        '🛒 Purchase'
      )}
    </button>
  )
}

export default PurchaseButton