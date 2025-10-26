const API_BASE = "http://129.212.179.234:5000";

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
    const response = await fetch("http://129.212.179.234:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    console.log("Login response:", data);

    if (response.ok) {
      alert("✅ Login successful!");
      // Optionally redirect:
      // window.location.href = "dashboard.html";
    } else {
      alert(`❌ Login failed: ${data.error}`);
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
    const response = await fetch("http://129.212.179.234:5000/register", {
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


function checkPassword(){
    let passwordText = document.getElementById("passRegister").value;

    if (length(passwordText) < 8 || length(passwordText) > 20){
        window.alert("Password must be between 8 - 20 characters"); // temp so we can do DOM later
        return false;
    }

    if (passwordText != verifyPassText.value){
        console.log("Make sure passwords are equal"); // not an alert for ease-of-use
        return false;
    }

    return true;

}

verifyPassText.addEventListener('blur', checkPassword);