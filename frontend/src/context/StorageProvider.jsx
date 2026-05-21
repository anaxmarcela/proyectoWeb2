import { createContext, useState, useEffect } from 'react'

export const StorageContext = createContext()

function StorageProvider({ children }) {
  const [modo, setModoState] = useState(() => localStorage.getItem('modo') || 'local')
  const [items, setItems] = useState([])

  const setModo = (nuevoModo) => {
    localStorage.setItem('modo', nuevoModo)
    setModoState(nuevoModo)
  }

  const obtenerItems = async () => {
    if (modo === 'api') {
      const res = await fetch('http://localhost:3000/api/items')
      const data = await res.json()
      setItems(data)
      return data
    } else {
      const todos = JSON.parse(localStorage.getItem('items') || '[]')
      const activos = todos.filter(i => i.activo)
      setItems(activos)
      return activos
    }
  }

  const guardarItem = async (item) => {
    if (modo === 'api') {
      const existe = items.find(i => i.id === item.id)
      if (existe) {
        await fetch(`http://localhost:3000/api/items/${item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        })
      } else {
        await fetch('http://localhost:3000/api/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        })
      }
    } else {
      const todos = JSON.parse(localStorage.getItem('items') || '[]')
      const existe = todos.find(i => i.id === item.id)
      if (existe) {
        const nuevos = todos.map(i => i.id === item.id ? item : i)
        localStorage.setItem('items', JSON.stringify(nuevos))
      } else {
        localStorage.setItem('items', JSON.stringify([...todos, item]))
      }
    }
    await obtenerItems()
  }

  const eliminarItem = async (id) => {
    if (modo === 'api') {
      await fetch(`http://localhost:3000/api/items/${id}`, { method: 'DELETE' })
    } else {
      const todos = JSON.parse(localStorage.getItem('items') || '[]')
      const nuevos = todos.map(i => i.id === id ? { ...i, activo: false } : i)
      localStorage.setItem('items', JSON.stringify(nuevos))
    }
    await obtenerItems()
  }

  useEffect(() => {
    obtenerItems()
  }, [modo])

  return (
    <StorageContext.Provider value={{ modo, setModo, items, obtenerItems, guardarItem, eliminarItem }}>
      {children}
    </StorageContext.Provider>
  )
}

export default StorageProvider