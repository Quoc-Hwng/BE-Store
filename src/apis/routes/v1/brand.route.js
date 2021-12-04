const express = require('express')
const { authController, brandController } = require('../../controllers')
const { authValidation, brandValidation } = require('../../validations')

const validate = require('../../../middlewares/validate')

const router = express.Router()

router.post('/add', validate(brandValidation.brandSchema), brandController.addBrand)
router.get('/', brandController.listBrand)
router.get('/:key', brandController.search)
router.get('/edit/:id', brandController.viewBrand)
router.put('/edit/:id', brandController.exitBrand)
router.delete('/:id', brandController.deleteBrand)

module.exports = router
