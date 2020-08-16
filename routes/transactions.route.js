var express = require('express')
var router = express.Router()

const controller = require('../controllers/transactions.controller')

const validate = require('../validates/transactions.validate')

router.get('/', controller.index)

router.get('/create', controller.create)

router.post('/create', validate.postCreate ,controller.postCreate)

router.get('/:id/complete', validate.complete, controller.complete)

router.get('/:id/delete', controller.delete)

module.exports = router;