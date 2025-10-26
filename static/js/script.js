const API_BASE = 'http://localhost:5000';

const verifyPassText = document.getElementById("verifyPassRegister");
const registerButton = document.getElementById("registerButton");
const loginButton = document.getElementById("loginButton");

async function doLogin() {
  const username = document.getElementById("userLogin").value.trim();
  const password = document.getElementById("passLogin").value.trim();

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
    console.log("Login response:", data);

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
  const username = document.getElementById("userRegister").value.trim();
  const email = document.getElementById("emailRegister").value.trim();
  const password = document.getElementById("passRegister").value.trim();
  const verifyPassword = document.getElementById("verifyPassRegister").value.trim();

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
      alert("✅ Account created successfully!");
      window.location.href = "login.html"; // redirect to login
    } else {
      alert(`❌ Error: ${data.error || "Registration failed."}`);
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
        print("Response not okay");
        return;
      }

      const data = await response.json();

      currentSessionID = data.session_id;
      localStorage.setItem('currentSessionID', currentSessionID);
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

    if (!currentSessionID) {
      window.alert("Invalid session ID, start a new chat");
      return;
    }

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
          session_id: currentSessionID,
          message: inputText
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

  async function loadChatHistory(sessionID){
    try{
      const response = await fetch(`${API_BASE}/api/chat/history`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({session_id: sessionID})
      });

      if(!response.ok){
        console.log("loading chat history error");
        return;
      }

      const data = await response.json();

      chatLog.innerHTML = '';

      if (data.history.length === 0){
        createParagraph("Welcome back! Chat session is empty.", 'model');
      }
      else{
        data.history.array.forEach(message => {
          createParagraph(message.text, message.role);
        });
      }
    }
    catch(error){
      console.log("Error: " + error);
      localStorage.removeItem('currentSessionID');
      currentSessionID = null;
    }
  }

  function createParagraph(text, role) {
    const newParagraph = document.createElement('p');
    if (role === 'user') {
      newParagraph.classList.add("user");
      newParagraph.innerText = text;
    }
    else if (role === 'model') {
      newParagraph.classList.add("model");
      if(text){
        newParagraph.innerText = text
      }
    }
    else console.log("ERROR OCCURRED");

    chatLog.append(newParagraph);
    return newParagraph;
  }

  sendButton.addEventListener('click', sendMessage);
  inputText.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  })

  function displayMessage(text, role){
    const messageElement = createParagraph(text, role);
    chatLog.append(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight;
  }
  
  if(currentSessionID){
    loadChatHistory(currentSessionID);
  }
});



function checkPassword() {
  const passElem = document.getElementById("passRegister");
  const verifyElem = verifyPassText || document.getElementById("verifyPassRegister");

  if (!passElem || !verifyElem) {
    // Elements not present on the page (e.g., different form) — don't block execution
    console.warn("Password inputs not found in DOM for checkPassword");
    return true;
  }

  const passwordText = passElem.value || "";

  if (passwordText.length < 8 || passwordText.length > 20) {
    window.alert("Password must be between 8 - 20 characters"); // temp so we can do DOM later
    return false;
  }

  if (passwordText !== verifyElem.value) {
    console.log("Make sure passwords are equal"); // not an alert for ease-of-use
    return false;
  }

  return true;

}


if (verifyPassText) {
  verifyPassText.addEventListener('blur', checkPassword);
}