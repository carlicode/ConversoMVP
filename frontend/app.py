import streamlit as st

st.title("Configurador de Converso Bot")
st.write("Configura tu bot para WhatsApp aquí.")

welcome_message = st.text_input("Mensaje de bienvenida", "¡Hola! Soy tu asistente virtual.")
response_message = st.text_area("Respuestas automáticas", "precio:El precio es $100\nubicación:Estamos en el centro.")
closing_message = st.text_input("Mensaje de cierre", "¿Te gustaría comprar ahora? Haz clic aquí.")

if st.button("Guardar configuración"):
    st.success("¡Configuración guardada!")
    # Aquí guardarías la configuración en un archivo temporal o base de datos
