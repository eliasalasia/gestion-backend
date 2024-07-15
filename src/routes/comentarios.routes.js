import express from 'express';
import { createComentario, getComentarios } from '../controllers/comentarios.controller.js';
import { verifyToken } from '../middlewares/jwt.middleware.js';

const router = express.Router();

router.post('/', verifyToken, createComentario);
router.get('/:incidenciaId', verifyToken, getComentarios);

export default router;