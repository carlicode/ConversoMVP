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
    "2": "Quiero que mi hijo dibuje y pinte",
    "3": "Cómo funciona la descarga",
    "4": "Cuál es el precio del kit"
};

// 📌 Función para enviar mensajes con retraso
async function sendMessages(chatId, messages) {
    for (const msg of messages) {
        await new Promise(resolve => setTimeout(resolve, 1000));
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
    "🤖 *Si necesitas ayuda, puedes pedirme alguna de estas opciones:*\n\n" +
    "• 💳 *Quiero pagar* - Para recibir los detalles de pago.\n" +
    "• 🖼️ *¿Qué dibujos tienen?* - Para conocer las categorías de dibujos disponibles.\n" +
    "• 📥 *¿Cómo funciona la descarga?* - Para saber cómo recibir los dibujos después del pago.\n" +
    "• 💰 *¿Cuál es el precio del kit?* - Para conocer el costo del paquete de dibujos.\n" +
    "• ✅ *Ya realicé el pago* - Para confirmar tu pago y recibir el enlace de descarga.";

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
                case "Saludo":
                    await sendMessages(chatId, [
                        "👋 ¡Hola! Soy *Flor* de *Coloreando Juntos*. ¡Bienvenido! 😊",
                        "🎁 Te regalo un *libro digital gratuito* con dibujos para colorear. ¡Espero que lo disfruten!\n\n📚 *Descárgalo aquí:* 👉 https://drive.google.com/file/d/1MAkd7iOlWIqxCC6MXvhsAzqCaUrlz7Pz/ 🔗",
                        "✨ También tenemos un *kit con más de 5000 dibujos* por *25 Bs* en categorías como *personajes infantiles, naturaleza y educativos*.",
                        "🤔 Tu niño o niña utiliza colores, crayones, tableta digital o algo más para pintar y dibujar? 😊"
                    ]);
                    break;
                case "Pedir información de dibujos":
                    await sendMessages(chatId, [
                        "🎨 Tenemos más de 5000 dibujos para colorear en distintas categorías!\n\n" +
                        "📂 *Categorías disponibles:*\n" +
                        "•⁠  ⁠🌟 *Personajes infantiles:* Bluey, Paw Patrol, Peppa Pig y más.\n" +
                        "•⁠  ⁠🐶 *Animales:* Perros, gatos, caballos y más.\n" +
                        "•⁠  ⁠🖼️ *Mandalas y arte abstracto*.\n" +
                        "•⁠  ⁠🏰 *Fantasía:* Unicornios, sirenas, hadas y castillos.\n" +
                        "•⁠  ⁠🎬 *Películas y series:* Moana, Toy Story, Frozen y más."
                    ]);
                
                    await sendMessages(chatId, [
                        "🎥 *Aquí tienes un video con los dibujos disponibles:* 👉 https://video.com"
                    ]);
                
                    await sendMessages(chatId, [
                        "Responde *QUIERO COMPRAR* para compartirte la información de pago 😊"
                    ]);
                    return;
                    
                

                case "Niño pintando":
                    await sendMessages(chatId, [
                        "🎨 *¡Colorear es más que solo diversión!*",
                        "🖌️ Estimula la creatividad y la imaginación.",
                        "✍️ Mejora la motricidad fina y la coordinación.",
                        "🎭 Fomenta la expresión emocional y la concentración.",
                        "🎥 Aquí te dejo un video con los dibujos que tenemos disponibles para colorear. 😊",
                        "👉 https://video.com",
                        "🛍️ Si quieres darle a tu hijo acceso a todos estos dibujos, solo escribe *QUIERO COMPRAR* y te compartiré el QR para tu compra."
                    ]);
                    return;

                case "Pinta otro":
                    await sendMessages(chatId, [
                        "🎨 ¡Qué genial! Tu niño disfruta del arte digital. 🖥️✨",
                        "Puedes imprimir los dibujos en *alta calidad* y colorearlos con crayones, lápices o acuarelas.",
                        "🎥 *Aquí tienes un video con los dibujos disponibles:*",
                        "👉 https://video.com",
                        "🛍️ Si quieres darle acceso a todos estos dibujos, solo escribe *QUIERO COMPRAR* y te compartiré el QR para tu compra."
                    ]);
                    return;

                case "Pedir QR o métodos de pago":
                case "Quiero pagar":
                    await sendMessages(chatId, [
                        "💳 *¡Claro! Aceptamos pagos por QR. 😊*",
                        "📥 *Aquí tienes el QR para realizar el pago.* En cuanto lo confirmemos, recibirás tu enlace de descarga. ✅"
                    ]);

                    try {
                        const media = MessageMedia.fromFilePath(path.join(__dirname, "qr.jpeg"));
                        await client.sendMessage(chatId, media);
                        console.log(`📤 QR de pago enviado a ${chatId}`);

                        await sendMessages(chatId, [
                            "📌 *Sigue estos pasos para confirmar tu pago:*\n\n" +
                            "1️⃣ Luego de realizar el pago, escribe *'YA REALICÉ EL PAGO'* en este chat. ✍️\n" +
                            "2️⃣ Adjunta una foto del comprobante de pago. 📷\n" +
                            "3️⃣ Revisaremos tu pago y en un máximo de *10 minutos* recibirás el enlace de descarga. 🎨✨"
                        ]);
                    } catch (error) {
                        console.error("❌ Error enviando el QR de pago:", error);
                    }
                    return;

                case "Pago confirmado":
                    await handlePaymentConfirmation(chatId);
                    return;

                default:
                    await sendMessages(chatId, [helpOptionsMessage]);
                    break;
            }
        } catch (error) {
            console.error(`❌ Error en el procesamiento:`, error);
        }
    }, 6000);
});

client.initialize();
