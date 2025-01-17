from fastapi import FastAPI, Request
from backend.bot.telegram_bot import send_message
from backend.bot.responses import generate_response
from backend.config import TELEGRAM_BOT_TOKEN, NGROK_URL

app = FastAPI()

@app.get("/")
def root():
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
        text = data["message"]["text"]

        # Generate response using OpenAI
        prompt = f"Responder como un asistente amigable: {text}"
        response_text = generate_response(prompt)

        # Send the response back to Telegram
        send_message(chat_id, response_text)

    return {"status": "success"}
