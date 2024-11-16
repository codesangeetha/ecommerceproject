const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    brand: String,
    image: String,
    category: String,
    isdeleted: Boolean,
    sizes_available: [String],
    colors_available: String,
    editUser: String,
    stock: { type: Number, required: true }
},
    {
        timestamps: true
    }
);
const Products = mongoose.model('products', productsSchema);
module.exports = Products;