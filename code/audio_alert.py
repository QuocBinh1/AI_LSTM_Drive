# audio_alert.py
import pygame, threading, time, os
from pathlib import Path

# ==== PATHS ====
HERE = Path(__file__).resolve()
PROJ = HERE.parent.parent
MUSIC_DIR = PROJ / "music"

# ==== INIT MIXER (an toàn) ====
try:
    pygame.mixer.init()
except Exception as e:
    print("[Audio] mixer.init() failed:", e)

AUDIO_FILES = {
    "eyes_natural":  str(MUSIC_DIR / "eyes_natural.mp3"),
    "eyes_sleepy":   str(MUSIC_DIR / "eyes_sleepy.mp3"),
    "mouth_natural": str(MUSIC_DIR / "mouth_natural.mp3"),
    "mouth_yawn":    str(MUSIC_DIR / "mouth_yawn.mp3"),
    "look_away":     str(MUSIC_DIR / "look_away.mp3"),
}

last_played_label = None
audio_lock = threading.Lock()

def play_audio(label: str):
    """Phát âm theo label; bỏ qua nếu vừa phát label đó."""
    global last_played_label
    def _play():
        try:
            p = AUDIO_FILES.get(label)
            if p and os.path.exists(p):
                pygame.mixer.music.load(p)
                pygame.mixer.music.play()
        except Exception as e:
            print(f"[Audio Error] {label}: {e}")
    with audio_lock:
        if label != last_played_label:
            last_played_label = label
            threading.Thread(target=_play, daemon=True).start()

def reset_audio_state(label=None):
    """Ngưng trạng thái 'đã phát' để có thể phát lại."""
    global last_played_label
    if label is None or last_played_label == label:
        last_played_label = None

# --- Adapter (nếu code khác vẫn gọi kiểu cũ) ---
def start_alert(kind="general"):
    lab = "eyes_sleepy" if kind == "sleepy" else "mouth_yawn" if kind == "yawn" else "eyes_sleepy"
    play_audio(lab)

def stop_alert(kind="general"):
    reset_audio_state()

def alert_active():
    try:
        return pygame.mixer.music.get_busy()
    except Exception:
        return False
