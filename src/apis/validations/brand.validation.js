const Joi = require('joi')


const brandSchema = {
    body: Joi.object().keys({
        codeBrand: Joi.string().required(),
        nameBrand: Joi.string().required(),
        description: Joi.string().required(),
        imgs: Joi.string().required(),
        state: Joi.string().required()

    })
}
module.exports = {
    brandSchema
}
