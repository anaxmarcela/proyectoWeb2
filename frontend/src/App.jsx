import { useState, useEffect } from 'react'
import FormularioItem from './components/FormularioItem'
import ListaItems from './components/ListaItems'

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

  const cambiarEstado = (id, nuevoEstado) => {
    setItems(items.map(item =>
      item.id === id
        ? { ...item, estado: nuevoEstado, fechaActividad: new Date().toISOString() }
        : item
    ))
  }

  const archivarItem = (id) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, activo: false } : item
    ))
  }

  return (
    <div>
      <h1>Mi Lista de Series y Películas</h1>
      <FormularioItem onAgregar={agregarItem} />
      <ListaItems items={items} onCambiarEstado={cambiarEstado} onArchivar={archivarItem} />
    </div>
  )

  

}
export default App
