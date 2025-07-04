from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
import requests

scheduler = BackgroundScheduler()
scheduler.start()

def send_to_whatsapp_bot(phone, message, bot_url):
    try:
        response = requests.post(bot_url, json={"phone_number": phone, "message": message})
        print("Mensaje enviado:", response.json())
    except Exception as e:
        print("Error enviando al bot:", e)

def schedule_whatsapp_reminder(reminder, bot_url):
    send_time = datetime.strptime(reminder.send_at, "%Y-%m-%d %H:%M")
    scheduler.add_job(
        send_to_whatsapp_bot,
        'date',
        run_date=send_time,
        args=[reminder.phone_number, reminder.message, bot_url]
    )
