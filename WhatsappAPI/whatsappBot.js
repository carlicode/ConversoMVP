const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fetch = require('node-fetch');

// Inicializar cliente de WhatsApp
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

// Mostrar QR para iniciar sesión
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Escanea este QR para iniciar sesión en WhatsApp');
});

// Cuando el bot esté listo
client.on('ready', () => {
    console.log('✅ Bot de WhatsApp conectado.');
});

// Manejo de mensajes recibidos
client.on('message', async (message) => {
    console.log(`📩 Mensaje de ${message.from}: ${message.body}`);

    try {
        // Enviar mensaje recibido a FastAPI
        const response = await fetch('http://localhost:8000/respond', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message.body })
        });

        const data = await response.json();
        console.log('🔍 Respuesta de FastAPI:', data.response);

        // Responder al usuario con la respuesta de OpenAI
        await message.reply(data.response);

    } catch (error) {
        console.error('❌ Error al procesar la solicitud:', error);
        await message.reply('Lo siento, no puedo responder en este momento.');
    }
});

// Manejo de desconexión
client.on('disconnected', (reason) => {
    console.log(`❌ Bot desconectado. Razón: ${reason}`);
});

// Inicializar bot
client.initialize();
