from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from scheduler import schedule_whatsapp_reminder

app = FastAPI()

class Reminder(BaseModel):
    phone_number: str
    message: str
    send_at: str  # formato: "YYYY-MM-DD HH:MM"

@app.post("/reminder/")
def create_reminder(reminder: Reminder):
    try:
        schedule_whatsapp_reminder(reminder)
        return {"status": "scheduled"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
