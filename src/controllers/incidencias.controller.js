import { pool } from '../config/db.js';

export const createIncidencia = async (req, res) => {
  try {
    const { asunto, descripcion, estado, tipo, ubicacion } = req.body;

    if (!asunto || !descripcion || !estado || !tipo || !ubicacion) {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    // Insertar la incidencia en la tabla incidencias
    const [result] = await pool.execute(
      'INSERT INTO incidencias (asunto, descripcion, tipo, estado, ubicacion, userId) VALUES (?, ?, ?, ?, ?, ?)',
      [asunto, descripcion, tipo, estado, ubicacion, req.user.id]
    );

    const incidenciaId = result.insertId;

    // Insertar las rutas de las imágenes en la tabla imagenes
    if (req.files && req.files.length > 0) {
      const imagenesPromises = req.files.map(file => {
        return pool.execute(
          'INSERT INTO imagenes (incidenciaId, rutaImagen) VALUES (?, ?)',
          [incidenciaId, file.path]
        );
      });

      await Promise.all(imagenesPromises);
    }

    res.status(201).json({ message: 'Incidencia creada exitosamente', incidenciaId });
  } catch (error) {
    console.error('Error al crear incidencia:', error);
    res.status(500).json({ message: 'Error al crear incidencia', error: error.message });
  }
};

// Esta ruta dependiendo de que seas Administrador/residente te mostrará o todas las incidencias o todas las del mismo residente. 
export const allIncidencias = async (req, res) => {
  console.log('Entrando en allIncidencias');
  console.log('Usuario en req:', req.user);

  try {
    const userId = req.user.id;
    console.log('ID de usuario:', userId);

    // Obtener el tipo de usuario de la tabla users
    const [users] = await pool.execute('SELECT tipo FROM users WHERE id = ?', [userId]);
    console.log('Resultado de la consulta de usuario:', users);

    if (users.length === 0) {
      console.log('Usuario no encontrado en la base de datos');
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const userType = users[0].tipo;
    console.log('Tipo de usuario:', userType);

    let incidencias;

    if (userType === 'administrador') {
      console.log('Usuario es administrador, obteniendo todas las incidencias');
      [incidencias] = await pool.execute('SELECT i.*, u.piso FROM incidencias i JOIN users u ON i.userId = u.id');
    } else {
      console.log('Usuario es residente, obteniendo sus incidencias');
      [incidencias] = await pool.execute('SELECT i.*, u.piso FROM incidencias i JOIN users u ON i.userId = u.id WHERE i.userId = ?', [userId]);
    }

    console.log('Número de incidencias obtenidas:', incidencias.length);

    // Recuperar las imágenes para cada incidencia
    const incidenciasConImagenes = await Promise.all(incidencias.map(async (incidencia) => {
      const [imagenes] = await pool.execute('SELECT rutaImagen FROM imagenes WHERE incidenciaId = ?', [incidencia.id]);
      incidencia.imagenes = imagenes.map(img => `http://localhost:3000/uploads/${img.rutaImagen}`); // Asegúrate que esta ruta es correcta
      return incidencia;
    }));

    console.log('Enviando respuesta con incidencias');
    res.json(incidenciasConImagenes);
  } catch (error) {
    console.error('Error en allIncidencias:', error);
    res.status(500).json({ message: 'Error al obtener incidencias', error: error.message });
  }
};

export const IncidenciaById = async (req, res) => {
  const { id } = req.params;
  try {
    const [incidencia] = await pool.execute('SELECT i.*, u.piso FROM incidencias i JOIN users u ON i.userId = u.id WHERE i.id = ?', [id]);
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

export const IncidenciasByEstado = async (req, res) => {
  const { estado } = req.params;
  const userId = req.user.id;

  try {
    // Obtener el tipo de usuario
    const [users] = await pool.execute('SELECT tipo FROM users WHERE id = ?', [userId]);

    if (users.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const userType = users[0].tipo;
    let incidencias;

    if (userType === 'administrador') {
      // Administrador: obtener todas las incidencias del estado especificado
      [incidencias] = await pool.execute(
        'SELECT i.*, u.piso, u.nombre AS nombre_residente FROM incidencias i JOIN users u ON i.userId = u.id WHERE i.estado = ?',
        [estado]
      );
    } else {
      // Residente: obtener solo sus incidencias del estado especificado
      [incidencias] = await pool.execute(
        'SELECT i.*, u.piso FROM incidencias i JOIN users u ON i.userId = u.id WHERE i.estado = ? AND i.userId = ?',
        [estado, userId]
      );
    }

    if (incidencias.length === 0) {
      return res.status(404).json({ message: 'No se encontraron incidencias con este estado' });
    }

    // Obtener imágenes para cada incidencia
    const incidenciasConImagenes = await Promise.all(incidencias.map(async (incidencia) => {
      const [imagenes] = await pool.execute('SELECT rutaImagen FROM imagenes WHERE incidenciaId = ?', [incidencia.id]);
      incidencia.imagenes = imagenes.map(img => img.rutaImagen);
      return incidencia;
    }));

    res.json(incidenciasConImagenes);
  } catch (error) {
    console.error('Error en IncidenciasByEstado:', error);
    res.status(500).json({ message: 'Error al obtener incidencias por estado', error: error.message });
  }
};

export const updateIncidencia = async (req, res) => {
  const { id } = req.params;
  const { asunto, descripcion, tipo, estado, ubicacion } = req.body;

  // Log para verificar los datos recibidos
  console.log('Datos recibidos:', { asunto, descripcion, tipo, estado, ubicacion });

  try {
    // Validar que los campos requeridos no sean undefined
    if (asunto === undefined || descripcion === undefined || tipo === undefined || estado === undefined || ubicacion === undefined) {
      return res.status(400).json({ message: 'Faltan campos requeridos para actualizar la incidencia' });
    }

    // Actualizar la incidencia
    const [result] = await pool.execute(
      'UPDATE incidencias SET asunto = ?, descripcion = ?, tipo = ?, estado = ?, ubicacion = ? WHERE id = ?',
      [asunto, descripcion, tipo, estado, ubicacion, id]
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

export const updateIncidenciaEstado = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    if (!estado) {
      return res.status(400).json({ message: 'El campo estado es requerido' });
    }

    const [result] = await pool.execute(
      'UPDATE incidencias SET estado = ? WHERE id = ?',
      [estado, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Incidencia no encontrada' });
    }

    res.json({ message: 'Estado de incidencia actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el estado de la incidencia', error: error.message });
  }
};