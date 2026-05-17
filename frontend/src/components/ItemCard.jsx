function ItemCard({item}) {
    return(
        <div>
            <h2>{item.nombre}</h2>
            <p>{item.categoriaId}</p>
            <p>{item.atributos.tipo}</p>
            <p>{item.atributos.plataforma}</p>
            <p>{item.estado}</p>
        </div>

    )
}

export default ItemCard

