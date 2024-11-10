function validateAddProduct() {
    var name = document.getElementById("productName").value;
    var price = document.getElementById("price").value;
    var description = document.getElementById("description").value;
    var category = document.getElementById("category").value;
    var img = document.getElementById("image").value;
    
    var errormsg1 = document.getElementById("error-name");
    var errormsg2 = document.getElementById("error-price");
    var errormsg3 = document.getElementById("error-description");
    var errormsg4 = document.getElementById("error-category");
    var errormsg5 = document.getElementById("error-image");
    

    errormsg1.innerHTML = "";
    errormsg2.innerHTML = "";
    errormsg3.innerHTML = "";
    errormsg4.innerHTML = "";
    errormsg5.innerHTML = "";


    var isValid = true;

    if (name == "") {
        errormsg1.innerHTML = "Please enter your product.";
        isValid = false;
    }
    if (price == "") {
        errormsg2.innerHTML = "Please enter your price.";
        isValid = false;
    }
   
    if (description == "") {
        errormsg3.innerHTML = "Please enter description.";
        isValid = false;
    }
    if (category == "") {
        errormsg4.innerHTML = "Please enter category.";
        isValid = false;
    }
    
    if (img == "") {
        errormsg5.innerHTML = "Please add product's image.";
        isValid = false;
    }

    return isValid;

}