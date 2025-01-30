# ConversoMVP

ConversoMVP es un proyecto diseñado para crear un bot de ventas automatizado en WhatsApp utilizando `whatsapp-web.js` para la interacción con los clientes y `FastAPI` para el procesamiento de mensajes con la inteligencia artificial de OpenAI.

---

## **Características Principales**

1. **Integración con WhatsApp:**
   - Usa `whatsapp-web.js` para interactuar con clientes en tiempo real.
   - Sesión persistente mediante `LocalAuth`.
   - Notificación automática al administrador cuando un usuario confirma su pago.
   
2. **Respuestas Inteligentes con OpenAI:**
   - Emplea OpenAI para generar respuestas naturales basadas en el contexto de la conversación.
   - Clasificación automática de intenciones para una mejor experiencia de usuario.
   - Manejo específico de respuestas para casos como "Pago Confirmado", "Niño Pintando" y "Pedir información de dibujos".

3. **Flujo de Conversación Optimizado:**
   - Se envía automáticamente un libro digital gratuito como regalo de bienvenida.
   - Se pregunta si el niño usa crayones, acuarelas o colores, para personalizar la experiencia.
   - Se muestran beneficios de pintar en un solo mensaje.
   - Se envía un video con los dibujos disponibles para colorear.
   - Se facilita la compra con un mensaje claro y un proceso guiado.

4. **Backend en FastAPI:**
   - Manejo eficiente de las solicitudes del bot de WhatsApp.
   - Rutas para gestionar la interacción con OpenAI y generar respuestas inteligentes.

5. **Organización Modular:**
   - Separación de la lógica del bot de WhatsApp y la gestión de respuestas con AI.
   - Arquitectura escalable y fácilmente mantenible.

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
│   ├── ai_responses.py           # Respuestas con OpenAI
│   ├── app.py                    # Servidor FastAPI
│   ├── config.py                 # Configuración de variables de entorno
│   ├── messages_classify_response.py  # Clasificación de intenciones del usuario
│   ├── messages_generate_response.py  # Generación de respuestas con AI
│   └── requirements.txt           # Lista de dependencias de Python
├── WhatsappAPI/                   # Lógica del bot de WhatsApp
│   ├── .wwebjs_auth/              # Caché de autenticación de WhatsApp
│   ├── .wwebjs_cache/             # Cache de sesión de WhatsApp
│   ├── node_modules/              # Dependencias instaladas
│   ├── whatsappBot.js             # Cliente de WhatsApp principal
│   ├── package.json               # Dependencias de Node.js
│   ├── package-lock.json          # Archivo de lock de dependencias
│   ├── qr.jpeg                    # Imagen del código QR para pagos
│   ├── regalo.pdf                 # Libro digital gratuito
│   ├── ventas.json                # Registro de ventas confirmadas
├── .env                           # Variables de entorno (ignorado en GitHub)
├── README.md                      # Documentación del proyecto
└── .gitignore                      # Exclusiones de archivos para Git
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
5. Si el usuario indica que ha realizado el pago:
   - El bot notifica automáticamente al administrador.
   - Se le proporciona el enlace de descarga una vez validado el pago.

---

## **Nuevas Funcionalidades Implementadas**
✅ **Personalización de la conversación**
✅ **Flujo de ventas mejorado**
✅ **Optimización de mensajes**
✅ **Notificación automática al administrador**
✅ **Manejo de pagos confirmados y almacenamiento en `ventas.json`**
✅ **Manejo de mensajes pendientes para responder automáticamente**
✅ **Manejo de intenciones como "Pedir información de dibujos", "Niño pintando" y "Pinta otro"**

---

🚀 **Desarrollado por CarliCode. Listo para automatizar tu negocio con ConversoMVP!** 🎨✨

