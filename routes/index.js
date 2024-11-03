var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/product',(req,res)=>{
 res.render('product');
});
router.get('/cart',(req,res)=>{
  res.render('cart');
 });
 router.get('/login',(req,res)=>{
  res.render('login');
 });
 router.get('/signup',(req,res)=>{
  res.render('signup');
 });
 router.get('/checkout',(req,res)=>{
  res.render('checkout');
 });
 router.get('/payment',(req,res)=>{
  res.render('payment');
 });
 
module.exports = router;
