import nodemailer from 'nodemailer';

const emailOlvidePassword = async (datos) => {
  let transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: process.env.EMAIL_PORT_GM,
    secure: false,
    logger: true,
    debug: true,
    auth: {
      user: 'clubdesoftwareutc@gmail.com',
      pass: 'kzwghhivpaekaofg'
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false
    },
  });

  const { email, nombre, token } = datos;

  const info = await transport.sendMail({
    from: 'Club de Software UTC',
    to: email,
    subject: 'Restablece tu contraseña',
    text: 'Solicitud de restablecimiento de contraseña',
    html: `<p>Hola ${nombre}, has solicitado reestablecer tu contraseña.</p>
    <p>Clickea en el siguiente enlace para generar una nueva contraseña:</p>
    <a href="${process.env.FRONTEND_URL}/frontend/olvidepass/${token}">Reestablecer contraseña</a></p>
    <p>Si no has solicitado una cuenta, simplemente ignora este mensaje.</p>`
  });
  console.log('Message sent: %s', info.messageId);
}
export default emailOlvidePassword; 