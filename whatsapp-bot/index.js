const venom = require('venom-bot');
const express = require('express');
const app = express();
app.use(express.json());

let client;

venom
  .create({
    session: 'reminder-session',
    multidevice: true,
    headless: 'new', // Nuevo modo headless
    useChrome: true,
    folderNameToken: 'tokens',
    mkdirFolderToken: '',
    dirToken: 'tokens/reminder-session',
    browserArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
    qrCallback: (base64Qrimg, asciiQR, urlCode) => {
      console.log('🧾 Escanea el siguiente QR para vincular WhatsApp:\n');
      console.log(asciiQR);
    }
  })
  .then((_client) => {
    client = _client;

    // Manejo del estado del cliente
    client.onStateChange((state) => {
      console.log('📡 Estado del cliente:', state);
      if (['CONFLICT', 'UNPAIRED', 'UNLAUNCHED'].includes(state)) {
        client.useHere();
      }
    });

    app.listen(3000, () =>
      console.log('✅ Bot WhatsApp escuchando en el puerto 3000')
    );
  })
  .catch((err) => {
    console.error('❌ Error al iniciar Venom:', err);
  });

// Endpoint para enviar mensajes
app.post('/send', (req, res) => {
  const { phone_number, message } = req.body;

  if (!client) {
    return res.status(500).json({ error: 'Cliente WhatsApp no iniciado' });
  }

  client
    .sendText(`${phone_number}@c.us`, message)
    .then(() => res.json({ status: 'Mensaje enviado correctamente' }))
    .catch((err) => res.status(500).json({ error: err.message }));
});
