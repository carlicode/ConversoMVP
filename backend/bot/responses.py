from openai import OpenAI
from backend.config import OPENAI_API_KEY
from backend.common.examples import examples  # Importar ejemplos de interacciones

client = OpenAI(api_key=OPENAI_API_KEY)

# Role system
system_message = {
    "role": "system",
    "content": """
    Eres un asistente virtual y te llamas 'Flor' para un negocio llamado "Coloreando Juntos". Ya has proporcionado información preliminar al cliente, así que evita repetir saludos y despedidas innecesarias. Tu trabajo es responder preguntas de manera precisa, clara y profesional, **sin formular preguntas adicionales al cliente**.

    ### **Información Preliminar Ya Compartida**
    - **Libro Digital de Muestra**: Gratuito. Contiene 10 dibujos variados.
    - **Kit Completo de Dibujos Digitales**: 3000 dibujos listos para imprimir por **25 Bs**.
    - **Temáticas**: Personajes infantiles, naturaleza, educativos y más.
    - Métodos de pago: Transferencia bancaria, QR y efectivo.

    ### **Estilo y Reglas**
    - Responde preguntas directamente, sin formular preguntas adicionales.
    - Usa emojis para mantener el tono amigable y atractivo.
    - Sé breve y al punto, pero ofrece detalles si son solicitados.
    - Siempre finaliza con un llamado a la acción si es relevante, como: "Por favor, avísame si necesitas más información."

    ### **Ejemplos de Respuestas**
    - Pregunta de dibujos: "Tenemos dibujos de Bluey, Bob el Constructor y más. 🌟"
    - Métodos de pago: "Puedes pagar por transferencia, QR o efectivo. 💳"
    - Tiempo de entrega: "El enlace se enviará en menos de 10 minutos tras el pago. ⏱️"
    """
}

def generate_response(user_message: str) -> str:
    """
    Generates a response using OpenAI's API, avoiding repeated greetings or farewells.

    Args:
        user_message (str): The input text from the user.

    Returns:
        str: The generated response.
    """
    try:
        # Construir el historial de mensajes
        chat_history = [system_message] + examples + [{"role": "user", "content": user_message}]
        
        # Generar respuesta desde OpenAI
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=chat_history
        )
        return completion.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error generating response: {e}")
        return "Lo siento, hubo un problema generando la respuesta."

from openai import OpenAI
from backend.config import OPENAI_API_KEY
from backend.common.examples import examples

client = OpenAI(api_key=OPENAI_API_KEY)

def analyze_intent(prompt: str) -> str:
    """
    Analyze the user's intent using OpenAI.

    Args:
        prompt (str): The user's input message.

    Returns:
        str: The detected intent (e.g., 'purchase', 'inquire', 'other').
    """
    try:
        # Prompt para detectar la intención
        messages = [
            {
                "role": "system",
                "content": """
                Eres un asistente que ayuda a identificar las intenciones del usuario en una conversación para un negocio que vende libros digitales para colorear. 
                Detecta si el usuario quiere comprar, tiene dudas sobre el producto, o está simplemente explorando.

                Devuelve solo una palabra para la intención:
                - 'purchase' si el usuario quiere comprar o hacer el pago.
                - 'inquire' si el usuario tiene preguntas sobre productos, precios, o entrega.
                - 'other' si el usuario está conversando o no tiene una intención clara de compra.
                """
            },
            {"role": "user", "content": prompt}
        ]
        
        # Llamar a la API de OpenAI
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages
        )

        # Retornar la intención
        return completion.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error analyzing intent: {e}")
        return "other"
