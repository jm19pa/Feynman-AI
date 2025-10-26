const API_BASE = '';

// === Login & Register Logic (yours, unchanged) ===
const verifyPassText = document.getElementById("verifyPassRegister");
const registerButton = document.getElementById("registerButton");
const loginButton = document.getElementById("loginButton");

async function doLogin() {
  const username = document.getElementById("userLogin")?.value.trim();
  const password = document.getElementById("passLogin")?.value.trim();

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      alert("Login successful!");
      localStorage.setItem('userID', data.user_id);
      localStorage.setItem('username', data.username);

      window.location.href = "chat.html" // will change later to selection.html
    } else {
      alert(`Login failed: ${data.error}`);
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Server connection failed.");
  }
}

async function doRegister() {
  const username = document.getElementById("userRegister")?.value.trim();
  const email = document.getElementById("emailRegister")?.value.trim();
  const password = document.getElementById("passRegister")?.value.trim();
  const verifyPassword = document.getElementById("verifyPassRegister")?.value.trim();

  if (!username || !email || !password || !verifyPassword) {
    alert("Please fill in all fields.");
    return;
  }

  if (password !== verifyPassword) {
    alert("Passwords do not match!");
    return;
  }

  if (password.length < 8 || password.length > 20) {
    alert("Password must be between 8 and 20 characters.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();

    if (response.ok) {
      alert("Account created successfully!");
      window.location.href = "login.html";
    } else {
      alert(`Error: ${data.error || "Registration failed."}`);
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Server error. Please try again later.");
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const chatLog = document.getElementById("chatLog");
  const inputText = document.getElementById("textBox");
  const sendButton = document.getElementById("send");

  let currentUserId = localStorage.getItem('userID');
  let currentSessionId = localStorage.getItem('currentSessionId');

  async function startNewChat() {
    const conceptMain = "Python";
    const subCategoriesArr = "local variables,conditionals";
    const subCategories = subCategoriesArr.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const knowledgeLevel = "1";
    const context = "School";

    const payload = {
      conceptMain,
      subCategories,
      knowledgeLevel,
      context,
      user_id: currentUserID
    }

    try {
      const response = await fetch(`${API_BASE}/api/chat/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.log("No session ID found, starting a new chat...");
        try {
            await startNewChat();
            // startNewChat() will set the global 'currentSessionId'
            if (!currentSessionId) {
                // If it's *still* null, the API call failed
                console.error("Failed to start a new chat.");
                createParagraph("Sorry, I couldn't start a new chat session. Please reload.", "model");
                return;
            }
        } catch (err) {
            console.error(err);
            return;
        }
        return;
      }

      const data = await response.json();

      currentSessionId = data.session_id;
      localStorage.setItem('currentSessionId', currentSessionId);
      chatLog.innerHTML = '';
      createParagraph(data.first_message, 'model');
    }
    catch (error) {
      console.log("Error: " + error);
    }
  }

  async function sendMessage() {
    const inputTextValue = inputText.value.trim();

    if (inputTextValue === '') return;


    inputText.value = '';
    createParagraph(inputTextValue, 'user');
    chatLog.scrollTop = chatLog.scrollHeight;

    try {
      const response = await fetch(`${API_BASE}/api/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          session_id: currentSessionId,
          message: inputTextValue
        })
      });

      if (!response.ok) {
        console.log("Response not ok");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiMessage = createParagraph(null, 'model');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        aiMessage.innerText += chunk;
        chatLog.scrollTop = chatLog.scrollHeight;
      }
    }
    catch (error) {
      console.log("Error: " + error);
      return;
    }

  }

  async function loadChatHistory(sessionID) {
    try {
      const response = await fetch(`${API_BASE}/api/chat/history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionID })
      });

      if (!response.ok) {
        console.log("loading chat history error");
        return;
      }

      const data = await response.json();

      chatLog.innerHTML = '';

      if (data.history.length === 0) {
        createParagraph("Welcome back! Chat session is empty.", 'model');
      }
      else {
        data.history.forEach(message => {
          createParagraph(message.text, message.role);
        });
      }
    }
    catch (error) {
      console.log("Error: " + error);
      localStorage.removeItem('currentSessionId');
      currentSessionId = null;
    }
  }

  // === Drawing Board Logic ===
  const canvas = document.getElementById("canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    const cursor = document.getElementById("brushCursor");
    let drawing = false;
    let erasing = false;
    let brushSize = 8; // size of circle (px)

    // keep canvas crisp and filled white
    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Draw logic
    canvas.addEventListener("mousedown", () => (drawing = true));
    canvas.addEventListener("mouseup", () => {
      drawing = false;
      ctx.beginPath();
    });
    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // update cursor position
      cursor.style.left = `${x + rect.left}px`;
      cursor.style.top = `${y + rect.top}px`;

      if (!drawing) return;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.strokeStyle = erasing ? "white" : "#000";
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    });

    // Show / hide custom cursor
    canvas.addEventListener("mouseenter", () => {
      cursor.style.display = "block";
      updateCursor();
    });
    canvas.addEventListener("mouseleave", () => {
      cursor.style.display = "none";
    });

    // Update cursor appearance
    function updateCursor() {
      cursor.style.width = `${brushSize}px`;
      cursor.style.height = `${brushSize}px`;
      cursor.style.borderColor = erasing ? "#ff5e5e" : "#00b4d8";
    }

    // Buttons
    const penBtn = document.getElementById("penBtn");
    const eraserBtn = document.getElementById("eraserBtn");
    const clearBtn = document.getElementById("clearBtn");
    const submitDrawing = document.getElementById("submitDrawing");

    if (penBtn)
      penBtn.onclick = () => {
        erasing = false;
        penBtn.classList.add("active");
        eraserBtn.classList.remove("active");
        updateCursor();
      };

    if (eraserBtn)
      eraserBtn.onclick = () => {
        erasing = true;
        eraserBtn.classList.add("active");
        penBtn.classList.remove("active");
        updateCursor();
      };

    if (clearBtn)
      clearBtn.onclick = () => {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      };

    if (submitDrawing)
      submitDrawing.onclick = async () => {
        const imageData = canvas.toDataURL("image/png");
        addMessage("🖼️ Sent drawing to AI...", "user");

        const response = await fetch("/analyze_image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: imageData }),
        });

        const data = await response.json();
        addMessage(data.response || "AI couldn't analyze the image.", "model");
      };

    updateCursor();
  }


  function createParagraph(text, role) {
    const newParagraph = document.createElement('p');
    if (role === 'user') {
      newParagraph.classList.add("user");
      newParagraph.innerText = text;
    }
    else if (role === 'model') {
      newParagraph.classList.add("model");
      if (text) {
        newParagraph.innerText = text
      }
    }
    else console.log("ERROR OCCURRED");

    chatLog.append(newParagraph);
    return newParagraph;
  }

  function addMessage(text, role) {
  const msg = createParagraph(text, role);
  chatLog.appendChild(msg);
  chatLog.scrollTop = chatLog.scrollHeight;
}

  if (sendButton) {
    sendButton.addEventListener('click', sendMessage);
  }
  if (inputText) {
    inputText.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    })
  }

  function displayMessage(text, role) {
    const messageElement = createParagraph(text, role);
    chatLog.append(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  if (currentSessionId) {
    loadChatHistory(currentSessionId);
  }
});

function checkPassword() {
  const passElem = document.getElementById("passRegister");
  const verifyElem = verifyPassText || document.getElementById("verifyPassRegister");
  if (!passElem || !verifyElem) return true;

  const passwordText = passElem.value || "";
  if (passwordText.length < 8 || passwordText.length > 20) {
    alert("Password must be between 8 - 20 characters");
    return false;
  }

  if (passwordText !== verifyElem.value) {
    console.log("Make sure passwords are equal");
    return false;
  }

  return true;
}