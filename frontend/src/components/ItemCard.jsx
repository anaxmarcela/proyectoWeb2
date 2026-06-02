import { memo } from 'react'
import { getCategoriaById } from '../utils/categorias'

const ESTADOS = ['pendiente', 'viendo', 'terminada', 'abandonada']

const STATUS_CLASS = {
  pendiente: 'pending',
  viendo: 'watching',
  terminada: 'finished',
  abandonada: 'dropped'
}

function ItemCard({ item, onCambiarEstado, onArchivar }) {
  const categoria = getCategoriaById(item.categoriaId)

  return (
    <div className="card" style={{ backgroundColor: `${categoria?.color || '#814881'}33` }}>
      <h2>{item.nombre}</h2>

      <p className="card-meta">
        {categoria && (
          <span style={{ color: categoria.color, fontWeight: 600 }}>
            {categoria.emoji} {categoria.nombre}
          </span>
        )}
        {categoria && <span className="meta-dot">·</span>}
        <span style={{ textTransform: 'capitalize' }}>{item.atributos.tipo}</span>
        {item.atributos.plataforma && <span className="meta-dot">·</span>}
        {item.atributos.plataforma && <span>{item.atributos.plataforma}</span>}
      </p>

      <div className="card-status-row">
        <span className={`status ${STATUS_CLASS[item.estado] || 'pending'}`}>
          {item.estado}
        </span>
        {item.puntuacion !== null && item.puntuacion !== undefined && (
          <span className="puntuacion-badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            {item.puntuacion}/10
          </span>
        )}
      </div>
      {item.notas && <p className="description">"{item.notas}"</p>}

      <div className="card-buttons">
        <button className="change-btn" onClick={() => {
          const indice = ESTADOS.indexOf(item.estado)
          const siguiente = ESTADOS[(indice + 1) % ESTADOS.length]
          onCambiarEstado(item.id, siguiente)
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          Cambiar estado
        </button>
        <button className="archive-btn" onClick={() => onArchivar(item.id)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/>
            <line x1="10" y1="12" x2="14" y2="12"/>
          </svg>
          Archivar
        </button>
      </div>
    </div>
  )
}

export default memo(ItemCard)
