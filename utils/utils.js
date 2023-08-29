export function filterMovies (movies, genre, year) {
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
