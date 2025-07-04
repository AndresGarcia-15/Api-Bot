from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
import subprocess

scheduler = BackgroundScheduler()
scheduler.start()

def send_whatsapp_message(phone, message):
    subprocess.Popen(["node", "whatsapp_client/index.js", phone, message])

def schedule_whatsapp_reminder(reminder):
    send_time = datetime.strptime(reminder.send_at, "%Y-%m-%d %H:%M")
    scheduler.add_job(
        send_whatsapp_message,
        'date',
        run_date=send_time,
        args=[reminder.phone_number, reminder.message]
    )
