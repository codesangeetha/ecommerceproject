var express = require('express');
const bcrypt = require("bcrypt");
const { finduser, getproductsdata, getProductDatabyId } = require('../helpers/functions');
const { insertuser } = require('../helpers/functions');

const Cart = require("../models/cart.model");
const User = require("../models/users.model");

var router = express.Router();

const checkLogin = (req, res, next) => {
    if (req.session.isLoggin && req.session.isLoggin == true) {
        // console.log('hello')
        next();
    } else {
        res.redirect('/login')
    }
}


router.get('/',  async (req, res) => {
    const info = await getproductsdata();
    // console.log(info);

    const arr = [];
    for (let i = 0; i < info.length; i++) {
        const ob = info[i];
        const newName = ob.name.substring(0, 18);
        const newOb = {
            _id: ob._id,
            name: newName,
            description: ob.description,
            price: ob.price,
            image: ob.image
        };
        arr.push(newOb);
    }
    // console.log('new', arr)
    return res.render('index', { arr: arr, isLogin: req.session.isLoggin });
});

router.get('/product/:id',checkLogin, async (req, res) => {
    const val = req.params.id;
    const info = await getProductDatabyId(val);
    // console.log(info)
    return res.render('product', { product: info, isLogin: req.session.isLoggin });
});
router.get('/cart',checkLogin, async (req, res) => {
    const userId = req.session.userId; // Assuming user is logged in and session is set
    // if (!userId) return res.redirect('/login');

    try {
        const cart = await Cart.findOne({ user: userId }).populate('products.product');
        console.log('cart', cart);
        res.render('cart', { cart });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


router.post('/cart/add', async (req, res) => {
    console.log('body', req.body);
    const { productId, quantity } = req.body;
    const userId = req.session.userId;

    try {
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, products: [] });
        }

        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
        if (productIndex >= 0) {
            cart.products[productIndex].quantity += parseInt(quantity, 10);
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await cart.save();
        res.redirect('/cart'); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});




router.get('/login', (req, res) => {
    const msg = req.session.message;
    req.session.message = "";
    return res.render('login', { msg });
});

router.post("/loginsubmit", async (req, res) => {
    
    // console.log(req.body);
    const loginvalue = await finduser(req.body.username, req.body.password);
    console.log(loginvalue);
    if (loginvalue == null) {
        req.session.message = "Invalid username/password";
        return res.redirect('/login');
    } else {
        req.session.isLoggin = true;
        req.session.name = req.body.username;
        req.session.userId = loginvalue._id;
        // console.log("loginvalue",req.session.userId)

        return res.redirect('/');
    }
});



router.get('/signup', (req, res) => {
    return res.render('signup');
});

router.post("/signupsubmit", async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const obj2 = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        status: true
    }
    console.log(obj2);
    const data = await insertuser(obj2);
    req.session.message = "Successfully signed up";
    return res.redirect('/login');
});

router.get('/checkout', checkLogin, async (req, res) => {
    const userId = req.session.userId;

    try {
        const cart = await Cart.findOne({ user: userId }).populate('products.product');
        const user = await User.findById(userId);

        res.render('checkout', { cart, user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.post('/checkout', checkLogin, async (req, res) => {
    const { fullname, address, city, state, pincode, email } = req.body;
    const userId = req.session.userId;

    try {
        // Update user address
        await User.findByIdAndUpdate(userId, {
            address: { fullname, address, city, state, pincode }
        });

        // Clear the cart
        await Cart.findOneAndDelete({ user: userId });

        res.send('Order placed successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});



router.get('/payment', (req, res) => {
    return res.render('payment');
});


module.exports = router;
