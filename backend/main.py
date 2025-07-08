from fastapi import FastAPI
from pydantic import BaseModel
from scheduler import schedule_whatsapp_reminder

app = FastAPI()

# URL pública de tu bot de WhatsApp en Render (ajústala después del despliegue)
BOT_URL = "https://whatsapp-bot-fastapi-a7hff4cwabftbbcw.canadacentral-01.azurewebsites.net/send"

class Reminder(BaseModel):
    phone_number: str
    message: str

@app.post("/reminder/")
def create_reminder(reminder: Reminder):
    schedule_whatsapp_reminder(reminder, BOT_URL)
    return {"status": "scheduled"}
