# ConversoMVP

ConversoMVP es un proyecto diseñado para crear un bot de ventas automatizado en WhatsApp utilizando `whatsapp-web.js`. Este bot permite interactuar con los clientes de manera eficiente, automatizando respuestas y gestionando pagos de manera organizada.

---

## **Características Principales**

1. **Integración con WhatsApp:**
   - Usa `whatsapp-web.js` para interactuar con clientes en tiempo real.
   - Sesión persistente mediante `LocalAuth`.
   - Notificación automática al administrador cuando un usuario confirma su pago.
   
2. **Flujo de Conversación Optimizado:**
   - Se envía automáticamente un libro digital gratuito como regalo de bienvenida.
   - Se personaliza la experiencia según la edad del niño o niña.
   - Se envía un video con los dibujos disponibles para colorear.
   - Se facilita la compra con un mensaje claro y un proceso guiado.

3. **Manejo de Pagos y Confirmaciones:**
   - Se envía un código QR para realizar pagos.
   - Se proporciona un proceso detallado para confirmar el pago con foto del comprobante.
   - El bot notifica automáticamente al administrador cuando se reporta un pago.

4. **Organización Modular:**
   - Separación de la lógica del bot de WhatsApp en un solo archivo `whatsappBot.js`.
   - Arquitectura clara y fácilmente mantenible.

---

## **Requisitos del Sistema**

- **Node.js 16+**
- **Ngrok** (para exponer el servidor local a internet)

### Dependencias de Node.js

Instala las dependencias dentro de la carpeta `WhatsappAPI`:

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
ADMIN_PHONE=59169533423@c.us
```

### Paso 3: Ejecutar el Bot de WhatsApp

```bash
cd WhatsappAPI
node whatsappBot.js
```

---

## **Flujo de Trabajo del Proyecto**

1. El cliente envía un mensaje a WhatsApp.
2. `whatsappBot.js` recibe el mensaje, clasifica la intención y responde según el flujo de ventas.
3. Si el usuario indica que ha realizado el pago:
   - El bot envía un mensaje de confirmación.
   - Se notifica automáticamente al administrador.
   - Se proporciona el enlace de descarga una vez validado el pago.

---

## **Nuevas Funcionalidades Implementadas**
✅ **Personalización de la conversación**  
✅ **Flujo de ventas mejorado**  
✅ **Optimización de mensajes**  
✅ **Notificación automática al administrador**  
✅ **Manejo de intenciones como "Pedir información de dibujos" y "Quiero pagar"**  

---

🚀 **Desarrollado por CarliCode. Listo para automatizar tu negocio con ConversoMVP!** 🎨✨

