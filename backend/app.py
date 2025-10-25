from flask import Flask, jsonify, request
from flask_cors import CORS
import google.generativeai as genai
import base64

# Initialize Flask
app = Flask(__name__)
CORS(app)  # Allow cross-origin requests (for your frontend)

# Initialize Gemini client
client = genai.Client()

# --- Root Route ---
@app.route("/")
def home():
    """
    Simple test route — confirms the backend is alive
    """
    return jsonify({"message": "Welcome to the Feynman AI Flask API!"})

# --- Test Route (Your Red Bull Example) ---
@app.route("/test", methods=["GET"])
def test():
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents="Provide a list of the most popular RedBull drink flavors."
        )
        return jsonify({"ai_response": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Core Route: Handle student explanation + image ---
@app.route("/submit", methods=["POST"])
def submit():
    data = request.get_json()
    text = data.get("text")
    image = data.get("image")

    if not text or not image:
        return jsonify({"error": "Missing text or image"}), 400

    try:
        image_bytes = base64.b64decode(image.split(",")[1])
    except Exception:
        return jsonify({"error": "Invalid image data"}), 400

    prompt = f"The student explained: '{text}'. Ask open-ended questions that guide them to clarify or deepen their understanding (Feynman technique style)."

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                {"mime_type": "image/png", "data": image_bytes},
                prompt
            ]
        )
        return jsonify({"ai_response": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Run Flask ---
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
