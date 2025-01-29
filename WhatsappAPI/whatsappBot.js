const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');

const ADMIN_PHONE = "59169533423@c.us"; // 📌 Número del administrador para recibir notificaciones
const userMessages = {};
const userTimers = {};

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('📸 Escanea este QR para iniciar sesión en WhatsApp');
});

client.on('ready', () => {
    console.log('✅ Bot de WhatsApp conectado y listo para ser usado.');
});

// 📌 Función para enviar mensajes con retraso
async function sendMessages(chatId, messages) {
    for (const msg of messages) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        await client.sendMessage(chatId, msg);
        console.log(`📤 Mensaje enviado a ${chatId}: ${msg}`);
    }
}

// 📌 Función para enviar información de pago con QR e instrucciones
async function sendPaymentInfo(chatId) {
    const messages = [
        "💳 ¡Claro! Aceptamos pagos por *QR*. 😊",
        "📥 Aquí tienes el QR para realizar el pago. En cuanto lo confirmemos, recibirás tu enlace de descarga. ✅"
    ];

    console.log(`🟢 Enviando información de pago a ${chatId}...`);
    await sendMessages(chatId, messages);

    // 📩 Luego de los mensajes, enviamos la imagen del QR
    const qrPath = path.join(__dirname, 'qr.jpeg');

    if (!fs.existsSync(qrPath)) {
        console.error(`❌ Error: No se encontró el archivo QR en ${qrPath}`);
        await client.sendMessage(chatId, "⚠️ Hubo un problema al enviar el QR. Puedes solicitarlo nuevamente más tarde.");
        return;
    }

    try {
        const media = MessageMedia.fromFilePath(qrPath);
        await client.sendMessage(chatId, media);
        console.log(`📤 Imagen QR enviada a ${chatId}: qr.jpeg`);

        // 📩 Luego del QR, enviamos instrucciones para confirmar el pago
        const paymentInstructions =
            "📌 *Sigue estos pasos para confirmar tu pago:*\n\n" +
            "1️⃣ Luego de realizar el pago, escribe *'YA REALICÉ EL PAGO'* en este chat. ✍️\n" +
            "2️⃣ Adjunta una foto del comprobante de pago. 📷\n" +
            "3️⃣ Revisaremos tu pago y en un máximo de *10 minutos* recibirás el enlace de descarga. 🎨✨";

        await client.sendMessage(chatId, paymentInstructions);
        console.log(`📤 Instrucciones de pago enviadas a ${chatId}`);

    } catch (error) {
        console.error(`❌ Error enviando la imagen QR a ${chatId}:`, error);
    }
}

// 📌 Función para notificar al administrador cuando un usuario confirma su pago
async function notifyAdminPayment(chatId) {
    const message = `🚨 *Alerta de Pago* 🚨\n\n📌 El número *${chatId.replace('@c.us', '')}* ha indicado que realizó el pago. Revisa en el banco.`;
    await client.sendMessage(ADMIN_PHONE, message);
    console.log(`📤 Notificación enviada al administrador sobre el pago de ${chatId}`);
}

// 📌 Función para enviar mensajes de saludo
async function sendSaludoMessages(chatId) {
    const messages = [
        "👋 ¡Hola! Soy *Flor* de *Coloreando Juntos*. ¡Bienvenido! 😊",
        "🎁 Como regalo de bienvenida, quiero darte un *libro digital gratuito* con dibujos para colorear. ¡Espero que te guste!",
        "📚 *Aquí tienes tu libro digital gratuito!* 🎨✨\n\n👉 https://drive.google.com/file/d/1MAkd7iOlWIqxCC6MXvhsAzqCaUrlz7Pz/ 🔗",
        "✨ Además, tenemos más de *5000 dibujos* en diferentes categorías como *personajes infantiles, naturaleza y educativos*.",
        "💰 Nuestro *kit completo* con acceso a todos los dibujos cuesta *25 Bs*. Una vez confirmado tu pago, recibirás un enlace de descarga inmediato. 📥",
        "🤔 *Tu niño o niña utiliza colores, crayones o algo más para pintar y dibujar?* 😊"
    ];

    console.log(`🟢 Enviando mensajes de saludo a ${chatId}...`);
    await sendMessages(chatId, messages);
}

// 📌 Manejo de mensajes recibidos
client.on('message', async (message) => {
    const chatId = message.from;
    const userMessage = message.body.trim().toLowerCase();

    console.log(`📩 Mensaje recibido de ${chatId}: "${userMessage}"`);

    if (!userMessages[chatId]) userMessages[chatId] = [];
    userMessages[chatId].push(userMessage);

    if (userTimers[chatId]) clearTimeout(userTimers[chatId]);

    userTimers[chatId] = setTimeout(async () => {
        const fullMessage = userMessages[chatId].join(' ');

        console.log(`📋 Mensaje completo de ${chatId}: "${fullMessage}"`);

        delete userMessages[chatId];
        delete userTimers[chatId];

        try {
            console.log(`🔍 Enviando mensaje a clasificación...`);
            const classifyResponse = await fetch('http://localhost:8000/classify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: fullMessage })
            });

            if (!classifyResponse.ok) {
                console.error('❌ Error en la clasificación del backend:', classifyResponse.statusText);
                await client.sendMessage(chatId, '⚠️ Lo siento, no puedo procesar tu solicitud en este momento.');
                return;
            }

            const classifyData = await classifyResponse.json();
            console.log(`🔍 Intención detectada: ${classifyData.intent}`);

            switch (classifyData.intent) {
                case "Saludo":
                    await sendSaludoMessages(chatId);
                    break;
                case "Pedir QR o métodos de pago":
                case "Quiero pagar":
                    await sendPaymentInfo(chatId);
                    break;
                case "Pago confirmado":
                    await sendMessages(chatId, [
                        "✅ *¡Gracias por tu pago!* \n\n" +
                        "📷 *Estamos verificando la transacción con tu comprobante de pago.* 🔎\n" +
                        "⌛ *Te responderemos en breve.*"
                    ]);
                    await notifyAdminPayment(chatId);
                    break;
                case "Niño pintando":
                    const paintingResponse = await fetch('http://localhost:8000/generate_painting_response', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message: fullMessage })
                    });

                    const paintingData = await paintingResponse.json();
                    await client.sendMessage(chatId, paintingData.response);

                    await sendMessages(chatId, [
                        "🎨 *¿Sabías que pintar tiene increíbles beneficios para los niños?*\n\n" +
                        "🖌️ Estimula la creatividad y la imaginación.\n" +
                        "✍️ Mejora la motricidad fina y la coordinación.\n" +
                        "🎭 Fomenta la expresión emocional y la concentración.\n\n" +
                        "🎥 *Aquí te dejo un video con los dibujos que tenemos disponibles para colorear.* 😊",
                        "👉 https://video.com",
                        "🛍️ *Si quieres darle a tu hijo acceso a todos estos dibujos, solo escribe* *'QUIERO COMPRAR'* *y te compartiré el QR para tu compra.*"
                    ]);
                    break;
                default:
                    console.log(`🧠 Solicitando respuesta a OpenAI...`);
                    await client.sendMessage(chatId, "🤖 Estoy procesando tu solicitud. Dame un momento...");
                    break;
            }

        } catch (error) {
            console.error(`❌ Error en el procesamiento:`, error);
            await client.sendMessage(chatId, '⚠️ Lo siento, hubo un error.');
        }
    }, 5000);
});

client.initialize();
