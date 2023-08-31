/* eslint-disable no-debugger */
import { router } from './routes/routes-movies.js';
import express, { json } from 'express';
import { corsMiddleware } from './middlewares/cors.js';

const app = express();

app.use(json()); // Funcion para traer cuerpo de request con express

// Solucion para CORS de metodos complejos (PUT, PATCH, DELETE)
app.use(corsMiddleware()); // origin: * Con esto funcionaria
app.use('/movies', router); // Enrutador de /movies
/* app.use(cors()); */

app.disable('x-powered-by'); // Elimina express ad

/** Puerto http en escucha. */
const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
