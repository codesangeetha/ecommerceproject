const Category = require("../models/categories.model");
const Products = require("../models/products.model");
const Users = require("../models/users.model");



exports.getcategorydata = async () => {
    const data = await Category.find({});
    return data;
}

exports.getproductsdata = async () => {
    const data = await Products.find({});
    return data;
}

exports.getusersdata = async () => {
    const data = await Users.find({});
    return data;
}

exports.insertcategory= async (obj) => {
    console.log('hi');
    const data = await Category.insertMany([obj]);
    return data;
}