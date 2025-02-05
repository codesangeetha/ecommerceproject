function validateSignupForm() {

    var name = document.getElementById("name").value.trim();
    var username = document.getElementById("username").value.trim();
    var email = document.getElementById("email").value.trim();
    var password = document.getElementById("password").value.trim();
    var confirmpassword = document.getElementById("cpassword").value.trim();
    var houseNo = document.getElementById("houseNo").value.trim();
    var city = document.getElementById("city").value.trim();
    var state = document.getElementById("state").value.trim();
    var pincode = document.getElementById("pincode").value.trim();
    var phone = document.getElementById("phone").value.trim();


    var errorName = document.getElementById("error-name");
    var errorUsername = document.getElementById("error-username");
    var errorEmail = document.getElementById("error-email");
    var errorPassword = document.getElementById("error-password");
    var errorCpassword = document.getElementById("error-cpassword");
    var errorHouseNo = document.getElementById("error-houseNo");
    var errorCity = document.getElementById("error-city");
    var errorState = document.getElementById("error-state");
    var errorPincode = document.getElementById("error-pincode");
    var errorPhone = document.getElementById("error-phone");


    errorName.innerHTML = "";
    errorUsername.innerHTML = "";
    errorEmail.innerHTML = "";
    errorPassword.innerHTML = "";
    errorCpassword.innerHTML = "";
    errorHouseNo.innerHTML = "";
    errorCity.innerHTML = "";
    errorState.innerHTML = "";
    errorPincode.innerHTML = "";
    errorPhone.innerHTML = "";

    var isValid = true;

    if (name === "") {
        errorName.innerHTML = "Please enter your name.";
        isValid = false;
    }
    if (username === "") {
        errorUsername.innerHTML = "Please enter your username.";
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

    if (confirmpassword === "") {
        errorCpassword.innerHTML = "Please enter confirm password.";
        isValid = false;
    } else if (confirmpassword.length < 6) {
        errorCpassword.innerHTML = "Password must be at least 6 characters long.";
        isValid = false;
    }else if (confirmpassword != password ) {
        errorCpassword.innerHTML = "Password and confirm password are not matchng.";
        isValid = false;
    }

    if (houseNo === "") {
        errorHouseNo.innerHTML = "Please enter your address.";
        isValid = false;
    }

    if (city === "") {
        errorCity.innerHTML = "Please enter your city.";
        isValid = false;
    }
    if (state === "") {
        errorState.innerHTML = "Please enter your state.";
        isValid = false;
    }
    if (pincode === "") {
        errorPincode.innerHTML = "Please enter your pincode.";
        isValid = false;
    }
    if (phone === "") {
        errorPhone.innerHTML = "Please enter your phone number.";
        isValid = false;
    }


    return isValid;
}