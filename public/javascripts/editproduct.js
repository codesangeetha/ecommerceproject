function validateEditProduct() {
    var name = document.getElementById("productName").value;
    var brand = document.getElementById("brand").value;
    var price = document.getElementById("price").value;
    var description = document.getElementById("description").value;
    var category = document.getElementById("category").value;
    var size = document.getElementById("size").value;
    var color = document.getElementById("color").value;
    var stock = document.getElementById("stock").value;
    var img = document.getElementById("image").value;
    var preview = document.getElementById("existing-image-preview");

    var errormsg1 = document.getElementById("error-name");
    var errormsg2 = document.getElementById("error-brand");
    var errormsg3 = document.getElementById("error-price");
    var errormsg4 = document.getElementById("error-description");
    var errormsg5 = document.getElementById("error-category");
    var errormsg6 = document.getElementById("error-size");
    var errormsg7 = document.getElementById("error-color");
    var errormsg8 = document.getElementById("error-stock");
    var errormsg9 = document.getElementById("error-image");


    errormsg1.innerHTML = "";
    errormsg2.innerHTML = "";
    errormsg3.innerHTML = "";
    errormsg4.innerHTML = "";
    errormsg5.innerHTML = "";
    errormsg6.innerHTML = "";
    errormsg7.innerHTML = "";
    errormsg8.innerHTML = "";
    errormsg9.innerHTML = "";


    var isValid = true;

    if (name == "") {
        errormsg1.innerHTML = "Please enter product.";
        isValid = false;
    }
    if (brand == "") {
        errormsg2.innerHTML = "Please enter brand.";
        isValid = false;
    }

    if (price == "") {
        errormsg3.innerHTML = "Please enter  price.";
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
        errormsg6.innerHTML = "Please choose product size.";
        isValid = false;
    }
    if (color == "") {
        errormsg7.innerHTML = "Please choose product color.";
        isValid = false;
    }

    if (stock == "") {
        errormsg8.innerHTML = "Stock can' be empty";
        isValid = false;
    }

console.log("preview data :",preview.innerHTML.trim());
console.log("img :",img.innerHTML);

    if (preview.innerHTML.trim() == "") {
        if (img == "") {
            errormsg9.innerHTML = "Please add product's image.";
            isValid = false;
        }
        return isValid;
    }



}
