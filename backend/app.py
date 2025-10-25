from flask import Flask, jsonify, request
from flask_cors import CORS
import google.generativeai as genai
import base64

# --- Flask setup ---
app = Flask(__name__)
CORS(app)

# --- Gemini setup ---
genai.configure()

# --- Routes ---

@app.route("/")
def home():
    return jsonify({"message": "Welcome to the Feynman AI Flask API!"})

@app.route("/test", methods=["GET"])
def test():
    """
    Basic Gemini test: ask for Red Bull flavors.
    """
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content("Provide a list of the most popular Red Bull drink flavors.")
        return jsonify({"ai_response": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/submit", methods=["POST"])
def submit():
    """
    Accepts JSON with text + base64 image, sends to Gemini,
    returns the AI's guiding questions.
    """
    data = request.get_json()
    text = data.get("text")
    image = data.get("image")

    if not text or not image:
        return jsonify({"error": "Missing text or image"}), 400

    try:
        image_bytes = base64.b64decode(image.split(",")[1])
    except Exception:
        return jsonify({"error": "Invalid image data"}), 400

    prompt = f"The student explained: '{text}'. Ask thoughtful, guiding questions in the Feynman learning style."

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(
            [prompt, {"mime_type": "image/png", "data": image_bytes}]
        )
        return jsonify({"ai_response": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
