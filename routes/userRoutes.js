import express from 'express';

import checkAuth from '../middleware/authMiddleware.js';
import { registrar, perfil, confirmar, autenticar, olvidePass, comprobarToken, nuevoPassword } from '../controllers/userControllers.js'

const router = express.Router();

//RUTAS PUBLICAS
router.post('/', registrar)
router.get('/confirmar/:token', confirmar)
router.post('/login', autenticar)
router.post('/olvide-password', olvidePass)
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword) //Esta linea es el equivalente a las 2 de abajo (CHAINING)
// router.get('/olvide-password/:token', comprobarToken)
// router.post('/olvide-password/:token', nuevoPassword)

//RUTAS PRIVADAS 
router.get('/perfil', checkAuth, perfil)

export default router;