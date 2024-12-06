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

const { } = require('../controllers/adminproductController');




var router = express.Router();

/* const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + random() + "-" + file.originalname);
    }
}); */

// const multer = require('multer');
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

// const upload = multer({ storage: storage });


const checkadminLogin = (req, res, next) => {
    if (req.session.isAdminLoggin && req.session.isAdminLoggin == true) {
        // console.log('hello')
        next();
    } else {
        // console.log("god")
        res.redirect('/admin/login')
    }
}



router.get('/product', checkadminLogin, async (req, res) => {

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
});

router.post('/product-search', checkadminLogin, async (req, res) => {
    const searchQuery = req.body.search?.trim(); // Handle whitespace-only input
    const page = parseInt(req.query.page) || 1; // Enable pagination
    const perPage = 4; // Number of items per page

    let query = { isdeleted: false };

    // Add search condition if searchQuery is not empty
    if (searchQuery) {
        query = {
            ...query,
            name: { $regex: searchQuery, $options: "i" }, // Case-insensitive search
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
        searchQuery // Pass the search query back for persistence in the input field
    });
});



router.get('/category', checkadminLogin, async (req, res) => {
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

    const totalcategories = await Category.countDocuments(query);

    const categorydata = await Category.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

    const categories = categorydata.map((o, index) => ({
        slno: (page - 1) * perPage + index + 1,
        _id: o._id,
        name: o.name,
        description: o.description.substring(0, 20),
        image: o.image

    }));

    const totalPages = Math.ceil(totalcategories / perPage);

    res.render('admincategory', {

        arr: categories,
        currentPage: page,
        totalPages,
        isAdmin: true, isadminlogin: req.session.isAdminLoggin,
        startDate,
        endDate
    });

});


router.post('/category-search', checkadminLogin, async (req, res) => {
    const searchQuery = req.body.search.trim();
    const page = parseInt(req.query.page) || 1;
    const perPage = 4; // Number of items per page

    let query = { isdeleted: false };
    if (searchQuery) {
        query = {
            ...query,
            name: { $regex: searchQuery, $options: "i" },
        };
    }

    const totalcategories = await Category.countDocuments(query);

    const categorydata = await Category.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

    const categories = categorydata.map((o, index) => ({
        slno: (page - 1) * perPage + index + 1,
        _id: o._id,
        name: o.name,
        description: o.description.substring(0, 20),
        image: o.image
    }));

    const totalPages = Math.ceil(totalcategories / perPage);

    res.render('admincategory', {
        arr: categories,
        currentPage: page,
        totalPages,
        isAdmin: true,
        isadminlogin: req.session.isAdminLoggin,
        searchQuery,
    });
});


router.get('/brand', checkadminLogin, async (req, res) => {
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

    const totalbrands = await Brand.countDocuments(query);

    const branddata = await Brand.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

    const brands = branddata.map((o, index) => ({
        slno: (page - 1) * perPage + index + 1,
        _id: o._id,
        name: o.name,
        description: o.description.substring(0, 20),

    }));

    const totalPages = Math.ceil(totalbrands / perPage);

    res.render('adminbrand', {
        arr: brands,
        currentPage: page,
        totalPages,
        isAdmin: true, isadminlogin: req.session.isAdminLoggin
    });
});

router.post('/brand-search', checkadminLogin, async (req, res) => {

    const searchQuery = req.body.search.trim();
    const page = parseInt(req.query.page) || 1;
    const perPage = 4; // Number of items per page

    let query = { isdeleted: false };
    if (searchQuery) {
        query = {
            ...query,
            name: { $regex: searchQuery, $options: "i" },
        };
    }

    const totalbrands = await Brand.countDocuments(query);

    const branddata = await Brand.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

    const brands = branddata.map((o, index) => ({
        slno: (page - 1) * perPage + index + 1,
        _id: o._id,
        name: o.name,
        description: o.description.substring(0, 20),
    }));

    const totalPages = Math.ceil(totalbrands / perPage);

    res.render('adminbrand', {
        arr: brands,
        currentPage: page,
        totalPages,
        isAdmin: true,
        isadminlogin: req.session.isAdminLoggin,
        searchQuery,
    });

});

router.get('/dashboard', checkadminLogin, async (req, res) => {
    const obj = await dashboradCount();
    return res.render('admindashboard', { isAdmin: true, isadminlogin: req.session.isAdminLoggin, obj });
});


