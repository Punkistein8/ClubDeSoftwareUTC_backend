import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
  let transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const { email, nombre, token } = datos;

  const info = await transport.sendMail({
    from: 'Club de Software UTC',
    to: email,
    subject: 'Confirmación de registro',
    text: 'Comprueba tu cuenta',
    html: `<p>Hola ${nombre}, vamos a comprobar tu cuenta.</p>
    <p>Gracias por registrarte en Club de Software UTC.
    Para confirmar tu cuenta, haz click en el siguiente enlace:
    <a href="${process.env.FRONTEND_URL}/frontend/confirmar/${token}">Confirmar cuenta</a></p>
    <p>Si no has solicitado una cuenta, simplemente ignora este mensaje.</p>`
  });
  console.log('Message sent: %s', info.messageId);
}
export default emailRegistro; 