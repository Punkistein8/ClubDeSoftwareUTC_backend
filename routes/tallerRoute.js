import express from 'express'
import { agregarTaller, inscribirseTaller, estoyInscrito } from '../controllers/tallerControllers.js'
import checkAuth from '../middleware/authMiddleware.js'
const router = express.Router();

router.route('/agg-tall').post(agregarTaller);
router.route('/').post(checkAuth, inscribirseTaller).get(checkAuth, estoyInscrito);

export default router;