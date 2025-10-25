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

    user_string = ""

    model = genai.GenerativeModel("gemini-2.5-flash")

    chat = model.start_chat()

    prompt = "What are some good energy drinks to try?"


    while user_string != "null":

        response = chat.send_message(prompt)

        for chunk in response:
            print(chunk.text, end="", flush=True)
        
        print("Chat:", end="")
        prompt = input()
    

    return

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
        # notes for implementation:
            # call model.generate_content_stream to send everything in chunks instead of a singular block (UX)
        '''
        JSON should be structured like:
        [
            {"role": "user", "parts": [{"text": "What are the top 5 RedBull flavors?", "image": null}]}
            {"role": "model", "parts": [{"text": "idk buddy lol", "image": smelly.png}]}
        ]        
        '''

        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(
            [prompt, {"mime_type": "image/png", "data": image_bytes}]
        )
        return jsonify({"ai_response": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

    # test()
