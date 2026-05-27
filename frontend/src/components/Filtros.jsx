import { useContext } from 'react'
import { StorageContext } from '../context/StorageProvider'
import { CATEGORIAS } from '../utils/categorias'

const ESTADOS = ['pendiente', 'viendo', 'terminada', 'abandonada']

function Filtros() {
  const { filtroCategoria, filtroEstado, busqueda, dispatch } = useContext(StorageContext)

  const hayFiltros = filtroCategoria !== 'todas' || filtroEstado !== 'todos' || busqueda !== ''

  return (
    <div className="filtros">
      <input
        type="text"
        className="filtro-busqueda"
        placeholder="Buscar por nombre..."
        value={busqueda}
        onChange={e => dispatch({ type: 'FILTRAR', payload: { busqueda: e.target.value } })}
      />

      <select
        value={filtroCategoria}
        onChange={e => dispatch({ type: 'FILTRAR', payload: { filtroCategoria: e.target.value } })}
      >
        <option value="todas">Todas las categorías</option>
        {CATEGORIAS.map(c => (
          <option key={c.id} value={c.id}>{c.emoji} {c.nombre}</option>
        ))}
      </select>

      <select
        value={filtroEstado}
        onChange={e => dispatch({ type: 'FILTRAR', payload: { filtroEstado: e.target.value } })}
      >
        <option value="todos">Todos los estados</option>
        {ESTADOS.map(e => (
          <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>
        ))}
      </select>

      {hayFiltros && (
        <button className="filtro-limpiar" onClick={() => dispatch({ type: 'LIMPIAR_FILTROS' })}>
          ✕ Limpiar filtros
        </button>
      )}
    </div>
  )
}

export default Filtros
