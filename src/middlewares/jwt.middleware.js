import jwt from 'jsonwebtoken';
import { DB_SECRET_KEY } from "../config/config.js";



export const verifyToken = (req, res, next) => {
  console.log('Iniciando verificación de token');
  
  try {
    if (!req.headers.authorization) {
      console.log('No se proporcionó el header de autorización');
      return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
    }

    const authHeader = req.headers.authorization;
    console.log('Header de autorización:', authHeader);

    const token = authHeader.split(' ')[1];
    console.log('Token extraído:', token);

    if (!token) {
      console.log('No se pudo extraer el token del header');
      return res.status(401).json({ message: 'Formato de token inválido' });
    }

    console.log('JWT_SECRET:', DB_SECRET_KEY); // Ten cuidado de no log esto en producción

    const decoded = jwt.verify(token, DB_SECRET_KEY);
    console.log('Token decodificado:', decoded);

    req.user = decoded;
    console.log('Usuario autenticado:', req.user);

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