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

exports.insertcategory = async (obj) => {

    const data = await Category.insertMany([obj]);
    return data;
}

exports.insertproduct = async (obj) => {

    const data = await Products.insertMany([obj]);
    return data;
}

exports.insertuser = async (obj) => {

    const data = await Users.insertMany([obj]);
    return data;
}

exports.deletecategory = async (val) => {
    const data = await Category.deleteOne({ _id: val });
    return data;
}

exports.deleteproduct = async (val) => {
    const data = await Products.deleteOne({ _id: val });
    return data;
}
