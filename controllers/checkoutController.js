const Cart = require('../models/cart.model');
const Product = require('../models/products.model');
const User = require('../models/users.model');


exports.getCheckout=async (req, res) => {
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
};

exports.checkoutSubmit=async (req, res) => {
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
};