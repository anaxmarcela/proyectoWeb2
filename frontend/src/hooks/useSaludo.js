import { useMemo } from 'react'
import useLocalStorage from './useLocalStorage'

/**
 * Hook de perfil de usuario con saludo dinámico.
 * Persiste el nombre en localStorage y calcula el saludo según la hora del día.
 *
 * @returns {{ nombre: string, setNombre: Function, saludo: string }}
 */
function useSaludo() {
  const [nombre, setNombre] = useLocalStorage('nombre-usuario', '')

  const saludo = useMemo(() => {
    const hora = new Date().getHours()
    if (hora >= 5 && hora < 12) return 'Buenos días'
    if (hora >= 12 && hora < 19) return 'Buenas tardes'
    return 'Buenas noches'
  }, [])

  return { nombre, setNombre, saludo }
}

export default useSaludo
