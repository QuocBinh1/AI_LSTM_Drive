import cv2
import requests

TOKEN = "8492461159:AAGm7LOXoqOkoYdzUSxJOdqIJ_N_AQertXg"
CHAT_ID = "6598189722"

def send_telegram_photo_alert(frame, message):
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendPhoto"
    _, img_encoded = cv2.imencode('.jpg', frame)
    files = {'photo': ('image.jpg', img_encoded.tobytes(), 'image/jpeg')}
    data = {'chat_id': CHAT_ID, 'caption': message}
    requests.post(url, files=files, data=data)