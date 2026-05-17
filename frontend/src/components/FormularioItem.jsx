import { useState } from 'react'
import { CATEGORIAS } from '../utils/categorias'

function FormularioItem({onAgregar}) {
    const [nombre, setNombre] = useState("")
    const [categoriaId, setCategoriaId] = useState("")
    const [tipo, setTipo] = useState("serie")
    const [plataforma, setPlataforma] = useState("")
    const [notas, setNotas] = useState("")

    function guardarItem(e){
       e.preventDefault();
       const nuevoItem = {
        nombre: nombre,
        categoriaId: categoriaId,
        atributos: {
            tipo: tipo,
            plataforma: plataforma,
        },
        notas: notas,
        id: crypto.randomUUID(),
        fechaRegistro: new Date().toISOString(),
        fechaActividad: new Date().toISOString(),
        estado: "pendiente",
        puntuacion: null,
        activo: true,
       }
       onAgregar(nuevoItem)
       setNombre("")
       setCategoriaId("")
       setTipo("serie")
       setPlataforma("")
       setNotas("")
    }


    return(
        <div>
            <form>
                <label>Nombre: <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" type="text" name="nombre" required /></label><br />
                <label>Categoría: <select value={categoriaId} onChange={e => setCategoriaId(e.target.value)}>
                    {CATEGORIAS.map(categoria => <option value={categoria.id}>{categoria.nombre}</option>)}
                </select></label><br />
                <label>Tipo: <select value={tipo} onChange={e => setTipo(e.target.value)}>
                    <option value="serie">Serie</option>
                    <option value="pelicula">Película</option>
                </select></label><br />
                <label>Plataforma: <input value={plataforma} onChange={e => setPlataforma(e.target.value)} placeholder="Plataforma" type="text" name="plataforma" required /></label><br />
                <label>Notas: <input value={notas} onChange={e => setNotas(e.target.value)} placeholder="Notas" type="text" name="notas" /></label><br />
                <button type="submit">Crear elemento</button>
            </form>
        </div>
    )
}

export default FormularioItem