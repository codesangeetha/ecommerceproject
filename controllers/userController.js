const Cart = require('../models/cart.model');
const Product = require('../models/products.model');
const User = require('../models/users.model');


exports.signupget = (req, res) => {
    const msg = req.session.message;
    req.session.message = "";
    return res.render('signup', { msg });
};

exports.signupSubmit= async (req, res) => {
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