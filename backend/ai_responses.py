from openai import OpenAI
from dotenv import load_dotenv
import os
import logging
from backend.messages_classify_response import classification_examples
from backend.messages_generate_response import response_examples

# Cargar variables de entorno
load_dotenv()

# Configurar la API de OpenAI
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

# Configurar logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# 📌 Mensaje del sistema para clasificar intenciones
system_classification_message = {
    "role": "system",
    "content": """
    Eres un clasificador de intenciones para un bot de atención al cliente. 
    Tu tarea es analizar el mensaje del usuario y devolver únicamente la intención detectada, sin agregar explicaciones ni información adicional.

    ### **Intenciones posibles:**
    - Saludo
    - Pedir precio
    - Pedir QR o métodos de pago
    - Cómo descargar
    - Quiero pagar
    - Pago confirmado
    - Niño pintando
    - No entiendo la intención del usuario

    ### **Reglas para clasificación**
    - Si el mensaje contiene saludos como "hola", "buenas", "qué tal", 'quiero informacion', 'informacion por favor', clasifícalo como *Saludo*.
    - Si el usuario pregunta sobre precios, clasifícalo como *Pedir precio*.
    - Si menciona pagos, métodos de pago o QR, clasifícalo como *Pedir QR o métodos de pago*.
    - Si pregunta cómo descargar, clasifícalo como *Cómo descargar*.
    - Si expresa intención de compra, clasifícalo como *Quiero pagar*.
    - Si dice "ya pagué", "ya hice el pago", "ya deposité", o algo similar, clasifícalo como *Pago confirmado*.
    - Si menciona materiales para colorear como "mi hijo usa crayones", "pinta con acuarelas", "no pinta pero quiero empezar", clasifícalo como *Niño pintando*.
    - Si el mensaje no encaja en ninguna categoría, clasifícalo como *No entiendo la intención del usuario*.

    Devuelve solo el nombre exacto de la intención, sin ningún otro texto.
    """
}

# 📌 Mensaje del sistema para generar respuestas
system_message = {
    "role": "system",
    "content": """
    Eres 'Flor', un asistente virtual para WhatsApp del negocio "Coloreando Juntos".
    Tu tarea es responder preguntas de forma clara y concisa, sin repetir saludos innecesarios.

    ### **Reglas para generar respuestas**
    - Usa emojis para un tono amigable y atractivo.
    - Sé breve, directo y evita respuestas largas.
    - Si es relevante, termina la respuesta con una acción clara.

    **Ejemplo de respuestas correctas:**
    ❌ *Incorrecto:* "¡Hola! Espero que estés teniendo un excelente día. En respuesta a tu pregunta..."
    ✅ *Correcto:* "Puedes pagar por QR o transferencia. ¿Te envío el QR? 😊"

    **Responde en este formato para cada mensaje del usuario.**
    """
}

def classify_response(user_message: str) -> str:
    """
    📌 Clasifica la intención del mensaje sin generar respuesta.
    """
    try:
        messages = [{"role": "system", "content": system_classification_message["content"]}] + \
                   classification_examples + \
                   [{"role": "user", "content": user_message}]

        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages
        )

        detected_intent = completion.choices[0].message.content.strip()
        logger.info(f"🔍 Intención detectada: {detected_intent}")

        return detected_intent

    except Exception as e:
        logger.error(f"❌ Error clasificando intención: {e}")
        return "No entiendo la intención del usuario"

def generate_response(user_message: str) -> str:
    """
    📌 Genera una respuesta con OpenAI si la intención no es predefinida.
    """
    try:
        messages = [{"role": "system", "content": system_message["content"]}] + \
                   response_examples + \
                   [{"role": "user", "content": user_message}]

        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages
        )

        generated_response = completion.choices[0].message.content.strip()
        logger.info(f"🔵 Respuesta generada: {generated_response}")

        return generated_response

    except Exception as e:
        logger.error(f"❌ Error generando respuesta: {e}")
        return "Lo siento, hubo un problema generando la respuesta."
