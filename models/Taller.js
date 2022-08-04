import mongoose from "mongoose";

const inscritosSchema = new mongoose.Schema({
  idInscritos: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
  },
});

const tallerSchema = mongoose.Schema({
  nombreTaller: {
    type: String,
    required: true,
    unique: true
  },

  responsables: {
    type: String,
    required: true,
  },

  descripcion: {
    type: String,
    required: true,
    default: 'Descripcion aqui'
  },

  inscritos: [inscritosSchema],
}, {
  timestamps: true
})

const Taller = mongoose.model('Taller', tallerSchema);
export default Taller;