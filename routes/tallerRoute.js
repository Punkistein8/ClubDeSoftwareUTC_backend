import express from 'express'
import { agregarTaller, inscribirseTaller, talleresInscritos, obtenerTalleres, estoyInscritoEnEsteTaller } from '../controllers/tallerControllers.js'
import checkAuth from '../middleware/authMiddleware.js'
const router = express.Router();

//Admins
router.route('/agg-tall').post(agregarTaller).get(obtenerTalleres);

//Privadas
router.route('/ident-tall').post(checkAuth, estoyInscritoEnEsteTaller)
router.route('/inscr-tall').post(checkAuth, inscribirseTaller)
router.route('/mis-inscritos').get(checkAuth, talleresInscritos)

export default router;