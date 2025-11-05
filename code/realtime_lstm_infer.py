# code/realtime_lstm_infer.py
from pathlib import Path
from collections import deque
import pickle, time, cv2, numpy as np, tensorflow as tf
import requests
import datetime
from detect_landmarks import detect_facial_landmarks
from audio_alert import play_audio, reset_audio_state
from telegram import send_telegram_alert ,send_telegram_photo_alert

# ===================== Telegram Alert States =====================
telegram_alert_sent_sleep = False
telegram_alert_sent_yawn = False


HERE = Path(__file__).resolve()
PROJ = HERE.parent.parent
DATA_DIR = PROJ / "data"

# ===================== Heuristics & States =====================
# EAR hysteresis (phân biệt BLINK và SLEEPY)
BLINK_T_CLOSE = 0.28       # ear < ngưỡng này -> coi là "đóng"
BLINK_T_OPEN  = 0.34        # ear > ngưỡng này -> coi là "mở"
SLEEP_MIN_DUR = 3.0         # đóng liên tục >= 2s -> sleepy (mới cảnh báo)
REFRACTORY_AFTER_OPEN = 0.4 # 0.4s miễn nhiễm cảnh báo sau khi mở mắt

# MAR heuristics (talking vs mouth-open vs yawn)
TALK_LOW      = 0.16        # biên dưới vùng nói chuyện
MOUTH_OPEN_T  = 0.30        # >= ngưỡng này coi là "há nhẹ"
OPEN_MIN_DUR  = 0.50        # há nhẹ liên tục >= 0.5s -> MOUTH OPEN
YAWN_T        = 0.45        # mở to (để tránh nhầm với há nhẹ)
YAWN_MIN_DUR  = 1.20        # mở to liên tục >= 1.2s -> YAWN

# ----- state cho mắt -----
eye_closed_since     = 0.0
eye_is_closed        = False
sleepy_active        = False
eye_refractory_until = 0.0

# ----- state cho miệng -----
mouth_open_since = 0.0
mid_open_since   = 0.0
prev_mouth_state = "closed"        # "closed" | "talk" | "mid" | "wide"
talk_osc         = 0               # đếm dao động nói

# ===================== Models & Buffers =====================
SEQ = 60
ear_buf, mar_buf = deque(maxlen=SEQ), deque(maxlen=SEQ)

eye_model   = tf.keras.models.load_model(str(DATA_DIR / "EyeLSTM.h5"))
mouth_model = tf.keras.models.load_model(str(DATA_DIR / "MouthLSTM.h5"))
enc_eye     = pickle.load(open(DATA_DIR / "label_encoder_eye.pkl", "rb"))
enc_mouth   = pickle.load(open(DATA_DIR / "label_encoder_mouth.pkl", "rb"))
EYE_CLASSES   = list(enc_eye.classes_)
MOUTH_CLASSES = list(enc_mouth.classes_)

