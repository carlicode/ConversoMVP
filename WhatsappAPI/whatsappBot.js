const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fetch = require('node-fetch');
const path = require('path');

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

// 📌 Mapeo de respuestas numéricas a intenciones
const numericIntentMapping = {
    "1": "Quiero pagar",
    "2": "Pedir información de dibujos",
    "3": "Cómo descargar",
    "4": "Cuál es el precio del kit"
};

// 📌 Función para enviar mensajes con un intervalo de 1 segundo entre cada uno
async function sendMessages(chatId, messages) {
    for (const msg of messages) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 1 segundo entre mensajes
        await client.sendMessage(chatId, msg);
        console.log(`📤 Mensaje enviado a ${chatId}: ${msg}`);
    }
}

// 📌 Función para notificar al administrador sobre un pago confirmado
async function notifyAdminPayment(chatId) {
    const message = `🚨 *Alerta de Pago* 🚨\n\n📌 El número *${chatId.replace('@c.us', '')}* ha indicado que realizó el pago. Revisa en el banco.`;
    await client.sendMessage(ADMIN_PHONE, message);
    console.log(`📤 Notificación enviada al administrador sobre el pago de ${chatId}`);
}

// 📌 Función para manejar la confirmación de pago
async function handlePaymentConfirmation(chatId) {
    await sendMessages(chatId, [
        "✅ *¡Gracias por tu pago!* \n\n📷 *Estamos verificando la transacción con tu comprobante de pago.* 🔎",
        "⌛ *Te responderemos en breve.*"
    ]);
    await notifyAdminPayment(chatId);
}

// 📌 Opciones en un solo mensaje con mejor formato
const helpOptionsMessage = 
    "🤖 *¡Ups! No entendí lo que necesitas.*\n" +
    "Por favor, escribe una de estas opciones para continuar la conversación:\n\n" +
    "• 💳 *Quiero pagar* - Para recibir los detalles de pago.\n" +
    "• 🖼️ *Ver dibujos disponibles* - Para conocer las categorías de dibujos.\n" +
    "• 💰 *Saber el precio* - Para conocer el costo del kit de dibujos.\n" +
    "• ✅ *Confirmar mi pago* - Si ya realizaste el pago y quieres confirmarlo.";

