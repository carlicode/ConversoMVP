from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from backend.ai_responses import classify_response, generate_response
import logging
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

app = FastAPI()

# Configurar logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Modelo para mensajes
class MessageRequest(BaseModel):
    message: str

@app.post("/classify")
async def classify(request: MessageRequest):
    """
    📌 Endpoint para clasificar la intención del mensaje sin generar respuesta.
    """
    try:
        logger.info(f"📩 Mensaje recibido para clasificación: {request.message}")

        # Clasificar la intención del mensaje
        intent = classify_response(request.message)
        logger.info(f"🤖 Intención detectada: {intent}")

        # Devuelve solo la intención sin respuesta predefinida
        return {"intent": intent, "generated": True}

    except Exception as e:
        logger.error(f"❌ Error clasificando mensaje: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor.")

@app.post("/generate")
async def generate(request: MessageRequest):
    """
    📌 Endpoint para generar respuesta con OpenAI solo cuando es necesario.
    """
    try:
        logger.info(f"📝 Generando respuesta para: {request.message}")

        response = generate_response(request.message)
        logger.info(f"🔵 Respuesta generada por OpenAI: {response}")

        return {"response": response}

    except Exception as e:
        logger.error(f"❌ Error generando respuesta: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor.")
