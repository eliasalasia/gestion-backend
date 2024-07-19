import express from 'express'
import {PORT}  from './config/config.js'
import userRoutes from './routes/users.routes.js';
import incidenciaRoutes from './routes/incidencias.routes.js';
import comentarioRoutes from './routes/comentarios.routes.js';
import { corsOptions, validateCORS } from './middlewares/cors.options.js';
import cors from 'cors'

const app = express()

app.use(cors(corsOptions));
app.use(validateCORS);
app.use(express.json())

app.use('/uploads', express.static('uploads'));
 
app.use('/api/users', userRoutes);
app.use('/api/incidencias', incidenciaRoutes); 
app.use('/api/comentarios', comentarioRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))


