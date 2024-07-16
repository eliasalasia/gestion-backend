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
    res.status(400).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};