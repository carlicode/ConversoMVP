# ConversoMVP

ConversoMVP es un proyecto diseñado para crear un bot de ventas automatizado en WhatsApp utilizando `whatsapp-web.js` y FastAPI. Este bot permite interactuar con los clientes de manera eficiente, automatizando respuestas y gestionando pagos de manera organizada.

---

## **Características Principales**

1. **Integración con WhatsApp:**
   - Usa `whatsapp-web.js` para interactuar con clientes en tiempo real.
   - Sesión persistente mediante `LocalAuth`.
   - Notificación automática al administrador cuando un usuario confirma su pago.
   - Respuesta automática a mensajes no leídos o chats nuevos al iniciar el bot.

2. **Flujo de Conversación Optimizado:**
   - Se envía automáticamente un libro digital gratuito como regalo de bienvenida.
   - Se personaliza la experiencia según la edad del niño o niña.
   - Se envía un video con los dibujos disponibles para colorear.
   - Se facilita la compra con un mensaje claro y un proceso guiado.

3. **Manejo de Pagos y Confirmaciones:**
   - Se envía un código QR para realizar pagos.
   - Se proporciona un proceso detallado para confirmar el pago con foto del comprobante.
   - El bot notifica automáticamente al administrador cuando se reporta un pago.

4. **Manejo de Mensajes No Respondidos:**
   - Al iniciar el bot, revisa los mensajes pendientes y envía una respuesta de bienvenida.
   - Evita que los clientes queden sin atención si enviaron mensajes antes de que el bot estuviera activo.

5. **API con FastAPI para Clasificación de Mensajes:**
   - Endpoint `/classify`: Clasifica mensajes y detecta intención del usuario.
   - Endpoint `/generate`: Genera respuestas utilizando OpenAI si es necesario.
   - Comunicación eficiente entre el bot y la API para respuestas inteligentes.

6. **Organización Modular:**
   - Separación de la lógica del bot de WhatsApp en archivos modulares.
   - FastAPI como backend para procesamiento de mensajes.
   - Arquitectura clara y fácilmente mantenible.

---

## **Requisitos del Sistema**

- **Node.js 16+**
- **Python 3.8+**
- **FastAPI y Uvicorn**
- **Ngrok** (para exponer el servidor local a internet)

### Dependencias de Node.js

Instala las dependencias dentro de la carpeta `WhatsappAPI`:

```bash
cd WhatsappAPI
npm install
```

### Dependencias de Python

Instala las dependencias necesarias dentro de la carpeta `backend`:

```bash
cd backend
pip install -r requirements.txt
```

---

## **Estructura del Proyecto**

```
conversoMVP/
├── WhatsappAPI/                   # Lógica del bot de WhatsApp
│   ├── bot.js                     # Cliente de WhatsApp principal
│   ├── handlers/                   # Manejadores de mensajes
│   │   ├── messageHandler.js       # Procesa mensajes entrantes
│   ├── utils/                      # Utilidades y funciones auxiliares
│   │   ├── messageUtils.js         # Funciones para enviar mensajes
│   ├── node_modules/               # Dependencias instaladas
│   ├── package.json                # Dependencias de Node.js
│   ├── package-lock.json           # Archivo de lock de dependencias
│   ├── qr.png                      # Imagen del código QR para pagos
│   ├── regalo.pdf                  # Libro digital gratuito
│   ├── ventas.json                 # Registro de ventas confirmadas
├── backend/                        # API con FastAPI para clasificación de mensajes
│   ├── app.py                      # Servidor FastAPI principal
│   ├── ai_responses.py             # Procesa respuestas con IA
│   ├── messages_classify_response.py # Clasificación de mensajes
│   ├── messages_generate_response.py # Generación de respuestas con OpenAI
│   ├── requirements.txt            # Dependencias de Python
├── .env                            # Variables de entorno (ignorado en GitHub)
├── README.md                       # Documentación del proyecto
└── .gitignore                       # Exclusiones de archivos para Git
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
ADMIN_PHONE=59169533423@c.us
```

### Paso 3: Ejecutar el Backend con FastAPI

```bash
cd backend
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

### Paso 4: Ejecutar el Bot de WhatsApp

```bash
cd WhatsappAPI
node bot.js
```

---

## **Flujo de Trabajo del Proyecto**

1. El cliente envía un mensaje a WhatsApp.
2. `bot.js` recibe el mensaje, lo procesa y lo clasifica.
3. Si es necesario, consulta FastAPI para detectar la intención o generar respuestas.
4. Si el usuario indica que ha realizado el pago:
   - El bot envía un mensaje de confirmación.
   - Se notifica automáticamente al administrador.
   - Se proporciona el enlace de descarga una vez validado el pago.
5. Al iniciar el bot, revisa los mensajes sin responder y envía un mensaje de saludo a los chats nuevos.

---

## **Nuevas Funcionalidades Implementadas**
✅ **Personalización de la conversación**  
✅ **Flujo de ventas mejorado**  
✅ **Optimización de mensajes**  
✅ **Notificación automática al administrador**  
✅ **Manejo de mensajes pendientes y chats no respondidos**  
✅ **Manejo de intenciones como "Pedir información de dibujos" y "Quiero pagar"**  
✅ **Integración con FastAPI para análisis y respuesta inteligente**  

---

🚀 **Desarrollado por CarliCode. Listo para automatizar tu negocio con ConversoMVP!** 🎨✨