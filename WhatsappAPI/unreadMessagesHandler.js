const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const path = require('path');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

client.on('ready', async () => {
    console.log('✅ Bot de WhatsApp conectado y listo para procesar mensajes sin responder.');
    
    try {
        const chats = await client.getChats();
        for (const chat of chats) {
            if (chat.unreadCount > 0) {
                console.log(`📩 Chat sin responder encontrado: ${chat.id._serialized}`);
                await sendSaludo(chat.id._serialized);
            }
        }
    } catch (error) {
        console.error("❌ Error obteniendo chats:", error);
    }
});

// 📌 Función para enviar el mensaje de saludo
async function sendSaludo(chatId) {
    await sendMessages(chatId, [
        "👋 ¡Hola! Soy *Flor* de *Coloreando Juntos*. ¡Bienvenid@! 😊",
        "🎁 Te obsequio un *libro digital gratuito* con una pequeña muestra de los dibujos para colorear que tenemos disponibles. 🎨✨"
    ]);

    try {
        const pdfFile = MessageMedia.fromFilePath(path.join(__dirname, "regalo.pdf"));
        await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 1 segundo antes de enviar el PDF
        await client.sendMessage(chatId, pdfFile);
        console.log(`📤 PDF de regalo enviado a ${chatId}`);
    } catch (error) {
        console.error("❌ Error enviando el PDF de regalo:", error);
    }

    await sendMessages(chatId, [
        "✨ Si te gustan estos dibujos, te encantará nuestro *kit premium* con más de *5000 ilustraciones* listas para imprimir y colorear en casa. 🖌️✏️",
        "📌 ¿Cuántos años tiene tu niño o niña? Así puedo recomendarte los mejores dibujos para su edad. 🎂"
    ]);
}

// 📌 Función para enviar mensajes con un intervalo de 1 segundo entre cada uno
async function sendMessages(chatId, messages) {
    for (const msg of messages) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await client.sendMessage(chatId, msg);
        console.log(`📤 Mensaje enviado a ${chatId}: ${msg}`);
    }
}

client.initialize();
