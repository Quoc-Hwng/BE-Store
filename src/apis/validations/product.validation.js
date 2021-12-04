const Joi = require('joi')


const productSchema = {
    body: Joi.object().keys({
        productName: Joi.string().required(),
        productCode: Joi.string().required(),
        description: Joi.string().required(),
        brand: Joi.string().required(),
        size: Joi.number().required(),
        amount: Joi.number().required(),
        status: Joi.string().required(),
        selling: Joi.string().required(),
        gender: Joi.string().required(),
        productImg1: Joi.string(),
        productImg2: Joi.string(),
        productImg3: Joi.string(),
        colour: Joi.string().required(),
        price: Joi.number().required(),
        priceSale: Joi.number()
    }),
}
module.exports = {
    productSchema
}
