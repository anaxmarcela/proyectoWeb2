import { useState, useEffect } from 'react'

/**
 * Hook para sincronizar un valor de estado con localStorage.
 * Si ya existe un valor guardado bajo esa clave, lo usa como estado inicial.
 * Cada vez que el valor cambia, lo persiste automáticamente.
 *
 * @param {string} key - Clave de localStorage donde se guarda el valor.
 * @param {*} initialValue - Valor inicial si no hay nada guardado en localStorage.
 * @returns {[*, Function]} - Tupla [valor, setter] igual que useState.
 */
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Si localStorage no está disponible, se ignora 
    }
  }, [key, value])

  return [value, setValue]
}

export default useLocalStorage
