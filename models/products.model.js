const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
    name : String,
    description : String,
    price:Number,
    brand:String,
    image: String ,
    category : String,
    isdeleted :Boolean,
    sizes_available:Number,
    colors_available:String,
    created_at : Date,
    updated_at : Date,
    editUser: String
});
const Products = mongoose.model('products',productsSchema);
module.exports = Products;