const express = require('express')
const { authController, newController } = require('../../controllers')
const { authValidation, newValidation } = require('../../validations')

const validate = require('../../../middlewares/validate')

const router = express.Router()

router.post('/add', validate(newValidation.newSchema), newController.addNew)
router.get('/', newController.listNew)
router.get('/:key', newController.search)
router.get('/edit/:id', newController.viewNew)
router.put('/edit/:id', newController.exitNew)
router.delete('/:id', newController.deleteNew)

module.exports = router
