import React from 'react'
import SweetCard from './SweetCard'

const CategorySection = ({ category, sweets, isVisible }) => {
  const getCategoryEmoji = (category) => {
    const emojiMap = {
      'Chocolate': '🍫',
      'Gummy': '🐻',
      'Hard Candy': '🍭',
      'Cookie': '🍪',
      'Cake': '🍰',
      'Ice Cream': '🍦',
      'Caramel': '🍯',
      'Soft Candy': '🍬'
    }
    return emojiMap[category] || '🍭'
  }

  const getCategoryColor = (category) => {
    const colorMap = {
      'Chocolate': 'from-amber-50 to-orange-100 border-amber-200',
      'Gummy': 'from-red-50 to-pink-100 border-red-200',
      'Hard Candy': 'from-purple-50 to-pink-100 border-purple-200',
      'Cookie': 'from-yellow-50 to-amber-100 border-yellow-200',
      'Cake': 'from-pink-50 to-rose-100 border-pink-200',
      'Ice Cream': 'from-blue-50 to-cyan-100 border-blue-200',
      'Caramel': 'from-orange-50 to-yellow-100 border-orange-200',
      'Soft Candy': 'from-green-50 to-emerald-100 border-green-200'
    }
    return colorMap[category] || 'from-gray-50 to-gray-100 border-gray-200'
  }

  return (
    <div className={`card bg-gradient-to-br ${getCategoryColor(category)} hover-lift ${isVisible ? 'slide-up' : 'opacity-0'}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="mr-3 text-3xl float">{getCategoryEmoji(category)}</span>
          {category}
          <span className="ml-3 text-lg font-normal text-gray-600">
            ({sweets.length} item{sweets.length !== 1 ? 's' : ''})
          </span>
        </h3>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200 shadow-sm">
          <span className="text-sm font-medium text-gray-700">
            ${Math.min(...sweets.map(s => parseFloat(s.price))).toFixed(2)} - ${Math.max(...sweets.map(s => parseFloat(s.price))).toFixed(2)}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sweets.map((sweet, index) => (
          <div
            key={sweet.id}
            className="transform transition-all duration-300 hover:scale-105"
            style={{
              animationDelay: `${index * 0.1}s`
            }}
          >
            <SweetCard sweet={sweet} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategorySection