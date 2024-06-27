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

dotenv.config({ path: '.env' });

const app = express();

// Set the limits once
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

const flowPrincipal = addKeyword(['hola'])
  .addAnswer(['🙌 Hola bienvenido a este *TetenBot*', 'ingresa una descripción completa de la imagen que quieres generar..'])
  .addAction({ capture: true }, async (ctx, { flowDynamic }) => {
    const images = await generateImages(ctx.body);
    return await flowDynamic(images);
  });

const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([flowPrincipal]);
  const adapterProvider = createProvider(BaileysProvider);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  const PORT = process.env.PORT || 3000;
  const PUBLIC_URL = process.env.PUBLIC_URL || 'http://localhost';

  app.get('/', (req, res) => {
    try {
      QRPortalWeb({
        port: PORT,
        publicSite: PUBLIC_URL,
        dir: 'public'
      });
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
    console.log(`Server is running on port ${PORT}`);
  });
};

main();