router.get('/login', (req, res) => {
    const msg = req.session.message;
    req.session.message = "";
   
    res.render('adminlogin', { msg, isAdmin: true, isadminlogin: req.session.isAdminLoggin });
});

router.post('/adminloginsubmit', async (req, res) => {
    const loginvalue = await finduseradmin(req.body.username, req.body.password);
    // console.log(loginvalue);
    if (loginvalue == null) {
        req.session.message = "Invalid username/password";
        return res.redirect('/admin/login');
    } else {
        req.session.isAdminLoggin = true;
        req.session.adminName = req.body.username;
        req.session.userid = loginvalue._id.toString();
        return res.redirect('/admin/dashboard');
    }
});

router.get('/user', checkadminLogin, async (req, res) => {

// console.log("req.query",req.query)
    const page = parseInt(req.query.page) || 1;
    const perPage = 4;
const { startDate, endDate } = req.query;

    let query = {};

    if (startDate) {
        query.createdAt = { ...query.createdAt, $gte: new Date(`${startDate}T00:00:00.000Z`) };
    }
    // console.log("startdate:",query);
    if (endDate) {
        query.createdAt = { ...query.createdAt, $lte: new Date(`${endDate}T23:59:59.999Z`) };
    }
    console.log("query :", query);

    const totalUsers = await Users.countDocuments(query);


    const usersdata = await Users.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

    const users = usersdata.map((o, index) => ({
        slno: (page - 1) * perPage + index + 1,
        _id: o._id,
        name: o.name,
        email: o.email,
        status: o.status

    }));
    // console.log("users",users)
    const totalPages = Math.ceil(totalUsers / perPage);

    res.render('adminusers', {
        arr: users,
        currentPage: page,
        totalPages,
        isAdmin: true, isadminlogin: req.session.isAdminLoggin,
        startDate,
        endDate
    });
    
});


router.post('/user-search', checkadminLogin, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = 4;
    const searchQuery = req.body.search?.trim(); 

    let query = {};

    if (searchQuery) {
        query = {
            $or: [
                { name: { $regex: searchQuery, $options: "i" } },
                { email: { $regex: searchQuery, $options: "i" } },
                { username: { $regex: searchQuery, $options: "i" } }
            ]
        };
    }

    const totalUsers = await Users.countDocuments(query);

    // Fetch paginated results
    const userdata = await Users.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

    const users = userdata.map((o, index) => ({
        slno: (page - 1) * perPage + index + 1,
        _id: o._id,
        name: o.name,
        email: o.email,
        status: o.status,
        username: o.username
    }));

    const totalPages = Math.ceil(totalUsers / perPage);

    res.render('adminusers', {
        arr: users,
        currentPage: page,
        totalPages,
        isAdmin: true,
        isadminlogin: req.session.isAdminLoggin,
        searchQuery // Pass the search query back to the view
    });
});

router.get('/add-category', checkadminLogin, (req, res) => {
    const msg = req.session.message;
    req.session.message = "";
    // console.log("msg", msg);
    return res.render('addcategory', { isAdmin: true, isadminlogin: req.session.isAdminLoggin, msg: msg })
});

router.post('/add-categorysubmit', upload.single('image'), async (req, res) => {

    if (req.body.categoryName === "") {
        req.session.message = "Category Name is empty";
        return res.redirect("/admin/add-category");
    }

    if (req.body.description === "") {
        req.session.message = "Category description is empty";
        return res.redirect("/admin/add-category");
    }

    const obj = {
        name: req.body.categoryName,
        description: req.body.description,
        isdeleted: false,
        editUser: req.session.adminName,
        image: req.file ? req.file.filename : null,
        status: req.body.status ? true : false
    }
    // console.log(obj);
    const data = await insertcategory(obj);
    // console.log(data);
    return res.redirect('/admin/category');
});



router.get('/add-brand', checkadminLogin, (req, res) => {
    const msg = req.session.message;
    req.session.message = "";
    // console.log("msg = ",msg);
    return res.render('addbrand', { isAdmin: true, isadminlogin: req.session.isAdminLoggin, msg: msg })
});

