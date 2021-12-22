const express = require('express')
const { authController, cartController } = require('../../controllers')
const { authValidation } = require('../../validations')
const validate = require('../../../middlewares/validate')

const router = express.Router()

router.post('/add', cartController.addCart)
router.get('/', cartController.viewAllCart)
router.get('/:id', cartController.viewCart)
router.put('/edit/:id', cartController.updateCart)
router.delete('/:id', cartController.deleteCart)
router.post('/addPayPal', cartControllerUser.addCartPayPal)
router.get('/success', cartControllerUser.getSuccess);
router.get('/cancel', cartControllerUser.getCancel);


module.exports = router
