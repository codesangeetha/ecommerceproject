const Cart = require('../models/cart.model');
const Product = require('../models/products.model');
const User = require('../models/users.model');
const Order = require('../models/order.model');
const { Cashfree } = require("cashfree-pg");
const { sendSMS } = require('../helpers/functions');
const checkoutSchema = require('../validators/checkout.schema');


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

exports.paymentOrder=async (req, res) => {

    const { error } = checkoutSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const err = error.details.map((err) => err.message).join(', ');
        return res.status(500).json({ message: `Server Error ${err}` });
    }

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
};

exports.thankyoupage = async (req, res) => {
  const { order_id } = req.query;

  try {
    // Fetch the order by order ID
    const order = await Order.findOne({ orderId: order_id }).populate('cartDetails.product');
    if (!order) return res.status(404).send('Order not found');

    // Update payment status
    order.paymentDetails.paymentStatus = 'Success';
    await order.save();

    // Reduce stock for each product in the order
    const cartProducts = order.cartDetails;
    for (let item of cartProducts) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock -= item.quantity;
        if (product.stock < 0) {
          product.stock = 0; // Ensure stock doesn't go negative
        }
        await product.save();
      }
    }

    // Clear the user's cart
    await Cart.findOneAndDelete({ user: req.user._id });

    // Send SMS notification
    /* const phoneNumber = order?.address?.phone; 
    const message = `Thank you for your order! Your order ID is ${order.orderId}.`;
    await sendSMS(phoneNumber, message); */

    // Render thank you page with order details
    res.render('thankyou', { order, isLogin: req.isAuthenticated() });
  } catch (err) {
    console.error('Error in thankyoupage:', err);
    res.status(500).send('Error occurred');
  }
};
