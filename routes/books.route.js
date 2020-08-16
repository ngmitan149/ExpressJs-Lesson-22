var express = require('express')
var router = express.Router()
var multer  = require('multer')

const upload = multer({ dest: './public/uploads' })
const controller = require('../controllers/books.controller')

router.get('/', controller.indexClient)

router.get('/private', controller.index)

router.get('/private/create', controller.create)

router.post('/private/create', controller.postCreate)

router.get('/private/:id/edit', controller.edit)

router.put('/private/update', upload.array('images', 10), controller.putUpdate)

router.get('/private/:id/delete', controller.delete)

module.exports = router;