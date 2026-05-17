import { useState, useEffect } from 'react'
import FormularioItem from './components/FormularioItem'

function App() {
  const [items, setItems] = useState(() => {
  return JSON.parse(localStorage.getItem('items') || '[]')
  })
  useEffect(() => {
    localStorage.setItem(
      'items',
      JSON.stringify(items)
    );
  },[items]);

  const agregarItem = (item) => {
    setItems([...items, item]);
  }

  return (
    <div>
      <h1>Mi Lista de Series y Películas</h1>
      <FormularioItem onAgregar={agregarItem} />
      {/*<ListaItems items={items} />*/}

    </div>
  )

  

}
export default App
