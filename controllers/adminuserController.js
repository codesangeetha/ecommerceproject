const Products = require("../models/products.model");
const Category = require("../models/categories.model");
const Users = require("../models/users.model");
const Brand = require('../models/brands.model');
const Order = require("../models/order.model");
const bcrypt = require("bcrypt");
const adminchangepasswordSchema = require('../validators/adminchangepassword.schema');

const { finduseradmin, banusers, updatePasswordByIdAdmin } = require('../helpers/functions');

exports.getLogin = (req, res) => {
    const msg = req.session.message;
    req.session.message = "";

    res.render('adminlogin', { msg, isAdmin: true, isadminlogin: req.session.admin == 'admin' });
};

/* exports.postAdminloginSubmit = async (req, res) => {
    const loginvalue = await finduseradmin(req.body.username, req.body.password);
    // console.log(loginvalue);
    if (loginvalue == null) {
        req.session.message = "Invalid username/password";
        return res.redirect('/admin/login');
    } else {
        req.session.isAdminLoggi1n = true;
        req.session.adminName = req.body.username;
        req.session.userid = loginvalue._id.toString();
        return res.redirect('/admin/dashboard');
    }
}; */

exports.getUser = async (req, res) => {

    // console.log("req.query",req.query)
    const page = parseInt(req.query.page) || 1;
    const perPage = 4;
    const { startDate, endDate } = req.query;

    let query = {};

    if (startDate) {
        query.createdAt = { ...query.createdAt, $gte: new Date(`${startDate}T00:00:00.000Z`) };
    }
    // console.log("startdate:",query);
    if (endDate) {
        query.createdAt = { ...query.createdAt, $lte: new Date(`${endDate}T23:59:59.999Z`) };
    }
    console.log("query :", query);

    const totalUsers = await Users.countDocuments(query);


    const usersdata = await Users.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

    const users = usersdata.map((o, index) => ({
        slno: (page - 1) * perPage + index + 1,
        _id: o._id,
        name: o.name,
        email: o.email,
        status: o.status

    }));
    // console.log("users",users)
    const totalPages = Math.ceil(totalUsers / perPage);

    res.render('adminusers', {
        arr: users,
        currentPage: page,
        totalPages,
        isAdmin: true, isadminlogin: req.session.admin == 'admin',
        startDate: startDate || "",
        endDate: endDate || ""
    });

};

exports.userSearch = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = 4;
    const searchQuery = req.body.search?.trim();

    let query = {};

    if (searchQuery) {
        query = {
            $or: [
                { name: { $regex: searchQuery, $options: "i" } },
                { email: { $regex: searchQuery, $options: "i" } },
                { username: { $regex: searchQuery, $options: "i" } }
            ]
        };
    }

    const totalUsers = await Users.countDocuments(query);

    // Fetch paginated results
    const userdata = await Users.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

    const users = userdata.map((o, index) => ({
        slno: (page - 1) * perPage + index + 1,
        _id: o._id,
        name: o.name,
        email: o.email,
        status: o.status,
        username: o.username
    }));

    const totalPages = Math.ceil(totalUsers / perPage);

    res.render('adminusers', {
        arr: users,
        currentPage: page,
        totalPages,
        isAdmin: true,
        isadminlogin: req.session.admin == 'admin',
        searchQuery // Pass the search query back to the view
    });
};

exports.getLogout = (req, res) => {
    /* req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send("Couldn't log out");
        }
        res.redirect('/admin/login');
    }); */

    req.logout((err) => {
        if (err) { return next(err); }
        res.clearCookie('admin-session-id'); // Clear the admin session cookie
        res.redirect('/admin/login');
      });
};

exports.getBantoggle = async (req, res) => {
    const val = req.params.id;

    const info = await banusers(val);
    res.redirect('/admin/user')
};

exports.adminChangePassword = (req, res) => {

    if (req.session.admin !== 'admin') {
        req.flash('error', 'Please log in to change your password.');
        return res.redirect('/admin/login');
    }
    res.render('adminchangepwd', { isAdmin: true, isadminlogin: req.session.admin == 'admin', });
};

exports.postAdminchangePassword = async (req, res) => {

    if (req.session.admin !== 'admin') return res.redirect('/admin/login');

    const { error } = adminchangepasswordSchema.validate(req.body, { abortEarly: false });
    if (error) {
        req.flash('error', error.details.map((err) => err.message).join(', '));
        return res.redirect('/admin/changepassword');
    }

    try {
        const { newPassword, confirmNewPassword } = req.body;
        const userId = req.session.adminUser._id;

        console.log('userId', userId);

        // Ensure user is logged in
        if (!userId) {
            req.flash('error', 'You must be logged in to change your password.');
            return res.redirect('/admin/login');
        }

        if (newPassword !== confirmNewPassword) {
            req.flash('error', 'New password and confirm password do not match.');
            return res.redirect('/admin/changepassword');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await updatePasswordByIdAdmin(userId, hashedPassword);

        req.flash('success', 'Password changed successfully.');
        return res.redirect('/admin/changepassword');
    } catch (error) {
        console.error('Error changing password:', error);
        req.flash('error', 'An error occurred. Please try again later.');
        return res.redirect('/admin/changepassword');
    }
};