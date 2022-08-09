
import Taller from '../models/Taller.js';

//Admin
const agregarTaller = async (req, res) => {

  // const { nombreTaller, responsables, descripcion, inscritos } = req.body;
  try {
    const taller = new Taller(req.body);
    // taller.save();
    console.log(req.user);
    const tallerGuardado = await taller.save();
    res.json(tallerGuardado);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
const obtenerTalleres = async (req, res) => {
  try {
    const talleres = await Taller.find();
    res.json(talleres);
  } catch (error) {
    const e = new Error('No se pudieron obtener los talleres');
    return res.status(400).json({ error: e + error.message });
  }
}

//Privadas
const estoyInscritoEnEsteTaller = async (req, res) => {
  const { nombreTaller } = req.body;

  //Verificar si el taller existe
  const taller = await Taller.findOne({ nombreTaller });
  if (!taller) {
    return res.status(404).json({ message: 'Taller no encontrado' });
  }

  //VERIFICANDO SI EL USUARIO ESTA YA INSCRITO
  const { inscritos } = taller;
  let isInscribed = false;
  inscritos.forEach(({ _id }) => {
    const idString = JSON.stringify(_id)
    const idExpString = JSON.stringify(req.user._id);
    (idString == idExpString ? isInscribed = true : isInscribed)
  })

  if (isInscribed) {
    //SI YA ESTA INSCRITO
    const cantidadInscritos = taller.inscritos.length;
    return res.json({ botonLabel: 'Anular Inscripción', cantidadInscritos });
  }

  //SI NO ESTA INSCRITO
  const cantidadInscritos = taller.inscritos.length;
  return res.json({ botonLabel: 'Inscribirse', cantidadInscritos });
}

const inscribirseTaller = async (req, res) => {
  const { nombreTaller, inscribirse } = req.body;

  //Verificar si el taller existe
  const taller = await Taller.findOne({ nombreTaller });
  if (!taller) {
    return res.status(404).json({ msg: 'Taller no encontrado' });
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
      try {
        taller.inscritos = taller.inscritos.filter(({ id }) => { return id !== req.user.id }); //ELIMINANDO EL USUARIO DE LOS INSCRITOS
        await taller.save();
        const cantidadInscritos = taller.inscritos.length;
        return res.json({ msg: 'Has anulado la inscripción a este taller', botonLabel: 'Inscribirse', cantidadInscritos });
      } catch (error) {
        return res.status(400).json({ error: "wut1?" + error.message });
      }
    } else {
      //SI NO ESTA INSCRITO
      try {
        taller.inscritos.push(req.user._id);
        await taller.save();
        const cantidadInscritos = taller.inscritos.length
        return res.json({ msg: 'Te has inscrito correctamente al taller', botonLabel: 'Anular Inscripción', cantidadInscritos });
      } catch (error) {
        return res.status(400).json({ error: "wut2?" + error.message });
      }
    }
  } else {
    const error = new Error('No se selecciono ningún taller');
    return res.status(402).json({ err: "wut3? " + error.message })
  }
};

const talleresInscritos = async (req, res) => {
  //VER SI ESTAS INSCRITO EN EL TALLER SELECCIONADO
  //EN QUE TALLERES ESTAS INSCRITO
  const talleres = await Taller.find();
  let talleresInscritos = [];
  talleres.forEach((tallerIterado) => {
    tallerIterado.inscritos.forEach(usuarioInscrito => {
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

export { agregarTaller, inscribirseTaller, talleresInscritos, obtenerTalleres, estoyInscritoEnEsteTaller };