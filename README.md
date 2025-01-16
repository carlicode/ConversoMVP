# Converso MVP

Converso es un MVP de una plataforma diseñada para crear un bot de ventas sencillo y personalizado, que interactúa con clientes a través de la API de WhatsApp. Este bot puede configurarse desde una interfaz en Streamlit y se conecta a los chats de WhatsApp para ayudar a generar leads y ventas, utilizando OpenAI y LangChain para respuestas inteligentes.

---

## **Características Principales**

1. **Configuración Personalizada:**
   - Los usuarios pueden personalizar los mensajes de bienvenida, respuestas automáticas y mensajes de cierre desde una interfaz fácil de usar en Streamlit.

2. **Integración con WhatsApp:**
   - Utiliza la API de WhatsApp para conectarse a los chats y manejar conversaciones en tiempo real.

3. **Respuestas Inteligentes con IA:**
   - Emplea OpenAI y LangChain para generar respuestas dinámicas y naturales basadas en el contexto de la conversación.

4. **Generación de Leads:**
   - Responde automáticamente a preguntas comunes de los clientes y los guía hacia una conversión o generación de leads.

5. **Simplicidad:**
   - Sin base de datos, toda la configuración se guarda en archivos temporales para pruebas rápidas.

---

## **Requisitos del Sistema**

- **Python 3.8+**
- **Node.js** (opcional, solo si necesitas herramientas adicionales para trabajar con la API de WhatsApp)
- **Ngrok** para exponer el servidor local a internet

### Dependencias de Python

Estas son las librerías necesarias para el proyecto:

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
│   ├── auth/                 # Manejo de autenticación y tokens
│   │   ├── oauth.py          # Implementación del flujo de OAuth
│   │   └── tokens.py         # Gestión de tokens de acceso
│   ├── bot/                  # Lógica del bot y manejo de mensajes
│   │   ├── webhook.py        # Webhook para WhatsApp
│   │   └── responses.py      # Lógica para generar respuestas con OpenAI y LangChain
│   ├── database/             # Conexión y modelos de datos
│   │   ├── models.py         # Modelos de base de datos
│   │   └── db.py             # Configuración de la base de datos
│   └── config.py             # Configuración global
├── frontend/                 # Interfaz del usuario con Streamlit
│   ├── app.py                # Configurador del bot
│   ├── static/               # Archivos estáticos (CSS, imágenes)
│   └── templates/            # Plantillas HTML (si son necesarias)
├── tests/                    # Tests unitarios
│   ├── test_backend.py       # Tests del backend
│   ├── test_frontend.py      # Tests del frontend
│   └── test_oauth.py         # Tests de OAuth
├── config.json   
├── Pipfile                   # Dependencias del proyecto
├── README.md                 # Documentación del proyecto
└── requirements.txt          # Lista de dependencias 
```

---

## **Cómo Configurar el Proyecto**

### Paso 1: Clonar el Repositorio
```bash
git clone https://github.com/tu_usuario/converso.git
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
OPENAI_API_KEY=tu_clave_openai
META_CLIENT_ID=tu_cliente_id
META_CLIENT_SECRET=tu_cliente_secreto
REDIRECT_URI=https://tu_ngrok_url.ngrok.io/oauth/callback
```

### Paso 4: Ejecutar el Backend
```bash
uvicorn backend.app:app --reload
```

### Paso 5: Exponer el Servidor con Ngrok
```bash
ngrok http 8000
```
Copia la URL pública proporcionada por ngrok y regístrala como webhook en el panel de Meta para WhatsApp.

### Paso 6: Ejecutar el Frontend
```bash
streamlit run frontend/app.py
```

---

## **Flujo de Trabajo del Usuario**

1. **Configuración del Bot:**
   - Desde Streamlit, los usuarios pueden personalizar el mensaje de bienvenida, respuestas automáticas, y mensaje de cierre.

2. **Conexión con WhatsApp:**
   - A través del flujo OAuth, el usuario autoriza el acceso a su cuenta de WhatsApp.

3. **Operación del Bot:**
   - El bot responde automáticamente a los mensajes entrantes basándose en las configuraciones y, si es necesario, utiliza OpenAI y LangChain para generar respuestas dinámicas.

---

## **Próximos Pasos**

- Mejorar el flujo OAuth para optimizar la autorización de usuarios.
- Agregar opciones avanzadas de personalización en la interfaz de Streamlit.
- Implementar métricas para analizar las conversiones generadas por el bot.

---

¡Listo para crear bots efectivos con Converso! 🚀

