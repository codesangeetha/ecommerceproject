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
    deletebrand ,getbrandsearch,
       getusersearch} = require('../helpers/functions');
const Products = require("../models/products.model");
const Category = require("../models/categories.model");
const Users = require("../models/users.model");

var router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + random() + "-" + file.originalname);
    }
});
const hbs = require('hbs');
const Brand = require('../models/brands.model');

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

const upload = multer({ storage: storage });


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

    const totalProducts = await Products.countDocuments({ isdeleted: false });

    const productdata = await Products.find({ isdeleted: false })
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
        isAdmin: true
    });
    clearCache(res);
});


router.post('/product-search', checkadminLogin, async (req, res) => {
    const productdata = await getproductsearch(req.body.search);
    clearCache(res);
    // console.log("productdata", productdata);
    const arr = [];
    for (let i = 0; i < productdata.length; i++) {
        const o = productdata[i];
        const newDesc = o.description.substring(0, 20);
        const newO = {
            slno: i + 1,
            _id: o._id,
            name: o.name,
            description: newDesc,
            price: o.price,
            image: o.image
        };
        arr.push(newO);
    }
    res.render('adminproduct', { arr: arr, isAdmin: true })
});


router.get('/category', checkadminLogin, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = 4;

    const totalcategories = await Category.countDocuments({ isdeleted: false });


    const categorydata = await Category.find({ isdeleted: false })
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

    const categories = categorydata.map((o, index) => ({
        slno: (page - 1) * perPage + index + 1,
        _id: o._id,
        name: o.name,
        description: o.description.substring(0, 20),

    }));

    const totalPages = Math.ceil(totalcategories / perPage);

    res.render('admincategory', {
        arr: categories,
        currentPage: page,
        totalPages,
        isAdmin: true
    });
    clearCache(res);
});


router.post('/category-search', checkadminLogin, async (req, res) => {
    // console.log("search form : ", req.body);
    // console.log('hello');
    const categorydata = await getcategorysearch(req.body.search);
    // console.log("categorydata", categorydata);
    clearCache(res);
    const arr = [];
    for (let i = 0; i < categorydata.length; i++) {
        const o = categorydata[i];
        const newDesc = o.description.substring(0, 20);
        const newO = {
            slno: i + 1,
            _id: o._id,
            name: o.name,
            description: newDesc
        };
        arr.push(newO);
    }
    res.render('admincategory', { arr: arr, isAdmin: true })
});


router.get('/brand', checkadminLogin, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = 4;

    const totalbrands = await Brand.countDocuments({ isdeleted: false });


    const branddata = await Brand.find({ isdeleted: false })
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
        isAdmin: true
    });
    clearCache(res);
});

router.post('/brand-search', checkadminLogin,async(req,res)=>{
    const branddata = await getbrandsearch(req.body.search);
     console.log("branddata", branddata);
     clearCache(res);
     const arr = [];
     for (let i = 0; i < branddata.length; i++) {
         const o = branddata[i];
         const newDesc = o.description.substring(0, 20);
         const newO = {
             slno: i + 1,
             _id: o._id,
             name: o.name,
             description: newDesc
         };
         arr.push(newO);
     }
     res.render('adminbrand', { arr: arr, isAdmin: true })
 });
 
router.get('/dashboard',checkadminLogin,(req,res)=>{
return res.render('admindashboard',{isAdmin:true});
});

router.get('/login', (req, res) => {
    const msg = req.session.message;
    req.session.message = "";
    clearCache(res);

    res.render('adminlogin', { msg, isAdmin: true });
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
        req.session.id = loginvalue._id;
        return res.redirect('/admin/dashboard');
    }
});

router.get('/user', checkadminLogin, async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const perPage = 4;


    const totalUsers = await Users.countDocuments();


    const usersdata = await Users.find({})
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
        isAdmin: true
    });
    clearCache(res);
});