router.post('/add-brandsubmit', async (req, res) => {

    if (req.body.brandName === "") {
        req.session.message = "Brand name is empty";
        return res.redirect('/admin/add-brand')
    }

    if (req.body.description === "") {
        req.session.message = "Brand descripton is empty";
        return res.redirect('/admin/add-brand')
    }

    const obj = {
        name: req.body.brandName,
        description: req.body.description,
        isdeleted: false,
        editUser: req.session.adminName,
        status: req.body.status ? true : false
    }
    // console.log(obj);
    const data = await insertbrand(obj)
    return res.redirect('/admin/brand');
});



router.get('/add-product', checkadminLogin, async (req, res) => {
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
});

router.post('/add-productsubmit', upload.array('images', 5), async (req, res) => {
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
});


router.get('/deletecategory/:id', async (req, res) => {
    const val = req.params.id;
    // console.log(val);
    const data = await deletecategory(val);
    res.redirect('/admin/category')
});

router.get('/deletebrand/:id', async (req, res) => {
    const val = req.params.id;
    // console.log(val);
    const data = await deletebrand(val);
    res.redirect('/admin/brand')
});

router.get('/deleteproduct/:id', async (req, res) => {
    const val = req.params.id;
    // console.log(val);
    const data = await deleteproduct(val);
    res.redirect('/admin/product')
});


router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send("Couldn't log out");
        }
        res.redirect('/admin/login');
    });
});

router.get('/edit-category/:id', checkadminLogin, async (req, res) => {
    const val = req.params.id;
    const data = await getCategoryDatabyId(val)
    //  console.log(data);

    return res.render('editcategory', { category: data, isAdmin: true, isadminlogin: req.session.isAdminLoggin })
});

router.post('/edit-categorysubmit/:id', checkadminLogin, upload.single('image'), async (req, res) => {
    const val2 = req.params.id;

    const oldimg = await getCategoryDatabyId(val2);
    console.log("oldimage -", oldimg);
    let obj = {
        name: req.body.categoryName,
        description: req.body.description,
        editUser: req.session.adminName,
        image: req.file ? req.file.filename : oldimg.image,
        status: req.body.status ? true : false
    };

    if (req.file) {
        obj.image = req.file.filename;
    } else if (req.body.removeImage) {
        obj.image = null;
    }

    // console.log(obj);
    const data = await editcategory(val2, obj);
    // console.log(data);
    res.redirect('/admin/category');
});

router.get('/edit-brand/:id', checkadminLogin, async (req, res) => {
    const val = req.params.id;
    const data = await getBrandDatabyId(val)
    // console.log("editbrand-data", data)
    return res.render('editbrand', { brand: data, isAdmin: true, isadminlogin: req.session.isAdminLoggin })
});
router.post('/edit-brandsubmit/:id', checkadminLogin, async (req, res) => {
    const val = req.params.id;
    let obj = {
        name: req.body.brandName,
        description: req.body.description,
        editUser: req.session.adminName,
        status: req.body.status ? true : false
    };
    // console.log("ready to edit",obj);
    const data = await editbrand(val, obj);
    return res.redirect('/admin/brand')
});

router.get('/edit-product/:id', checkadminLogin, async (req, res) => {
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
});


router.post('/edit-productsubmit/:id', checkadminLogin, upload.array('images', 5), async (req, res) => {
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
});


router.get('/bantoggle/:id', async (req, res) => {
    const val = req.params.id;

    const info = await banusers(val);
    res.redirect('/admin/user')
});



router.get('/view-product/:id', async (req, res) => {
    const val = req.params.id;
    const product = await getProductDatabyId(val);
    const categories = await getcategorydata();
    const brands = await getbranddata();

    let categoryName = categories.find(cat => cat._id.toString() === product.category)?.name || 'N/A';
    let brandName = brands.find(brand => brand._id.toString() === product.brand)?.name || 'N/A';

    const createdAtDate = product.createdAt ? product.createdAt.toISOString().split('T')[0] : 'N/A';
    const updatedAtDate = product.updatedAt ? product.updatedAt.toISOString().split('T')[0] : 'N/A';

    res.render('partials/productModalContent', {
        layout: false, 
        product,
        categoryName,
        brandName,
        createdAtDate,
        updatedAtDate
    });
});

