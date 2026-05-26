import ItemCard from './ItemCard'

function ListaItems({ items, cargando, onCambiarEstado, onArchivar }) {
  const activos = items.filter(item => item.activo)

  if (cargando) {
    return <p className="loading-state">Cargando...</p>
  }

  if (activos.length === 0) {
    return <p className="empty-state">No hay series ni películas en la lista todavía.</p>
  }

  return (
    <div>
      <p className="section-title">Mi Lista ({activos.length})</p>
      <div className="cards-container">
        {activos.map(item => (
          <ItemCard
            key={item.id}
            item={item}
            onCambiarEstado={onCambiarEstado}
            onArchivar={onArchivar}
          />
        ))}
      </div>
    </div>
  )
}

export default ListaItems