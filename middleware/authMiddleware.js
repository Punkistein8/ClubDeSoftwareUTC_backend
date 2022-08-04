import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuarios.js';

const checkAuth = async (req, res, next) => {

  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; //Split para separar el Bearer de el token
      const { id } = jwt.verify(token, process.env.JWT_SECRET); //Verifica el token y lo decodifica con el secret de JWT y lo guarda en la variable id
      const usuarioLogeado = await Usuario.findById(id).select('-password -token -confirmado'); //Busca el usuario por el id y lo guarda en la variable usuarioLogeado
      req.user = usuarioLogeado; //OJO, almacenando el usuario logeado en variable del servidor express
      return next(); //Pasa al siguiente middleware o ruta que se encuentra en el request (en este caso userRoutes)
    } catch (error) { //Si hay un error en la verificacion del token
      const e = new Error('Token no valido: '); //Crea un error
      return res.status(403).json({ msg: e.message + error }) //Retorna un mensaje de error
    }
  }

  if (!token) { //Si no hay token en el request (no se ha logeado)
    const e = new Error('Token invalido o no existente'); //Crea un error
    return res.status(403).json({ msg: e.message }) //Retorna un mensaje de error
  }

  next(); //Pasa al siguiente middleware o ruta que se encuentra en el request (en este caso userRoutes) (Este es el default)
}

export default checkAuth;