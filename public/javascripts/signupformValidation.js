function validateSignupForm() {
 
    var name = document.getElementById("name").value.trim();
    var username = document.getElementById("username").value.trim();
    var email = document.getElementById("email").value.trim();
    var password = document.getElementById("password").value.trim();


    var errorName = document.getElementById("error-name");
    var errorUsername = document.getElementById("error-username");
    var errorEmail = document.getElementById("error-email");
    var errorPassword = document.getElementById("error-password");

  
    errorName.innerHTML = "";
    errorUsername.innerHTML = "";
    errorEmail.innerHTML = "";
    errorPassword.innerHTML = "";


    var isValid = true;

    if (name === "") {
        errorName.innerHTML = "Please enter your name.";
        isValid = false;
    }
    if (username === "") {
        errorName.innerHTML = "Please enter your username.";
        isValid = false;
    }

   
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (email === "") {
        errorEmail.innerHTML = "Please enter your email.";
        isValid = false;
    } else if (!emailPattern.test(email)) {
        errorEmail.innerHTML = "Please enter a valid email address.";
        isValid = false;
    }
    
    if (password === "") {
        errorPassword.innerHTML = "Please enter your password.";
        isValid = false;
    } else if (password.length < 6) {
        errorPassword.innerHTML = "Password must be at least 6 characters long.";
        isValid = false;
    }

    return isValid;
}