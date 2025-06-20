from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from Expression_Detector import detect_expression

app = Flask(__name__)
CORS(app)

# Endpoint untuk mengunggah gambar dan mendapatkan rating kepuasan
@app.route("/analyze", methods=["POST"])
def analyze_image():
    if 'file' not in request.files:
        return jsonify({"error": "Tidak ada file yang diunggah"}), 400
    
    file = request.files['file']
    file_path = "temp.jpg"
    file.save(file_path)

    # Analisis ekspresi menggunakan fungsi di expression_detector.py
    result = detect_expression(file_path)
    print(result)
    
    # Hapus gambar sementara setelah analisis
    os.remove(file_path)
    
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)