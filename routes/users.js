var express = require('express');
var router = express.Router();
const stripecontroller=require("../controller/stripe")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/payment',stripecontroller.payment)
router.get('/productview',stripecontroller.productView)
router.post('/productadd',stripecontroller.productAdd)
router.get('/productview',stripecontroller.productView)

module.exports = router;
