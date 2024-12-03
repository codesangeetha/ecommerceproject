var express = require('express');
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const { finduser, getproductsdata, getProductDatabyId, sendEmail } = require('../helpers/functions');
const { insertuser } = require('../helpers/functions');

const { getAllProducts, getProductById, addToFavorites, removeFromFavorites } = require('../controllers/productController');
const { addToCart, getCart, updateCartItem, removeFromCart, updateSize,updateColor } = require('../controllers/cartController');
const { signupget,signupSubmit } = require('../controllers/userController');
const { getCheckout,checkoutSubmit } = require('../controllers/checkoutController');

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


/* router.get('/', async (req, res) => {
    const searchQuery = req.query.q || ""; // Get search query from the URL
    const regex = new RegExp(searchQuery, 'i'); // Create a case-insensitive regex for the query
    const categoryFilter = req.query.category || undefined;

    const info = await getproductsdata(); // Fetch all product data
    console.log("info", info);
    console.log("categoryFilter", categoryFilter);
    let filteredInfo = info.filter(product => {
        return regex.test(product.name) || regex.test(product.description);
    });
    if (categoryFilter) {
        filteredInfo = filteredInfo.filter(product => {
            return categoryFilter.trim() === product.category.trim()
        });
    }

    const arr = [];
    for (let i = 0; i < filteredInfo.length; i++) {
        const ob = filteredInfo[i];
        const newName = ob.name.substring(0, 18);
        const newOb = {
            _id: ob._id,
            name: newName,
            description: ob.description,
            price: ob.price,
            image: ob.images[0]
        };
        arr.push(newOb);
    }

    return res.render('index', {
        arr: arr,
        isLogin: req.isAuthenticated(),
        searchQuery // Pass the search query back to the view for the input box
    });
}); */


/* router.get('/product/:id', checkLogin, async (req, res) => {
    const val = req.params.id;
    const info = await getProductDatabyId(val);
    const isFavorited = req.user && req.user.favorites.includes(val);

    return res.render('product', {
        product: info,
        isLogin: req.isAuthenticated(),
        isFavorited,
        productShareUrl: `http://localhost:3000/product/${val}`
    });
});

// Mark product as favorite
router.post('/product/:id/favorite', checkLogin, async (req, res) => {
    const userId = req.user._id; // Assuming `req.user` contains the logged-in user
    const productId = req.params.id;

    try {
        // Update the user's favorites list
        await User.findByIdAndUpdate(
            userId,
            { $addToSet: { favorites: productId } }, // Adds productId if not already present
            { new: true } // Return the updated document
        );

        // Update the product's `favoriteBy` list
        await Product.findByIdAndUpdate(
            productId,
            { $addToSet: { favoriteBy: userId } }, // Adds userId if not already present
            { new: true } // Return the updated document
        );

        res.json({ success: true, message: 'Product added to favorites!' });
    } catch (error) {
        console.error('Error adding to favorites:', error);
        res.status(500).json({ success: false, message: 'An error occurred while adding to favorites.' });
    }
});

// Unmark product as favorite
router.post('/product/:id/unfavorite', checkLogin, async (req, res) => {
    const userId = req.user._id; // Assuming `req.user` contains the logged-in user
    const productId = req.params.id;

    try {
        // Remove the product from the user's favorites list
        await User.findByIdAndUpdate(
            userId,
            { $pull: { favorites: productId } }, // Removes productId from favorites
            { new: true } // Return the updated document
        );

        // Remove the user from the product's `favoriteBy` list
        await Product.findByIdAndUpdate(
            productId,
            { $pull: { favoriteBy: userId } }, // Removes userId from favoriteBy
            { new: true } // Return the updated document
        );

        res.json({ success: true, message: 'Product removed from favorites!' });
    } catch (error) {
        console.error('Error removing from favorites:', error);
        res.status(500).json({ success: false, message: 'An error occurred while removing from favorites.' });
    }
});
 */


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

        /* res.send('Password reset email sent!'); */
        res.render('forgot-password', { successMessage: 'Password reset email sent!' });
    } catch (err) {
        console.error(err);
        /* res.status(500).send('Error occurred'); */
        res.render('forgot-password', { errorMessage: 'An error occurred. Please try again.' });
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
            
            res.render('reset-password', { infoMessage: 'Password reset token is invalid or has expired.' });
        }

        res.render('reset-password', { token });
    } catch (err) {
        console.error(err);
        res.render('reset-password', { errorMessage: 'An error occurred.' });
        
    }
});