# ===================== Realtime Loop =====================
cap = cv2.VideoCapture(1)  # đổi index nếu cần (0/1/2...)
while True:
    ok, frame = cap.read()
    if not ok:
        break

    # --- landmarks & features ---
    ear, mar, vis = detect_facial_landmarks(frame)

    # append đúng feature (tránh None)
    if ear is not None:
        ear_buf.append(float(ear))
    if mar is not None:
        mar_buf.append(float(mar))

    # --- LSTM predictions khi đủ chuỗi ---
    eye_label, mouth_label = "...", "..."
    if len(ear_buf) == SEQ:
        Xe = np.asarray(ear_buf, dtype=np.float32)[None, :, None]
        pe = eye_model.predict(Xe, verbose=0)[0]
        eye_label = EYE_CLASSES[int(np.argmax(pe))]
    if len(mar_buf) == SEQ:
        Xm = np.asarray(mar_buf, dtype=np.float32)[None, :, None]
        pm = mouth_model.predict(Xm, verbose=0)[0]
        mouth_label = MOUTH_CLASSES[int(np.argmax(pm))]

    # ================= Heuristics (không cần model) =================
    # dùng trung bình ngắn cho mượt
    ear_now = np.mean(list(ear_buf)[-5:]) if len(ear_buf) else None
    mar_now = np.mean(list(mar_buf)[-5:]) if len(mar_buf) else None

    now = time.time()
    blink_flag = False
    yawn_flag_rule = False
    mid_open_active = False
    talk_flag = False

    # ----- BLINK / SLEEPY (EAR với hysteresis + duration) -----
    if ear_now is not None:
        if eye_is_closed:
            if ear_now > BLINK_T_OPEN:
                # mắt vừa mở lại
                dur = now - eye_closed_since
                blink_flag = (dur < 0.35)              # chớp < 0.35s
                eye_is_closed = False
                eye_closed_since = 0.0
                sleepy_active = False
                eye_refractory_until = now + REFRACTORY_AFTER_OPEN
            else:
                # vẫn đang đóng: check đủ lâu -> sleepy
                if (now - eye_closed_since) >= SLEEP_MIN_DUR:
                    sleepy_active = True
        else:
            if ear_now < BLINK_T_CLOSE:
                eye_is_closed = True
                eye_closed_since = now

    # ----- TALKING / MOUTH-OPEN / YAWN (MAR với duration + dao động) -----
    if mar_now is not None:
        if mar_now >= YAWN_T:
            # mở rất to -> kiểm tra yawn theo thời lượng
            if prev_mouth_state != "wide":
                mouth_open_since = now
            prev_mouth_state = "wide"
            mid_open_since = 0.0
        elif mar_now >= MOUTH_OPEN_T:
            # há nhẹ (OPEN)
            if prev_mouth_state != "mid":
                mid_open_since = now
            prev_mouth_state = "mid"
        elif TALK_LOW <= mar_now < MOUTH_OPEN_T:
            # vùng nói chuyện (dao động nhỏ/nhanh)
            if prev_mouth_state == "closed":
                talk_osc += 1
            prev_mouth_state = "talk"
            mid_open_since = 0.0
        else:
            # miệng đóng lại
            if prev_mouth_state in ("talk", "wide"):
                if prev_mouth_state == "talk":
                    talk_osc += 1
            prev_mouth_state = "closed"
            mid_open_since = 0.0

        # kết luận theo thời lượng
        if prev_mouth_state == "wide" and (now - mouth_open_since) >= YAWN_MIN_DUR:
            yawn_flag_rule = True
            talk_osc = 0

        if prev_mouth_state == "mid" and mid_open_since > 0 and (now - mid_open_since) >= OPEN_MIN_DUR:
            mid_open_active = True  # -> MOUTH OPEN

        # nói chuyện: nhiều dao động đóng/mở nhỏ trong một đoạn ngắn
        if talk_osc >= 3:
            talk_flag = True
            talk_osc = 0

    # ================= Decisions & Audio =================
    # Ưu tiên: YAWN > SLEEPY. Sleepy chỉ kêu khi rule cho phép (đóng đủ lâu)
    # Yawn chỉ kêu khi model báo yawn *và* MAR hiện tại đủ lớn, hoặc rule yawn.
    yawn_decide   = ( (mouth_label == "mouth_yawn") and (mar_now is not None and mar_now >= YAWN_T) ) or yawn_flag_rule
    sleepy_decide = ((eye_label == "eyes_sleepy") or sleepy_active) and (now >= eye_refractory_until)

    if yawn_decide:
        play_audio("mouth_yawn")   
        # Nếu chưa gửi cảnh báo ngáp
        if not telegram_alert_sent_yawn:
            # === GỌI HÀM CẢNH BÁO Ở ĐÂY ===
            send_telegram_photo_alert(frame, "Tài xế có dấu hiệu NGÁP") 
            telegram_alert_sent_yawn = True
            telegram_alert_sent_sleep = True          
    elif sleepy_decide:
        play_audio("eyes_sleepy")
        # Nếu chưa gửi cảnh báo buồn ngủ
        if not telegram_alert_sent_sleep:
            # === GỌI HÀM CẢNH BÁO Ở ĐÂY ===
            send_telegram_photo_alert(frame, "Tài xế có dấu hiệu BUỒN NGỦ") 
            telegram_alert_sent_sleep = True
    else:
        # Nếu không còn buồn ngủ hay ngáp -> Reset lại mọi thứ
        reset_audio_state()
        telegram_alert_sent_sleep = False
        telegram_alert_sent_yawn = False

    display_eye = "eyes_blink" if (blink_flag and not sleepy_active) else eye_label
    # ================= HUD =================
    cv2.putText(vis, f"Eye:{display_eye}  Mouth:{mouth_label}", (10, 52),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255,255,255), 2)
    y = 80
    if blink_flag:
        cv2.putText(vis, "BLINK", (10, y), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 0,255), 2); y += 26
    if sleepy_active:
        cv2.putText(vis, "EYES CLOSED...", (10, y), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0,0,255), 2); y += 26
    if mid_open_active:
        cv2.putText(vis, "MOUTH OPEN", (10, y), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0,200,255), 2); y += 26
    if talk_flag:
        cv2.putText(vis, "TALKING", (10, y), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0,165,255), 2); y += 26

    cv2.imshow("Realtime LSTM (EAR/MAR)", vis)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
