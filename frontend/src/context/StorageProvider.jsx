import { createContext, useState, useEffect, useRef, useReducer } from 'react'
import { itemsReducer, initialState } from '../reducers/itemsReducer'
import useLocalStorage from '../hooks/useLocalStorage'
import useFetch from '../hooks/useFetch'

export const StorageContext = createContext()

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function StorageProvider({ children }) {
  const [modo, setModoRaw] = useLocalStorage('modo', 'local')
  const [cargando, setCargando] = useState(true)
  const [state, dispatch] = useReducer(itemsReducer, initialState)

  // useRef: guarda el modo actual de forma síncrona para evitar race conditions
  // cuando hay un fetch en vuelo y el usuario cambia de modo antes de que resuelva
  const modoRef = useRef(modo)
  // useRef: guarda el ID del intervalo de polling para poder limpiarlo sin provocar re-render
  const intervalRef = useRef(null)

  const [fetchUrl, setFetchUrl] = useState(null)
  const { data: apiData, error: apiError } = useFetch(fetchUrl)

  useEffect(() => {
    if (apiData !== null && modoRef.current === 'api') {
      dispatch({ type: 'HIDRATAR', payload: apiData })
      setCargando(false)
    }
  }, [apiData])

  useEffect(() => {
    if (apiError && modoRef.current === 'api') {
      console.error('Error al conectar con la API:', apiError)
      dispatch({ type: 'HIDRATAR', payload: [] })
      setCargando(false)
    }
  }, [apiError])

  const setModo = (nuevoModo) => {
    modoRef.current = nuevoModo  // actualiza el ref ANTES del re-render
    dispatch({ type: 'HIDRATAR', payload: [] })
    setCargando(true)
    setModoRaw(nuevoModo)  // useLocalStorage persiste automáticamente
  }

  const obtenerItems = (modoActual = modo) => {
    if (modoActual === 'api') {
      setFetchUrl(`${API_BASE}/api/items?_=${Date.now()}`)
    } else {
      const todos = JSON.parse(localStorage.getItem('items') || '[]')
      const activos = todos
        .filter(i => i.activo)
        .sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro))
      dispatch({ type: 'HIDRATAR', payload: activos })
      setCargando(false)
    }
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
      fetch(`${API_BASE}/api/items${existe ? '/' + item.id : ''}`, {
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
      obtenerItems()
    }
  }

  const eliminarItem = async (id) => {
    if (modo === 'api') {
      // elimina de la UI inmediatamente
      dispatch({ type: 'ELIMINAR', payload: id })
      // envía al servidor en segundo plano
      fetch(`${API_BASE}/api/items/${id}`, { method: 'DELETE' })
        .catch(err => {
          console.error('Error al archivar en la API:', err)
          obtenerItems() // si falla, sincroniza desde el servidor
        })
    } else {
      const todos = JSON.parse(localStorage.getItem('items') || '[]')
      localStorage.setItem('items', JSON.stringify(todos.map(i => i.id === id ? { ...i, activo: false } : i)))
      obtenerItems()
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
