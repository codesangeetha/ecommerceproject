function validateForm() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var errorMessage1 = document.getElementById("error-name");
    var errorMessage2 = document.getElementById("error-pwd");

    errorMessage1.innerHTML = "";
    errorMessage2.innerHTML = "";

    var isValid = true;

    if (email == "") {
        errorMessage1.innerHTML = "Please enter your email.";
        isValid = false;
    }
    if (password == "") {
        errorMessage2.innerHTML = "Please enter your password.";
        isValid = false;
    }

    return isValid;
}