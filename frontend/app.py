import streamlit as st
import json

# Streamlit UI for configuring the Converso Bot
st.title("Converso Bot Configurator")
st.write("Customize your WhatsApp bot here.")

# Input fields for bot customization
welcome_message = st.text_input(
    "Welcome Message", "Hello! I am your virtual assistant."
)  # Input for the welcome message

response_message = st.text_area(
    "Automatic Responses", "price:The price is $100\nlocation:We are in the city center."
)  # Input for predefined automatic responses (key:value pairs)

closing_message = st.text_input(
    "Closing Message", "Would you like to buy now? Click here."
)  # Input for the closing message

# Button to save the configuration
if st.button("Save Configuration"):
    """
    Save the bot's configuration into a JSON file.
    """
    # Build the configuration dictionary
    config = {
        "welcome_message": welcome_message,  # Save the welcome message
        "responses": dict(
            line.split(":") for line in response_message.split("\n") if ":" in line
        ),  # Parse key:value pairs from the response message input
        "closing_message": closing_message,  # Save the closing message
    }

    # Write the configuration to a JSON file
    with open("config.json", "w") as f:
        json.dump(config, f)

    # Display success message
    st.success("Configuration saved successfully!")
