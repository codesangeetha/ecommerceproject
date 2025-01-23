const Products = require("../models/products.model");
const Category = require("../models/categories.model");
const Users = require("../models/users.model");
const Brand = require('../models/brands.model');
const Order = require("../models/order.model");

const { } = require('../helpers/functions');

exports.getOrders = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = 4;
    const { startDate, endDate } = req.query;

    let query = {};

    if (startDate) {
        query.createdAt = { ...query.createdAt, $gte: new Date(`${startDate}T00:00:00.000Z`) };
    }
    if (endDate) {
        query.createdAt = { ...query.createdAt, $lte: new Date(`${endDate}T23:59:59.999Z`) };
    }

    const totalOrders = await Order.countDocuments(query);

    const orderData = await Order.find(query)
        .populate('user', 'name email') // Populate user name and email
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

    const orders = orderData.map((o, index) => ({
        slno: (page - 1) * perPage + index + 1,
        _id: o._id,
        userName: o.user?.name || 'N/A',
        email: o.user?.email || 'N/A',
        totalAmount: o.totalAmount,
        paymentStatus: o.paymentDetails.paymentStatus || 'N/A',
        createdAt: o.createdAt,
    }));

    const totalPages = Math.ceil(totalOrders / perPage);

    res.render('adminorders', {
        orders,
        currentPage: page,
        totalPages,
        isAdmin: true,
        isadminlogin: req.session.isAdminLoggin,
        startDate: startDate || "",
        endDate: endDate || ""
    });
};

exports.viewOrders = async (req, res) => {
    const orderId = req.params.id;

    try {
        const order = await Order.findById(orderId)
            .populate('user', 'name email')
            .populate('cartDetails.product', 'name price image'); // Adjust based on your product schema

        res.render('partials/orderDetails', { layout: false, order });
    } catch (error) {
        res.status(500).send('<p class="text-danger">Failed to load order details.</p>');
    }
};