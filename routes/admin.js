var express = require('express');
const multer = require('multer');
const { getcategorydata, getproductsdata, getusersdata, insertcategory, insertproduct, deletecategory, deleteproduct, getCategoryDatabyId,editcategory,getProductDatabyId, editproduct,banusers } = require('../helpers/functions');

var router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Set your desired upload directory
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + random() + "-" + file.originalname);
    }
  });

  function random(){
    return Math.floor(Math.random()+9000)+1000;
  }
  
const upload = multer({ storage: storage });


const checkadminLogin = (req, res, next) => {
    if (req.session.isLoggin && req.session.isLoggin == true) {
        console.log('hello')
        next();
    } else {
        // console.log("god")
        res.redirect('/admin/login')
    }
}


router.get('/product', checkadminLogin, async (req, res) => {
    const productdata = await getproductsdata();
    // console.log(productdata);
    res.render('adminproduct', { arr: productdata })
});


router.get('/category', checkadminLogin, async (req, res) => {
    console.log('hello');
    const categorydata = await getcategorydata();
    console.log(categorydata);
    res.render('admincategory', { arr: categorydata })
});

router.get('/login', (req, res) => {
    const msg = "";
    if (req.session.message) {
        const msg = req.session.message;
    }
    req.session.msg = "";
    res.render('adminlogin', { msg });
});

router.post('/adminloginsubmit', (req, res) => {
    if (req.body.username == "Manu" && req.body.password == "manupwd") {
        req.session.isLoggin = true;
        req.session.username = req.body.username;
        return res.redirect('/admin/category');
    } else {
        req.session.message = "Invalid username /password";
        return res.redirect('/admin/login');
    }
});

router.get('/user', checkadminLogin, async (req, res) => {
    const usersdata = await getusersdata();
     console.log(usersdata);

    res.render('adminusers', { arr: usersdata })
});

router.get('/add-category', checkadminLogin, (req, res) => {
    return res.render('addcategory')
});

router.post('/add-categorysubmit', async (req, res) => {
    const obj = {
        name: req.body.categoryName,
        description: req.body.description
    }
    console.log(obj);
    const data = await insertcategory(obj)
    // console.log(data);
    return res.redirect('/admin/category');
})

router.get('/add-product', checkadminLogin, (req, res) => {
    return res.render('addproduct')
});

router.post('/add-productsubmit', upload.single('image'), async (req, res) => {
    const obj = {
        name: req.body.productName,
        price: req.body.price,
        description: req.body.description,
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
        // Redirect to login page after session is destroyed
        res.redirect('/admin/login');
    });
});

router.get('/edit-category/:id',checkadminLogin, async (req, res) => {
    const val = req.params.id;
    const data = await getCategoryDatabyId(val)
    //  console.log(data);
    return res.render('editcategory',{category:data})
});

router.post('/edit-categorysubmit/:id',checkadminLogin,async(req,res)=>{
const val2 = req.params.id;
let obj = {
name: req.body.categoryName,
description : req.body.description
}
console.log(obj);
const data = await editcategory(val2,obj);
// console.log(data);
res.redirect('/admin/category');
});

router.get('/edit-product/:id',checkadminLogin, async (req, res) => {
    const val = req.params.id;
    const data = await getProductDatabyId(val)
    //  console.log(data);
    return res.render('editproduct',{products:data})
});

router.post('/edit-productsubmit/:id',checkadminLogin,upload.single('image'),async(req,res)=>{
    const val2 = req.params.id;
    let obj = {
    name: req.body.productName,
    price:req.body.price,
    description : req.body.description,
    image: req.file ? req.file.filename : null 
    }
    // console.log(obj);
    const data = await editproduct(val2,obj);
    //  console.log(data);
    res.redirect('/admin/product');
});

router.get('/bantoggle/:id',async(req,res)=>{
const val=req.params.id;
const info = await banusers(val);
res.redirect('/admin/user')
});

module.exports = router;
