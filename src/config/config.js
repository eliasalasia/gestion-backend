import { config } from 'dotenv';

config();

export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_USER = process.env.DB_USER || 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD || '';
export const DB_DATABASE = process.env.DB_DATABASE || 'incidencias_db';
export const DB_PORT = process.env.DB_PORT || 3306;
export const PORT = process.env.PORT || 3000;
export const DB_SECRET_KEY = process.env.SECRET_KEY || 'qweasd123'; 
export const allowedOrigins = ['http://localhost:5173']