import { MoviesModel } from '../models/movies.js';
import { validateMovie, validatePartialMovie } from '../schemas/movies.js';

export class MoviesController {
  static async getAll (req, res) {
    try {
      const { genre, year } = req.query;
      const movies = await MoviesModel.getAll(genre, year);
      res.json(movies);
    } catch (error) {
    // Manejo de errores
      console.error(error);
      res.status(500).json({ error: 'An error occurred while filtering movies' });
    }
  }

  static async getById (req, res) {
    const id = req.params.id;
    const movie = await MoviesModel.getById(id);
    if (movie) {
      return res.json(movie);
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  }

  static async getByGenre (req, res) {
    const genre = req.params.genre;
    const moviesByGenre = await MoviesModel.getByGenre(genre);
    if (moviesByGenre) {
      return res.json(moviesByGenre);
    } else {
      res.status(404).json({ message: 'Movies not found with this genre' });
    }
  }

  static async create (req, res) {
    const result = validateMovie(req.body);

    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const newMovie = await MoviesModel.create({ input: result.data });

    res.status(201).json(newMovie);
  }

  static async update (req, res) {
    const result = validatePartialMovie(req.body);

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const { id } = req.params;
    const updateMovie = await MoviesModel.update({ id, input: result.data });
    return res.json(updateMovie);
  }

  static async delete (req, res) {
    const { id } = req.params;
    const result = await MoviesModel.delete(id);

    if (!result) {
      return res.status(404).json({ message: 'Movie not Found.' });
    }

    return res.json({ message: 'Movie Deleted' });
  }
}
