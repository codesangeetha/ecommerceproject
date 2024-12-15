var express = require('express');
const multer = require('multer');
const { getcategorydata,
    getproductsdata,
    getusersdata,
    insertcategory,
    insertproduct, deletecategory, deleteproduct, getCategoryDatabyId,
    editcategory, getProductDatabyId,
    editproduct, banusers,
    getcategorysearch,
    finduseradmin,
    getproductsearch,
    getbranddata, insertbrand, getBrandDatabyId, editbrand,
    deletebrand, getbrandsearch,
    getusersearch,
    dashboradCount,
    updatePasswordByIdAdmin } = require('../helpers/functions');
const Products = require("../models/products.model");
const Category = require("../models/categories.model");
const Users = require("../models/users.model");
const Brand = require('../models/brands.model');
const Order = require("../models/order.model");
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');

const { getProduct, postProductSearch, addProduct, addProductSubmit, getEditProduct, postEditProduct, deleteProduct, viewProduct } = require('../controllers/adminproductController');

const { getCategory, addCategory, postaddCategorySubmit, postCategorySearch, deleteCategory, getEditCategory, editCategorySubmit, getViewCategory } = require('../controllers/admincategoryController');

const { getBrand, getAddBrand, addBrandSubmit, brandSearch, deleteBrand, getEditBrand, editBrandSubmit, getViewBrand } = require('../controllers/adminbrandController');

const { getLogin, postAdminloginSubmit, getUser, userSearch, getLogout, getBantoggle, adminChangePassword, postAdminchangePassword } = require('../controllers/adminuserController');

const { getOrders, viewOrders } = require('../controllers/adminOrderController');

var router = express.Router();

const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    fileFilter: function (req, file, cb) {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

module.exports = upload;


const hbs = require('hbs');

hbs.registerHelper('range', (start, end) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

hbs.registerHelper('add', (a, b) => a + b);
hbs.registerHelper('subtract', (a, b) => a - b);
hbs.registerHelper('eq', (a, b) => a === b);
hbs.registerHelper('gt', (a, b) => a > b);
hbs.registerHelper('lt', (a, b) => a < b);


function random() {
    return Math.floor(Math.random() + 9000) + 1000;
}

const checkadminLogin = (req, res, next) => {
    if (req.session.isAdminLoggin && req.session.isAdminLoggin == true) {
        // console.log('hello')
        next();
    } else {
        // console.log("god")
        res.redirect('/admin/login')
    }
}

router.get('/product', checkadminLogin, getProduct);

router.post('/product-search', checkadminLogin, postProductSearch);

router.get('/edit-product/:id', checkadminLogin, getEditProduct);

router.post('/edit-productsubmit/:id', checkadminLogin, upload.array('images', 5), postEditProduct);

router.get('/add-product', checkadminLogin, addProduct);

router.post('/add-productsubmit', upload.array('images', 5), addProductSubmit);

router.get('/view-product/:id', viewProduct);

router.get('/deleteproduct/:id', deleteProduct);



router.get('/category', checkadminLogin, getCategory);

router.get('/add-category', checkadminLogin, addCategory);

router.post('/add-categorysubmit', upload.single('image'), postaddCategorySubmit);

router.post('/category-search', checkadminLogin, postCategorySearch);

router.get('/edit-category/:id', checkadminLogin, getEditCategory);

router.post('/edit-categorysubmit/:id', checkadminLogin, upload.single('image'), editCategorySubmit);

router.get('/view-category/:id', getViewCategory);

router.get('/deletecategory/:id', deleteCategory);



router.get('/brand', checkadminLogin, getBrand);

router.get('/add-brand', checkadminLogin, getAddBrand);

router.post('/add-brandsubmit', addBrandSubmit);

router.post('/brand-search', checkadminLogin, brandSearch);

router.get('/edit-brand/:id', checkadminLogin, getEditBrand);

router.post('/edit-brandsubmit/:id', checkadminLogin, editBrandSubmit);

router.get('/view-brand/:id', getViewBrand);

router.get('/deletebrand/:id', deleteBrand);


router.get('/dashboard', checkadminLogin, async (req, res) => {
    const obj = await dashboradCount();
    return res.render('admindashboard', { isAdmin: true, isadminlogin: req.session.isAdminLoggin, obj });
});


router.get('/login', getLogin);

router.post('/adminloginsubmit', postAdminloginSubmit);

router.get('/user', checkadminLogin, getUser);

router.post('/user-search', checkadminLogin, userSearch);

router.get('/logout', getLogout);

router.get('/bantoggle/:id', getBantoggle);

router.get('/changePassword', adminChangePassword);

router.post('/changepassword-submit', postAdminchangePassword);


router.get('/orders', checkadminLogin, getOrders);

router.get('/view-order/:id', checkadminLogin, viewOrders);

module.exports = router;
