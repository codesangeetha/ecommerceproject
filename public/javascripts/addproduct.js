function validateAddProduct() {
    var name = document.getElementById("productName").value;
    var brand = document.getElementById("brand").value;
    var price = document.getElementById("price").value;
    var description = document.getElementById("description").value;
    var category = document.getElementById("category").value;
    var size = document.getElementById("size").value;
    var color = document.getElementById("color").value;
    var stock = document.getElementById("stock").value;
    var img = document.getElementById("image").value;
    
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
 if (img == "") {
        errormsg9.innerHTML = "Please add product's image.";
        isValid = false;
    } 

    return isValid;

}
/* 
document.addEventListener("DOMContentLoaded", () => {
    const imageInput = document.getElementById("image");
    const previewContainer = document.getElementById("image-preview");

    // Function to display the image preview
    imageInput.addEventListener("change", () => {
        previewContainer.innerHTML = ""; // Clear existing preview

        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement("img");
                img.src = e.target.result;
                img.alt = "Selected Product Image";
                img.style.width = "150px";
                img.style.height = "150px";
                img.style.objectFit = "cover";
                img.className = "img-thumbnail";

                const removeBtn = document.createElement("button");
                removeBtn.textContent = "Remove";
                removeBtn.className = "btn btn-danger btn-sm mt-2";
                removeBtn.onclick = () => {
                    imageInput.value = ""; // Reset file input
                    previewContainer.innerHTML = ""; // Clear preview
                };

                previewContainer.appendChild(img);
                previewContainer.appendChild(removeBtn);
            };
            reader.readAsDataURL(file);
        }
    });
});
 */

document.addEventListener("DOMContentLoaded", () => {
    const imageInput = document.getElementById("images");
    const previewContainer = document.getElementById("image-preview");

    // Function to display the image previews
    imageInput.addEventListener("change", () => {
        previewContainer.innerHTML = ""; // Clear existing previews

        const files = Array.from(imageInput.files);
        files.forEach((file, index) => {
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imgContainer = document.createElement("div");
                    imgContainer.className = "preview-item";
                    imgContainer.style.position = "relative";
                    imgContainer.style.display = "inline-block";
                    imgContainer.style.marginRight = "10px";

                    const img = document.createElement("img");
                    img.src = e.target.result;
                    img.alt = `Image ${index + 1}`;
                    img.style.width = "100px";
                    img.style.height = "100px";
                    img.style.objectFit = "cover";
                    img.className = "img-thumbnail";

                    const removeBtn = document.createElement("button");
                    removeBtn.textContent = "Remove";
                    removeBtn.className = "btn btn-danger btn-sm";
                    removeBtn.style.position = "absolute";
                    removeBtn.style.top = "5px";
                    removeBtn.style.right = "5px";

                    // Remove image from preview and file input
                    removeBtn.onclick = () => {
                        files.splice(index, 1); // Remove file from files array
                        const dt = new DataTransfer();
                        files.forEach(file => dt.items.add(file));
                        imageInput.files = dt.files; // Update input files
                        imgContainer.remove(); // Remove preview
                    };

                    imgContainer.appendChild(img);
                    imgContainer.appendChild(removeBtn);
                    previewContainer.appendChild(imgContainer);
                };
                reader.readAsDataURL(file);
            }
        });
    });
});
