const ESTADOS = ['pendiente', 'viendo', 'terminada', 'abandonada'] 

function ItemCard({item, onCambiarEstado, onArchivar}) {
    return(
        <div>
            <h2>{item.nombre}</h2>
            <p>{item.categoriaId}</p>
            <p>{item.atributos.tipo}</p>
            <p>{item.atributos.plataforma}</p>
            <p>{item.estado}</p>
            <button onClick={() => {
                const indice = ESTADOS.indexOf(item.estado)
                const siguiente = ESTADOS[(indice + 1) % ESTADOS.length]
                onCambiarEstado(item.id, siguiente)}}>Cambiar estado</button>
            <button onClick={() => onArchivar(item.id)}>Archivar</button>
        </div>

    )
}

export default ItemCard

