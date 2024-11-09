var express = require('express');
const { finduser } = require('../helpers/functions');
const { insertuser } = require('../helpers/functions');


var router = express.Router();

const checkLogin = (req, res, next) => {
  if (req.session.isLoggin && req.session.isLoggin == true) {
    console.log('hello')
    next();
  } else {
    res.redirect('/login')
  }
}


router.get('/', function (req, res, next) {
  return res.render('index');
});

router.get('/product', (req, res) => {
  return res.render('product');
});
router.get('/cart', (req, res) => {
  return res.render('cart');
});

router.get('/login', (req, res) => {
  const msg = req.session.message;
  req.session.message = "";
  return res.render('login', { msg });
});

router.post("/loginsubmit", async (req, res) => {
  console.log(req.body);
  const loginvalue = await finduser(req.body.username, req.body.password);
    console.log(loginvalue);
  if (loginvalue == null) {
    req.session.message = "Invalid username/password";
    return res.redirect('/login');
  } else {
    req.session.isLoggin = true;
    req.session.name = req.body.username;
    return res.redirect('/');
  }
});



router.get('/signup', (req, res) => {
  return res.render('signup');
});

router.post("/signupsubmit", async (req, res) => {
  const obj2 = {
    name: req.body.name,
    username:req.body.username,
    email: req.body.email,
    password: req.body.password,
    status:true
  }
  console.log(obj2);
  const data = await insertuser(obj2);
  req.session.message = "Successfully signed up";
  return res.redirect('/login');
});

router.get('/checkout', (req, res) => {
  return res.render('checkout');
});
router.get('/payment', (req, res) => {
  return res.render('payment');
});

module.exports = router;
