import { createContext, useState, useEffect, useRef } from 'react'

export const StorageContext = createContext()

function StorageProvider({ children }) {
  const [modo, setModoState] = useState(() => localStorage.getItem('modo') || 'local')
  const [items, setItems] = useState([])
  const [cargando, setCargando] = useState(true)

  // useRef: guarda el modo actual de forma síncrona para evitar race conditions
  // cuando hay un fetch en vuelo y el usuario cambia de modo antes de que resuelva
  const modoRef = useRef(modo)

  const setModo = (nuevoModo) => {
    localStorage.setItem('modo', nuevoModo)
    modoRef.current = nuevoModo  // actualiza el ref ANTES del re-render
    setItems([])
    setCargando(true)
    setModoState(nuevoModo)
  }

  const obtenerItems = async (modoActual = modo) => {
    if (modoActual === 'api') {
      try {
        const res = await fetch('http://localhost:3000/api/items')
        const data = await res.json()
        // solo actualiza si el modo no cambió mientras esperábamos la respuesta
        if (modoRef.current === 'api') setItems(data)
      } catch (err) {
        console.error('Error al conectar con la API:', err)
        if (modoRef.current === 'api') setItems([])
      }
    } else {
      const todos = JSON.parse(localStorage.getItem('items') || '[]')
      const activos = todos.filter(i => i.activo)
      setItems(activos)
    }
    setCargando(false)
  }

  const guardarItem = async (item) => {
    if (modo === 'api') {
      const existe = items.find(i => i.id === item.id)
      // actualiza el estado local inmediatamente para que la UI responda al instante
      setItems(prev =>
        existe
          ? prev.map(i => i.id === item.id ? item : i)
          : [...prev, item]
      )
      // envía al servidor en segundo plano sin bloquear la UI
      fetch(`http://localhost:3000/api/items${existe ? '/' + item.id : ''}`, {
        method: existe ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      }).catch(err => {
        console.error('Error al guardar en la API:', err)
        obtenerItems() // si falla, sincroniza desde el servidor
      })
    } else {
      const todos = JSON.parse(localStorage.getItem('items') || '[]')
      const existe = todos.find(i => i.id === item.id)
      if (existe) {
        const nuevos = todos.map(i => i.id === item.id ? item : i)
        localStorage.setItem('items', JSON.stringify(nuevos))
      } else {
        localStorage.setItem('items', JSON.stringify([...todos, item]))
      }
      await obtenerItems()
    }
  }

  const eliminarItem = async (id) => {
    if (modo === 'api') {
      // elimina de la UI inmediatamente
      setItems(prev => prev.filter(i => i.id !== id))
      // envía al servidor en segundo plano
      fetch(`http://localhost:3000/api/items/${id}`, { method: 'DELETE' })
        .catch(err => {
          console.error('Error al archivar en la API:', err)
          obtenerItems() // si falla, sincroniza desde el servidor
        })
    } else {
      const todos = JSON.parse(localStorage.getItem('items') || '[]')
      const nuevos = todos.map(i => i.id === id ? { ...i, activo: false } : i)
      localStorage.setItem('items', JSON.stringify(nuevos))
      await obtenerItems()
    }
  }

  useEffect(() => {
    obtenerItems(modo)
  }, [modo])

  return (
    <StorageContext.Provider value={{ modo, setModo, items, cargando, obtenerItems, guardarItem, eliminarItem }}>
      {children}
    </StorageContext.Provider>
  )
}

export default StorageProvider