import Card from './Card';
import PropTypes from 'prop-types';
import { useState } from 'react';
// Day2 Exercise#1 add prop types
function Dish({name, price, category, isSpicy, currency ="ETB", onAddToCart}) {
  
  const [count, setCount] = useState(0)

  function add(){
    setCount(count + 1)
    onAddToCart(price)
  }


 
  return (
   <>
    <div className="dish">
      <Card>
        <h1>{name}: </h1>
        <br />
        <p><small>{category}</small></p>
        <p>{price} {currency}</p>
        <br />
        <p>{isSpicy && <strong> Spicy</strong>}</p>{/*D2:Exercies#2 rendering spicy badge */}
      </Card>
      {/* D2:Exercies#3 add a card wrapper on Dish */}


      <button onClick={add}>Add to cart</button>
      {/* <button onClick={()=>onRemove(price)} disabled={isClicked}>Remove from cart</button> */}
      

       <p>Quantity: {count}</p>
    </div>
   </>
  )
}


// D2:Exercise#1 Add proptypes 
Dish.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  isSpicy: PropTypes.bool
  
}
export default Dish

