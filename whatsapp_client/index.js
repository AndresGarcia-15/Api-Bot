const venom = require('venom-bot');

const phone = process.argv[2];     // Ej: 573001234567
const message = process.argv[3];   // Ej: "Hola"

venom
  .create({
  session: 'reminder-session',
  multidevice: true,
  headless: false, 
  useChrome: true,
  browserArgs: ['--start-maximized']
})

  .then((client) => {
    client.sendText(`${phone}@c.us`, message)
      .then(() => {
        console.log('✅ Mensaje enviado a', phone);
        process.exit();
      })
      .catch((err) => {
        console.error('❌ Error al enviar mensaje:', err);
        process.exit(1);
      });
  })
  .catch((err) => {
    console.error('❌ Error al crear sesión:', err);
  });
