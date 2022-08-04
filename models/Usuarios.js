import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import generarId from '../helpers/generarId.js'

const usuarioSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  telefono: {
    type: String,
    default: null,
    trum: true
  },
  token: {
    type: String,
    default: generarId(),
  },
  confirmado: {
    type: Boolean,
    default: false
  }
});

usuarioSchema.methods.comprobarPassword = async function (passwordFormularios) {
  return await bcrypt.compare(passwordFormularios, this.password); //Compara la password limpia del formulario, con la hasheada de la base de datos
}

usuarioSchema.pre('save', async function (next) { //Ejecuta codigo antes de almacenar
  if (!this.isModified('password')) {
    next();
  };
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})

const Usuario = mongoose.model('Usuario', usuarioSchema);
export default Usuario;