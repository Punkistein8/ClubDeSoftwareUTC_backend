
import Taller from '../models/Taller.js';

const agregarTaller = async (req, res) => {

  // const { nombreTaller, responsables, descripcion, inscritos } = req.body;
  try {
    const taller = new Taller(req.body);
    // taller.save();
    const tallerGuardado = await taller.save();
    const { nombreTaller } = tallerGuardado;
    res.json({ message: `Taller '${nombreTaller}' guardado correctamente` });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

const inscribirseTaller = async (req, res) => {
  const { nombreTaller, inscribirse } = req.body;

  //Verificar si el taller existe
  const taller = await Taller.findOne({ nombreTaller });
  if (!taller) {
    return res.status(404).json({ message: 'Taller no encontrado' });
  }

  if (inscribirse) {

    //VERIFICANDO SI EL USUARIO ESTA YA INSCRITO
    const { inscritos } = taller;
    let isInscribed = false;
    //ITERANDO CADA ID DE LOS INSCRITOS
    inscritos.forEach(({ _id }) => {
      const idString = JSON.stringify(_id)
      const idExpString = JSON.stringify(req.user._id);
      (idString == idExpString ? isInscribed = true : isInscribed)
    })

    if (isInscribed) {
      //SI YA ESTA INSCRITO
      const error = new Error('Ya estás inscrito en este taller')
      return res.status(400).json({ err: error.message });
    } else {
      //SI NO ESTA INSCRITO
      try {
        taller.inscritos.push(req.user._id);
        await taller.save();
        return res.json({ message: 'Inscrito correctamente' });
      } catch (error) {
        return res.status(400).json({ err: error.message });
      }
    }
  } else {
    const error = new Error('No se selecciono ningún taller');
    return res.status(402).json({ err: error.message })
  }
};

const estoyInscrito = async (req, res) => {
  //VER SI ESTAS INSCRITO EN EL TALLER SELECCIONADO
  //EN QUE TALLERES ESTAS INSCRITO
  const talleres = await Taller.find();
  let talleresInscritos = [];
  talleres.forEach((tallerIterado) => {
    tallerIterado.inscritos.forEach((usuarioInscrito) => {
      const idExpString = JSON.stringify(req.user._id);
      const idString = JSON.stringify(usuarioInscrito.id);

      if (idExpString == idString) {
        talleresInscritos.push(tallerIterado);
      }
    });
  });

  if (talleresInscritos == 0) {
    const error = new Error('No te has inscrito en ningun taller')
    return res.json({ msg: error.message })
  }

  return res.json({ talleres: talleresInscritos })

}

export { agregarTaller, inscribirseTaller, estoyInscrito };