import { useContext, useRef, useState, useMemo, useCallback } from 'react'
import useAtajoTeclado from './hooks/useAtajoTeclado'
import useRacha from './hooks/useRacha'
import { StorageContext } from './context/StorageProvider'
import { ThemeContext } from './context/ThemeProvider'
import FormularioItem from './components/FormularioItem'
import ListaItems from './components/ListaItems'
import Filtros from './components/Filtros'
import Graficas from './components/Graficas'

function App() {
  const { items, modo, setModo, cargando, guardarItem, eliminarItem,
          filtroCategoria, filtroEstado, busqueda } = useContext(StorageContext)

  const itemsFiltrados = useMemo(() =>
    items.filter(item => {
      const porCategoria = filtroCategoria === 'todas' || item.categoriaId === filtroCategoria
      const porEstado    = filtroEstado === 'todos'    || item.estado === filtroEstado
      const porBusqueda  = item.nombre.toLowerCase().includes(busqueda.toLowerCase())
      return porCategoria && porEstado && porBusqueda
    }),
    [items, filtroCategoria, filtroEstado, busqueda]
  )

  const { tema, toggleTema } = useContext(ThemeContext)

  const { racha, mensaje } = useRacha(items)

  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  const inputRef = useRef(null)

  useAtajoTeclado('n', useCallback(() => {
    setMostrarFormulario(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, []), { ctrl: true })

  useAtajoTeclado('Escape', useCallback(() => {
    setMostrarFormulario(false)
  }, []))

  const agregarItem = async (item) => {
    await guardarItem(item)
    setMostrarFormulario(false)
    inputRef.current?.focus()
  }

  const cambiarEstado = useCallback(async (id, nuevoEstado) => {
    const item = items.find(i => i.id === id)
    await guardarItem({ ...item, estado: nuevoEstado, fechaActividad: new Date().toISOString() })
  }, [items, guardarItem])

  const handleArchivar = useCallback((id) => {
    eliminarItem(id)
  }, [eliminarItem])

  return (
    <div>
      <div className="header">
        {racha > 0 && (
          <div className="racha-badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C8 6 6 10 8 14c-2-1-3-3-3-5-2 3-1 7 2 9a6 6 0 0 0 10-4c1-3-1-6-3-7 0 2-1 3-2 4-1-2-1-5 0-7z"/>
            </svg>
            <span>{mensaje}</span>
          </div>
        )}
        <h1>Moonwatch</h1>
        <div className="top-controls">
          <div className="theme-toggle" onClick={toggleTema}>
            <span className={`toggle-option ${tema === 'claro' ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            </span>
            <span className={`toggle-option ${tema === 'oscuro' ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </span>
          </div>
          <select value={modo} onChange={e => setModo(e.target.value)}>
            <option value="local">Local</option>
            <option value="api">API</option>
          </select>
        </div>
      </div>

      <div className="separator" />

      <button className="add-btn" onClick={() => setMostrarFormulario(!mostrarFormulario)}>
        {mostrarFormulario
          ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
        }
      </button>

      {mostrarFormulario && <FormularioItem onAgregar={agregarItem} inputRef={inputRef} />}
      <Filtros />
      <Graficas items={itemsFiltrados} />
      <ListaItems items={itemsFiltrados} cargando={cargando} onCambiarEstado={cambiarEstado} onArchivar={handleArchivar} />
    </div>
  )
}

export default App
