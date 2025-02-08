const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const path = require('path');

// 📌 Crear instancia del cliente de WhatsApp con autenticación local
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true } // Cambia a false para ver el navegador en caso de problemas
});

// 📌 Evento para cuando se genera el QR
client.on('qr', (qr) => {
    console.log('📸 ¡Escanea este código QR para iniciar sesión en WhatsApp!');
    qrcode.generate(qr, { small: true }); // Muestra el QR en la terminal
});

// 📌 Evento cuando la autenticación falla
client.on('auth_failure', (msg) => {
    console.error('❌ Error de autenticación:', msg);
});

// 📌 Evento cuando la sesión ya está iniciada
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

// 📌 Evento para detectar desconexiones
client.on('disconnected', (reason) => {
    console.error(`🔴 Se ha desconectado de WhatsApp. Razón: ${reason}`);
});

// 📌 Función para enviar un mensaje de saludo a un chat con mensajes sin leer
async function sendSaludo(chatId) {
    try {
        await sendMessages(chatId, [
            "👋 ¡Hola! Soy *Flor* de *Coloreando Juntos*. ¡Bienvenid@! 😊",
            "🎁 Te obsequio un *libro digital gratuito* con una pequeña muestra de los dibujos para colorear que tenemos disponibles. 🎨✨"
        ]);

        // 📌 Enviar el PDF de regalo
        const pdfFile = MessageMedia.fromFilePath(path.join(__dirname, "regalo.pdf"));
        await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 1 segundo antes de enviar el PDF
        await client.sendMessage(chatId, pdfFile);
        console.log(`📤 PDF de regalo enviado a ${chatId}`);

        // 📌 Enviar mensaje adicional
        await sendMessages(chatId, [
            "✨ Si te gustan estos dibujos, te encantará nuestro *kit premium* con más de *5000 ilustraciones* listas para imprimir y colorear en casa. 🖌️✏️",
            "📌 ¿Cuántos años tiene tu niño o niña? Así puedo recomendarte los mejores dibujos para su edad. 🎂"
        ]);

    } catch (error) {
        console.error(`❌ Error enviando saludo a ${chatId}:`, error);
    }
}

// 📌 Función para enviar mensajes con un intervalo de 1 segundo entre cada uno
async function sendMessages(chatId, messages) {
    for (const msg of messages) {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await client.sendMessage(chatId, msg);
            console.log(`📤 Mensaje enviado a ${chatId}: ${msg}`);
        } catch (error) {
            console.error(`❌ Error enviando mensaje a ${chatId}:`, error);
        }
    }
}

// 📌 Inicializar el cliente de WhatsApp
client.initialize();
