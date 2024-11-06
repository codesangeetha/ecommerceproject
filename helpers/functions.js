const Category = require("../models/categories.model");
const Products = require("../models/products.model");

exports.getcategorydata = async () => {
    const data = await Category.find({});
    return data;
}

exports.getproductsdata = async () => {
    const data = await Products.find({});
    return data;
}