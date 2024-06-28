const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');
const { generateImages } = require('./generateImage.service');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
let images = ''

dotenv.config({ path: '.env' });

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

const flowSaludo = addKeyword('hola').addAnswer('¡Hola! ¿Que deseas que te genere?').addAction({ capture: true }, async (ctx, { flowDynamic }) => {
  const imagesResponse = await generateImages(ctx.body);
  images = await flowDynamic(imagesResponse);
})
const flowDespedida = addKeyword('adios').addAnswer('¡Hasta luego! Espero haberte sido de ayuda.');
const flowImagen = addKeyword('imagen').addAnswer('¡Aquí tienes una imagen!', { media: images });


const adapterDB = new MockAdapter();
const adapterFlow = createFlow([flowSaludo, flowDespedida, flowImagen]);
//const adapterFlow = createFlow([flowPrincipal]);
const adapterProvider = createProvider(BaileysProvider);

createBot({
  flow: adapterFlow,
  provider: adapterProvider,
  database: adapterDB,
});

const PORT = parseInt(process.env.PORT, 10) || 3000; 

app.get('/', (req, res) => {
  try {
    const qrFilePath = path.join(__dirname, 'bot.qr.png');
    if (fs.existsSync(qrFilePath)) {
      res.sendFile(qrFilePath);
    } else {
      res.status(404).send('QR Code not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  QRPortalWeb({
    port: PORT + 1
  });
  console.log(`Server is running on port ${PORT}`);
});
