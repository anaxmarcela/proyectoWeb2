import { createContext, useState, useEffect, useRef, useReducer } from 'react'
import { itemsReducer, initialState } from '../reducers/itemsReducer'

export const StorageContext = createContext()

function StorageProvider({ children }) {
  const [modo, setModoState] = useState(() => localStorage.getItem('modo') || 'local')
  const [cargando, setCargando] = useState(true)
  const [state, dispatch] = useReducer(itemsReducer, initialState)

  // useRef: guarda el modo actual de forma síncrona para evitar race conditions
  // cuando hay un fetch en vuelo y el usuario cambia de modo antes de que resuelva
  const modoRef = useRef(modo)
  // useRef: guarda el ID del intervalo de polling para poder limpiarlo sin provocar re-render
  const intervalRef = useRef(null)

  const setModo = (nuevoModo) => {
    localStorage.setItem('modo', nuevoModo)
    modoRef.current = nuevoModo  // actualiza el ref ANTES del re-render
    dispatch({ type: 'HIDRATAR', payload: [] })
    setCargando(true)
    setModoState(nuevoModo)
  }

  const obtenerItems = async (modoActual = modo) => {
    if (modoActual === 'api') {
      try {
        const res = await fetch('http://localhost:3000/api/items')
        const data = await res.json()
        // solo actualiza si el modo no cambió mientras esperábamos la respuesta
        if (modoRef.current === 'api') dispatch({ type: 'HIDRATAR', payload: data })
      } catch (err) {
        console.error('Error al conectar con la API:', err)
        if (modoRef.current === 'api') dispatch({ type: 'HIDRATAR', payload: [] })
      }
    } else {
      const todos = JSON.parse(localStorage.getItem('items') || '[]')
      const activos = todos
        .filter(i => i.activo)
        .sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro))
      dispatch({ type: 'HIDRATAR', payload: activos })
    }
    setCargando(false)
  }

  const guardarItem = async (item) => {
    if (modo === 'api') {
      const existe = state.lista.find(i => i.id === item.id)
      // actualiza el estado local inmediatamente para que la UI responda al instante
      if (existe) {
        dispatch({ type: 'CAMBIAR_ESTADO', payload: { id: item.id, estado: item.estado, fechaActividad: item.fechaActividad } })
      } else {
        dispatch({ type: 'AGREGAR', payload: item })
      }
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
        localStorage.setItem('items', JSON.stringify(todos.map(i => i.id === item.id ? item : i)))
      } else {
        localStorage.setItem('items', JSON.stringify([...todos, item]))
      }
      await obtenerItems()
    }
  }

  const eliminarItem = async (id) => {
    if (modo === 'api') {
      // elimina de la UI inmediatamente
      dispatch({ type: 'ELIMINAR', payload: id })
      // envía al servidor en segundo plano
      fetch(`http://localhost:3000/api/items/${id}`, { method: 'DELETE' })
        .catch(err => {
          console.error('Error al archivar en la API:', err)
          obtenerItems() // si falla, sincroniza desde el servidor
        })
    } else {
      const todos = JSON.parse(localStorage.getItem('items') || '[]')
      localStorage.setItem('items', JSON.stringify(todos.map(i => i.id === id ? { ...i, activo: false } : i)))
      await obtenerItems()
    }
  }

  useEffect(() => {
    obtenerItems(modo)
    // polling cada 30s en modo API para mantener los datos sincronizados
    if (modo === 'api') {
      intervalRef.current = setInterval(() => obtenerItems(), 30000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [modo])

  return (
    <StorageContext.Provider value={{
      modo, setModo,
      items: state.lista.filter(i => i.activo),
      cargando,
      obtenerItems, guardarItem, eliminarItem,
      dispatch,
      filtroCategoria: state.filtroCategoria,
      filtroEstado:    state.filtroEstado,
      busqueda:        state.busqueda,
    }}>
      {children}
    </StorageContext.Provider>
  )
}

export default StorageProvider
