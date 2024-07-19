import jwt from 'jsonwebtoken';
import { DB_SECRET_KEY } from '../config/config.js';

export const verifyToken = (req, res, next) => {
  console.log('Iniciando verificación de token');
  
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log('No se proporcionó el header de autorización');
      return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('No se pudo extraer el token del header');
      return res.status(401).json({ message: 'Formato de token inválido' });
    }

    const decoded = jwt.verify(token, DB_SECRET_KEY);
    req.user = decoded; // Asegúrate de que req.user contiene el ID del usuario
    next();
  } catch (error) {
    console.error('Error en la verificación del token:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido' });
    }
    res.status(401).json({ message: 'Autenticación fallida', error: error.message });
  }
};