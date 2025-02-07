const { sendMessages, sendPaymentQR, handlePaymentConfirmation } = require('../utils/messageUtils');
const fetch = require('node-fetch');

// 📌 Mapeo de respuestas numéricas a intenciones
const numericIntentMapping = {
    "1": "Quiero pagar",
    "2": "Pedir información de dibujos",
    "3": "Cómo descargar",
    "4": "Cuál es el precio del kit"
};

const userMessages = {}; // 📌 Almacena los mensajes temporales
const userTimers = {};   // 📌 Temporizadores para procesar los mensajes con retraso

/**
 * 📌 Maneja los mensajes entrantes y los clasifica según la intención del usuario.
 */
async function handleMessage(client, message) {
    if (message.type !== 'chat') return; // 📌 Ignorar mensajes que no sean de texto

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
            fullMessage = numericIntentMapping[fullMessage];
        }

        try {
            // 📌 Llamada a FastAPI para clasificar la intención
            const classifyResponse = await fetch('http://localhost:8000/classify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: fullMessage })
            });

            const classifyData = await classifyResponse.json();
            console.log(`🔍 Intención detectada: ${classifyData.intent}`);

            // 📌 Responder según la intención detectada
            switch (classifyData.intent) {
                case "Saludo":
                    await sendMessages(client, chatId, [
                        "👋 ¡Hola! Soy *Flor* de *Coloreando Juntos*. ¡Bienvenid@! 😊",
                        "🎁 Te obsequio un *libro digital gratuito* con una pequeña muestra de los dibujos para colorear que tenemos disponibles. 🎨✨"
                    ]);
                    break;

                case "Quiero pagar":
                    await sendPaymentQR(client, chatId);
                    break;

                case "Pago confirmado":
                    await handlePaymentConfirmation(client, chatId);
                    break;

                case "Quiero mi regalo":
                    await sendMessages(client, chatId, [
                        "🎉✨ ¡Sorpresa especial para ti! ✨🎉",
                        "Por tiempo limitado, nuestro kit premium con más de 5000 dibujos está a *¡solo 19 Bs!* (precio normal 25 Bs). 🎨🖌️",
                        "📌 Aprovecha esta oferta exclusiva antes de que termine.",
                        "Responde *QUIERO COMPRAR* para obtener el descuento ahora mismo. ⏳🔥"
                    ]);

                    await sendPaymentQR(client, chatId);

                    await sendMessages(client, chatId, [
                        "📌 *Sigue estos pasos para confirmar tu pago:*",
                        "1️⃣ Adjunta una foto del comprobante de pago. 📷",
                        "2️⃣ Luego de realizar el pago, escribe *'YA REALICÉ EL PAGO'* en este chat. ✍️",
                        "3️⃣ Revisaremos tu pago y en un máximo de *10 minutos* recibirás el enlace de descarga. 🎨✨"
                    ]);
                    break;

                default:
                    await sendMessages(client, chatId, [
                        "🤖 *No entendí tu mensaje.* 😊",
                        "📌 Puedes escribir una de estas opciones:\n" +
                        "• 💳 *Quiero pagar*\n" +
                        "• 🖼️ *Ver dibujos disponibles*\n" +
                        "• 💰 *Saber el precio*\n" +
                        "• ✅ *Confirmar mi pago*"
                    ]);
                    break;
            }
        } catch (error) {
            console.error(`❌ Error en el procesamiento:`, error);
        }
    }, 6000);
}

module.exports = { handleMessage };
