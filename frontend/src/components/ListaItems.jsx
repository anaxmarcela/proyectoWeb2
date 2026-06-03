import ItemCard from './ItemCard'

function ListaItems({ items, registros = [], cargando, onCambiarEstado, onEditar, onArchivar, onRegistrarActividad }) {
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
            registros={registros.filter(r => r.itemId === item.id)}
            onCambiarEstado={onCambiarEstado}
            onEditar={onEditar}
            onArchivar={onArchivar}
            onRegistrarActividad={onRegistrarActividad}
          />
        ))}
      </div>
    </div>
  )
}

export default ListaItems