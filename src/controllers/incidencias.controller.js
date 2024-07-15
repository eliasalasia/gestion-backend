import { pool } from '../config/db.js';

export const createIncidencia = async (req, res) => {
  try {
    const { asunto, descripcion, tipo, ubicacion } = req.body;

    if (!asunto || !descripcion || !tipo || !ubicacion) {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const estado = 'pendiente';
    const createdAt = new Date();
    const updatedAt = new Date();

    // Insertar la incidencia en la tabla incidencias
    const [result] = await pool.execute(
      'INSERT INTO incidencias (asunto, descripcion, tipo, estado, ubicacion, userId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [asunto, descripcion, tipo, estado, ubicacion, req.user.id, createdAt, updatedAt]
    );

    const incidenciaId = result.insertId;

    // Insertar las rutas de las imágenes en la tabla imagenes
    if (req.files && req.files.length > 0) {
      const imagenesPromises = req.files.map(file => {
        return pool.execute(
          'INSERT INTO imagenes (incidenciaId, rutaImagen, createdAt, updatedAt) VALUES (?, ?, ?, ?)',
          [incidenciaId, file.path, createdAt, updatedAt]
        );
      });

      await Promise.all(imagenesPromises);
    }

    res.status(201).json({ message: 'Incidencia creada exitosamente', incidenciaId });
  } catch (error) {
    res.status(400).json({ message: 'Error al crear incidencia', error: error.message });
  }
};

export const allIncidencias = async (req, res) => {
  try {
    const [incidencias] = await pool.execute('SELECT * FROM incidencias');

    // Recuperar las imágenes para cada incidencia
    const incidenciasConImagenes = await Promise.all(incidencias.map(async (incidencia) => {
      const [imagenes] = await pool.execute('SELECT rutaImagen FROM imagenes WHERE incidenciaId = ?', [incidencia.id]);
      incidencia.imagenes = imagenes.map(img => img.rutaImagen);
      return incidencia;
    }));

    res.json(incidenciasConImagenes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener incidencias', error: error.message });
  }
};

export const IncidenciaById = async (req, res) => {
  const { id } = req.params;
  try {
    const [incidencia] = await pool.execute('SELECT * FROM incidencias WHERE id = ?', [id]);
    if (incidencia.length === 0) {
      return res.status(404).json({ message: 'Incidencia no encontrada' });
    }

    const [imagenes] = await pool.execute('SELECT rutaImagen FROM imagenes WHERE incidenciaId = ?', [id]);
    incidencia[0].imagenes = imagenes.map(img => img.rutaImagen);

    res.json(incidencia[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener incidencia', error: error.message });
  }
};

export const updateIncidencia = async (req, res) => {
  const { id } = req.params;
  const { asunto, descripcion, tipo, ubicacion } = req.body;

  try {
    // Actualizar la incidencia
    const [result] = await pool.execute(
      'UPDATE incidencias SET asunto = ?, descripcion = ?, tipo = ?, ubicacion = ? WHERE id = ?',
      [asunto, descripcion, tipo, ubicacion, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Incidencia no encontrada' });
    }

    // Actualizar las imágenes (eliminarlas y volver a insertarlas)
    if (req.files && req.files.length > 0) {
      await pool.execute('DELETE FROM imagenes WHERE incidenciaId = ?', [id]);
      const createdAt = new Date();
      const updatedAt = new Date();
      const imagenesPromises = req.files.map(file => {
        return pool.execute(
          'INSERT INTO imagenes (incidenciaId, rutaImagen, createdAt, updatedAt) VALUES (?, ?, ?, ?)',
          [id, file.path, createdAt, updatedAt]
        );
      });

      await Promise.all(imagenesPromises);
    }

    res.json({ message: 'Incidencia actualizada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar incidencia', error: error.message });
  }
};

export const deleteIncidencia = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.execute('DELETE FROM incidencias WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Incidencia no encontrada' });
    }

    // Eliminar las imágenes asociadas a la incidencia
    await pool.execute('DELETE FROM imagenes WHERE incidenciaId = ?', [id]);

    res.json({ message: 'Incidencia eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar incidencia', error: error.message });
  }
};
