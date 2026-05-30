import { useMemo } from 'react'

/**
 * Hook de dominio para calcular la racha actual de actividad diaria.
 * Recorre los items y revisa sus fechaActividad para determinar
 * cuántos días consecutivos (hasta hoy) hubo al menos un item activo.
 *
 * @param {Array} items - Lista de items activos del tracker.
 * @returns {{ racha: number, mensaje: string }} - Días consecutivos y mensaje motivacional.
 */
function useRacha(items) {
  const { racha, mensaje } = useMemo(() => {
    if (!items || items.length === 0) return { racha: 0, mensaje: '' }

    // recolecta todas las fechas únicas de actividad (solo la parte YYYY-MM-DD)
    const fechasSet = new Set(
      items
        .filter(i => i.fechaActividad)
        .map(i => i.fechaActividad.split('T')[0])
    )

    // cuenta hacia atrás desde hoy hasta que se rompa la racha
    let dias = 0
    const hoy = new Date()

    while (true) {
      const fecha = new Date(hoy)
      fecha.setDate(hoy.getDate() - dias)
      const fechaISO = fecha.toISOString().split('T')[0]

      if (fechasSet.has(fechaISO)) {
        dias++
      } else {
        break
      }
    }

    let mensaje = ''
    if (dias === 0) mensaje = 'Sin actividad hoy todavía'
    else if (dias === 1) mensaje = '¡Empezando la racha!'
    else if (dias < 5) mensaje = `¡${dias} días seguidos!`
    else if (dias < 10) mensaje = `🔥 ${dias} días en racha`
    else mensaje = `🔥🔥 ${dias} días — ¡imparable!`

    return { racha: dias, mensaje }
  }, [items])

  return { racha, mensaje }
}

export default useRacha
