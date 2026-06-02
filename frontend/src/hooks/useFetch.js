import { useState, useEffect } from 'react'

/**
 * Hook para hacer fetch a una URL con manejo de estados y cancelación automática.
 * Usa AbortController para cancelar la petición si el componente se desmonta
 * o si la URL cambia antes de que la respuesta llegue.
 *
 * @param {string|null} url - URL a la que se hace el fetch. Si es null, no hace nada.
 * @returns {{ data: *, loading: boolean, error: string|null }} - Estado de la petición.
 */
function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!url) return

    const controller = new AbortController()

    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
        const json = await res.json()
        setData(json)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    return () => controller.abort()
  }, [url])

  return { data, loading, error }
}

export default useFetch
