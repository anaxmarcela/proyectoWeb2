import { useContext, useRef, useState, useEffect } from 'react'
import { StorageContext } from './context/StorageProvider'
import { ThemeContext } from './context/ThemeProvider'
import FormularioItem from './components/FormularioItem'
import ListaItems from './components/ListaItems'

function App() {
  const { items, modo, setModo, guardarItem, eliminarItem, obtenerItems } = useContext(StorageContext)
  const { tema, toggleTema } = useContext(ThemeContext)

  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  const inputRef = useRef(null)

  const intervalRef = useRef(null)

  useEffect(() => {
    if (modo === 'api') {
      intervalRef.current = setInterval(() => {
        obtenerItems()
      }, 30000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [modo])

  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault()
        setMostrarFormulario(true)
        setTimeout(() => inputRef.current?.focus(), 50)
      } 
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const agregarItem = async (item) => {
    await guardarItem(item)
    setMostrarFormulario(false)
    inputRef.current?.focus()
  }
 

  const cambiarEstado = async (id, nuevoEstado) => {
    const item = items.find(i => i.id === id)
    await guardarItem({ ...item, estado: nuevoEstado, fechaActividad: new Date().toISOString() })
  }
  
  return (
    <div>
      <header>
        <h1>Mi Lista de Series y Películas</h1>
        <div className="header-controles">
          <button onClick={toggleTema}>
            {tema === 'claro' ? '🌙 Oscuro' : '☀️ Claro'}
          </button>
          <label className="label-modo">
            Modo:
            <select value={modo} onChange={e => setModo(e.target.value)}>
              <option value="local">Local</option>
              <option value="api">API</option>
            </select>
          </label>
        </div>
      </header>
      <main>
        <button className="btn-agregar" onClick={() => setMostrarFormulario(!mostrarFormulario)}>
          {mostrarFormulario ? '✕ Cerrar' : '＋ Agregar'}
        </button>
        {mostrarFormulario && <FormularioItem onAgregar={agregarItem} inputRef={inputRef} />}
        <ListaItems items={items} onCambiarEstado={cambiarEstado} onArchivar={eliminarItem} />
      </main>
    </div>
  )

}
export default App
