# Moonwatch

Aplicación web para llevar un registro personal de series y películas. Permite agregar títulos, clasificarlos por categoría y plataforma, cambiar su estado de visualización y archivarlos cuando ya no se quieren ver.

**Autor:** Marcela Ordoñez — Carnet 24993

---

## ¿Qué puede hacer?

- Agregar series y películas con nombre, categoría, plataforma y notas
- Ver la lista de títulos activos
- Cambiar el estado: `pendiente` → `viendo` → `terminada` → `abandonada`
- Archivar títulos (soft delete, no se borran de la base de datos)
- Los datos persisten en LocalStorage aunque se recargue la página

---

## Tecnologías

| Capa | Tecnología |
|------|------------|
| Frontend | React 19 + Vite |
| Estilos | CSS puro + Google Fonts |
| Estado | useState, useEffect, useContext, useRef |
| Backend | Node.js + Express |
| Base de datos | Supabase (PostgreSQL) |

---

## Estructura del proyecto

```
proyectoWeb2/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── FormularioItem.jsx   # Formulario para agregar series/películas
│       │   ├── ItemCard.jsx         # Tarjeta individual con botones de acción
│       │   └── ListaItems.jsx       # Lista de todos los items activos
│       ├── context/
│       │   ├── StorageProvider.jsx  # Contexto híbrido: API ↔ LocalStorage
│       │   └── ThemeProvider.jsx    # Contexto de tema claro/oscuro
│       ├── utils/
│       │   └── categorias.js        # 10 categorías con color y emoji
│       ├── App.jsx                  # Componente principal (consume ambos contextos)
│       └── index.css               # Estilos globales con variables por tema
└── backend/
    └── src/
        ├── db/
        │   └── index.js             # Conexión a Supabase y creación de tablas
        ├── routes/
        │   └── items.js             # 5 endpoints de la API
        └── index.js                 # Servidor Express
```

---

## Cómo correr el proyecto