router.get('/view-category/:id', async (req, res) => {
    try {
        const val = req.params.id;
        const category = await getCategoryDatabyId(val);
        console.log("categories", category);

        if (!category) {
            return res.status(404).send('<p class="text-danger">Category not found</p>');
        }

        const createdAtDate = category.createdAt
            ? category.createdAt.toISOString().split('T')[0]
            : 'N/A';
        const updatedAtDate = category.updatedAt
            ? category.updatedAt.toISOString().split('T')[0]
            : 'N/A';

        res.render('partials/categoryModalContent', {
            layout: false,
            categoryName: category.name,
            description: category.description,
            editUser: category.editUser || 'N/A',
            status: category.status,
            createdAtDate,
            updatedAtDate,
            image: category.image || 'default.png',
        });
    } catch (error) {
        console.error('Error fetching category data:', error);
        res.status(500).send('<p class="text-danger">Internal server error</p>');
    }
});

router.get('/view-brand/:id', async (req, res) => {
    try {
        const val = req.params.id;

        const brand = await getBrandDatabyId(val);
        console.log("brand", brand);


        if (!brand) {
            return res.status(404).send('<p class="text-danger">Brand not found</p>');
        }

        const createdAtDate = brand.createdAt
            ? brand.createdAt.toISOString().split('T')[0]
            : 'N/A';
        const updatedAtDate = brand.updatedAt
            ? brand.updatedAt.toISOString().split('T')[0]
            : 'N/A';


        res.render('partials/brandModalContent', {
            layout: false,
            brandName: brand.name,
            description: brand.description,
            editUser: brand.editUser || 'N/A',
            status: brand.status,
            createdAtDate,
            updatedAtDate,

        });
    } catch (error) {
        console.error('Error fetching brand data:', error);
        res.status(500).send('<p class="text-danger">Internal server error</p>');
    }
});


router.get('/orders', checkadminLogin, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = 4;
    const { startDate, endDate } = req.query;

    let query = {};

    if (startDate) {
        query.createdAt = { ...query.createdAt, $gte: new Date(`${startDate}T00:00:00.000Z`) };
    }
    if (endDate) {
        query.createdAt = { ...query.createdAt, $lte: new Date(`${endDate}T23:59:59.999Z`) };
    }

    const totalOrders = await Order.countDocuments(query);

    const orderData = await Order.find(query)
        .populate('user', 'name email') // Populate user name and email
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

    const orders = orderData.map((o, index) => ({
        slno: (page - 1) * perPage + index + 1,
        _id: o._id,
        userName: o.user?.name || 'N/A',
        email: o.user?.email || 'N/A',
        totalAmount: o.totalAmount,
        paymentStatus: o.paymentDetails.paymentStatus || 'N/A',
        createdAt: o.createdAt,
    }));

    const totalPages = Math.ceil(totalOrders / perPage);

    res.render('adminorders', {
        orders,
        currentPage: page,
        totalPages,
        isAdmin: true,
        isadminlogin: req.session.isAdminLoggin,
        startDate,
        endDate,
    });
});

router.get('/view-order/:id', checkadminLogin, async (req, res) => {
    const orderId = req.params.id;

    try {
        const order = await Order.findById(orderId)
            .populate('user', 'name email')
            .populate('cartDetails.product', 'name price image'); // Adjust based on your product schema

        res.render('partials/orderDetails', { layout: false, order });
    } catch (error) {
        res.status(500).send('<p class="text-danger">Failed to load order details.</p>');
    }
});

router.get('/changePassword',(req, res) => {
    
    if (!req.session.userId) {
        req.flash('error', 'Please log in to change your password.');
        return res.redirect('/admin/login');
    }
    res.render('adminchangepwd',{isAdmin: true, isadminlogin: req.session.isAdminLoggin,});
});
// /admin/changepassword-submit
router.post('/changepassword-submit', async (req, res) => {

    try {
        const { newPassword, confirmNewPassword } = req.body;
        const userId =  req.session.userid;

        console.log('userId', userId);

        // Ensure user is logged in
        if (!userId) {
            req.flash('error', 'You must be logged in to change your password.');
            return res.redirect('/admin/login');
        }

        if (newPassword !== confirmNewPassword) {
            req.flash('error', 'New password and confirm password do not match.');
            return res.redirect('/admin/changepassword');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await updatePasswordByIdAdmin(userId, hashedPassword);

        req.flash('success', 'Password changed successfully.');
        return res.redirect('/admin/changepassword');
    } catch (error) {
        console.error('Error changing password:', error);
        req.flash('error', 'An error occurred. Please try again later.');
        return res.redirect('/admin/changepassword');
    }
});

/* function clearCache(res) {
    res.set('Cache-Control', 'no-store,no-cache,must-revalidate,private');
} */

module.exports = router;
