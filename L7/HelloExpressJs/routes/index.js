var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('Nice to meet you');
  //send local vars to ejs template 
  res.locals.title = '[Hello Express JS]';
  res.locals.products = [
    {name: 'test1', price: 20},
    {name: 'test2', price: 320},
    {name: 'test3', price: 101},
  ];
  res.render('index');
});
module.exports = router;
