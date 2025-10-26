from flask import Flask, jsonify, request, Response, send_from_directory
from werkzeug.security import generate_password_hash , check_password_hash
from flask_cors import CORS
import google.generativeai as genai
import base64
import json
from pathlib import Path
from datetime import datetime
import db

### initializations ###

# init flask
app = Flask(__name__)
CORS(app)

# calling gemini & getting api key
genai.configure()
model = genai.GenerativeModel("gemini-2.5-flash")

### helper functions ###


def getChatHistory(sessionID):
    
    chatHistory = []
    # query the chat database for everything from sessionID

    try:
        queryCommand = "SELECT role, content_parts FROM Messages WHERE session_id = %s ORDER BY timestamp ASC"
    
        rows = db.query(queryCommand, (sessionID,))

        # empty table
        if not rows:
            return []
        
        # build the chat history
        for row in rows:
            chatHistory.append({
                "role": row["role"],
                "parts": json.loads(row["content_parts"])
            })
    except Exception as e:
        print(f"Error: {e}")
        return None

    return chatHistory

def saveMessage(sessionID, role, parts):
    try:
        query = "INSERT INTO Messages (session_id, role, content_parts, timestamp) VALUES (%s, %s, %s, %s)"

        if not isinstance(parts, list):
            parts = list(parts)

        serializedParts = []
        for part in parts:
            try:
                serializedParts.append({"text": part.text})
            except AttributeError as e:
                print(f"Attribute Error: {e}")
                serializedParts.append(part)

        contentPartsJSON = json.dumps(serializedParts)

        db.execute(query, (sessionID, role, contentPartsJSON, datetime.now()))
    except Exception as e:
        print(f"Excetion: {e}")
        
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
        db.execute(
            "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
            (username, email, hashed_password)
        )
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

  
#login
@app.route("/login", methods=["POST", "GET"])
def login():

    if request.method == "GET":
        return jsonify({"message": "Send a POST request with username and password to log in."})
    
    data = request.get_json()
    identifier = data.get("username")  # can be a username OR an email address
    password = data.get("password")

    if not identifier or not password:
        return jsonify({"error": "Username/email and password are required"}), 400

    try:
        # Treat the provided identifier as an email if it contains '@' and '.'
        if "@" in identifier and "." in identifier:
            user = db.query(
                "SELECT * FROM users WHERE email=%s",
                (identifier,)
            )
        else:
            user = db.query(
                "SELECT * FROM users WHERE username=%s",
                (identifier,)
            )

        if not user:
            return jsonify({"error": "Invalid username or password"}), 401
        
        stored_hashed_password = user[0]["password"]

        if not check_password_hash(stored_hashed_password, password):
            return jsonify({"error": "Invalid username or password"}), 401

        return jsonify({"message": "Login successful"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500  

# BUILDS A NEW MODEL
@app.route("/api/chat/new", methods=["POST"])
def newChat():
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON body provided"}), 400
            
        conceptMain = data.get("conceptMain")
        subCategories = data.get("subCategories")
        knowledgeLevel = data.get("knowledgeLevel")
        context = data.get("context")
        userID = data.get("user_id")
        
        if not userID:
            return jsonify({"error": "No userID found"}), 300


        # creating a singular string that contains all elements in subCategories
        subCategoriesString = ", ".join(subCategories)
        inputtedFields = [conceptMain, subCategoriesString, knowledgeLevel, context]

        promptPath = Path.cwd() / "backend" / "prompt.txt"

        # we do this to create unique prompts for each instance
        replaceKeywords = ["{inputtedConceptMain}", 
                        "{inputtedConcepts}", 
                        "{inputtedKnowledgeLevel}", 
                        "{inputtedContext}"]
        
        # opening prompt file & appending data
        try:
            with open(file=promptPath, mode='r') as promptFile:
                prompt = promptFile.read()
                for i, keyword in enumerate(replaceKeywords):
                    prompt = prompt.replace(keyword, inputtedFields[i])
        except FileNotFoundError:
            print("Prompt file was not found")
            return jsonify({"error": "Server error"}), 500
            
        # create a new session
        newSessionID = None
        try:
            query = "INSERT INTO ChatSessions (user_id, title) VALUES (%s, %s)"
            
            # main concept will be the title of the chat logs
            newSessionID = db.execute(query, (userID, conceptMain))
            
            if not newSessionID:
                raise Exception("Failed to create a new session in database.")
            
            print(f"New session is: {newSessionID}")
            
        except Exception as e:
            print(f"Error: {e}")
            return jsonify({"error": "database error"}), 500
            
        initialPromptParts = [{"text": prompt}]
        saveMessage(newSessionID, 'user', initialPromptParts)
        
        chat = model.start_chat(history=[
            {"role": "user", "parts": initialPromptParts}
        ])
        
        firstResponse = chat.send_message("Please introduce yourself based on the instructions given")
        
        modelParts = firstResponse.candidates[0].content.parts
        
        saveMessage(newSessionID, 'model', modelParts)
        
        return jsonify({
            "session_id": newSessionID,
            "first_message": firstResponse.text
        })
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/chat/message", methods=["POST"])
def sendChatMessage():
    try:
        data = request.get_json()
        sessionID = data.get("session_id")
        newMessage = data.get("message")
        
        if not sessionID or not newMessage:
            return jsonify({"error": "session_id and message are required"}), 400
        
        history = getChatHistory(sessionID=sessionID)
        if history is None:
            return jsonify({"error": "Can't get chat history"}), 500
        
        chat = model.start_chat(history=history)
        
        newMessageParts = [{"text": newMessage}]
        
        responseStream = chat.send_message(newMessageParts, stream=True)
        
        # defining inside function since it's only needed here
        def sendChunks():
            try:
                chunks = []
                for chunk in responseStream:
                    chunks.append(chunk.text)
                    yield chunk.text
                    
                saveMessage(sessionID, 'user', newMessageParts)
                
                modelResponseParts = chat.history[-1].parts
                saveMessage(sessionID, 'model', modelResponseParts)
                
            except Exception as e:
                print(f"Error: {e}")
                yield f"Error: {e}"
                 
        return Response(sendChunks(), mimetype='text/plain')
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500
        
@app.route("/api/chat/history", methods=["POST"])
def getHistory():
    try:
        data = request.get_json()
        sessionID = data.get("session_id")
        
        if not sessionID:
            return jsonify({"error": "session_id required"}), 400
        
        history = getChatHistory(sessionID)
        if history is None:
            return jsonify({"error": "Can't retrieve chat history"}), 500
        
        textHistory = []
        for message in history:
            if message['parts']:
                textHistory.append({
                    "role": message['role'],
                    "text": message['parts'][0]['text']
                })
        
        return jsonify({"history": textHistory})
    
    except Exception as e:
        print(f"Error: {e}")
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
        image_b64_string = image.split(",")[1]
        image_mime_type = image.split(",")[0].split(":")[1].split(";")[0]
    except Exception:
        return jsonify({"error": "Invalid image data"}), 400

    prompt = f"The student explained: '{text}'. Ask thoughtful, guiding questions in the Feynman learning style."

    image_part = {
        "mime_type": image_mime_type,
        "data": image_b64_string
    }

    response_stream = model.generate_content_stream([prompt, image_part])
    
    
    # calling gemini
    try:

        response = model.generate_content(
            [prompt, {"mime_type": "image/png", "data": image_bytes}]
        )
        return jsonify({"ai_response": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/')
def serve_index():
    return send_from_directory('static', 'index.html')

@app.route('/<path:path>')
def serve_static_files(path):
    return send_from_directory('static', path)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

    # used for testing
    # test()
