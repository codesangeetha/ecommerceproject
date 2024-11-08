function validateAddCategory() {
    var name = document.getElementById("categoryName").value;
    var description = document.getElementById("description").value;
    var errormsg1 = document.getElementById("error-name");
    var errormsg2 = document.getElementById("error-description");

    errormsg1.innerHTML = "";
    errormsg2.innerHTML = "";

    var isValid = true;

    if (name == "") {
        errormsg1.innerHTML = "Please enter your name.";
        isValid = false;
    }
    if (description == "") {
        errormsg2.innerHTML = "Please enter description.";
        isValid = false;
    }

    return isValid;

}