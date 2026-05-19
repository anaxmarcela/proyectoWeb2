import ItemCard from './ItemCard'

function ListaItems({ items, onCambiarEstado, onArchivar }) {
  const activos = items.filter(item => item.activo)

  if (activos.length === 0) {
    return <p>No hay series ni películas en la lista todavía.</p>
  }

  return (
    <div>
      <h2>Mi Lista ({activos.length})</h2>
      {activos.map(item => (
        <ItemCard
          key={item.id}
          item={item}
          onCambiarEstado={onCambiarEstado}
          onArchivar={onArchivar}
        />
      ))}
    </div>
  )
}

export default ListaItems