from fastapi import FastAPI
from pydantic import BaseModel
from scheduler import schedule_whatsapp_reminder
import requests

app = FastAPI()

BOT_URL = "https://botwhasatpp-gganfgdwb2gwc7f3.canadacentral-01.azurewebsites.net"

class Reminder(BaseModel):
    phone_number: str
    message: str

# ✅ Nuevo modelo para mensajes a grupos
class GroupMessage(BaseModel):
    group_id: str  # ID del grupo (ej: "120363154351234567@g.us")
    message: str

@app.post("/reminder/")
def create_reminder(reminder: Reminder):
    schedule_whatsapp_reminder(reminder, f"{BOT_URL}/send")
    return {"status": "scheduled"}

# ✅ Nuevo endpoint para enviar mensaje a grupo
@app.post("/send-group/")
def send_group_message(group_msg: GroupMessage):
    try:
        response = requests.post(
            f"{BOT_URL}/send", 
            json={"receiver": group_msg.group_id, "message": group_msg.message}
        )
        if response.status_code == 200:
            return {"status": "Mensaje enviado al grupo"}
        else:
            return {"error": "Error enviando mensaje al grupo"}
    except Exception as e:
        return {"error": f"Error: {str(e)}"}

@app.get("/groups/")
def get_groups():
    try:
        response = requests.get(f"{BOT_URL}/groups", timeout=10)
        if response.status_code == 404:
            return {"error": "El endpoint /groups no existe en el bot"}
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"error": f"No se pudieron obtener los grupos: {str(e)}"}