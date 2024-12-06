function changepasswordValidation() {
    var newpassword = document.getElementById("newPassword").value.trim();
    var confirmpassword = document.getElementById("confirmNewPassword").value.trim();

    var errorPassword = document.getElementById("error-pwd");
    var confirmPassword = document.getElementById("error-confirmpwd");

    errorPassword.innerHTML = "";
    confirmPassword.innerHTML="";

    var isValid = true;

    if (newpassword === "") {
        errorPassword.innerHTML = "Please enter your password.";
        isValid = false;
    } else if (password.length < 6) {
        errorPassword.innerHTML = "Password must be at least 6 characters long.";
        isValid = false;
    }
    if(confirmpassword === ""){
        confirmPassword.innerHTML = "Please enter confirm password.";
    }
    return isValid;
}