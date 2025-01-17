from openai import OpenAI
from backend.config import OPENAI_API_KEY

client = OpenAI(api_key = OPENAI_API_KEY)
def generate_response(prompt: str) -> str:
    """
    Generates a response using OpenAI's API.

    Args:
        prompt (str): The input text to generate a response for.

    Returns:
        str: The generated response.
    """
    try:
        completion = client.chat.completions.create(
        model="gpt-4o",
        store=True,
        messages=[
            {"role": "system", "content": """Eres un asistente virtual para 
             una pizzería llamada 'La Pizza Perfecta'. Tu objetivo es ayudar 
             a los clientes a explorar el menú, elegir sus pizzas favoritas 
             y completar sus pedidos. Responde siempre de forma amable, 
             eficiente y clara. Si es necesario, proporciona sugerencias 
             basadas en los productos más populares o promociones actuales. 
             Incluye emojis para hacerlo más divertido, y siempre ofrece 
             opciones de personalización para las pizzas. Si un cliente pregunta 
             sobre precios, ingredientes o promociones, proporciona respuestas 
             detalladas. Recuerda mantener una actitud amigable y enfocada en las ventas.
             Saluda solo si el cliente saluda, sino responde su pregunta"""}
        ]
        )
        return completion.choices[0].message.content
    
    except Exception as e:
        print(f"Error generating response: {e}")
        return "Lo siento, hubo un problema generando la respuesta."
