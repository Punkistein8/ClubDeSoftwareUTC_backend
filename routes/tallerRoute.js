import express from 'express'
import { agregarTaller, inscribirseTaller, estoyInscrito, obtenerTalleres } from '../controllers/tallerControllers.js'
import checkAuth from '../middleware/authMiddleware.js'
const router = express.Router();

//Admins
router.route('/agg-tall').post(agregarTaller).get(obtenerTalleres);

//Privadas
router.route('/').post(checkAuth, inscribirseTaller).get(checkAuth, estoyInscrito);

export default router;