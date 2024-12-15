// controllers/cartController.js
const Cart = require('../models/cart.model');
const Product = require('../models/products.model');
const User = require('../models/users.model');
const updatecolorschema = require('../validators/updatecolor.schema');
const updatesizeschema = require('../validators/updatesize.schema');
const updatequantityschema = require('../validators/updatequantity.schema');


// Add product to cart
exports.addToCart = async (req, res) => {
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
};

// Get cart details for the logged-in user
exports.getCart = async (req, res) => {
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

};

// Update product quantity in the cart
exports.updateCartItem = async (req, res) => {
    
    const { error } = updatequantityschema.validate(req.body, { abortEarly: false });
    if (error) {
        const err = error.details.map((err) => err.message).join(', ');
        return res.status(500).json({ message: `Server Error ${err}` });
    }

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
        res.status(200).json({ message: 'Quantity updated successfully', qty: cart.products[productIndex].quantity });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Remove product from cart
exports.removeFromCart = async (req, res) => {
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


};

exports.updateSize = async (req, res) => {

    const { error } = updatesizeschema.validate(req.body, { abortEarly: false });
    if (error) {
        const err = error.details.map((err) => err.message).join(', ');
        return res.status(500).json({ message: `Server Error ${err}` });
    }

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
};

exports.updateColor=async (req, res) => {

    const { error } = updatecolorschema.validate(req.body, { abortEarly: false });
    if (error) {
        const err = error.details.map((err) => err.message).join(', ');
        return res.status(500).json({ message: `Server Error ${err}` });
    }

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

};
