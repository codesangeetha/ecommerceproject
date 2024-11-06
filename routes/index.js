var express = require('express');
var router = express.Router();

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
  return res.render('login');
});

router.get('/signup', (req, res) => {
  return res.render('signup');
});
router.get('/checkout', (req, res) => {
  return res.render('checkout');
});
router.get('/payment', (req, res) => {
  return res.render('payment');
});

module.exports = router;
