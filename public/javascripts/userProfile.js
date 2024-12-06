function userProfileValidation(){

    var houseNo = document.getElementById("houseNo").value.trim();
    var city = document.getElementById("city").value.trim();
    var state = document.getElementById("state").value.trim();
    var pincode = document.getElementById("pincode").value.trim();
    var phone = document.getElementById("phone").value.trim();

    var errorHouseNo = document.getElementById("error-houseNo");
    var errorCity = document.getElementById("error-city");
    var errorState = document.getElementById("error-state");
    var errorPincode = document.getElementById("error-pincode");
    var errorPhone = document.getElementById("error-phone");

    errorHouseNo.innerHTML = "";
    errorCity.innerHTML = "";
    errorState.innerHTML = "";
    errorPincode.innerHTML = "";
    errorPhone.innerHTML = "";

    var isValid = true;

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