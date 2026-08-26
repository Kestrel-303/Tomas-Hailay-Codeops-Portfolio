import React from 'react'

function Dish(prop) {
  return (
    <div className='card'>
       <h2>
        {prop.name}
       </h2>
       <p>{prop.price}</p>
       <p><small>{prop.ingredients}</small></p>
    </div>
  )
}

export default Dish
