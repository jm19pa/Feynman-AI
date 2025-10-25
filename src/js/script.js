const verifyPassText = document.getElementById("verifyPassRegister");

function doLogin(){
    console.log("DO LOGIN");

    // send API request to see if username / password match
}

function doRegister(){
    console.log("DO REGISTER");

    // send API request to add a user
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