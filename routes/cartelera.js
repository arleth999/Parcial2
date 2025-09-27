const express = require('express');
const router = express.Router();
const { getConnection, sql } = require('../db');

/**
 * @swagger
 * components:
 *   schemas:
 *     PeliculaArlet:
 *       type: object
 *       properties:
 *         imdbID:
 *           type: string
 *           description: ID de la película en IMDB.
 *         Titulo:
 *           type: string
 *           description: Título de la película.
 *         Anio:
 *           type: string
 *           description: Año de estreno.
 *         Tipo:
 *           type: string
 *           description: Tipo (ej. Película, Serie).
 *         Poster:
 *           type: string
 *           description: URL del póster de la película.
 *         Estado:
 *           type: boolean
 *           description: Estado de disponibilidad.
 *         Descripcion:
 *           type: string
 *           description: Sinopsis o descripción de la película.
 *         Ubicacion:
 *           type: string
 *           description: Ubicación en el cine.
 *       example:
 *         imdbID: "tt0111161"
 *         Titulo: "The Shawshank Redemption"
 *         Anio: "1994"
 *         Tipo: "movie"
 *         Poster: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg"
 *         Estado: true
 *         Descripcion: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency."
 *         Ubicacion: "Sala 1"
 */

/**
 * @swagger
 * tags:
 *   name: CarteleraArlet
 *   description: API para gestionar la cartelera de Arlet
 */

/**
 * @swagger
 * /api/cartelera:
 *   get:
 *     summary: Devuelve la lista completa de películas disponibles
 *     tags: [CarteleraArlet]
 *     responses:
 *       200:
 *         description: Lista de películas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PeliculaArlet'
 *       500:
 *         description: Error en el servidor.
 */
router.get('/', async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT imdbID, Titulo, Anio, Tipo, Poster, Estado, Descripcion, Ubicacion FROM peliculas444');
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ codError: "500", msgRespuesta: "Error interno del servidor" });
    }
});

/**
 * @swagger
 * /api/cartelera:
 *   post:
 *     summary: Inserta un nuevo registro de película
 *     tags: [CarteleraArlet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PeliculaArlet'
 *     responses:
 *       200:
 *         description: Registro insertado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 codError:
 *                   type: string
 *                 msgRespuesta:
 *                   type: string
 *               example:
 *                 codError: "200"
 *                 msgRespuesta: "Registro Insertado"
 *       400:
 *         description: Error de solicitud o datos inválidos.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/', async (req, res) => {
    const { imdbID, Titulo, Anio, Tipo, Poster, Estado, Descripcion, Ubicacion } = req.body;
    if (!imdbID || !Titulo) {
        return res.status(400).json({ codError: "400", msgRespuesta: "imdbID y Titulo son campos requeridos." });
    }

    try {
        const pool = await getConnection();
        await pool.request()
            .input('imdbID', sql.NVarChar(50), imdbID)
            .input('Titulo', sql.NVarChar(255), Titulo)
            .input('Anio', sql.NVarChar(10), Anio)
            .input('Tipo', sql.NVarChar(50), Tipo)
            .input('Poster', sql.NVarChar(sql.MAX), Poster)
            .input('Estado', sql.Bit, Estado)
            .input('Descripcion', sql.NVarChar(sql.MAX), Descripcion)
            .input('Ubicacion', sql.NVarChar(100), Ubicacion)
            .query('INSERT INTO peliculas444 (imdbID, Titulo, Anio, Tipo, Poster, Estado, Descripcion, Ubicacion) VALUES (@imdbID, @Titulo, @Anio, @Tipo, @Poster, @Estado, @Descripcion, @Ubicacion)');
        
        res.status(200).json({ codError: "200", msgRespuesta: "Registro Insertado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ codError: "500", msgRespuesta: "Error interno del servidor" });
    }
});

/**
 * @swagger
 * /api/cartelera/{imdbID}:
 *   put:
 *     summary: Actualiza un registro existente basado en su imdbID
 *     tags: [CarteleraArlet]
 *     parameters:
 *       - in: path
 *         name: imdbID
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID de la película a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PeliculaArlet'
 *     responses:
 *       200:
 *         description: Registro actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 codError:
 *                   type: string
 *                 msgRespuesta:
 *                   type: string
 *               example:
 *                 codError: "200"
 *                 msgRespuesta: "Registro actualizado correctamente"
 *       400:
 *         description: Solicitud inválida o mal formada.
 *       404:
 *         description: Registro no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.put('/:imdbID', async (req, res) => {
    const { imdbID } = req.params;
    const { Titulo, Anio, Tipo, Poster, Estado, Descripcion, Ubicacion } = req.body;

    if (!Titulo) {
        return res.status(400).json({ codError: "400", msgRespuesta: "Titulo es un campo requerido en el body." });
    }

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('imdbID', sql.NVarChar(50), imdbID)
            .input('Titulo', sql.NVarChar(255), Titulo)
            .input('Anio', sql.NVarChar(10), Anio)
            .input('Tipo', sql.NVarChar(50), Tipo)
            .input('Poster', sql.NVarChar(sql.MAX), Poster)
            .input('Estado', sql.Bit, Estado)
            .input('Descripcion', sql.NVarChar(sql.MAX), Descripcion)
            .input('Ubicacion', sql.NVarChar(100), Ubicacion)
            .query('UPDATE peliculas444 SET Titulo = @Titulo, Anio = @Anio, Tipo = @Tipo, Poster = @Poster, Estado = @Estado, Descripcion = @Descripcion, Ubicacion = @Ubicacion WHERE imdbID = @imdbID');
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ codError: "404", msgRespuesta: "Registro no encontrado" });
        }
        
        res.status(200).json({ codError: "200", msgRespuesta: "Registro actualizado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ codError: "500", msgRespuesta: "Error interno del servidor" });
    }
});

module.exports = router;
