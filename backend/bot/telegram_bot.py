import requests
from backend.config import TELEGRAM_BOT_TOKEN

TELEGRAM_API_URL = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}"

def send_message(chat_id: int, text: str):
    """
    Sends a message to a specific Telegram chat.

    Args:
        chat_id (int): The chat ID where the message will be sent.
        text (str): The message content.
    """
    url = f"{TELEGRAM_API_URL}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": text
    }
    response = requests.post(url, json=payload)
    print("Telegram API Response:", response.json())
