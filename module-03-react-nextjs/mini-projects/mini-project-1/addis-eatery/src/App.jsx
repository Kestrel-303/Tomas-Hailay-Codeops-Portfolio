import Header from "./componenets/Header";
import Dish from "./componenets/Dish";
import './App.css';

const dish = [
  {id: 1, name: "Chechebsa", price: "300 ETB", ingredients: "shredded kitta flatbread, niter kibbeh (Ethiopian spiced clarified butter), and berbere spice blend" },
  {id: 2, name: "Scrambled egg", price: "400 ETB", ingredients: "eggs, red onions, jalapeño peppers, tomatoes, oil or niter kibbeh, garlic, and salt." },
  {id: 3, name: "Firfir", price: "300 ETB", ingredients: "injera, red onions, berbere spice blend, niter kibbeh or oil, garlic, ginger, tomatoes, and water." },

]

function App() {

  return (
    <>
      <div>
        <Header />
        <h2 className="menu">Breakfast Menu</h2>
        <div className="card-container">
          
          {dish.map((item, index) => 
        
        (
          <Dish key={index} name={item.name} price={item.price} ingredients={item.ingredients}/>
        )
        )}
        </div>
      </div>
    </>
  )
}

export default App
