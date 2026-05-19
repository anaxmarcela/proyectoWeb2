const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { inicializarTablas } = require('./db')
const itemsRouter = require('./routes/items')

const app = express()
const PUERTO = process.env.PORT || 3000

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
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