// 📌 Manejo de mensajes recibidos con acumulación de 6 segundos
client.on('message', async (message) => {
    const chatId = message.from;
    let userMessage = message.body.trim();

    console.log(`📩 Mensaje recibido de ${chatId}: "${userMessage}"`);

    if (!userMessages[chatId]) userMessages[chatId] = [];
    userMessages[chatId].push(userMessage);

    if (userTimers[chatId]) clearTimeout(userTimers[chatId]);

    userTimers[chatId] = setTimeout(async () => {
        const fullMessage = userMessages[chatId].join(' ');
        console.log(`📋 Mensaje completo de ${chatId}: "${fullMessage}"`);

        delete userMessages[chatId];
        delete userTimers[chatId];

        if (numericIntentMapping[fullMessage]) {
            console.log(`🔄 Mapeando "${fullMessage}" a intención: "${numericIntentMapping[fullMessage]}"`);
            fullMessage = numericIntentMapping[fullMessage];
        }

        try {
            const classifyResponse = await fetch('http://localhost:8000/classify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: fullMessage })
            });

            const classifyData = await classifyResponse.json();
            console.log(`🔍 Intención detectada: ${classifyData.intent}`);

            switch (classifyData.intent) {
                // 📌 Enviar PDF de regalo
            // 📌 Enviar PDF de regalo
case "Saludo":
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
    break;

case "Edad":
    await sendMessages(chatId, [
        "🎨 ¡Genial! Contamos con diferentes dibujos adaptados a cada edad."
    ]);

    await sendMessages(chatId, [
        "🎨 *Accede a más de 5000 plantillas en distintas categorías por solo *25 Bs!!!*\n\n" +
        "📂 *Categorías disponibles:*\n" +
        "•⁠ 🌟 *Personajes infantiles:* Bluey, Paw Patrol, Peppa Pig y más.\n" +
        "•⁠ 🐶 *Animales:* Perros, gatos, caballos y más.\n" +
        "•⁠ 🖼️ *Mandalas y arte abstracto*.\n" +
        "•⁠ 🏰 *Fantasía:* Unicornios, sirenas, hadas y castillos.\n" +
        "•⁠ 🎬 *Películas y series:* Moana, Toy Story, Frozen y más."
    ]);

    await sendMessages(chatId, [
        "🎥 *Aquí tienes un video con los dibujos disponibles:* 👉 https://video.com"
    ]);

    await sendMessages(chatId, [
        "📌 Responde *QUIERO COMPRAR* para recibir la información de pago 😊"
    ]);
    break;

case "Pedir información de dibujos":
    await sendMessages(chatId, [
        "🎨 *Accede a más de 5000 plantillas en distintas categorías por solo *25 Bs!!!*\n\n" +
        "📂 *Categorías disponibles:*\n" +
        "•⁠ 🌟 *Personajes infantiles:* Bluey, Paw Patrol, Peppa Pig y más.\n" +
        "•⁠ 🐶 *Animales:* Perros, gatos, caballos y más.\n" +
        "•⁠ 🖼️ *Mandalas y arte abstracto*.\n" +
        "•⁠ 🏰 *Fantasía:* Unicornios, sirenas, hadas y castillos.\n" +
        "•⁠ 🎬 *Películas y series:* Moana, Toy Story, Frozen y más."
    ]);

    await sendMessages(chatId, [
        "🎥 *Aquí tienes un video con los dibujos disponibles:* 👉 https://video.com"
    ]);

    await sendMessages(chatId, [
        "📌 Responde *QUIERO COMPRAR* para recibir la información de pago 😊"
    ]);
    break;

// 📌 Enviar QR de pago
case "Pedir QR o métodos de pago":
case "Quiero pagar":
    await sendMessages(chatId, [
        "💳 *¡Claro! Aceptamos pagos por QR. 😊*",
        "📥 Aquí tienes el QR para realizar el pago de tan solo *25 Bs.*"
    ]);

    try {
        const media = MessageMedia.fromFilePath(path.join(__dirname, "qr.jpeg"));
        await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 1 segundo antes de enviar el QR
        await client.sendMessage(chatId, media);
        console.log(`📤 QR de pago enviado a ${chatId}`);
    } catch (error) {
        console.error("❌ Error enviando el QR de pago:", error);
    }

    await sendMessages(chatId, [
        "📌 *Sigue estos pasos para confirmar tu pago:*\n\n" +
        "1️⃣ Adjunta una foto del comprobante de pago. 📷\n" +
        "2️⃣ Luego de realizar el pago, escribe *'YA REALICÉ EL PAGO'* en este chat. ✍️\n" +
        "3️⃣ Revisaremos tu pago y en un máximo de *10 minutos* recibirás el enlace de descarga. 🎨✨"
    ]);
    break;

case "Pago confirmado":
    await handlePaymentConfirmation(chatId);
    break;

case "Bot":
    await sendMessages(chatId, [
        "🤖 *Soy un bot y estoy haciendo mi mejor esfuerzo para reconocer tu mensaje.* 😊",
        "📌 Para ayudarte mejor, por favor elige una opción escribiendo una de estas frases:"
    ]);

    await sendMessages(chatId, [
        "• 💳 *Quiero pagar* - Para recibir los detalles de pago.\n" +
        "• 🖼️ *Ver dibujos disponibles* - Para conocer las categorías de dibujos.\n" +
        "• 💰 *Saber el precio* - Para conocer el costo del kit de dibujos.\n" +
        "• ✅ *Confirmar mi pago* - Si ya realizaste el pago y quieres confirmarlo."
    ]);
    break;

case "No entiendo la intención del usuario":
    try {
        const generateResponse = await fetch("http://localhost:8000/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: fullMessage })
        });

        const responseData = await generateResponse.json();
        const aiResponse = responseData.response || "Lo siento, no entendí tu mensaje. ¿Podrías reformularlo?";

        await sendMessages(chatId, [aiResponse]);

        // 📌 Enviar opciones después de la respuesta generada
        await sendMessages(chatId, [
            "📌 Para ayudarte mejor, por favor elige una opción escribiendo una de estas frases:"
        ]);

        await sendMessages(chatId, [
            "• 💳 *Quiero pagar* - Para recibir los detalles de pago.\n" +
            "• 🖼️ *Ver dibujos disponibles* - Para conocer las categorías de dibujos.\n" +
            "• 💰 *Saber el precio* - Para conocer el costo del kit de dibujos.\n" +
            "• ✅ *Confirmar mi pago* - Si ya realizaste el pago y quieres confirmarlo."
        ]);

    } catch (error) {
        console.error("❌ Error obteniendo respuesta generada:", error);
        await sendMessages(chatId, ["Lo siento, ocurrió un error procesando tu mensaje."]);
    }
    break;

                    
            }            
            
        } catch (error) {
            console.error(`❌ Error en el procesamiento:`, error);
        }
    }, 6000);
});

client.initialize();
