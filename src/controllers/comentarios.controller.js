import {pool} from '../config/db.js';

export const createComentario = async (req, res) => {
  try {
    const { contenido, incidenciaId } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO comentarios (contenido, userId, incidenciaId) VALUES (?, ?, ?)',
      [contenido, req.user.id, incidenciaId]
    );
    
    res.status(201).json({ message: 'Comentario creado exitosamente', comentarioId: result.insertId });
  } catch (error) {
    res.status(400).json({ message: 'Error al crear comentario', error: error.message });
  }
};

export const getComentarios = async (req, res) => {
  try {
    const [comentarios] = await pool.execute(
      'SELECT c.*, u.nombre as userName FROM comentarios c JOIN users u ON c.userId = u.id WHERE c.incidenciaId = ? ORDER BY c.createdAt DESC',
      [req.params.incidenciaId]
    );
    
    res.json(comentarios);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener comentarios', error: error.message });
  }
};