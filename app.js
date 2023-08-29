/* eslint-disable no-debugger */
const { validateMovie, validatePartialMovie } = require('./schemas/movies.js');
const express = require('express');
const movies = require('./movies.json');
const crypto = require('node:crypto');
const cors = require('cors');

const app = express();
app.use(express.json()); // Funcion para traer cuerpo de request con express
app.disable('x-powered-by');

// Solucion para CORS de metodos complejos (PUT, PATCH, DELETE)
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:8080',
      'http://localhost:1234'
    ];

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }

    if (!origin) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  }
}));

/** Prueba Hola mundo */
app.get('/', (req, res) => {
  res.json({ message: 'API Peliculas' });
});

/** Obtener todas las peliculas o filtrado por genero.
 * Prueba de varios filtrados con req.query
*/

app.get('/movies', (req, res) => {
  try {
    const { genre, year } = req.query;

    // Validación de entrada
    if (genre && typeof genre !== 'string') {
      return res.status(400).json({ error: 'Invalid genre' });
    }
    if (year && isNaN(year)) {
      return res.status(400).json({ error: 'Invalid year' });
    }

    const filteredMovies = filterMovies(movies, genre, year);

    res.json(filteredMovies);
  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.status(500).json({ error: 'An error occurred while filtering movies' });
  }
});

function filterMovies (movies, genre, year) {
  let filteredMovies = movies;
  if (genre) {
    filteredMovies = filteredMovies.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    );
  }
  if (year) {
    filteredMovies = filteredMovies.filter(movie => movie.year.toString() === year.toString());
  }
  return filteredMovies;
}

/// //////////////////

/** Pelicula por id */
app.get('/movies/:id', (req, res) => {
  const id = req.params.id;
  const movie = movies.find(movie => movie.id === id);
  if (movie) {
    return res.json(movie);
  } else {
    res.status(404).json({ message: 'Movie not found' });
  }
});

// Peliculas por genero
app.get('/movies/genre/:genre', (req, res) => {
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
app.post('/movies', (req, res) => {
  const result = validateMovie(req.body);

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  };
  movies.push(newMovie); // Agregar la nueva película al array en memoria

  // Convertir el array de películas a una cadena en formato JSON
  /* const jsonMovies = JSON.stringify(movies, null, 2);

  // Escribir la cadena en el archivo movies.json
  fs.writeFile('./movies.json', jsonMovies, (err) => {
    if (err) {
      console.error(err);
      // Si hubo un error al escribir el archivo, enviar una respuesta con código de estado 500 (Error interno del servidor)
      return res.status(500).json({ error: 'An error occurred while saving the movie' });
    }

    // Si no hubo errores, enviar una respuesta con código de estado 201 (Creado)
    res.status(201).json(newMovie);
  }); */
  res.status(201).json(newMovie);
});

// Actualizar Pelicula
app.patch('/movies/:id', (req, res) => {
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
app.delete('/movies/:id', (req, res) => {
  const { id } = req.params;
  const movieIndex = movies.findIndex(movie => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not Found.' });
  }

  movies.splice(movieIndex, 1);
  return res.json({ message: 'Movie Deleted' });
});

/** Puerto http en escucha. */
const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
