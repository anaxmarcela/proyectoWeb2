# Tracker de Series y Películas

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
| Frontend | React 18 + Vite |
| Estilos | CSS puro |
| Estado | useState, useEffect |
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
│       ├── utils/
│       │   └── categorias.js        # Categorías con color y emoji
│       └── App.jsx                  # Componente principal con estado global
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
| Fase 2 | useContext híbrido + useRef + Tema visual | 🔄 Pendiente |
| Fase 3 | useReducer + Gráficas Recharts | 🔄 Pendiente |
| Fase 4 | Custom hooks + Deploy + Video | 🔄 Pendiente |

---

## Mis primeras Series y Películas

https://drive.google.com/file/d/16wmYPcvg1WHMvoCK9Y2r4enynxIc_p8Q/view?usp=sharing

- **Bridgerton** — Romance | Serie | Netflix | viendo
- **Euphoria** — Drama | Serie | Max | pendiente
- **Lista terminal** — Serie | Amazon Prime | pendiente
