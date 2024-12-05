var express = require('express');
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const { finduser, getproductsdata, getProductDatabyId, sendEmail } = require('../helpers/functions');
const { insertuser } = require('../helpers/functions');

const { getAllProducts, getProductById, addToFavorites, removeFromFavorites } = require('../controllers/productController');
const { addToCart, getCart, updateCartItem, removeFromCart, updateSize,updateColor } = require('../controllers/cartController');
const { signupget,signupSubmit,forgotPassword,forgotPasswordSubmit,resetPassword,resetPasswordSuccess,postresetPassword,getProfile,postProfile,getFavorites,getChangePassword, postChangepassword } = require('../controllers/userController');
const { getCheckout,checkoutSubmit,paymentOrder,thankyoupage } = require('../controllers/checkoutController');

const Cart = require("../models/cart.model");
const User = require("../models/users.model");
const Order = require("../models/order.model");
const Product = require("../models/products.model");
const { Cashfree } = require("cashfree-pg");
const Category = require('../models/categories.model');


var router = express.Router();

const checkLogin = (req, res, next) => {
    if (req.isAuthenticated() && req.isAuthenticated() == true) {
        // console.log('hello')
        next();
    } else {
        res.redirect('/login')
    }
}


router.use(async (req, res, next) => {
    try {
        const categories = await Category.find({ isdeleted: false, status: true }); // Fetch only active and undeleted categories
        res.locals.categories = categories; // Make categories available in Handlebars

        res.locals.username = req?.user?.name?.substring(0, 7) || "";
        next();
    } catch (error) {
        console.error('Error fetching categories:', error);
        next(error);
    }
});

router.use(async (req, res, next) => {
    try {
        let cartItems = "";
        if(req?.user?._id){
            const cart = await Cart.findOne({ user: req.user._id });
            if(cart){
                const count = cart.products.length;
                if(count>0){
                    cartItems = count == 1 ? "1 item" : `${count} items`;
                }
            }
        }
        res.locals.cartItems = cartItems;
        next();
    } catch (error) {
        console.error('Error fetching categories:', error);
        next(error);
    }
});

router.get('/', getAllProducts);

// Route to get a product by its ID
router.get('/product/:id', checkLogin, getProductById);

// Route to add a product to favorites
router.post('/product/:id/favorite', checkLogin, addToFavorites);

// Route to remove a product from favorites
router.post('/product/:id/unfavorite', checkLogin, removeFromFavorites);

router.get('/cart', checkLogin, getCart);

router.post('/cart/add', checkLogin, addToCart);

router.get('/delete-cart/:id', checkLogin, removeFromCart);

router.post('/cart/update', checkLogin, updateCartItem);

router.post('/cart/updatesize', checkLogin, updateSize);

router.post('/cart/updatecolor', checkLogin,updateColor );

router.get('/signup', signupget);

router.post("/signupsubmit",signupSubmit);

router.get('/checkout', checkLogin,getCheckout );

router.post('/checkout-submit', checkLogin, checkoutSubmit);

router.get('/forgot-password',forgotPassword);

router.post('/forgot-password-submit', forgotPasswordSubmit);

router.get('/reset-password/:token', resetPassword);

router.get('reset-pwd-success',resetPasswordSuccess);

router.post('/reset-password-submit/:token',postresetPassword );

router.post('/payment/create-order', paymentOrder);

router.get('/thankyou', thankyoupage);

// Profile Page
router.get('/profile', getProfile);

// Update Profile
router.post('/profile', postProfile);


router.get('/favorites', getFavorites);

router.get('/changepassword', getChangePassword);

router.post('/changepassword', postChangepassword);



module.exports = router;
