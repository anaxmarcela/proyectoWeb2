import { useEffect } from 'react'

/**
 * Hook para registrar un atajo de teclado con cleanup automático.
 * Escucha el evento keydown en window y ejecuta el callback cuando
 * la combinación de teclas coincide. Limpia el listener al desmontar.
 *
 * @param {string} key - Tecla principal (ej: 'n', 'Escape', 'Enter').
 * @param {Function} callback - Función a ejecutar cuando se activa el atajo.
 * @param {{ ctrl?: boolean, shift?: boolean, alt?: boolean }} [modificadores] - Teclas modificadoras requeridas.
 */
function useAtajoTeclado(key, callback, modificadores = {}) {
  useEffect(() => {
    const handler = (e) => {
      const ctrlOk  = modificadores.ctrl  ? e.ctrlKey  : true
      const shiftOk = modificadores.shift ? e.shiftKey : true
      const altOk   = modificadores.alt   ? e.altKey   : true

      if (e.key === key && ctrlOk && shiftOk && altOk) {
        e.preventDefault()
        callback()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [key, callback, modificadores.ctrl, modificadores.shift, modificadores.alt])
}

export default useAtajoTeclado
