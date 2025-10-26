from flask import Flask, jsonify, request
from werkzeug.security import generate_password_hash
from flask_cors import CORS
from db import query, execute
import google.generativeai as genai
import base64
from pathlib import Path

### initializations ###

# init flask
app = Flask(__name__)
CORS(app)

# calling gemini & getting api key
genai.configure()
model = genai.GenerativeModel("gemini-2.5-flash")
chat = model.start_chat()

### api routes ###

# testing basic api
@app.route("/")
def home():
    return jsonify({"message": "Welcome to the Feynman AI Flask API!"})

#register
@app.route("/register", methods=["POST", "GET"])
def register():

    if request.method == "GET":
        return jsonify({"message": "Send a POST request with username, email, and password to register."})
    
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    email =data.get("email")

    if not username or not email or not password:
        return jsonify({"error": "Username, email, and password are required"}), 400
    
    if "@" not in email or "." not in email:
        return jsonify({"error": "Invalid email address"}), 400
    
    hashed_password = generate_password_hash(password)

    try:
        execute(
            "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
            (username, email, hashed_password)
        )
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# testing gemini api
@app.route("/test", methods=["GET"])
def test(conceptMain=str, subCategories=list, knowledgeLevel=str, context=str):

    # role defines who said what "MODEL" or "USER"
    # parts defines what was sent "TEXT" or "IMAGE"
    jsonTemplate = {
        "role": "",
        "parts": ["", ""]
    }

    # understanding: 1 -> 4
    # context: general, exam, work

    # creating a singular string that contains all elements in subCategories
    subCategories = ", ".join(subCategories)

    inputtedFields = []

    inputtedFields.append(conceptMain)
    inputtedFields.append(subCategories)
    inputtedFields.append(knowledgeLevel)
    inputtedFields.append(context)

    prompt = ""

    localPath = f"{Path.cwd()}\\backend\\prompt.txt"
    serverPath = ""

    # we do this to create unique prompts for each instance
    replaceKeywords = ["{inputtedConceptMain}", 
                       "{inputtedConcepts}", 
                       "{inputtedKnowledgeLevel}", 
                       "{inputtedContext}"]

    # opening prompt file & appending data
    try:
        with open(file=localPath, mode='r') as promptFile:
            prompt = promptFile.read()
            for i, keyword in enumerate(replaceKeywords):
                prompt = prompt.replace(keyword, inputtedFields[i])
    except FileNotFoundError:
        print("Prompt file was not found")
        return

    chat = model.start_chat() # starting a chat so gemini remembers everything

    # sending this to JSON too
    newUserJson = jsonTemplate
    newUserJson["role"] = "user"
    newUserJson["parts"][0] += prompt


    # the main logic right now for text
    while prompt != "null":

        response = chat.send_message(prompt, stream=True)

        for chunk in response:
            print(chunk.text, end="", flush=True)
            newModelJson = jsonTemplate
            newModelJson["role"] = "model"
            newModelJson["parts"][0] += chunk.text

        # SEND JSON FOR MODEL
        
        print("\nChat: ", end="")
        prompt = input()

        newUserJson = jsonTemplate
        newUserJson["role"] = "user"
        newUserJson["parts"][0] += prompt

        # SEND JSON FOR USER

    return

# BUILDS A NEW MODEL
@app.route("/newChat", methods="GET")
def newChat():

    data = request.json()
    conceptMain = data.get("conceptMain")
    subCategories = data.get("subCategories")
    knowledgeLevel = data.get("knowledgeLevel")
    context = data.get("context")

    # creating a singular string that contains all elements in subCategories
    subCategories = ", ".join(subCategories)

    inputtedFields = []

    inputtedFields.append(conceptMain)
    inputtedFields.append(subCategories)
    inputtedFields.append(knowledgeLevel)
    inputtedFields.append(context)

    # starting a chat so gemini remembers everything
    chat = model.start_chat()

    prompt = ""

    localPath = f"{Path.cwd()}\\backend\\prompt.txt"
    serverPath = ""

    # we do this to create unique prompts for each instance
    replaceKeywords = ["{inputtedConceptMain}", 
                    "{inputtedConcepts}", 
                    "{inputtedKnowledgeLevel}", 
                    "{inputtedContext}"]

    # opening prompt file & appending data
    try:
        with open(file=localPath, mode='r') as promptFile:
            prompt = promptFile.read()
            for i, keyword in enumerate(replaceKeywords):
                prompt = prompt.replace(keyword, inputtedFields[i])
    except FileNotFoundError:
        print("Prompt file was not found")
        return
        
@app.route("/returningChat", methods="GET")
def returningChat():

    data = request.json()
    history = data.get("history")

    chat = model.start_chat(history=history)

    return

def getChatHistory(sessionID):
    
    chatHistory = []

    # query the chat database for everything from sessionID

    
    
    return chatHistory

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

        response = model.generate_content(
            [prompt, {"mime_type": "image/png", "data": image_bytes}]
        )
        return jsonify({"ai_response": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

    # used for testing
    # test()
