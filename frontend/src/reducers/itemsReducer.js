export const initialState = {
  lista:           [],       // array de todos los items
  filtroCategoria: 'todas',  // id de categoría o 'todas'
  filtroEstado:    'todos',  // estado o 'todos'
  busqueda:        '',       // texto de búsqueda
}

// Función pura: sin fetch, sin Date.now(), sin mutaciones al estado anterior
export function itemsReducer(state, action) {
  switch (action.type) {

    // Carga inicial del array de items (desde API o localStorage)
    case 'HIDRATAR':
      return { ...state, lista: action.payload }

    // Añade un nuevo item al array
    case 'AGREGAR':
      return { ...state, lista: [action.payload, ...state.lista] }

    // Archiva el item (activo = false)
    case 'ELIMINAR':
      return {
        ...state,
        lista: state.lista.map(item =>
          item.id === action.payload ? { ...item, activo: false } : item
        )
      }

    // Actualiza el estado del item (pendiente, viendo, terminada, abandonada)
    case 'CAMBIAR_ESTADO':
      return {
        ...state,
        lista: state.lista.map(item =>
          item.id === action.payload.id
            ? { ...item, estado: action.payload.estado, fechaActividad: action.payload.fechaActividad }
            : item
        )
      }

    // Actualiza uno o varios filtros activos (categoría, estado, búsqueda)
    case 'FILTRAR':
      return { ...state, ...action.payload }

    // Resetea todos los filtros a su valor inicial
    case 'LIMPIAR_FILTROS':
      return {
        ...state,
        filtroCategoria: 'todas',
        filtroEstado:    'todos',
        busqueda:        '',
      }

    // Agrega un registro de actividad al historial de un item
    case 'REGISTRAR_ACTIVIDAD':
      return {
        ...state,
        lista: state.lista.map(item =>
          item.id === action.payload.itemId
            ? {
                ...item,
                registros: [...(item.registros || []), action.payload.registro]
              }
            : item
        )
      }

    default:
      return state
  }
}
