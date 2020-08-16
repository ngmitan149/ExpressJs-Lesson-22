var express = require('express')
var router = express.Router()
var multer  = require('multer')

const upload = multer({ dest: './public/uploads' })

const controller = require('../controllers/users.controller')

router.get('/', controller.profile)

router.get('/avatar', controller.avatar)

router.put('/update', controller.putClientUpdate)

router.put('/updateAvatar', upload.single('avatar'), controller.putAvatar)

module.exports = router;