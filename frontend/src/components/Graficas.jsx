import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import { CATEGORIAS } from '../utils/categorias'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  const visibles = payload.filter(entry => entry.value)
  if (!visibles.length) return null
  return (
    <div className="grafica-tooltip">
      {label && <p className="grafica-tooltip-label">{label}</p>}
      {visibles.map((entry, i) => (
        <p key={i} className="grafica-tooltip-item" style={{ color: entry.color || entry.fill }}>
          {entry.name}: <strong>{entry.value}</strong>
        </p>
      ))}
    </div>
  )
}

const COLOR_PRINCIPAL = '#E77665'
const COLOR_SECUNDARIO = '#814881'

const COLORES_ESTADO = {
  pendiente:  '#F39C12',
  viendo:     '#27AE60',
  terminada:  '#2980B9',
  abandonada: '#E74C3C',
}

function Graficas({ items, registros = [] }) {

  const actividadSemana = useMemo(() => {
    const tipoPorItem = {}
    items.forEach(i => { tipoPorItem[i.id] = i.atributos?.tipo })

    const hoy = new Date()
    return Array.from({ length: 7 }, (_, i) => {
      const fecha = new Date(hoy)
      fecha.setDate(hoy.getDate() - (6 - i))
      const fechaISO = fecha.toISOString().split('T')[0]
      const dia = fecha.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })

      let episodios = 0
      let minutos = 0
      registros.forEach(r => {
        if (r.fecha?.startsWith(fechaISO)) {
          if (tipoPorItem[r.itemId] === 'pelicula') minutos += (r.valor || 0)
          else episodios += (r.valor || 0)
        }
      })
      return { dia, episodios, minutos }
    })
  }, [items, registros])

  const distribucionCategorias = useMemo(() => {
    return CATEGORIAS
      .map(cat => ({
        name: cat.nombre,
        value: items.filter(i => i.categoriaId === cat.id).length,
        color: cat.color,
      }))
      .filter(c => c.value > 0)
  }, [items])

  const distribucionEstados = useMemo(() => {
    return ['pendiente', 'viendo', 'terminada', 'abandonada'].map(estado => ({
      estado: estado.charAt(0).toUpperCase() + estado.slice(1),
      cantidad: items.filter(i => i.estado === estado).length,
      color: COLORES_ESTADO[estado],
    }))
  }, [items])

  if (items.length === 0) return null

  return (
    <div className="graficas-section">
      <p className="section-title">Estadísticas</p>
      <div className="graficas-grid">

        {/* Gráfica 1: Actividad últimos 7 días */}
        <div className="grafica-card">
          <h3 className="grafica-titulo">Actividad últimos 7 días</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={actividadSemana} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(129,72,129,0.15)" />
              <XAxis dataKey="dia" tick={{ fontSize: 9, fontFamily: 'Inter, sans-serif' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 9, fontFamily: 'Inter, sans-serif' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="episodios" name="Episodios vistos" fill={COLOR_PRINCIPAL} radius={[6, 6, 0, 0]} />
              <Bar dataKey="minutos" name="Minutos vistos" fill={COLOR_SECUNDARIO} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfica 2: Por categoría */}
        <div className="grafica-card">
          <h3 className="grafica-titulo">Por categoría</h3>
          {distribucionCategorias.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={distribucionCategorias}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                >
                  {distribucionCategorias.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="grafica-vacia">Sin datos</p>
          )}
        </div>

        {/* Gráfica 3 (libre): Por estado */}
        <div className="grafica-card">
          <h3 className="grafica-titulo">Por estado</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={distribucionEstados} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(129,72,129,0.15)" />
              <XAxis dataKey="estado" tick={{ fontSize: 9, fontFamily: 'Inter, sans-serif' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 9, fontFamily: 'Inter, sans-serif' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="cantidad" name="Cantidad por estado" radius={[6, 6, 0, 0]}>
                {distribucionEstados.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  )
}

export default Graficas
