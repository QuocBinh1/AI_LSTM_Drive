from fastapi import FastAPI, UploadFile, File
from utils.inference import predict_eye, predict_mouth
# from .utils.telegram_bot import send_telegram_photo_alert
import cv2
import numpy as np
import datetime

app = FastAPI()

eye_seq, mouth_seq = [], []

@app.post("/analyze_frame/")
async def analyze_frame(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    ear, mar = 0.21, 0.65  # placeholder - bạn thay bằng real EAR/MAR
    eye_seq.append(ear)
    mouth_seq.append(mar)

    eye_label, _ = predict_eye(eye_seq)
    mouth_label, _ = predict_mouth(mouth_seq)

    status = f"Eye: {eye_label} | Mouth: {mouth_label}"

    if eye_label == "eyes_sleepy" or mouth_label == "mouth_yawn":
        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        msg = f"⚠️ Cảnh báo: {eye_label if eye_label == 'eyes_sleepy' else mouth_label}\n🕒 {now}"
        send_telegram_photo_alert(frame, msg)

    return {"eye": eye_label, "mouth": mouth_label}