/* router.post('/user-search', checkadminLogin, async (req, res) => {
    const userdata = await getusersearch(req.body.search);
    clearCache(res);
     console.log("userdata", userdata);
    const arr = [];
    for (let i = 0; i < userdata.length; i++) {
        const o = userdata[i];
                const newO = {
            slno: i + 1,
            _id: o._id,
            name: o.name,
            email: o.email,
            status:o.status,
            username:o.username
        };
        arr.push(newO);
    }
    res.render('adminusers', { arr: arr, isAdmin: true })
})
 */
router.get('/add-category', checkadminLogin, (req, res) => {
    const msg = req.session.message;
    req.session.message = "";
    // console.log("msg", msg);
    return res.render('addcategory', { isAdmin: true, msg: msg })
});

router.post('/add-categorysubmit', async (req, res) => {

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
        isdeleted: false
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
    return res.render('addbrand', { isAdmin: true, msg: msg })
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
        isdeleted: false
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

    return res.render('addproduct', { arr: data, arr2: info, sizeArr: sizeArr, msg: msg, colorArr: colorArr, isAdmin: true })
});

router.post('/add-productsubmit', upload.single('image'), async (req, res) => {
    // console.log(req.body);
    let sizearr = req.body.size;
    if (!Array.isArray(req.body.size)) {
        sizearr = [req.body.size];
    }
    let colorarr = req.body.color;
    if (!Array.isArray(req.body.color)) {
        colorarr = [req.body.color];
    }

    if (req.body.productName === "") {
        req.session.message = "Product name is empty";
        return res.redirect("/admin/add-product")
    }
    if (req.body.brand === "") {
        req.session.message = "Product brand is empty";
        return res.redirect("/admin/add-product")
    }
    if (req.body.price === "") {
        req.session.message = "Product price is empty";
        return res.redirect("/admin/add-product")
    }
    if (req.body.description === "") {
        req.session.message = "Product description is empty";
        return res.redirect("/admin/add-product")
    }
    if (req.body.category === "") {
        req.session.message = "Product category is empty";
        return res.redirect("/admin/add-product")
    }
    if (req.body.size === "") {
        req.session.message = "Product size is empty";
        return res.redirect("/admin/add-product")
    }
    if (req.body.color === "") {
        req.session.message = "Product color is empty";
        return res.redirect("/admin/add-product")
    }
    if (req.body.stock === "") {
        req.session.message = "Product stock is empty";
        return res.redirect("/admin/add-product")
    }
    if (req.body.image === "") {
        req.session.message = "Product image is empty";
        return res.redirect("/admin/add-product")
    }
    const obj = {
        name: req.body.productName,
        brand: req.body.brand,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        isdeleted: false,
        editUser: req.session.adminName,
        image: req.file ? req.file.filename : null,
        sizes_available: sizearr,
        colors_available: colorarr,
        stock: req.body.stock
    }
    console.log(obj);
    const data = await insertproduct(obj)
    // console.log(data);
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
  
    return res.render('editcategory', { category: data, msg:msg, isAdmin: true })
});

router.post('/edit-categorysubmit/:id', checkadminLogin, async (req, res) => {
    const val2 = req.params.id;


    let obj = {
        name: req.body.categoryName,
        description: req.body.description,
        editUser: req.session.adminName
    };
    // console.log(obj);
    const data = await editcategory(val2, obj);
    // console.log(data);
    res.redirect('/admin/category');
});

router.get('/edit-brand/:id', checkadminLogin, async (req, res) => {
    const val = req.params.id;
    const data = await getBrandDatabyId(val)
    // console.log("editbrand-data", data)
    return res.render('editbrand', { brand: data, isAdmin: true })
});
router.post('/edit-brandsubmit/:id', checkadminLogin, async (req, res) => {
    const val = req.params.id;
    let obj = {
        name: req.body.brandName,
        description: req.body.description,
        editUser: req.session.adminName
    };
    // console.log("ready to edit",obj);
    const data = await editbrand(val, obj);
    return res.redirect('/admin/brand')
});

