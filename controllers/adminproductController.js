
const Products = require("../models/products.model");
const Category = require("../models/categories.model");
const Users = require("../models/users.model");
const Brand = require('../models/brands.model');
const Order = require("../models/order.model");

const{getcategorydata,getbranddata,insertproduct,getProductDatabyId,editproduct,deleteproduct}=require('../helpers/functions');

exports.getProduct = async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const perPage = 4;
    const { startDate, endDate } = req.query;

    let query = { isdeleted: false };

    if (startDate) {
        query.createdAt = { ...query.createdAt, $gte: new Date(`${startDate}T00:00:00.000Z`) };
    }
    if (endDate) {
        query.createdAt = { ...query.createdAt, $lte: new Date(`${endDate}T23:59:59.999Z`) };
    }
    console.log("query :", query);

    const totalProducts = await Products.countDocuments(query);

    const productdata = await Products.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

    const products = productdata.map((o, index) => ({
        slno: (page - 1) * perPage + index + 1,
        _id: o._id,
        name: o.name,
        description: o.description.substring(0, 20),
        price: o.price,
        image: o.images[0]
    }));

    const totalPages = Math.ceil(totalProducts / perPage);

    return res.render('adminproduct', {
        arr: products,
        currentPage: page,
        totalPages,
        isAdmin: true, isadminlogin: req.session.isAdminLoggin,
        startDate,
        endDate
    });
};

exports.postProductSearch = async (req, res) => {
    const searchQuery = req.body.search?.trim(); 
    const page = parseInt(req.query.page) || 1;
    const perPage = 4;
    let query = { isdeleted: false };

    if (searchQuery) {
        query = {
            ...query,
            name: { $regex: searchQuery, $options: "i" }, 
        };
    }

    const totalProducts = await Products.countDocuments(query);

    const productdata = await Products.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

    const products = productdata.map((o, index) => ({
        slno: (page - 1) * perPage + index + 1,
        _id: o._id,
        name: o.name,
        description: o.description.substring(0, 20),
        price: o.price,
        image: o.image
    }));

    const totalPages = Math.ceil(totalProducts / perPage);

    res.render('adminproduct', {
        arr: products,
        currentPage: page,
        totalPages,
        isAdmin: true,
        isadminlogin: req.session.isAdminLoggin,
        searchQuery
    });
};

exports.addProduct = async (req, res) => {
    const data = await getcategorydata();
    console.log(data);
    const info = await getbranddata();
    console.log("brand data", info);
    const sizeArr = [5, 6, 7, 8, 9, 10, 11, 12, 13];
    const colorArr = ["Red", "Blue", "White", "Black"];
    // console.log("colorarr", colorArr);

    const msg = req.session.message;
    req.session.message = "";

    return res.render('addproduct', { arr: data, arr2: info, sizeArr: sizeArr, msg: msg, colorArr: colorArr, isAdmin: true, isadminlogin: req.session.isAdminLoggin })
};

exports.addProductSubmit = async (req, res) => {
    let sizearr = req.body.size;
    if (!Array.isArray(req.body.size)) {
        sizearr = [req.body.size];
    }
    let colorarr = req.body.color;
    if (!Array.isArray(req.body.color)) {
        colorarr = [req.body.color];
    }


    const imagePaths = req.files.map(file => file.filename);

    const obj = {
        name: req.body.productName,
        brand: req.body.brand,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        isdeleted: false,
        editUser: req.session.adminName,
        images: imagePaths, // Store image paths
        sizes_available: sizearr,
        colors_available: colorarr,
        stock: req.body.stock,
        status: req.body.status ? true : false
    };

    const data = await insertproduct(obj);
    return res.redirect('/admin/product');
};

exports.getEditProduct = async (req, res) => {
    const val = req.params.id;
    const product = await getProductDatabyId(val);
    console.log("product data:", product);

    const categories = await getcategorydata();
    const newCategories = categories.map((category) => ({
        _id: category._id,
        name: category.name,
        selected: product.category == category._id ? "selected" : "",
    }));

    const brands = await getbranddata();
    const newBrands = brands.map((brand) => ({
        _id: brand._id,
        name: brand.name,
        selected: product.brand == brand._id ? "selected" : "",
    }));

    const sizeArr = [5, 6, 7, 8, 9, 10, 11, 12, 13];
    const newSizeArr = sizeArr.map((size) => ({
        size,
        selected: product.sizes_available.includes(size) ? "selected" : "",
    }));

    const colorArr = ["Red", "Blue", "White", "Black"];
    const newColorArr = colorArr.map((color) => ({
        color,
        selected: product.colors_available.includes(color) ? "selected" : "",
    }));

    return res.render('editproduct', {
        products: product,
        arr: newCategories,
        arr2: newBrands,
        newSizeArr,
        newColorArr,
        isAdmin: true,
        isadminlogin: req.session.isAdminLoggin,
    });
};

exports.postEditProduct =  async (req, res) => {
    const val2 = req.params.id;
    let sizearr = req.body.size;
    if (!Array.isArray(req.body.size)) {
        sizearr = [req.body.size];
    }

    let colorarr = req.body.color;
    if (!Array.isArray(req.body.color)) {
        colorarr = [req.body.color];
    }

    const oldProduct = await getProductDatabyId(val2); // Fetch old product data

    // Process new image uploads
    const newImages = req.files.map((file) => file.filename);

    // Handle removed images
    let updatedImages = oldProduct.images || [];
    if (req.body.removedImages) {
        const removedImages = Array.isArray(req.body.removedImages)
            ? req.body.removedImages
            : [req.body.removedImages];
        updatedImages = updatedImages.filter((img) => !removedImages.includes(img));
    }

    // Add new images to the updated image array
    updatedImages = [...updatedImages, ...newImages];

    const obj = {
        name: req.body.productName,
        price: req.body.price,
        brand: req.body.brand,
        description: req.body.description,
        category: req.body.category,
        sizes_available: sizearr,
        colors_available: colorarr,
        editUser: req.session.adminName,
        images: updatedImages,
        stock: req.body.stock,
        status: req.body.status ? true : false,
    };

    await editproduct(val2, obj);
    res.redirect('/admin/product');
};

exports.deleteProduct =  async (req, res) => {
    const val = req.params.id;
    // console.log(val);
    const data = await deleteproduct(val);
    res.redirect('/admin/product')
}