import React from 'react'
import SweetCard from './SweetCard'

const SweetGrid = ({ sweets }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {sweets.map((sweet, index) => (
        <SweetCard key={sweet.id} sweet={sweet} index={index} />
      ))}
    </div>
  )
}

export default SweetGrid