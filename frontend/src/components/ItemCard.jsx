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
    <div className="card" style={{ borderTopColor: categoria?.color || 'var(--plum)' }}>
      <h2>{item.nombre}</h2>

      <div className="card-info">
        {categoria && (
          <span className="chip" style={{ color: categoria.color, background: `${categoria.color}22` }}>
            {categoria.emoji} {categoria.nombre}
          </span>
        )}
        <span className="chip">{item.atributos.tipo}</span>
      </div>

      <p className="platform">{item.atributos.plataforma}</p>

      <span className={`status ${STATUS_CLASS[item.estado] || 'pending'}`}>
        {item.estado}
      </span>

      {item.notas && <p className="description">"{item.notas}"</p>}

      <div className="card-buttons">
        <button className="change-btn" onClick={() => {
          const indice = ESTADOS.indexOf(item.estado)
          const siguiente = ESTADOS[(indice + 1) % ESTADOS.length]
          onCambiarEstado(item.id, siguiente)
        }}>Cambiar estado</button>
        <button className="archive-btn" onClick={() => onArchivar(item.id)}>Archivar</button>
      </div>
    </div>
  )
}

export default ItemCard
