import { Router } from 'express';
import { MoviesController } from '../controllers/movies.js';

export const router = Router();

/** Obtener todas las peliculas o filtrado por genero.
 * Prueba de varios filtrados con req.query
*/
router.get('/', MoviesController.getAll);

/** Pelicula por id */
router.get('/:id', MoviesController.getById);

// Peliculas por genero
router.get('/genre/:genre', MoviesController.getByGenre);

// Crear pelicula
router.post('/', MoviesController.create);

// Actualizar Pelicula
router.patch('/:id', MoviesController.update);

// Eliminar Pelicula
router.delete('/:id', MoviesController.delete);
