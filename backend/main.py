from fastapi import FastAPI
from pydantic import BaseModel
import requests
from scheduler import schedule_whatsapp_reminder

app = FastAPI()

BOT_URL = "https://whatsapp-bot-fastapi-a7hff4cwabftbbcw.canadacentral-01.azurewebsites.net/send"
GROUPS_URL = "https://whatsapp-bot-fastapi-a7hff4cwabftbbcw.canadacentral-01.azurewebsites.net/groups"

class Reminder(BaseModel):
    phone_number: str
    message: str

@app.post("/reminder/")
def create_reminder(reminder: Reminder):
    schedule_whatsapp_reminder(reminder, BOT_URL)
    return {"status": "scheduled"}

@app.get("/groups/")
def get_groups():
    try:
        response = requests.get(GROUPS_URL)
        return response.json()
    except Exception as e:
        return {"error": str(e)}
