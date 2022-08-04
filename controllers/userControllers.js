import Usuario from '../models/Usuarios.js'
import generarId from '../helpers/generarId.js';
import generarJWT from '../helpers/generarJWT.js'
import emailRegistro from '../helpers/emailRegistro.js';
import emailOlvidePassword from '../helpers/emailOlvidePassword.js';

const registrar = async (req, res) => {
  //Prevenir usuarios duplicados
  const { email, nombre } = req.body;
  const existeUsuario = await Usuario.findOne({ email });

  if (existeUsuario) {
    const error = new Error('Usuario ya registrado');
    return res.status(400).json({ msg: error.message })
  }

  try {
    //Guardar un nuevo Usuario
    const usuario = new Usuario(req.body);
    const usuarioGuardado = await usuario.save();

    //Enviar el email de confirmacion
    emailRegistro({ email, nombre, token: usuarioGuardado.token })

    return res.json(usuarioGuardado);
  } catch (error) {
    console.log('Error: ', error);
  }
}

const perfil = (req, res) => {
  const { user } = req; //Destructuring de la variable de servidor que contiene el usuario logeado
  res.json(user)
}

const confirmar = async (req, res) => {
  const { token } = req.params;

  const usuarioConfirmar = await Usuario.findOne({ token })

  if (!usuarioConfirmar) {
    const error = new Error('Cuenta ya registrada')
    res.status(404).json({ msg: error.message });
  };

  try {
    usuarioConfirmar.token = null;
    usuarioConfirmar.confirmado = true;
    await usuarioConfirmar.save();
    const { nombre } = usuarioConfirmar;
    res.json({ msg: `¡${nombre}, tu cuenta se ha confirmado correctamente!` })
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}

const autenticar = async (req, res) => {
  const { email, password } = req.body;

  //Comprobando si el usuario existe
  const existeUsuario = await Usuario.findOne({ email });
  if (!existeUsuario) {
    const error = new Error(`El email ${email} no existe`)
    return res.status(403).json({ msg: error.message })
  }

  //Comprobando si el usuario esta confirmado
  if (!existeUsuario.confirmado) {
    const error = new Error('Debes confirmar tu cuenta antes de iniciar sesión.')
    return res.status(403).json({ msg: error.message })
  }

  //Comprobar password
  if (await existeUsuario.comprobarPassword(password)) {
    const { _id, nombre, email, token } = existeUsuario
    return res.json({
      _id,
      nombre,
      email,
      token: generarJWT(_id),
    })
  } else {
    const error = new Error('Tu contraseña es incorrecta.');
    return res.status(403).json({ msg: error.message })
  }
}

const olvidePass = async (req, res) => {
  const { email } = req.body;

  const existeEmailUser = await Usuario.findOne({ email });

  if (!existeEmailUser) {
    const error = new Error('El email no existe')
    return res.status(400).json({ msg: error.message })
  }

  try {
    existeEmailUser.token = generarId();
    await existeEmailUser.save();

    //Enviar el email de confirmacion
    emailOlvidePassword({
      email,
      nombre: existeEmailUser.nombre,
      token: existeEmailUser.token
    })

    return res.json({ msg: "Te enviamos un email con las instrucciones" })
  } catch (error) {
    console.log(error);
  }
}

const comprobarToken = async (req, res) => {
  const { token } = req.params;

  const existeUserConToken = await Usuario.findOne({ token })

  if (!existeUserConToken) {
    const error = new Error('El token ingresado no es válido')
    return res.status(400).json({ msg: error.message })
  }
}

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const existeUserConToken = await Usuario.findOne({ token })
  if (!existeUserConToken) {
    const error = new Error('Hubo un error de autenticación al intentar cambiar la contraseña')
    return res.status(400).json({ msg: error.message })
  }

  try {
    existeUserConToken.token = null;
    existeUserConToken.password = password;
    await existeUserConToken.save();
    res.json({ msg: "La contraseña se modificó correctamente" })
  } catch (error) {
    console.log(error);
  }
}


export { registrar, perfil, confirmar, autenticar, olvidePass, comprobarToken, nuevoPassword };