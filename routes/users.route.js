var express = require('express')
var router = express.Router()

const controller = require('../controllers/users.controller')

const validate = require('../validates/users.validate')

router.get('/', controller.index)

router.get('/create', controller.create)

router.post('/create', validate.postCreate, controller.postCreate)

router.get('/:id/edit', controller.edit)

router.put('/update', controller.putUpdate)

router.get('/:id/delete', controller.delete)

module.exports = router;