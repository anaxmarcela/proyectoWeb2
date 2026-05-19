const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

async function inicializarTablas() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      categoriaid TEXT,
      estado TEXT,
      puntuacion REAL,
      fecharegistro TEXT,
      fechaactividad TEXT,
      notas TEXT,
      atributos TEXT,
      activo INTEGER DEFAULT 1
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS registros (
      id TEXT PRIMARY KEY,
      itemid TEXT REFERENCES items(id),
      fecha TEXT,
      valor INTEGER,
      notas TEXT
    )
  `)

  console.log('Tablas verificadas')
}

module.exports = { pool, inicializarTablas }