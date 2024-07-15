import express from 'express';
import { createIncidencia } from '../controllers/incidencias.controller.js';
import { verifyToken } from '../middlewares/jwt.middleware.js';
import upload from '../middlewares/multer.middleware.js';

const router = express.Router();

router.post('/', verifyToken, upload.array('imagenes', 5), createIncidencia);
/*router.get('/', verifyToken, getIncidencias);
router.get('/:id', verifyToken, getIncidencia);
router.put('/:id', verifyToken, upload.array('imagenes', 5), updateIncidencia);
router.delete('/:id', verifyToken, deleteIncidencia);*/

export default router;