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
    getbranddata, insertbrand, getBrandDatabyId,editbrand, 
    deletebrand} = require('../helpers/functions');

var router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + random() + "-" + file.originalname);
    }
});

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
    const productdata = await getproductsdata();
    clearCache(res);
    // console.log(productdata);

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

    // console.log('new arr', arr);
    res.render('adminproduct', { arr: arr, isAdmin: true })
});

router.post('/product-search', checkadminLogin, async (req, res) => {
    const productdata = await getproductsearch(req.body.search);
    clearCache(res);
    console.log("productdata", productdata);
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
})


router.get('/category', checkadminLogin, async (req, res) => {
    const categorydata = await getcategorydata();
    console.log(categorydata);
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

router.post('/category-search', checkadminLogin, async (req, res) => {
    console.log("search form : ", req.body);
    // console.log('hello');
    const categorydata = await getcategorysearch(req.body.search);
    console.log("categorydata", categorydata);
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

router.get('/brand', async (req, res) => {
    const branddata = await getbranddata();
    console.log(branddata);
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
    return res.render('adminbrand', { arr: arr, isAdmin: true })
});

router.get('/login', (req, res) => {
    const msg = req.session.message;
    req.session.message = "";
    clearCache(res);

    res.render('adminlogin', { msg, isAdmin: true });
});

router.post('/adminloginsubmit', async (req, res) => {
    const loginvalue = await finduseradmin(req.body.username, req.body.password);
    console.log(loginvalue);
    if (loginvalue == null) {
        req.session.message = "Invalid username/password";
        return res.redirect('/admin/login');
    } else {
        req.session.isAdminLoggin = true;
        req.session.adminName = req.body.username;
        req.session.id = loginvalue._id;
        return res.redirect('/admin/category');
    }
});

router.get('/user', checkadminLogin, async (req, res) => {
    const usersdata = await getusersdata();
    console.log(usersdata);
    clearCache(res);
    const arr = [];
    for (let i = 0; i < usersdata.length; i++) {
        const o = usersdata[i];

        const newO = {
            slno: i + 1,
            _id: o._id,
            name: o.name,
            email: o.email,
            status: o.status
        };
        arr.push(newO);

    }
    console.log("newarr", arr);
    res.render('adminusers', { arr: arr, isAdmin: true })
});


/* router.get('/user', checkadminLogin, async (req, res) => {
    const usersdata = await getusersdata();
    console.log(usersdata);
    clearCache(res);
    const arr = [];
    for (let i = 0; i < usersdata.length; i++) {
        const o = usersdata[i];

        const newO = {
            slno: i + 1,
            _id: o._id,
            name: o.name,
            email: o.email,
            status: o.status
        };
        arr.push(newO);

    }
    console.log("newarr", arr);
    res.render('adminusers', { arr: arr, isAdmin: true })
}); */


router.get('/add-category', checkadminLogin, (req, res) => {
    return res.render('addcategory', { isAdmin: true })
});

router.post('/add-categorysubmit', async (req, res) => {
    const obj = {
        name: req.body.categoryName,
        description: req.body.description,
        isdeleted: false
    }
    // console.log(obj);
    const data = await insertcategory(obj)
    // console.log(data);
    return res.redirect('/admin/category');
});



router.get('/add-brand', (req, res) => {
    return res.render('addbrand', { isAdmin: true })
});

router.post('/add-brandsubmit', async (req, res) => {
    const obj = {
        name: req.body.brandName,
        description: req.body.description,
        isdeleted: false
    }
    console.log(obj);
    const data = await insertbrand(obj)
    return res.redirect('/admin/brand');
});



router.get('/add-product', checkadminLogin, async (req, res) => {
    const data = await getcategorydata();
    console.log(data);
    const info = await getbranddata();
    console.log("brand data",info);

    return res.render('addproduct', { arr: data,arr2:info, isAdmin: true })
});

router.post('/add-productsubmit', upload.single('image'), async (req, res) => {
    console.log(req.body);
    const obj = {
        name: req.body.productName,
        brand: req.body.brand,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        isdeleted: false,
        editUser: req.session.adminName,
        image: req.file ? req.file.filename : null
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

router.get('/deletebrand/:id',async(req,res)=>{
    const val = req.params.id;
    // console.log(val);
    const data = await  deletebrand(val);
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
    return res.render('editcategory', { category: data, isAdmin: true })
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

router.get('/edit-brand/:id',checkadminLogin, async (req, res) => {
    const val = req.params.id;
    const data = await getBrandDatabyId(val)
    // console.log("editbrand-data", data)
    return res.render('editbrand', { brand: data, isAdmin: true })
});
router.post('/edit-brandsubmit/:id',checkadminLogin,async(req, res) => {
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
    // console.log(product);

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

    //  console.log(newCategories);
    return res.render('editproduct', { products: product, arr: newCategories,arr2:newbrands, isAdmin: true });
});

router.post('/edit-productsubmit/:id', checkadminLogin, upload.single('image'), async (req, res) => {
    const val2 = req.params.id;
    let obj = {
        name: req.body.productName,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        editUser: req.session.adminName,
        image: req.file ? req.file.filename : null
    }
    console.log(obj);
    const data = await editproduct(val2, obj);
    //  console.log(data);
    res.redirect('/admin/product');
});


router.get('/bantoggle/:id', async (req, res) => {
    const val = req.params.id;

    const info = await banusers(val);
    res.redirect('/admin/user')
});


function clearCache(res) {
    res.set('Cache-Control', 'no-store,no-cache,must-revalidate,private')
}

module.exports = router;
