import { pool } from '../config/db.js';

export const createIncidencia = async (req, res) => {
  try {
    console.log('Body recibido:', req.body);
    console.log('Archivos recibidos:', req.files);
    
    const { asunto, descripcion, tipo, ubicacion } = req.body;
    
    // Verificar que los campos requeridos estén presentes
    if (!asunto || !descripcion || !tipo || !ubicacion) {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    // Manejar las imágenes
    const imagenes = req.files && req.files.length > 0
      ? JSON.stringify(req.files.map(file => file.path))
      : '[]';

    console.log('Imágenes procesadas:', imagenes);

    // Verificar que req.user existe y tiene un id
    if (!req.user || !req.user.id) {
      console.log('Usuario no encontrado en la solicitud:', req.user);
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    console.log('ID de usuario:', req.user.id);

    const [result] = await pool.execute(
      'INSERT INTO incidencias (asunto, descripcion, tipo, ubicacion, imagenes, userId) VALUES (?, ?, ?, ?, ?, ?)',
      [asunto, descripcion, tipo, ubicacion, imagenes, req.user.id]
    );

    console.log('Resultado de la inserción:', result);

    res.status(201).json({ message: 'Incidencia creada exitosamente', incidenciaId: result.insertId });
  } catch (error) {
    console.error('Error al crear incidencia:', error);
    res.status(400).json({ message: 'Error al crear incidencia', error: error.message });
  }
};