const express = require('express');
const movies = require('./movies.json');

const app = express();
app.disable('x-powered-by');

/** Prueba Hola mundo */
app.get('/', (req, res) => {
  res.json({ message: 'API Peliculas' });
});

/** Obtener todas las peliculas o filtrado por genero.
 * Prueba de varios filtrados con req.query
*/
app.get('/movies', (req, res) => {
  const { genre, year } = req.query;
  let filteredMovies = movies;
  if (genre) {
    filteredMovies = filteredMovies.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    );
  }
  if (year) {
    filteredMovies = filteredMovies.filter(movie => movie.year.toString() === year.toString());
  }

  res.json(filteredMovies);
});

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

/** Puerto http en escucha. */
const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
