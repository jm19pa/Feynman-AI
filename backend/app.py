from flask import Flask, jsonify, request
from flask_cors import CORS
import google.generativeai as genai
import base64

### initializations ###

# init flask
app = Flask(__name__)
CORS(app)

# calling gemini & getting api key
genai.configure()

### api routes ###

# testing basic api
@app.route("/")
def home():
    return jsonify({"message": "Welcome to the Feynman AI Flask API!"})

# testing gemini api
@app.route("/test", methods=["GET"])
def test():

    # trying out the gemini model call
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content("Provide a list of the most popular Red Bull drink flavors.")
        return jsonify({"ai_response": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# text + image submitting
@app.route("/submit", methods=["POST"])
def submit():

    data = request.get_json()
    text = data.get("text")
    image = data.get("image")

    # return early if either text or image not there
    if not text or not image:
        return jsonify({"error": "Missing text or image"}), 400

    # making sure image sending will work
    try:
        image_bytes = base64.b64decode(image.split(",")[1])
    except Exception:
        return jsonify({"error": "Invalid image data"}), 400

    prompt = f"The student explained: '{text}'. Ask thoughtful, guiding questions in the Feynman learning style."

    # calling gemini
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(
            [prompt, {"mime_type": "image/png", "data": image_bytes}]
        )
        return jsonify({"ai_response": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
