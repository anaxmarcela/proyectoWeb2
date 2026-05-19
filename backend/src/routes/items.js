const express = require('express')
const router = express.Router()
const { pool } = require('../db')

router.get('/', async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT * FROM items WHERE activo = 1 ORDER BY fecharegistro DESC'
    )
    res.json(resultado.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al obtener items' })
  }
})

router.post('/', async (req, res) => {
  const { id, nombre, categoriaId, estado, puntuacion, fechaRegistro, fechaActividad, notas, atributos } = req.body
  try {
    await pool.query(
      `INSERT INTO items (id, nombre, categoriaid, estado, puntuacion, fecharegistro, fechaactividad, notas, atributos, activo)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,1)`,
      [id, nombre, categoriaId, estado, puntuacion, fechaRegistro, fechaActividad, notas, JSON.stringify(atributos)]
    )
    res.status(201).json({ mensaje: 'Item creado' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al crear item' })
  }
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { nombre, categoriaId, estado, puntuacion, fechaActividad, notas, atributos } = req.body
  try {
    await pool.query(
      `UPDATE items SET nombre=$1, categoriaid=$2, estado=$3, puntuacion=$4, fechaactividad=$5, notas=$6, atributos=$7
       WHERE id=$8`,
      [nombre, categoriaId, estado, puntuacion, fechaActividad, notas, JSON.stringify(atributos), id]
    )
    res.json({ mensaje: 'Item actualizado' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al actualizar item' })
  }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('UPDATE items SET activo=0 WHERE id=$1', [id])
    res.json({ mensaje: 'Item archivado' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al archivar item' })
  }
})

router.post('/:id/registro', async (req, res) => {
  const { id: itemId } = req.params
  const { id, fecha, valor, notas } = req.body
  try {
    await pool.query(
      'INSERT INTO registros (id, itemid, fecha, valor, notas) VALUES ($1,$2,$3,$4,$5)',
      [id || crypto.randomUUID(), itemId, fecha, valor, notas]
    )
    await pool.query('UPDATE items SET fechaactividad=$1 WHERE id=$2', [fecha, itemId])
    res.status(201).json({ mensaje: 'Registro creado' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al crear registro' })
  }
})

module.exports = router