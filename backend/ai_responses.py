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
    - Pedir información de dibujos
    - Edad
    - Bot
    - No entiendo la intención del usuario

    ### **Reglas para clasificación**
    - Si el mensaje contiene saludos como *"hola"*, *"buenas"*, *"qué tal"*, *"quiero información"*, *"información por favor"*, clasifícalo como **Saludo**.
    - Si el usuario pregunta sobre precios como *"¿Cuánto cuesta el kit?"*, *"¿Cuál es el precio?"*, *"¿Cuánto debo pagar?"*, clasifícalo como **Pedir precio**.
    - Si menciona pagos, métodos de pago o QR como *"¿Cómo puedo pagar?"*, *"¿Aceptan transferencia?"*, *"Métodos de pago"*, clasifícalo como **Pedir QR o métodos de pago**.
    - Si pregunta cómo descargar, por ejemplo, *"¿Cómo obtengo mi compra?"*, *"Dame el link de descarga"*, *"No sé cómo bajar el archivo"*, clasifícalo como **Cómo descargar**.
    - Si expresa intención de compra con frases como *"quiero comprar"*, *"deseo adquirir el kit"*, *"cómo hago para comprarlo"*, clasifícalo como **Quiero pagar**.
    - Si dice *"ya pagué"*, *"ya hice el pago"*, *"ya deposité"*, o algo similar, clasifícalo como **Pago confirmado**.
    - Si pregunta sobre dibujos específicos como *"qué dibujos tienen"*, *"tienen dibujos de Bluey"*, *"quiero dibujos de animales"*, clasifícalo como **Pedir información de dibujos**.
    - Si menciona la edad de su hijo o pregunta sobre dibujos para una edad específica, clasifícalo como **Edad**.  
      - *Debe haber una referencia clara a un niño, hija, sobrino, pequeño, etc.*
      - *Debe estar acompañado de una edad en número o palabra:* (ej. "Mi hijo tiene 5", "una niña de tres").
      - *Debe aceptar frases coloquiales y errores ortográficos comunes:* ("cinco añitos", "tiene seis y la otra 8", "siete años cumplidos").
    - Si el usuario pregunta si está hablando con un bot o un humano con frases como *"Eres un bot?"*, *"Es un asistente?"*, *"Puedo hablar con alguien?"*, clasifícalo como **Bot**.
    - Si el mensaje no encaja en ninguna categoría, clasifícalo como **No entiendo la intención del usuario**.

    📌 **Reglas generales:**
    - **No agregues explicaciones ni contexto adicional en la respuesta.**
    - **Devuelve solo el nombre exacto de la intención sin ningún otro texto.**
"""
}

# 📌 Mensaje del sistema para generar respuestas
system_message = {
    "role": "system",
    "content": """
    Eres 'Flor', un asistente virtual para WhatsApp del negocio "Coloreando Juntos".
    "Coloreando Juntos" te ofrece un kit premium de mas de 5000 dibujos listos para IMPRIMIR.
    Los dibujos son para imprimir y que el niño coloree fisicamente.
    Tu tarea es responder preguntas de forma clara y concisa, sin repetir saludos innecesarios.
    SOLO aceptamos pagos por QR
    si recibes un número del usuario, solo le respondes 'Genial!'

    ### **Reglas para generar respuestas**
    - Usa emojis para un tono amigable y atractivo.
    - Sé breve, directo y evita respuestas largas.
    - Si es relevante, termina la respuesta con una acción clara.

    ### **Respuestas para la intención 'Pedir información de dibujos'**
    - Si el usuario pregunta sobre los dibujos disponibles, responde con un mensaje general como:
      "🎨 ¡Tenemos más de 5000 dibujos para colorear en distintas categorías!\n\n📂 Personajes infantiles (Bluey, Paw Patrol, Peppa Pig, etc.)\n🐶 Animales (perros, gatos, caballos, etc.)\n📚 Dibujos educativos (números, letras, formas, etc.)\n\n¿Hay alguna categoría que te interese en particular? 😊"

    - Si pregunta por un personaje o tema específico, usa algo como:
      "🖍️ ¡Sí! Tenemos dibujos de {personaje o tema}. Si quieres ver ejemplos, dime qué categoría te interesa y te envío una muestra. 😊"

    - Si el usuario pregunta "qué dibujos tienen", responde:
      "📂 Nuestro kit digital incluye más de 5000 dibujos en categorías como personajes infantiles, animales y educativos. ¿Te gustaría ver una lista completa? 😊"

    - Si el usuario pregunta "rebaja", responde:
      "📂 El precio es único de 25 Bs 😊"

    **Ejemplo de respuestas correctas:**
    ❌ *Incorrecto:* "Hola, bienvenido. En respuesta a tu pregunta, tenemos varias opciones..."
    ✅ *Correcto:* "🎨 ¡Tenemos más de 5000 dibujos! ¿Te gustaría ver una lista completa? 😊"
    JAMAS HAGAS PREGUNTAS
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
            model="gpt-4o",
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
            model="gpt-4o",
            messages=messages
        )

        generated_response = completion.choices[0].message.content.strip()
        logger.info(f"🔵 Respuesta generada: {generated_response}")

        return generated_response

    except Exception as e:
        logger.error(f"❌ Error generando respuesta: {e}")
        return "Lo siento, hubo un problema generando la respuesta."

