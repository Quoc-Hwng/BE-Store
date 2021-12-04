const Joi = require('joi')


const newSchema = {
    body: Joi.object().keys({
        codeTitle: Joi.string().required(),
        title: Joi.string().required(),
        description: Joi.string().required(),
        imgs: Joi.string().required(),
        starDay: Joi.date().required(),
        endDay: Joi.date().required(),
        state: Joi.string().required()

    })
}
module.exports = {
    newSchema
}
