var express = require('express');
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const { finduser, getproductsdata, getProductDatabyId, sendEmail } = require('../helpers/functions');
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


router.get('/', async (req, res) => {
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

router.get('/product/:id', checkLogin, async (req, res) => {
    const val = req.params.id;
    const info = await getProductDatabyId(val);
    // console.log(info)
    return res.render('product', { product: info, isLogin: req.session.isLoggin });
});


router.get('/cart', checkLogin, async (req, res) => {
    const userId = req.session.userId; // Assuming user is logged in and session is set
    // if (!userId) return res.redirect('/login');

    try {
        const cart = await Cart.findOne({ user: userId }).populate('products.product');
        //  console.log('cart', cart);
        res.render('cart', { cart });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


router.post('/cart/add', checkLogin, async (req, res) => {
    // console.log('body', req.body);
    const { productId, quantity, size, color } = req.body;
    const userId = req.session.userId;

    try {
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, products: [] });
        }
        console.log(cart);
        const productIndex = cart.products.findIndex(p => {
            return p.product.toString() === productId && p.size === size && p.color === color;
        });
        if (productIndex >= 0) {
            cart.products[productIndex].quantity += parseInt(quantity, 10);
        } else {
            cart.products.push({ product: productId, quantity, color, size });
        }

        await cart.save();
        res.redirect('/cart');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.get('/delete-cart/:id', checkLogin, async (req, res) => {
    const val = req.params.id;
    const userId = req.session.userId;
    //  console.log(val);
    let cart = await Cart.findOne({ user: userId })
    console.log(cart);
    let cartproducts = cart.products;
    console.log(cartproducts);

    const arr = [];
    for (let i = 0; i < cart.products.length; i++) {
        if (val !== cart.products[i]._id.toString()) {
            arr.push(cart.products[i]);
        }
    }
    cart.products = arr;
    await cart.save();
    return res.redirect('/cart');


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
    if (loginvalue.result == null) {
        req.session.message = loginvalue.msg;
        return res.redirect('/login');
    } if (loginvalue.status == false) {
        req.session.message = "You are disabled by admin";
        return res.redirect('/login');
    } else {
        req.session.isLoggin = true;
        req.session.name = req.body.username;
        req.session.userId = loginvalue.result._id;
        console.log("loginvalue", req.session.userId)

        return res.redirect('/');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send("Couldn't log out");
        }
        res.redirect('/');
    });
});


router.get('/signup', (req, res) => {
    const msg = req.session.message;
    req.session.message = "";
    return res.render('signup', { msg });
});

router.post("/signupsubmit", async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    if (req.body.name === "") {
        req.session.message = "Enter name";
        return res.redirect('/signup');
    }

    if (req.body.username === "") {
        req.session.message = "Enter username";
        return res.redirect('/signup');
    }
    if (req.body.email === "") {
        req.session.message = "Enter email";
        return res.redirect('/signup');
    }
    if (req.body.password === "") {
        req.session.message = "Enter password";
        return res.redirect('/signup');
    }
    console.log("req.body", req.body);
    const obj2 = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        status: true,
        address: {
            houseNo: req.body.houseNo,
            city: req.body.city,
            state: req.body.state,
            pincode: req.body.pincode,
        }
    }

    // console.log(obj2);
    const data = await insertuser(obj2);
    req.session.message = "Successfully signed up";
    return res.redirect('/login');
});

router.get('/checkout', checkLogin, async (req, res) => {
    const userId = req.session.userId;

    try {
        const cart = await Cart.findOne({ user: userId }).populate('products.product');
        const user = await User.findById(userId);

        console.log('cart', cart);
        console.log('prod', cart.products[0].product);

        let result = 0;
        for (let i = 0; i < cart.products.length; i++) {
            let sum = cart.products[i].product.price * cart.products[i].quantity;
            result = result + sum;
        }
        console.log("sum is", result);
        let total = result+100;

        res.render('checkout', { cart, user,result,total });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.post('/checkout-submit', checkLogin, async (req, res) => {
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

router.get('/forgot-password', (req, res) => {
    res.render('forgot-password');
});



router.post('/forgot-password-submit', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('User not found');
        }
        const token = crypto.randomBytes(32).toString('hex');

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetURL = `http://${req.headers.host}/reset-password/${token}`;
        const mailBody = `You are receiving this because you requested to reset your password.\n\n
    Please click on the following link, or paste it into your browser to complete the process:\n\n
    ${resetURL}\n\n
    If you did not request this, please ignore this email.\n`;

        await sendEmail(user.email, 'Password Reset', mailBody);

        res.send('Password reset email sent!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error occurred');
    }
});

router.get('/reset-password/:token', async (req, res) => {
    const { token } = req.params;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).send('Password reset token is invalid or has expired.');
        }

        res.render('reset-password', { token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error occurred');
    }
});

router.post('/reset-password-submit/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).send('Password reset token is invalid or has expired.');
        }

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();
        res.send('Password has been reset successfully!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error occurred');
    }
});






module.exports = router;