router.get('/edit-product/:id', checkadminLogin, async (req, res) => {
    const val = req.params.id;
    const product = await getProductDatabyId(val)
    console.log(product);

    const categories = await getcategorydata();
    const newCategories = [];

    for (let i = 0; i < categories.length; i++) {
        let selectVal = "";
        if (product.category == categories[i]._id) {
            selectVal = "selected";
        }
        const obj = {
            _id: categories[i]._id,
            name: categories[i].name,
            selected: selectVal
        };
        newCategories.push(obj);
    }

    const brands = await getbranddata();
    const newbrands = [];

    for (let i = 0; i < brands.length; i++) {
        let selectVal = "";
        if (product.brand == brands[i]._id) {
            selectVal = "selected";
        }
        const obj = {
            _id: brands[i]._id,
            name: brands[i].name,
            selected: selectVal
        };
        newbrands.push(obj);
    }

    const sizeArr = [5, 6, 7, 8, 9, 10, 11, 12, 13];
    const newSizeArr = [];
    for (let i = 0; i < sizeArr.length; i++) {
        let selectVal = "";

        if (product.sizes_available.includes(sizeArr[i])) {
            selectVal = "selected";
        }

        const obj = {
            size: sizeArr[i],
            selected: selectVal
        }
        newSizeArr.push(obj);
    }

    const colorArr = ["Red", "Blue", "White", "Black"];
    const newColorArr = [];
    for (let i = 0; i < colorArr.length; i++) {
        let selectVal = "";

        if (product.colors_available.includes(colorArr[i])) {
            selectVal = "selected";
        }

        const obj = {
            color: colorArr[i],
            selected: selectVal
        }
        newColorArr.push(obj);
    }
    // console.log(newColorArr);
    return res.render('editproduct', { products: product, arr: newCategories, arr2: newbrands, newSizeArr: newSizeArr, newColorArr: newColorArr, isAdmin: true });
});


router.post('/edit-productsubmit/:id', checkadminLogin, upload.single('image'), async (req, res) => {
    const val2 = req.params.id;
    let sizearr = req.body.size;
    if (!Array.isArray(req.body.size)) {
        sizearr = [req.body.size];
    }
    let colorarr = req.body.color;
    if (!Array.isArray(req.body.color)) {
        colorarr = [req.body.color];
    }
    let obj = {
        name: req.body.productName,
        price: req.body.price,
        brand: req.body.brand,
        description: req.body.description,
        category: req.body.category,
        sizes_available: sizearr,
        colors_available: colorarr,
        editUser: req.session.adminName,
        image: req.file ? req.file.filename : null,
        stock: req.body.stock
    };

    // Handle new image upload
    if (req.file) {
        obj.image = req.file.filename;
    } else if (req.body.removeImage) {
        obj.image = null; // Clear the existing image
        // Optionally, delete the old image file from the server
    }

    const data = await editproduct(val2, obj);
    res.redirect('/admin/product');
});



router.get('/bantoggle/:id', async (req, res) => {
    const val = req.params.id;

    const info = await banusers(val);
    res.redirect('/admin/user')
});

router.get('/view-product/:id', async (req, res) => {
    const val = req.params.id;
    const product = await getProductDatabyId(val)
    console.log("product document:", product);
    const categories = await getcategorydata();
    let catName = "";
    for (let i = 0; i < categories.length; i++) {
        if (product.category == categories[i]._id) {
            catName = categories[i].name;
        }
    }
    let createdDate = "";
    if (product.createdAt) {
        const createdAtDateArr = product.createdAt.toISOString().split("T");
        createdDate = createdAtDateArr;
    }

    let updatedDate = "";
    if (product.updatedAt) {
        const updatedAtDateArr = product.updatedAt.toISOString().split("T");
        updatedDate = updatedAtDateArr;
    }

    const brands = await getbranddata();
    console.log("brands list", brands);
    let brandName = "";
    for (let i = 0; i < brands.length; i++) {
        if (product.brand == brands[i]._id) {
            brandName = brands[i].name;
        }
    }
    return res.render('adminProductview', { product: product, categoryName: catName, brandname: brandName, createdAtDate: createdDate[0], updatedAtDate: updatedDate[0], isAdmin: true });
});

function clearCache(res) {
    res.set('Cache-Control', 'no-store,no-cache,must-revalidate,private')
}

module.exports = router;
