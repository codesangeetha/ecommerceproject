var express = require('express');
const { getcategorydata, getproductsdata, getusersdata, insertcategory,insertproduct } = require('../helpers/functions');
var router = express.Router();

const checkadminLogin = (req, res, next) => {
    if (req.session.isLoggin && req.session.isLoggin == true) {
        console.log('hello')
        next();
    } else {
        console.log("god")
        res.redirect('/admin/login')
    }
}


router.get('/product', checkadminLogin, async (req, res) => {
    const productdata = await getproductsdata();
    console.log(productdata);
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

router.get('/add-category',checkadminLogin, (req, res) => {
    return res.render('addcategory')
});

router.post('/add-categorysubmit',async (req, res) => {
    const obj = {
        name: req.body.categoryName,
        description: req.body.description
    }
console.log(obj);
const data =await insertcategory(obj)
console.log(data);
return res.redirect('/admin/category');
})

router.get('/add-product',checkadminLogin, (req, res) => {
    return res.render('addproduct')
});

router.post('/add-productsubmit',async (req, res) => {
    const obj = {
        name: req.body.productName,
        description: req.body.description
    }
console.log(obj);
const data =await insertproduct(obj)
console.log(data);
return res.redirect('/admin/product');
})



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
module.exports = router;
