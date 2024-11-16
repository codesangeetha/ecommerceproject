function validateEditProduct() {
    var name = document.getElementById("productName").value;
    var brand = document.getElementById("brand").value;
    var price = document.getElementById("price").value;
    var description = document.getElementById("description").value;
    var category = document.getElementById("category").value;
    var size = document.getElementById("size").value;
    var color = document.getElementById("color").value;
    var img = document.getElementById("image").value;

    var errormsg1 = document.getElementById("error-name");
    var errormsg2 = document.getElementById("error-brand");
    var errormsg3 = document.getElementById("error-price");
    var errormsg4 = document.getElementById("error-description");
    var errormsg5 = document.getElementById("error-category");
    var errormsg6 = document.getElementById("error-size");
    var errormsg7 = document.getElementById("error-color");
    var errormsg8 = document.getElementById("error-image");


    errormsg1.innerHTML = "";
    errormsg2.innerHTML = "";
    errormsg3.innerHTML = "";
    errormsg4.innerHTML = "";
    errormsg5.innerHTML = "";
    errormsg6.innerHTML = "";
    errormsg7.innerHTML = "";
    errormsg8.innerHTML = "";
    

    var isValid = true;

    if (name == "") {
        errormsg1.innerHTML = "Please enter your product.";
        isValid = false;
    }
    if (brand == "") {
        errormsg2.innerHTML = "Please enter your brand.";
        isValid = false;
    }

    if (price == "") {
        errormsg3.innerHTML = "Please enter your price.";
        isValid = false;
    }

    if (description == "") {
        errormsg4.innerHTML = "Please enter description.";
        isValid = false;
    }
    if (category == "") {
        errormsg5.innerHTML = "Please enter category.";
        isValid = false;
    }
    if (size == "") {
        errormsg6.innerHTML = "Choose size";
        isValid = false;
    }
    if (color == "") {
        errormsg7.innerHTML = "Choose color";
        isValid = false;
    }

    if (img == "") {
        errormsg8.innerHTML = "Please add product's image.";
        isValid = false;
    }

    return isValid;

}