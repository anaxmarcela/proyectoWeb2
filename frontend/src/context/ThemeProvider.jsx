import { createContext, useState, useEffect } from 'react'

export const ThemeContext = createContext()

function ThemeProvider({ children }) {
  const [tema, setTema] = useState(() => localStorage.getItem('tema') || 'claro')

  useEffect(() => {
    document.body.setAttribute('data-theme', tema)
    localStorage.setItem('tema', tema)
  }, [tema])

  const toggleTema = () => {
    setTema(t => t === 'claro' ? 'oscuro' : 'claro')
  }

  useEffect(() => {
    const handler = (e) => {
      if ((e.key === 'T' || e.key === 't') &&
          document.activeElement.tagName !== 'INPUT' &&
          document.activeElement.tagName !== 'SELECT') {
        toggleTema()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <ThemeContext.Provider value={{ tema, toggleTema }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider