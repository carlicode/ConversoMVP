from openai import OpenAI
from backend.config import OPENAI_API_KEY
from backend.common.examples import examples  # Importar los ejemplos

client = OpenAI(api_key=OPENAI_API_KEY)

def generate_response(prompt: str) -> str:
    """
    Generates a response using OpenAI's API.

    Args:
        prompt (str): The input text to generate a response for.

    Returns:
        str: The generated response.
    """
    try:
        # Agregar el prompt del usuario al final de los ejemplos
        chat_history = examples + [{"role": "user", "content": prompt}]
        
        # Generar la respuesta
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=chat_history
        )
        return completion.choices[0].message.content
    except Exception as e:
        print(f"Error generating response: {e}")
        return "Lo siento, hubo un problema generando la respuesta."
