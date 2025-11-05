# detect_landmarks.py  (bổ sung tính EAR/MAR)
import cv2, numpy as np
import mediapipe as mp

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=False, max_num_faces=1, refine_landmarks=True,
    min_detection_confidence=0.5, min_tracking_confidence=0.5
)

LEFT_EYE  = [33,160,158,133,153,144]      # (L-corner, up1, up2, R-corner, low1, low2)
RIGHT_EYE = [263,387,385,362,380,373]
MOUTH_LR_TB = [78,308,13,14]              # left, right, top, bottom (đủ cho MAR đơn)

def _euclid(a,b): return float(np.linalg.norm(a-b))

def _ear(pts):
    def ear_eye(ids):
        p = pts[ids]
        A = _euclid(p[1], p[4]); B = _euclid(p[2], p[5]); C = _euclid(p[0], p[3])
        return (A+B)/(2.0*C+1e-6)
    return (ear_eye(LEFT_EYE) + ear_eye(RIGHT_EYE))/2.0

def _mar(pts):
    l, r, t, b = MOUTH_LR_TB
    horiz = _euclid(pts[l], pts[r])
    vert  = _euclid(pts[t], pts[b])
    return vert/(horiz+1e-6)

def detect_facial_landmarks(frame_bgr):
    frame = frame_bgr.copy()
    h, w = frame.shape[:2]
    res = face_mesh.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

    if not res.multi_face_landmarks:
        return None, None, frame

    lm = res.multi_face_landmarks[0].landmark
    pts = np.array([(p.x*w, p.y*h) for p in lm], dtype=np.float32)

    ear = np.clip(_ear(pts), 0.05, 0.45)
    mar = np.clip(_mar(pts), 0.05, 0.90)

    cv2.putText(frame, f"EAR:{ear:.3f}  MAR:{mar:.3f}", (10, 24),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,255,0), 2)
    return ear, mar, frame   

    

