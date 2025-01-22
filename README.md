# ConversoMVP

ConversoMVP es un proyecto diseñado para crear un bot de ventas automatizado en WhatsApp utilizando `whatsapp-web.js` para la interacción con los clientes y `FastAPI` para el procesamiento de mensajes con la inteligencia artificial de OpenAI.

---

## **Características Principales**

1. **Integración con WhatsApp:**
   - Usa `whatsapp-web.js` para interactuar con clientes en tiempo real.
   - Sesión persistente mediante `LocalAuth`.

2. **Respuestas Inteligentes con OpenAI:**
   - Emplea OpenAI para generar respuestas naturales basadas en el contexto de la conversación.

3. **Backend en FastAPI:**
   - Manejo eficiente de las solicitudes del bot de WhatsApp.
   - Rutas para gestionar la interacción con OpenAI.

4. **Organización Modular:**
   - Separación de la lógica del bot de WhatsApp y la gestión de respuestas con AI.

---

## **Requisitos del Sistema**

- **Python 3.8+**
- **Node.js 16+**
- **Ngrok** (para exponer el servidor local a internet)

### Dependencias de Python

Las siguientes librerías son necesarias para el backend:

```bash
pip install -r requirements.txt
```

### Dependencias de Node.js

Instala las dependencias de Node.js dentro de la carpeta `WhatsappAPI`:

```bash
cd WhatsappAPI
npm install
```

---

## **Estructura del Proyecto**

```
conversoMVP/
├── backend/                      # Lógica del servidor y APIs
│   ├── ai_responses.py            # Respuestas con OpenAI
│   ├── app.py                      # Servidor FastAPI
│   ├── config.py                    # Configuración de variables de entorno
│   ├── examples.py                  # Ejemplos de conversación
│   └── requirements.txt              # Lista de dependencias de Python
├── WhatsappAPI/                   # Lógica del bot de WhatsApp
│   ├── whatsappBot.js                # Cliente de WhatsApp
│   ├── package.json                   # Dependencias de Node.js
│   ├── package-lock.json               # Archivo de lock de dependencias
│   └── node_modules/                   # Dependencias instaladas
├── .env                             # Variables de entorno (ignorado en GitHub)
├── README.md                         # Documentación del proyecto
└── .gitignore                         # Exclusiones de archivos para Git
```

---

## **Cómo Configurar el Proyecto**

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/carlicode/ConversoMVP.git
cd conversoMVP
```

### Paso 2: Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
OPENAI_API_KEY=tu_clave_api_openai
FASTAPI_HOST=http://localhost:8000
```

### Paso 3: Ejecutar el Backend (FastAPI)

```bash
cd backend
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### Paso 4: Ejecutar el Bot de WhatsApp

```bash
cd WhatsappAPI
node whatsappBot.js
```

---

## **Flujo de Trabajo del Proyecto**

1. El cliente envía un mensaje a WhatsApp.
2. `whatsappBot.js` recibe el mensaje y lo envía al backend de FastAPI.
3. FastAPI procesa el mensaje usando OpenAI y devuelve la respuesta.
4. El bot de WhatsApp envía la respuesta generada al cliente.

---

## **Next Steps / Próximos Pasos**

- Mejorar la lógica de respuestas utilizando más ejemplos en `examples.py`.
- Agregar una interfaz visual en Streamlit para la gestión del bot.
- Implementar métricas para analizar interacciones.

---

¡Listo para automatizar tu negocio con ConversoMVP! 🚀

