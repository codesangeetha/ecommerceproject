const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    brand: String,
    images: [String], // Change from 'image' to 'images'
    category: String,
    isdeleted: Boolean,
    sizes_available: [String],
    colors_available: [String],
    editUser: String,
    stock: { type: Number, required: true },
    status: Boolean,
    favoriteBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
    timestamps: true
});

const Products = mongoose.model('products', productsSchema);
module.exports = Products;