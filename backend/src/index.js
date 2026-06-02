const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { inicializarTablas } = require('./db')
const itemsRouter = require('./routes/items')

const app = express()
const PUERTO = process.env.PORT || 3000

const origenesPermitidos = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origenesPermitidos.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`CORS bloqueado para: ${origin}`))
    }
  }
}))
app.use(express.json())

app.use('/api/items', itemsRouter)

app.get('/', (req, res) => {
  res.json({ mensaje: 'API Tracker de Series y Películas' })
})

inicializarTablas().then(() => {
  app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en puerto ${PUERTO}`)
  })
}).catch(err => {
  console.error('Error al inicializar BD:', err)
  process.exit(1)
})