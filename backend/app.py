from fastapi import FastAPI, Request
from backend.bot.telegram_bot import send_message
from backend.bot.responses import generate_response
from backend.config import TELEGRAM_BOT_TOKEN, NGROK_URL
import requests
import asyncio
from collections import defaultdict

app = FastAPI()

# Diccionario para acumular mensajes por usuario
user_messages = defaultdict(list)
user_timers = {}

@app.get("/")
def root():
    """
    Root endpoint to verify the server is running.
    """
    return {"message": "Converso Telegram Bot is running!"}

@app.get("/telegram/set-webhook")
def set_telegram_webhook():
    """
    Sets the Telegram webhook using the NGROK_URL.
    """
    webhook_url = f"{NGROK_URL}/telegram/webhook"
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/setWebhook"
    response = requests.post(url, json={"url": webhook_url})
    return response.json()

@app.post("/telegram/webhook")
async def telegram_webhook(request: Request):
    """
    Handles incoming messages from Telegram.
    """
    data = await request.json()
    print("Telegram Webhook Received:", data)

    if "message" in data:
        chat_id = data["message"]["chat"]["id"]
        text = data["message"]["text"].strip().lower()

        # Check if the user is greeting (first interaction)
        greetings = ["hola", "buenos días", "buenas tardes", "buenas noches", "/start"]
        if text in greetings and not user_messages[chat_id]:
            # Predefined sequence of messages
            messages = [
                "¡Hola! 😊 Mi nombre es Mariela y estoy aquí para compartirte toda la información sobre nuestros dibujos listos para imprimir.",
                "Quiero regalarte un libro digital gratuito para colorear. 🎁 En este libro encontrarás una muestra de nuestros dibujos.",
                "Tenemos más de **3000 dibujos** en categorías como personajes infantiles, naturaleza y educativos. 🎨✨",
                "El kit completo cuesta **25 Bs**. Una vez que confirmes tu pago, te enviaré un enlace para descargarlo. 😊",
                "¿En qué más puedo ayudarte? Estoy aquí para resolver tus dudas y guiarte en tu compra. 💖"
            ]
            for message in messages:
                send_message(chat_id, message)
        else:
            # Acumular mensajes del usuario
            user_messages[chat_id].append(text)

            # Cancelar temporizador previo, si existe
            if chat_id in user_timers:
                user_timers[chat_id].cancel()

            # Crear un temporizador para procesar los mensajes tras 3 segundos
            user_timers[chat_id] = asyncio.create_task(process_user_messages(chat_id))

    return {"status": "success"}

async def process_user_messages(chat_id: int):
    """
    Procesa los mensajes acumulados para un usuario después de un retraso.
    """
    await asyncio.sleep(3)  # Esperar 3 segundos para acumular mensajes

    # Concatenar todos los mensajes del usuario
    full_message = " ".join(user_messages[chat_id])

    # Limpiar mensajes acumulados y temporizador
    user_messages[chat_id] = []
    user_timers.pop(chat_id, None)

    # Generar respuesta usando OpenAI
    response_text = generate_response(full_message)

    # Enviar la respuesta al usuario
    send_message(chat_id, response_text)
