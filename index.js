import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors';

import conectarDB from './config/MongoDatabase.js'

import userRoutes from './routes/userRoutes.js'
import tallerRoute from './routes/tallerRoute.js'

//Llamando a la variable de ambiente del puerto a usar 
const PORT = process.env.PORT || 4000;

//Lee las variables de entorno y conecta con la BD
dotenv.config();
conectarDB();

//Inicializando express
const app = express();

// Agregando dominios permitidos por CORS
const dominiosPermitidos = [process.env.FRONTEND_URL]; //Dominios permitidos por CORS
console.log('FRONT : ' + process.env.FRONTEND_URL); //Imprime el dominio permitido por CORS 
const corsOptions = { //Configuraciones de CORS para permitir el acceso a los dominios permitidos
  origin: function (origin, callback) { //Funcion que se ejecuta para verificar si el dominio que se intenta acceder esta permitido o no (origin es el dominio que se intenta acceder) y si es asi, se ejecuta la funcion callback con el parametro true y si no, con false (callback es la funcion que se ejecuta cuando se termina de verificar si el dominio esta permitido o no)
    if (dominiosPermitidos.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('No permitido por politica CORS'))
    }
  }
};
// //Permitiendo que la app use CORS para que se pueda acceder desde los dominios permitidos
app.use(cors(corsOptions));



//Para hacer que la api pueda responder en JSON
app.use(express.json())

//Enrutamiento
app.use('/api/usuarios', userRoutes);
app.use('/api/talleres', tallerRoute);

//Setear el puerto de escucha
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}
);