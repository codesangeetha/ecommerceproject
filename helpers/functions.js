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

exports.getCategoryDatabyId = async (val) => {
    const data = await Category.findOne({ _id: val });
    return data;
}

exports.editcategory = async (id,info) => {
    const data = await Category.updateOne({ _id: id },info);
    return data;
}

exports.getProductDatabyId = async (val) => {
    const data = await Products.findOne({ _id: val });
    return data;
}

exports.editproduct = async (id,info) => {
    const data = await Products.updateOne({ _id: id },info);
    return data;
}

exports.banusers = async (id) => {
    const user = await Users.findById({ _id: id });
    user.status = !user.status;
    const data = await user.save();
    return data;
}

exports.finduser = async (username,pwd) => {
    const data = await Users.findOne({$and:[{username:username},{password:pwd}]});
    return data;
}