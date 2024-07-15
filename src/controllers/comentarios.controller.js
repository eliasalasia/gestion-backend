import {pool} from '../config/db.js';

// Crear un nuevo comentario
export const createComentario = async (req, res) => {
  try {
    const { contenido, incidenciaId } = req.body;
    // Insertar el comentario en la base de datos
    const [result] = await pool.execute(
      'INSERT INTO comentarios (contenido, userId, incidenciaId) VALUES (?, ?, ?)',
      [contenido, req.user.id, incidenciaId]
    );

    res.status(201).json({ message: 'Comentario creado exitosamente', comentarioId: result.insertId });
  } catch (error) {
    res.status(400).json({ message: 'Error al crear comentario', error: error.message });
  }
};

// Obtener todos los comentarios para una incidencia específica
export const getComentarios = async (req, res) => {
  try {
    // Recuperar los comentarios de la base de datos, incluyendo el nombre del usuario que hizo el comentario
    const [comentarios] = await pool.execute(
      'SELECT c.*, u.nombre as userName FROM comentarios c JOIN users u ON c.userId = u.id WHERE c.incidenciaId = ? ORDER BY c.createdAt DESC',
      [req.params.incidenciaId]
    );

    res.json(comentarios);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener comentarios', error: error.message });
  }
};