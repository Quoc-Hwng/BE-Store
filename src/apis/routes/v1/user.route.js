const express = require('express')
const { authController, userController } = require('../../controllers')
const validate = require('../../../middlewares/validate')

const router = express.Router()

router.get('/', userController.listUser)
router.get('/:key', userController.search)


module.exports = router
