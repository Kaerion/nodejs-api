import { getMoviesFromJSON } from '../utils/utils.js';
import { randomUUID } from 'node:crypto';

const movies = getMoviesFromJSON();

export class MoviesModel {
  static getAll = async ({ genre, year }) => {
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
  };

  static async getById ({ id }) {
    const movie = movies.find(movie => movie.id === id);
    return movie;
  }

  static async getByGenre ({ genre }) {
    const moviesByGenre = movies.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()));

    return moviesByGenre;
  }

  static async create ({ input }) {
    const newMovie = {
      id: randomUUID(),
      ...input
    };

    movies.push(newMovie);
    return newMovie;
  }

  static async delete ({ id }) {
    const movieIndex = movies.findIndex(movie => movie.id === id);
    if (movieIndex === -1) return false;
    movies.splice(movieIndex, 1);
    return true;
  }

  static async update ({ id, input }) {
    const movieIndex = movies.findIndex(movie => movie.id === id);
    if (movieIndex === -1) return false;
    const updateMovie = {
      ...movies[movieIndex],
      ...input
    };

    movies[movieIndex] = updateMovie;
    return movies[movieIndex];
  }
}
