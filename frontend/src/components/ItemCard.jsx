import { memo, useState, useMemo } from 'react'
import { getCategoriaById } from '../utils/categorias'

const ESTADOS = ['pendiente', 'viendo', 'terminada', 'abandonada']

const STATUS_CLASS = {
  pendiente: 'pending',
  viendo: 'watching',
  terminada: 'finished',
  abandonada: 'dropped'
}

function ItemCard({ item, registros = [], onCambiarEstado, onArchivar, onRegistrarActividad }) {
  const categoria = getCategoriaById(item.categoriaId)
  const [episodios, setEpisodios] = useState('')
  const [mostrarRegistro, setMostrarRegistro] = useState(false)
  const [mostrarHistorial, setMostrarHistorial] = useState(false)

  // ordena los registros de este item del más reciente al más antiguo
  const historial = useMemo(
    () => [...registros].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)),
    [registros]
  )

  const totalEpisodios = useMemo(
    () => historial.reduce((sum, r) => sum + (r.valor || 0), 0),
    [historial]
  )

  const handleRegistrar = () => {
    if (!episodios || Number(episodios) < 1) return
    onRegistrarActividad(item.id, Number(episodios))
    setEpisodios('')
    setMostrarRegistro(false)
  }

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

      {mostrarRegistro && (
        <div className="registro-actividad">
          <input
            type="number"
            min="1"
            max="99"
            value={episodios}
            onChange={e => setEpisodios(e.target.value)}
            placeholder="Episodios vistos hoy"
            className="registro-input"
            onKeyDown={e => e.key === 'Enter' && handleRegistrar()}
            autoFocus
          />
          <button className="registro-confirmar" onClick={handleRegistrar}>✓</button>
          <button className="registro-cancelar" onClick={() => setMostrarRegistro(false)}>✕</button>
        </div>
      )}

      {mostrarHistorial && (
        <div className="historial">
          {historial.length === 0 ? (
            <p className="historial-vacio">Sin registros todavía.</p>
          ) : (
            <>
              <p className="historial-total">Total: {totalEpisodios} episodio{totalEpisodios !== 1 ? 's' : ''}</p>
              <ul className="historial-lista">
                {historial.map(r => (
                  <li key={r.id} className="historial-item">
                    <span className="historial-fecha">
                      {new Date(r.fecha).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </span>
                    <span className="historial-valor">{r.valor} ep</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

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
        <button className="registro-btn" onClick={() => setMostrarRegistro(!mostrarRegistro)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
          Registrar
        </button>
        <button className="historial-btn" onClick={() => setMostrarHistorial(!mostrarHistorial)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          Historial{historial.length > 0 ? ` (${historial.length})` : ''}
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
