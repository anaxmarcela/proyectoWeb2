import { useState } from 'react'
import { CATEGORIAS } from '../utils/categorias'

function FormularioItem({onAgregar, inputRef}) {
    const [nombre, setNombre] = useState("")
    const [categoriaId, setCategoriaId] = useState("")
    const [tipo, setTipo] = useState("serie")
    const [plataforma, setPlataforma] = useState("")
    const [notas, setNotas] = useState("")
    const [puntuacion, setPuntuacion] = useState("")

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
        puntuacion: puntuacion !== "" ? parseInt(puntuacion) : null,
        activo: true,
       }
       onAgregar(nuevoItem)
       setNombre("")
       setCategoriaId("")
       setTipo("serie")
       setPlataforma("")
       setNotas("")
       setPuntuacion("")
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
                <label>Puntuación: <input value={puntuacion} onChange={e => {
                  const val = e.target.value
                  if (val === '' || (Number(val) >= 0 && Number(val) <= 10 && /^\d{1,2}$/.test(val))) {
                    setPuntuacion(val)
                  }
                }} placeholder="0 - 10 (opcional)" type="number" min="0" max="10" step="1" name="puntuacion" /></label>
                <label>
                  Notas:
                  <input value={notas} onChange={e => setNotas(e.target.value)} placeholder="Notas (máx. 150 caracteres)" type="text" name="notas" maxLength={150} />
                  <span className="char-counter" style={{ color: notas.length >= 140 ? 'var(--terra-cotta)' : 'var(--text-soft)' }}>
                    {notas.length}/150
                  </span>
                </label>
                <button type="submit">Crear elemento</button>
            </form>
        </div>
    )
}

export default FormularioItem