### Requisitos
- Node.js 18+
- Cuenta en [Supabase](https://supabase.com)

### 1. Clonar el repositorio

```bash
git clone https://github.com/anaxmarcela/proyectoWeb2.git
cd proyectoWeb2
```

### 2. Configurar el backend

```bash
cd backend
npm install
```

Crear un archivo `.env` dentro de `backend/`:

```
DATABASE_URL=postgresql://postgres.xxxx:tuPassword@aws-0-xx.pooler.supabase.com:6543/postgres
PORT=3000
FRONTEND_URL=http://localhost:5173
```

Iniciar el servidor:

```bash
npm run dev
```

La primera vez que corre, crea automáticamente las tablas `items` y `registros` en Supabase.

### 3. Configurar el frontend

```bash
cd frontend
npm install
npm run dev
```

Abrir en el navegador: `http://localhost:5173`

---

## API — Endpoints

Base URL: `http://localhost:3000`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/items` | Devuelve todos los items activos |
| POST | `/api/items` | Crea un nuevo item |
| PUT | `/api/items/:id` | Actualiza un item existente |
| DELETE | `/api/items/:id` | Archiva un item (activo = 0) |
| POST | `/api/items/:id/registro` | Registra actividad diaria |

### Ejemplo — Crear item

```json
{
  "id": "uuid-aqui",
  "nombre": "Bridgerton",
  "categoriaId": "romance",
  "estado": "viendo",
  "puntuacion": null,
  "fechaRegistro": "2026-05-19T00:00:00.000Z",
  "fechaActividad": "2026-05-19T00:00:00.000Z",
  "notas": "",
  "atributos": { "tipo": "serie", "plataforma": "Netflix" }
}
```

---

## Modelo de datos

### items

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | TEXT | UUID generado en el cliente |
| nombre | TEXT | Nombre de la serie o película |
| categoriaid | TEXT | accion, drama, romance, etc. |
| estado | TEXT | pendiente / viendo / terminada / abandonada |
| puntuacion | REAL | 0-10 o null |
| fecharegistro | TEXT | Fecha de creación (ISO) |
| fechaactividad | TEXT | Última interacción (ISO) |
| notas | TEXT | Campo libre |
| atributos | TEXT | JSON con tipo y plataforma |
| activo | INTEGER | 1 = visible, 0 = archivado |

### registros

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | TEXT | UUID |
| itemid | TEXT | Referencia al item |
| fecha | TEXT | Fecha del registro (ISO) |
| valor | INTEGER | Episodios vistos ese día |
| notas | TEXT | Campo libre |

---

## Categorías disponibles

accion, comedia, drama, terror, ciencia ficcion, animacion, documental, thriller, romance, fantasia

---

## Fases del proyecto

| Fase | Contenido | Estado |
|------|-----------|--------|
| Fase 1 | useState + useEffect + Backend Express | ✅ Completada |
| Fase 2 | useContext híbrido + useRef + Tema visual | ✅ Completada |
| Fase 3 | useReducer + Gráficas Recharts | ✅ Completada |
| Fase 4 | Custom hooks + Deploy + Video | 🔄 Pendiente |

---

## Mi gráfica original

La tercera gráfica muestra la **distribución de items por estado** (Pendiente, Viendo, Terminada, Abandonada) usando un BarChart con un color distinto por cada barra.

La elegí porque es la visualización más útil para un tracker personal, porque puedes ver en qué estado está la mayoría de tu lista. Si casi todo está en "Pendiente" sabes que tienes mucho por ver, si hay muchos en "Abandonada" no estás viendo las series/películas para ti. 

---

## Mis 3 decisiones técnicas

**1. Estructura del reducer**

Separé las acciones en dos grupos: las que modifican los datos (`HIDRATAR`, `AGREGAR`, `ELIMINAR`, `CAMBIAR_ESTADO`, `REGISTRAR_ACTIVIDAD`) y las que modifican los filtros (`FILTRAR`, `LIMPIAR_FILTROS`). Esto me ayudó a mantener el reducer ordenado y a entender rápido qué parte del estado afecta cada acción. También mantuve el estado de filtros dentro del mismo reducer en vez de usar un useState aparte, porque así todo el estado de la lista vive en un solo lugar.

**2. Acción más difícil: `CAMBIAR_ESTADO`**

Al principio la implementé cambiando solo el campo `estado`, pero luego me di cuenta que también necesitaba actualizar `fechaActividad` para que la gráfica de actividad de los últimos 7 días funcionara correctamente. El problema era que el reducer tiene que ser función pura (sin `Date.now()`), entonces no podía generar la fecha dentro del reducer. La solución fue pasar la fecha ya generada desde el componente en el `payload`: `{ id, estado, fechaActividad: new Date().toISOString() }`, y el reducer solo la asigna sin crearla.

**3. Gráfica más compleja: Actividad últimos 7 días**

Esta gráfica transforma los datos de una manera que las otras dos no hacen. En vez de simplemente agrupar items por una propiedad que ya existe (como categoría o estado), genera un array de los últimos 7 días desde hoy usando `Array.from` y `Date`, y para cada día cuenta cuántos items tienen ese día en su `fechaActividad`. Esto requiere comparar fechas en formato ISO y generar las etiquetas de los días en español. Todo envuelto en `useMemo` para que no se recalcule en cada render, solo cuando cambia la lista filtrada.

---

## Optimización de rendimiento — React Profiler

### Antes de useMemo

![Profiler antes](assets/profiler-antes.png)

### Después de useMemo

![Profiler después](assets/profiler-despues.png)

### Análisis
Sin `useMemo`, cada vez que se escribe una letra en el buscador React re-renderiza todos los `ItemCard` porque `itemsFiltrados` es un array nuevo en cada render, lo que hace que `onCambiarEstado` y `onArchivar` (pasados como props) también sean referencias nuevas. Con `useMemo` en la lista filtrada y `useCallback` en los handlers, React detecta que las props de cada `ItemCard` no cambiaron y los omite del re-render gracias a `React.memo`. El resultado visible en el Profiler es que los componentes `ItemCard` dejan de aparecer como re-renderizados cuando solo cambia el texto del buscador sin afectar los resultados.

---

## Mi paleta de colores

La paleta se compone de 5 colores fijos de marca más variables que cambian según el tema.

### Colores de marca (siempre presentes)

| Nombre | Hex | Uso principal | Justificación |
|--------|-----|---------------|---------------|
| Eerie Black | `#1F0822` | Títulos principales | Utilicé un morado oscuro para no usar un negro genérico Este tono tiene un subtono morado que lo hace parte de la paleta sin que se note a primera vista. |
| Plum | `#814881` | Acentos, section titles, bordes | Es el color que más identifica a Moonwatch. Lo elegí porque el morado siempre me ha parecido que combina bien con el ambiente de ver series de noche. |
| Deep Mauve | `#D180C8` | Gradientes decorativos | Una versión más suave del Plum para cuando necesito el morado pero sin tanto peso. Lo uso en los fondos y degradados para que no compita con el contenido. |
| Terra Cotta | `#E77665` | Botones de acción principales | Quería que los botones llamaran la atención. Este salmón/terracota contrasta bien con los morados y se siente cálido. |
| Topaz | `#F9CE75` | Gradiente decorativo del separador | Lo agregué al gradiente del separador para que no fuera solo morado y rojo. |

### Tema claro (`body[data-theme='claro']`)

| Color | Hex | Uso | Justificación |
|-------|-----|-----|---------------|
| Crema cálida | `#FFF7E8` | Fondo principal | El blanco puro me parecía muy fuerte por lo que opté por un crema, como el papel de una revista, y no cansa tanto la vista. |
| Blanco rosado | `#FFF8F4` | Fondo de cards | Necesitaba que las cards se distinguieran del fondo sin usar bordes gruesos. Este blanco con toque rosado hace eso, de forma muy sutil. |
| Eerie Black | `#1F0822` | Texto general | Para el texto principal elegí este negro morado porque combina con la paleta sin que el contraste se sienta brusco sobre los fondos cálidos. |
| Malva grisáceo | `#6a556d` | Texto secundario | La plataforma y las notas no necesitan tanta atención como el título. Con este gris morado se leen bien pero sin competir con la información principal. |
| Sombra suave | `rgba(31,8,34,0.08)` | Sombras de cards | No quería sombras muy marcadas en el modo claro porque se ve pesado. Con solo un 8% de opacidad del Eerie Black las cards flotan sin que parezca un diseño del 2010. |
| Blob mauve | `rgba(209,128,200,0.45)` | Blob decorativo del fondo | Son esos círculos difuminados que se ven en el fondo. Los puse para que el fondo no fuera tan plano, y en modo claro los hice bastante visibles porque se ven bonitos con el crema. |

### Tema oscuro (`body[data-theme='oscuro']`)

| Color | Hex | Uso | Justificación |
|-------|-----|-----|---------------|
| Morado profundo | `#140517` | Fondo principal | En lugar de usar negro puro para el modo oscuro, elegí este morado muy oscuro para que se sienta consistente con los otros colores de la paleta. |
| Ciruela oscura | `#241028` | Fondo de cards | Con el fondo tan oscuro necesitaba que las cards tuvieran algo de diferencia. Este morado un poco más claro es suficiente para que se distingan sin romper la atmosfera oscura. |
| Lavanda pálida | `#F7EAF5` | Texto general | El blanco puro sobre morado oscuro me parecía demasiado duro. Esta lavanda pálida se lee perfectamente y mantiene la paleta dentro de los tonos morados. |
| Lavanda grisácea | `#cdb6ce` | Texto secundario | Para los textos de menor jerarquía, un tono más apagado que la lavanda principal. Así se crea una diferencia clara entre lo importante y lo secundario. |
| Sombra oscura | `rgba(0,0,0,0.35)` | Sombras de cards | En modo oscuro las sombras necesitan más fuerza para que se noten. Con 35% de negro las cards tienen presencia sobre el fondo sin verse recortadas. |
| Ciruela select | `#2d1631` | Fondo del selector de modo | El selector necesitaba un fondo propio para no perderse entre las cards. Este ciruela oscuro lo diferencia sutilmente sin inventarse un color nuevo. |

---

## Mis primeros Items

![Captura de pantalla de Moonwatch](assets/Captura.png)

- **Bridgerton** — Romance | Serie | Netflix | viendo
- **Euphoria** — Drama | Serie | Max | pendiente
- **Lista terminal** — Thriller | Serie | Amazon Prime | pendiente
