import { useState } from 'react'
import { CATEGORIAS } from '../utils/categorias'

function FormularioItem({onAgregar, inputRef}) {
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
        <div className="formulario-card">
            <form onSubmit={guardarItem}>
                <label>Nombre: <input ref={inputRef} value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" type="text" name="nombre" required /></label>
                <label>Categoría: <select value={categoriaId} onChange={e => setCategoriaId(e.target.value)}>
                    {CATEGORIAS.map(categoria => <option key={categoria.id} value={categoria.id}>{categoria.emoji} {categoria.nombre}</option>)}
                </select></label>
                <label>Tipo: <select value={tipo} onChange={e => setTipo(e.target.value)}>
                    <option value="serie">Serie</option>
                    <option value="pelicula">Película</option>
                </select></label>
                <label>Plataforma: <input value={plataforma} onChange={e => setPlataforma(e.target.value)} placeholder="Plataforma" type="text" name="plataforma" required /></label>
                <label>Notas: <input value={notas} onChange={e => setNotas(e.target.value)} placeholder="Notas" type="text" name="notas" /></label>
                <button type="submit">Crear elemento</button>
            </form>
        </div>
    )
}

export default FormularioItem