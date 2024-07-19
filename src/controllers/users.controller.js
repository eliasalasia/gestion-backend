import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import { DB_SECRET_KEY } from '../config/config.js';

export const register = async (req, res) => {
  try {
    const { nombre, email, contraseña, tipo, apartamento, piso } = req.body;
    const hashedPassword = await bcrypt.hash(contraseña, 12);

    const [result] = await pool.execute(
      'INSERT INTO users (nombre, email, contraseña, tipo, apartamento, piso) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, email, hashedPassword, tipo, apartamento, piso]
    );

    res.status(201).json({ message: 'Usuario registrado exitosamente', userId: result.insertId });
  } catch (error) {
    res.status(400).json({ message: 'Error al registrar usuario', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, contraseña } = req.body;
    
    if (!email || !contraseña) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(contraseña, user.contraseña);

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user.id }, DB_SECRET_KEY, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, nombre: user.nombre, tipo: user.tipo, piso: user.piso } });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


export const getUserData = async (req, res) => {
  try {
    const userId = req.user.id; // Asegúrate de que el ID del usuario esté en req.user
    const [users] = await pool.execute('SELECT id, nombre, email, tipo, apartamento, piso FROM users WHERE id = ?', [userId]);

    if (users.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};