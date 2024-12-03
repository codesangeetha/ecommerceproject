const Cart = require('../models/cart.model');
const Product = require('../models/products.model');
const User = require('../models/users.model');
const crypto = require('crypto');
const bcrypt = require("bcrypt");
const { sendEmail } = require('../helpers/functions');


exports.signupget = (req, res) => {
    const msg = req.session.message;
    req.session.message = "";
    return res.render('signup', { msg });
};

exports.signupSubmit = async (req, res) => {
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
};

exports.forgotPassword = (req, res) => {
    res.render('forgot-password');
};
exports.forgotPasswordSubmit = async (req, res) => {
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
};
exports.resetPassword = async (req, res) => {
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
};
exports.resetPasswordSuccess = (req, res) => {
    return res.render('resetpwdsuccess')
};

exports.postresetPassword = async (req, res) => {
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
        res.status(500).render("resetpwdsuccess", { errorMessage: 'Error occurred' });
    }
};

exports.getProfile = async (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/login');

    try {
        const user = await User.findById(req.user._id); // Fetch the logged-in user's details
        res.render('profile', { user, isLogin: req.isAuthenticated() });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).send('An error occurred');
    }
};
exports.postProfile = async (req, res) => {
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
};

exports.getFavorites = async (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/login');

    try {
        const user = await User.findById(req.user._id).populate('favorites'); // Ensure 'favorites' is populated
        const favorites = user.favorites;
        res.render('favorites', { favorites });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).send('An error occurred');
    }
};