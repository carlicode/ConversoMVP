import requests
import json
import os
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

app = FastAPI()

# Environment variables
VERIFY_TOKEN = os.getenv("VERIFY_TOKEN")
ACCESS_TOKEN = os.getenv("ACCESS_TOKEN")
WHATSAPP_API_URL = os.getenv("WHATSAPP_API_URL")

# Function to send messages via WhatsApp API
def send_message(to, text):
    """
    Sends a message to a specific WhatsApp number via the WhatsApp API.
    
    Args:
        to (str): The recipient's WhatsApp number in international format.
        text (str): The message text to send.
    """
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",  # API access token
        "Content-Type": "application/json"  # Specify JSON content
    }
    payload = {
        "messaging_product": "whatsapp",  # Specify WhatsApp as the messaging platform
        "to": to,  # Recipient's phone number
        "text": {"body": text}  # Message content
    }
    response = requests.post(WHATSAPP_API_URL, headers=headers, json=payload)
    print("WhatsApp API Response:", response.json())

# Function to load the bot configuration from a JSON file
def load_config():
    """
    Loads the bot configuration stored in config.json.
    
    Returns:
        dict: The bot configuration as a dictionary.
    """
    with open("config.json", "r") as f:
        return json.load(f)

# Endpoint to verify the webhook with the Meta API
@app.get("/webhook")
def verify_webhook(request: Request):
    """
    Verifies the webhook when configured in the Meta API settings.
    
    Args:
        request (Request): The incoming HTTP request containing the verification data.
    
    Returns:
        JSONResponse: The challenge token if verification is successful, or an error.
    """
    mode = request.query_params.get("hub.mode")
    token = request.query_params.get("hub.verify_token")
    challenge = request.query_params.get("hub.challenge")

    if mode == "subscribe" and token == VERIFY_TOKEN:
        return JSONResponse(content=int(challenge))
    else:
        return JSONResponse(content={"error": "Unauthorized"}, status_code=403)

# Endpoint to process incoming messages via the webhook
@app.post("/webhook")
async def webhook(request: Request):
    """
    Handles incoming messages from the WhatsApp API via the webhook.
    
    Args:
        request (Request): The incoming HTTP request containing message data.
    
    Returns:
        dict: A success status response.
    """
    config = load_config()  # Load bot configuration
    data = await request.json()  # Parse the incoming JSON payload

    # Check if there are incoming messages in the payload
    if "messages" in data:
        for message in data["messages"]:
            sender = message["from"]  # Sender's phone number
            text = message["text"]["body"]  # Message text content
            print(f"Message received from {sender}: {text}")

            # Retrieve the appropriate response from the configuration
            response = config["responses"].get(text.lower(), config["closing_message"])
            send_message(sender, response)  # Send the response

    return {"status": "success"}
