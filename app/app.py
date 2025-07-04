from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from app.scheduler import schedule_whatsapp_reminder
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite solicitudes desde cualquier origen
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos
    allow_headers=["*"],  # Permite todos los headers
)

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
