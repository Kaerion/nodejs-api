import { Router } from 'express';
import fs from 'node:fs';
import { filterMovies } from '../utils/utils.js';
import { randomUUID } from 'node:crypto';
import { validateMovie, validatePartialMovie } from '../schemas/movies.js';

export const router = Router();
const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'));

/** Obtener todas las peliculas o filtrado por genero.
 * Prueba de varios filtrados con req.query
*/
router.get('/', (req, res) => {
  try {
    const { genre, year } = req.query;
    const filteredMovies = filterMovies(movies, genre, year);
    res.json(filteredMovies);
  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.status(500).json({ error: 'An error occurred while filtering movies' });
  }
});

/** Pelicula por id */
router.get('/:id', (req, res) => {
  const id = req.params.id;
  const movie = movies.find(movie => movie.id === id);
  if (movie) {
    return res.json(movie);
  } else {
    res.status(404).json({ message: 'Movie not found' });
  }
});

// Peliculas por genero
router.get('/genre/:genre', (req, res) => {
  const genre = req.params.genre;
  console.log(genre);
  const moviesByGenre = movies.filter(
    movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()));
  if (moviesByGenre) {
    return res.json(moviesByGenre);
  } else {
    res.status(404).json({ message: 'Movies not found with this genre' });
  }
});

// Crear pelicula
router.post('/', (req, res) => {
  const result = validateMovie(req.body);

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const newMovie = {
    id: randomUUID(),
    ...result.data
  };

  movies.push(newMovie);

  res.status(201).json(newMovie);
});

// Actualizar Pelicula
router.patch('/:id', (req, res) => {
  const result = validatePartialMovie(req.body);

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const { id } = req.params;
  const movieIndex = movies.findIndex(movie => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not Found.' });
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  };

  movies[movieIndex] = updateMovie;
  return res.json(updateMovie);
});

// Eliminar Pelicula
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const movieIndex = movies.findIndex(movie => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not Found.' });
  }

  movies.splice(movieIndex, 1);
  return res.json({ message: 'Movie Deleted' });
});
