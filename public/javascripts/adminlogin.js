function validateForm() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var errorMessage1 = document.getElementById("error-name");
    var errorMessage2 = document.getElementById("error-pwd");

    errorMessage1.innerHTML = "";
    errorMessage2.innerHTML = "";

    var isValid = true;

    if (username == "") {
        errorMessage1.innerHTML = "Please enter your username.";
        isValid = false;
    }
    if (password == "") {
        errorMessage2.innerHTML = "Please enter your password.";
        isValid = false;
    }

    return isValid;
}