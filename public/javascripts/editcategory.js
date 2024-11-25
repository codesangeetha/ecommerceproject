function validateAddCategory() {
    var name = document.getElementById("categoryName").value;
    var description = document.getElementById("description").value;
    var img = document.getElementById("image").value;
    var preview = document.getElementById("existing-image-preview");

    var errormsg1 = document.getElementById("error-name");
    var errormsg2 = document.getElementById("error-description");
    var errormsg3 = document.getElementById("error-image");

    errormsg1.innerHTML = "";
    errormsg2.innerHTML = "";
    errormsg3.innerHTML = "";

    var isValid = true;

    if (name == "") {
        errormsg1.innerHTML = "Please enter your name.";
        isValid = false;
    }
    if (description == "") {
        errormsg2.innerHTML = "Please enter description.";
        isValid = false;
    }
    if (preview.innerHTML.trim() == "") {
        if (img == "") {
            errormsg3.innerHTML = "Please add category's image.";
            isValid = false;
        }
        return isValid;
    }

    return isValid;

}