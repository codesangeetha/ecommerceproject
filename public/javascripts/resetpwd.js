function resetpasswordValidation(){
    var password = document.getElementById("password").value.trim();

    var errorPassword = document.getElementById("error-password");

    errorPassword.innerHTML = "";
    var isValid = true;

    if (password === "") {
        errorPassword.innerHTML = "Please enter password";
        isValid = false;
    }
    return isValid;
}