router.get('reset-pwd-success',(req,res)=>{
    return res.render('resetpwdsuccess')
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
        /* res.send('Password has been reset successfully!'); */
        res.render('resetpwdsuccess')
    } catch (err) {
        console.error(err);
        res.status(500).render("resetpwdsuccess",{errorMessage:'Error occurred'});
    }
});



router.post('/payment/create-order', async (req, res) => {
    const { total, phone, email, name, houseNo, city, state, pincode } = req.body;
    console.log('Create order');
    try {

        Cashfree.XClientId = process.env.XCLIENTID;
        Cashfree.XClientSecret = process.env.XCLIENTSECRET;
        Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

        const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

        const userCart = await Cart.findOne({ user: req.user._id }).populate('products.product');
        if (!userCart) return res.status(400).send('Cart not found');


        const address = {
            fullname: name,
            houseNo: req.body.houseNo || "NA",
            city: req.body.city || "NA",
            state: req.body.state || "NA",
            pincode: req.body.pincode || "NA",
            phone: phone,
        };

        // Create order in database
        const newOrder = await Order.create({
            user: req.user._id,
            orderId,
            cartDetails: userCart.products,
            address,
            paymentDetails: { paymentStatus: 'Pending' },
            totalAmount: total,
        });

        var request = {
            "order_amount": parseInt(total),
            "order_currency": "INR",
            "order_id": orderId,
            "customer_details": {
                "customer_id": req.user._id.toString(),
                "customer_name": name,
                "customer_email": email,
                "customer_houseNo": houseNo,
                "customer_city": city,
                "customer_state": state,
                "customer_pincode": pincode,
                "customer_phone": phone.toString(),
            },
            "order_meta": {
                "return_url": `http://localhost:3000/payment/thankyou?order_id=${orderId}`,
            },
        };

        const response = await Cashfree.PGCreateOrder("2023-08-01", request);

        console.log('Order created successfully:', response.data);

        const res_obj = {
            msg: "Order created",
            payment_session_id: response.data.payment_session_id,
            order_id: orderId
        };
        res.json(res_obj);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error occurred');
    }
});

router.get('/thankyou', async (req, res) => {
    const { order_id } = req.query;

    try {
        // Fetch the order by order ID
        const order = await Order.findOne({ orderId: order_id }).populate('cartDetails.product');
        if (!order) return res.status(404).send('Order not found');

        // Update payment status
        order.paymentDetails.paymentStatus = 'Success';
        await order.save();

        // Clear the user's cart
        await Cart.findOneAndDelete({ user: req.user._id });

        // Render thank you page with order details
        res.render('thankyou', { order });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error occurred');
    }
});

// Profile Page
router.get('/profile', async (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/login');

    try {
        const user = await User.findById(req.user._id); // Fetch the logged-in user's details
        res.render('profile', { user, isLogin: req.isAuthenticated() });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).send('An error occurred');
    }
});

// Update Profile
router.post('/profile', async (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/login');

    const { houseNo, city, state, pincode, phone } = req.body;

    try {
        await User.findByIdAndUpdate(
            req.user._id,
            { address: { houseNo, city, state, pincode, phone } },
            { new: true }
        );
        res.redirect('/profile');
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).send('An error occurred');
    }
});


router.get('/favorites', async (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/login');

    try {
        const user = await User.findById(req.user._id).populate('favorites'); // Ensure 'favorites' is populated
        const favorites = user.favorites;
        res.render('favorites', { favorites });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).send('An error occurred');
    }
});


module.exports = router;
