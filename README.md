# Converso MVP

Converso es un MVP de una plataforma diseñada para crear un bot de ventas sencillo y personalizable que interactúa con clientes a través de la API de Telegram. Este bot puede configurarse mediante una interfaz en Streamlit y se conecta a los chats de Telegram para ayudar a generar leads y ventas utilizando OpenAI y LangChain para respuestas inteligentes.

---

## **Características Principales**

1. **Configuración Personalizada:**
   - Los usuarios pueden personalizar los mensajes de bienvenida, respuestas automáticas y mensajes de cierre desde una interfaz fácil de usar en Streamlit.

2. **Integración con Telegram:**
   - Utiliza la API de Telegram para conectarse a los chats y manejar conversaciones en tiempo real.

3. **Respuestas Inteligentes con IA:**
   - Emplea OpenAI y LangChain para generar respuestas dinámicas y naturales basadas en el contexto de la conversación.

4. **Generación de Leads:**
   - Responde automáticamente a preguntas comunes de los clientes y los guía hacia una conversión o generación de leads.

5. **Simplicidad:**
   - Sin base de datos; todas las configuraciones se guardan en archivos temporales para pruebas rápidas.

---

## **Requisitos del Sistema**

- **Python 3.8+**
- **Ngrok** para exponer el servidor local a internet

### Dependencias de Python

Las siguientes librerías son necesarias para el proyecto:

- `fastapi`
- `uvicorn`
- `streamlit`
- `requests`
- `python-dotenv`
- `pyngrok`
- `openai`
- `langchain`

Instálalas con:
```bash
pip install fastapi uvicorn streamlit requests python-dotenv pyngrok openai langchain
```

---

## **Estructura del Proyecto**

```
converso/
├── backend/                  # Lógica del servidor y manejo de datos
│   ├── app.py                # Punto de entrada del backend
│   ├── bot/                  # Lógica del bot y manejo de mensajes
│   │   ├── webhook.py        # Webhook para Telegram
│   │   └── responses.py      # Lógica para generar respuestas con OpenAI y LangChain
│   └── config.py             # Configuración global
├── frontend/                 # Interfaz del usuario con Streamlit
│   ├── app.py                # Configurador del bot
│   ├── static/               # Archivos estáticos (CSS, imágenes)
│   └── templates/            # Plantillas HTML (si son necesarias)
├── tests/                    # Tests unitarios
│   ├── test_backend.py       # Tests del backend
│   └── test_frontend.py      # Tests del frontend
├── config.json               # Archivo de configuración del bot
├── Pipfile                   # Dependencias del proyecto
├── README.md                 # Documentación del proyecto
└── requirements.txt          # Lista de dependencias
```

---

## **Cómo Configurar el Proyecto**

### Paso 1: Clonar el Repositorio
```bash
git clone https://github.com/carlicode/ConversoMVP.git
cd converso
```

### Paso 2: Crear un Entorno Virtual
```bash
pip install pipenv
pipenv install
pipenv shell
```

### Paso 3: Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
BOT_TOKEN=tu_token_del_bot_telegram
OPENAI_API_KEY=tu_clave_api_openai
```

### Paso 4: Ejecutar el Backend
```bash
uvicorn backend.app:app --reload
```

### Paso 5: Exponer el Servidor con Ngrok
```bash
ngrok http 8000
```
Copia la URL pública proporcionada por Ngrok y regístrala como webhook en el panel de desarrollo de Telegram.

### Paso 6: Ejecutar el Frontend
```bash
streamlit run frontend/app.py
```

---

## **Flujo de Trabajo del Usuario**

1. **Configuración del Bot:**
   - Personaliza el mensaje de bienvenida, respuestas automáticas y mensaje de cierre desde Streamlit.

2. **Conexión con Telegram:**
   - Usa el token del bot generado por el BotFather para autorizar el acceso a tu bot.

3. **Operación del Bot:**
   - El bot responde automáticamente a los mensajes entrantes basándose en las configuraciones y, si es necesario, utiliza OpenAI y LangChain para respuestas dinámicas.

---

## **Next Steps / Próximos Pasos**

- Mejorar la gestión del webhook para manejo avanzado de mensajes.
- Agregar opciones avanzadas de personalización en la interfaz de Streamlit.
- Implementar métricas para analizar las conversiones generadas por el bot.

---

¡Listo para crear bots efectivos con Converso! / Ready to create effective bots with Converso! 🚀

