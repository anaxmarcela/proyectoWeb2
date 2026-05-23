import { getCategoriaById } from '../utils/categorias'

const ESTADOS = ['pendiente', 'viendo', 'terminada', 'abandonada']

function ItemCard({item, onCambiarEstado, onArchivar}) {
    const categoria = getCategoriaById(item.categoriaId)

    return(
        <div className="item-card">
            <h2>{item.nombre}</h2>
            <p className="meta">
              {categoria ? (
                <span style={{ color: categoria.color }}>
                  {categoria.emoji} {categoria.nombre}
                </span>
              ) : item.categoriaId} — {item.atributos.tipo}
            </p>
            <p className="meta">📺 {item.atributos.plataforma}</p>
            <span className={`estado estado-${item.estado}`}>{item.estado}</span>
            {item.notas && <p className="notas">"{item.notas}"</p>}
            <div className="acciones">
                <button onClick={() => {
                    const indice = ESTADOS.indexOf(item.estado)
                    const siguiente = ESTADOS[(indice + 1) % ESTADOS.length]
                    onCambiarEstado(item.id, siguiente)
                }}>Cambiar estado</button>
                <button onClick={() => onArchivar(item.id)}>Archivar</button>
            </div>
        </div>
    )
}

export default ItemCard

