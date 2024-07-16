import {pool} from '../config/db.js';


// Crear un nuevo comentario
export const createComentario = async (req, res) => {
  try {
    const { contenido, incidenciaId } = req.body;
    const userId = req.user.id;

    // Verificar que contenido e incidenciaId estén presentes en el cuerpo de la solicitud
    if (!contenido || !incidenciaId) {
      return res.status(400).json({ message: 'Contenido e incidenciaId son campos requeridos' });
    }

    // Obtener el tipo de usuario desde la base de datos
    const [users] = await pool.execute('SELECT tipo FROM users WHERE id = ?', [userId]);

    if (users.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const userType = users[0].tipo;

    // Verificar si el usuario es residente y si la incidencia le pertenece
    if (userType !== 'administrador') {
      const [incidencias] = await pool.execute(
        'SELECT * FROM incidencias WHERE id = ? AND userId = ?',
        [incidenciaId, userId]
      );

      if (incidencias.length === 0) {
        return res.status(403).json({ message: 'Acceso no autorizado para comentar en esta incidencia' });
      }
    }

    // Insertar el comentario en la base de datos
    const [result] = await pool.execute(
      'INSERT INTO comentarios (contenido, userId, incidenciaId) VALUES (?, ?, ?)',
      [contenido, userId, incidenciaId]
    );

    res.status(201).json({ message: 'Comentario creado exitosamente', comentarioId: result.insertId });
  } catch (error) {
    res.status(400).json({ message: 'Error al crear comentario', error: error.message });
  }
};



export const getComentarios = async (req, res) => {
  try {
    const userId = req.user.id; // Obtenemos el ID del usuario del token
    const incidenciaId = req.params.incidenciaId;

    console.log('Usuario ID:', userId);
    console.log('Incidencia ID:', incidenciaId);

    // Obtener el tipo de usuario de la base de datos
    const [userResult] = await pool.execute('SELECT tipo FROM users WHERE id = ?', [userId]);
    
    if (userResult.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const userType = userResult[0].tipo;
    console.log('Tipo de usuario:', userType);

    let tieneAcceso = false;

    if (userType === 'administrador') {
      tieneAcceso = true;
    } else {
      // Verificar si la incidencia pertenece al usuario residente
      const [incidencia] = await pool.execute(
        'SELECT * FROM incidencias WHERE id = ? AND userId = ?',
        [incidenciaId, userId]
      );
      tieneAcceso = incidencia.length > 0;
    }

    if (!tieneAcceso) {
      return res.status(403).json({ message: 'Acceso no autorizado para ver comentarios de esta incidencia' });
    }

    // Obtener los comentarios
    const [comentarios] = await pool.execute(
      'SELECT c.*, u.nombre as userName FROM comentarios c JOIN users u ON c.userId = u.id WHERE c.incidenciaId = ? ORDER BY c.createdAt DESC',
      [incidenciaId]
    );

    return res.json(comentarios);
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
