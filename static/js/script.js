const API_BASE = "";

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
    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      alert("✅ Login successful!");
      // redirect to chat
      window.location.href = "chat.html";
    } else {
      alert(`❌ Login failed: ${data.error}`);
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
    const response = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();

    if (response.ok) {
      alert("✅ Account created successfully!");
      window.location.href = "login.html";
    } else {
      alert(`❌ Error: ${data.error || "Registration failed."}`);
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Server error. Please try again later.");
  }
}

if (verifyPassText) verifyPassText.addEventListener('blur', checkPassword);

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

// === Chat & Drawing Logic ===
document.addEventListener("DOMContentLoaded", () => {
  const chatLog = document.getElementById("chatLog");
  const textBox = document.getElementById("textBox");
  const sendBtn = document.getElementById("send");

  if (chatLog && sendBtn && textBox) {
    function addMessage(text, sender) {
      const msg = document.createElement("div");
      msg.classList.add("msg", sender);
      msg.innerText = text;
      chatLog.appendChild(msg);
      chatLog.scrollTop = chatLog.scrollHeight;
    }

    async function sendMessage() {
      const message = textBox.value.trim();
      if (!message) return;
      addMessage(message, "user");
      textBox.value = "";

      const response = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      addMessage(data.reply || "Error: No reply received.", "model");
    }

    sendBtn.addEventListener("click", sendMessage);
    textBox.addEventListener("keypress", e => {
      if (e.key === "Enter") sendMessage();
    });
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

      const response = await fetch("/analyze_drawing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      });

      const data = await response.json();
      addMessage(data.reply || "AI couldn't analyze the image.", "model");
    };

  updateCursor();
}

});
