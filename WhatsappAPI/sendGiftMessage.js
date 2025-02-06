const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

const EXCLUDED_NUMBERS = [
    '59174529153@c.us',
    '59165654220@c.us',
    '59163505706@c.us'
];

client.on('ready', async () => {
    console.log('✅ Bot de WhatsApp conectado y listo para enviar mensajes.');

    try {
        const chats = await client.getChats();
        for (const chat of chats) {
            const chatId = chat.id._serialized;
            
            // 📌 Filtrar los números de los clientes que ya compraron
            if (!EXCLUDED_NUMBERS.includes(chatId)) {
                console.log(`📩 Enviando mensaje a: ${chatId}`);
                await sendGiftMessage(chatId);
            } else {
                console.log(`⏩ Omitiendo a cliente que ya compró: ${chatId}`);
            }
        }
    } catch (error) {
        console.error("❌ Error obteniendo chats:", error);
    }
});

// 📌 Función para enviar el mensaje especial
async function sendGiftMessage(chatId) {
    const message = 
        "🎁✨ *¡Tenemos un regalo especial para ti!* ✨🎁\n\n" +
        "Hola! 😊 Nos encanta compartir creatividad contigo, por eso queremos regalarte un *libro digital gratuito* con una selección de dibujos para colorear. 🎨✨\n\n" +
        "📩 Responde con un *'QUIERO MI REGALO'* y te lo enviamos de inmediato. 🎁💖\n\n" +
        "¡Que la creatividad nunca falte! 🖌️✨";

    await client.sendMessage(chatId, message);
    console.log(`📤 Mensaje enviado a ${chatId}`);
}

client.initialize();
