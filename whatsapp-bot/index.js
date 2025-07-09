const venom = require('venom-bot');
const express = require('express');
const app = express();
app.use(express.json());

let client;

venom
  .create({
    session: 'reminder-session',
    multidevice: true,
    headless: 'new',
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

// ✅ Enviar mensaje a número o grupo
app.post('/send', async (req, res) => {
  const { receiver, message } = req.body;

  if (!client) {
    return res.status(500).json({ error: 'Cliente WhatsApp no iniciado' });
  }

  try {
    const finalId = receiver.includes('@') ? receiver : `${receiver}@c.us`;
    const result = await client.sendText(finalId, message);
    res.json({ status: 'Mensaje enviado correctamente' });
  } catch (err) {
    console.error('❌ Error al enviar mensaje:', err);
    res.status(500).json({ error: err.message || 'Error desconocido' });
  }
});

app.get('/groups', async (req, res) => {
  if (!client) {
    return res.status(500).json({ error: 'Cliente WhatsApp no iniciado' });
  }

  try {
    console.log('🔍 Obteniendo chats...');
    const chats = await client.getAllChats();
    console.log(`📊 Total de chats encontrados: ${chats.length}`);
    
    // Filtrar grupos usando el ID en lugar de isGroup
    const groups = chats.filter(chat => {
      // Los IDs de grupos terminan en @g.us
      const isGroupChat = chat.id._serialized.includes('@g.us');
      console.log(`Chat: ${chat.name || 'Sin nombre'} - Es grupo: ${isGroupChat} - ID: ${chat.id._serialized}`);
      return isGroupChat;
    });
    
    console.log(`👥 Grupos encontrados: ${groups.length}`);
    
    const groupList = groups.map(group => ({
      name: group.name || 'Grupo sin nombre',
      id: group.id._serialized,
      participantCount: group.participants ? group.participants.length : 0
    }));

    console.log('📋 Lista final de grupos:', groupList);
    res.json(groupList);
  } catch (err) {
    console.error('❌ Error obteniendo grupos:', err);
    res.status(500).json({ error: err.message || 'Error desconocido' });
  }
});