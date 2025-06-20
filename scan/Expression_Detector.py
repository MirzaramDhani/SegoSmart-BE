import cv2
from deepface import DeepFace

# Pemetaan emosi ke rating kepuasan
emotion_to_rating = {
    "happy": 5,
    "surprise": 4,
    "neutral": 3,
    "sad": 2,
    "angry": 1,
    "fear" : 1,
    "disgust" : 1
}

def detect_expression(image_path):
    # Baca gambar
    image = cv2.imread(image_path)
    if image is None:
        return "Gambar tidak ditemukan."
    
    # Konversi gambar ke RGB
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    try:
        # Deteksi wajah dan ekspresi menggunakan DeepFace
        result = DeepFace.analyze(rgb_image, actions=["emotion"])
        
        # Akses ekspresi dominan
        if isinstance(result, list):
            result = result[0]
        
        emotion = result["dominant_emotion"]
        
        # Mendapatkan rating kepuasan berdasarkan emosi
        satisfaction_rating = emotion_to_rating.get(emotion, "Tidak diketahui")
        
        return {
            "emotion": emotion,
            "satisfaction_rating": satisfaction_rating
        }

    except Exception as e:
        return {"error": str(e)}