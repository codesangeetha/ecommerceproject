var express = require('express');
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const { finduser, getproductsdata, getProductDatabyId, sendEmail } = require('../helpers/functions');
const { insertuser } = require('../helpers/functions');

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
        next();
    } catch (error) {
        console.error('Error fetching categories:', error);
        next(error);
    }
});



/* 
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
    return res.render('index', { arr: arr, isLogin: req.isAuthenticated() });
}); */

router.get('/', async (req, res) => {
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
});

/* 
router.get('/', async (req, res) => {
    const searchQuery = req.query.q || ""; // Get search query from the URL
    const categoryFilter = req.query.category || null; // Get category ID from the query
    const regex = new RegExp(searchQuery, 'i'); // Create a case-insensitive regex for the query

    console.log("regex", regex);
    // Fetch products with filters
    const query = {
        isdeleted: false,
        status: true,
        $or: [{ name: { $regex: regex } }, { description: { $regex: regex } }]
    };
    if (categoryFilter) query.category = categoryFilter; // Add category filter if specified

    console.log("query", query);
    const products = await Product.find(query);

    // Process product data for the frontend
    const arr = products.map(product => ({
        _id: product._id,
        name: product.name.substring(0, 18),
        description: product.description,
        price: product.price,
        image: product.image,
    }));

    // Render home with filtered products
    res.render('index', { 
        arr: arr, 
        isLogin: req.isAuthenticated(), 
        searchQuery,
        selectedCategory: categoryFilter
    });
}); */





/* router.get('/product/:id', checkLogin, async (req, res) => {
    const val = req.params.id;
    const info = await getProductDatabyId(val);
    // console.log(info)
    return res.render('product', { product: info, isLogin: req.isAuthenticated(), productShareUrl: `http://localhost:3000/product/${val}` });
}); */

router.get('/product/:id', checkLogin, async (req, res) => {
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
    const userId = req.user._id; // Assuming req.user contains logged-in user
    const productId = req.params.id;

    await User.findByIdAndUpdate(userId, {
        $addToSet: { favorites: productId } // Adds if not already present
    });

    res.json({ success: true, message: 'Product added to favorites!' });
});

// Unmark product as favorite
router.post('/product/:id/unfavorite', checkLogin, async (req, res) => {
    const userId = req.user._id;
    const productId = req.params.id;

    await User.findByIdAndUpdate(userId, {
        $pull: { favorites: productId } // Removes from array
    });

    res.json({ success: true, message: 'Product removed from favorites!' });
});





router.get('/cart', checkLogin, async (req, res) => {
    const userId = req.user._id; // Assuming user is logged in and session is set
    // if (!userId) return res.redirect('/login');

    try {
        const cart = await Cart.findOne({ user: userId }).populate('products.product');
        console.log('cart', cart);
        res.render('cart', { cart, isLogin: req.isAuthenticated() });
        // console.log("product:",cart.products[0].product);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }

});


router.post('/cart/add', checkLogin, async (req, res) => {
    // console.log('body', req.body);
    console.log("userId", req.user);
    const { productId, quantity, size, color } = req.body;
    const userId = req.user._id;

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
    const userId = req.user._id;
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

router.post('/cart/update', checkLogin, async (req, res) => {
    const userId = req.user._id;
    const { productId, change } = req.body;

    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const productIndex = cart.products.findIndex((p) => {
            return p._id.toString() === productId;
        });
        if (productIndex >= 0) {
            cart.products[productIndex].quantity += change;

            // Prevent quantity from being less than 1
            if (cart.products[productIndex].quantity < 1) {
                cart.products.splice(productIndex, 1); // Remove product if quantity is 0
            }
        } else {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        await cart.save();
        res.status(200).json({ message: 'Quantity updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/cart/updatesize', checkLogin, async (req, res) => {
    const userId = req.user._id;
    const { productId, size } = req.body;

    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const productIndex = cart.products.findIndex((p) => {
            return p._id.toString() === productId;
        });
        if (productIndex >= 0) {
            cart.products[productIndex].size = size;

            if (cart.products[productIndex].size < 1) {
                cart.products.splice(productIndex, 1);
            }
        } else {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        await cart.save();
        res.status(200).json({ message: 'Size updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/cart/updatecolor', checkLogin, async (req, res) => {
    const userId = req.user._id;
    const { productId, color } = req.body;

    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const productIndex = cart.products.findIndex((p) => {
            return p._id.toString() === productId;
        });
        if (productIndex >= 0) {
            cart.products[productIndex].color = color.toString();

            if (cart.products[productIndex].color < 1) {
                cart.products.splice(productIndex, 1);
            }
        } else {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        await cart.save();
        res.status(200).json({ message: 'Color updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }

});

/* 
router.get('/login', (req, res) => {
    const msg = req.session.message;
    req.session.message = "";
    return res.render('login', { msg });
});

router.post("/loginsubmit", async (req, res) => {

    // console.log(req.body);
    const loginvalue = await finduser(req.body.username, req.body.password);
    console.log("loginvalue", loginvalue);
    if (loginvalue.result == null) {
        req.session.message = loginvalue.msg;
        return res.redirect('/login');
    } if (loginvalue.status == false) {
        req.session.message = "You are disabled by admin";
        return res.redirect('/login');
    } else {
        req.isAuthenticated() = true;
        req.session.name = req.body.username;
        req.user._id = loginvalue.result._id;
        console.log("loginvalue", req.user._id)

        return res.redirect('/');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send("Couldn't log out");
        }
        res.redirect('/login');
    });
});
 */

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
            phone: req.body.phone
        }
    }

    console.log("obj for no.", obj2);
    const data = await insertuser(obj2);
    req.session.message = "Successfully signed up";
    return res.redirect('/login');
});

router.get('/checkout', checkLogin, async (req, res) => {
    const userId = req.user._id;

    try {
        const cart = await Cart.findOne({ user: userId }).populate('products.product');
        const user = await User.findById(userId);
        console.log("user:", user)

        console.log('cart', cart);
        console.log('prod', cart.products[0].product);

        let result = 0;
        for (let i = 0; i < cart.products.length; i++) {
            let sum = cart.products[i].product.price * cart.products[i].quantity;
            result = result + sum;
        }
        // console.log("sum is", result);
        let total = result + 100;

        res.render('checkout', { cart, user, result, total, isLogin: req.isAuthenticated() });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.post('/checkout-submit', checkLogin, async (req, res) => {
    const { fullname, address, city, state, pincode, email, phone } = req.body;
    const userId = req.user._id;

    try {
        // Update user address
        await User.findByIdAndUpdate(userId, {
            address: { fullname, address, city, state, pincode, email, phone }
        });

        // Clear the cart
        await Cart.findOneAndDelete({ user: userId });

        res.send('Order placed successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
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


module.exports = router;
