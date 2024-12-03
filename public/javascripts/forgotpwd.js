function forgotemailValidation(){
    var email = document.getElementById("email").value.trim();

    var errorEmail = document.getElementById("error-email");

    errorEmail.innerHTML = "";
    var isValid = true;

    if (email === "") {
        errorEmail.innerHTML = "Please enter email";
        isValid = false;
    }
    return isValid;
}