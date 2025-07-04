const venom = require('venom-bot');
const express = require('express');
const app = express();
app.use(express.json());

let client;

venom
  .create({
    session: 'render-bot',
    multidevice: true,
    headless: false, // Mostrar el navegador
    useChrome: true,
    browserArgs: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized']
  })
  .then((_client) => {
    client = _client;
    app.listen(3000, () => console.log("✅ Bot WhatsApp escuchando en el puerto 3000"));
  })
  .catch(err => {
    console.error("❌ Error al iniciar Venom:", err);
  });

app.post('/send', (req, res) => {
  const { phone_number, message } = req.body;

  if (!client) {
    return res.status(500).json({ error: "Cliente WhatsApp no iniciado" });
  }

  client.sendText(`${phone_number}@c.us`, message)
    .then(() => res.json({ status: "Mensaje enviado correctamente" }))
    .catch(err => res.status(500).json({ error: err.message }));
});
