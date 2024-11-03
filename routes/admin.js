var express = require('express');
var router = express.Router();

router.get('/product',(req,res)=>{
res.render('adminproduct')
});

router.get('/category',(req,res)=>{
    res.render('admincategory')
    });

module.exports = router;