const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');
const { generateImages } = require('./generateImage.service');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

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


  const PORT = process.env.PORT || 3002;
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

  app.get('/', async (req, res) => {
    try {
      QRPortalWeb({
        PORT:3002
      });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

};

main();
