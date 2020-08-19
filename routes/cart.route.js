var express = require('express')
var router = express.Router()

const controller = require('../controllers/cart.controller')

router.get('/', controller.index)

router.get('/add/:bookId', controller.addToCart)

router.post('/payment', controller.completePayment)

module.exports = router;