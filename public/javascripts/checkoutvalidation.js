function validateCheckoutform(){

    var name = document.getElementById("name").value.trim();
    var houseNo = document.getElementById("houseNo").value.trim();
    var city = document.getElementById("city").value.trim();
    var state = document.getElementById("state").value.trim();
    var pincode = document.getElementById("pincode").value.trim();
    var email = document.getElementById("email").value.trim();
    var phone = document.getElementById("phone").value.trim();


    var errorName = document.getElementById("error-name");
    var errorHouseNo = document.getElementById("error-houseno");
    var errorCity = document.getElementById("error-city");
    var errorState = document.getElementById("error-state");
    var errorPincode = document.getElementById("error-pincode");
    var errorEmail = document.getElementById("error-email");
    var errorPhone = document.getElementById("error-phone");

    errorName.innerHTML = "";
    errorHouseNo.innerHTML ="";
    errorCity.innerHTML = "";
    errorState.innerHTML="";
    errorPincode.innerHTML="";
    errorEmail.innerHTML="";
    errorPhone.innerHTML="";

    var isValid = true;

    if (name === "") {
        errorName.innerHTML = "Please enter your name.";
        isValid = false;
    }
    if (houseNo === "") {
        errorHouseNo.innerHTML = "Please enter your house name.";
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
    if (email === "") {
        errorEmail.innerHTML = "Please enter your email.";
        isValid = false;
    }
    if (phone === "") {
        errorPhone.innerHTML = "Please enter your phone number.";
        isValid = false;
    }
    return isValid;
}