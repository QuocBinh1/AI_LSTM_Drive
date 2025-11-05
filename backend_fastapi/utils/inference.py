import numpy as np
from tensorflow.keras.models import load_model
import joblib

eye_model = load_model("models/EyeLSTM.h5")
mouth_model = load_model("models/MouthLSTM.h5")
eye_encoder = joblib.load("models/label_encoder_eye.pkl")
mouth_encoder = joblib.load("models/label_encoder_mouth.pkl")

def predict_eye(eye_seq: list[float]):
    x = np.array(eye_seq[-100:]).reshape(1, -1, 1)
    y_pred = eye_model.predict(x)[0]
    label = eye_encoder.inverse_transform([np.argmax(y_pred)])[0]
    return label, y_pred

def predict_mouth(mouth_seq: list[float]):
    x = np.array(mouth_seq[-100:]).reshape(1, -1, 1)
    y_pred = mouth_model.predict(x)[0]
    label = mouth_encoder.inverse_transform([np.argmax(y_pred)])[0]
    return label, y_pred