import fs from 'node:fs';

export function getMoviesFromJSON () {
  const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'));
  return movies;
}
