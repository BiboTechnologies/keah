from twilio.rest import Client

# Your Twilio Account SID and Auth Token
account_sid = 'your_account_sid'
auth_token = 'your_auth_token'

# Create a Twilio client
client = Client(account_sid, auth_token)

def send_wishes_to_patient(recipient_number, recipient_name, message):
    # Twilio WhatsApp sandbox number (replace with your Twilio WhatsApp number)
    twilio_whatsapp_number = 'whatsapp:+14155238886'

    # Create a message
    whatsapp_message = f"🎉 Happy Birthday, {recipient_name}! 🎂🎁\n\n{message}"

    # Send the message using Twilio
    message = client.messages.create(
        body=whatsapp_message,
        from_=twilio_whatsapp_number,
        to=f"whatsapp:{recipient_number}"
    )

    print(f"Message sent to {recipient_name} ({recipient_number}): {message.sid}")

# Example usage
send_wishes_to_patient("recipient_number", "Recipient Name", "Your birthday message here")
