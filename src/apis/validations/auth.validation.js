const Joi = require('joi')

const { password } = require('./customize.validation')

const loginSchema = {
    body: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
    }),
}

const logoutSchema = {
    body: Joi.object().keys({
        accessToken: Joi.string(),
        refreshToken: Joi.string(),
    }),
}

const registerSchema = {
    body: Joi.object().keys({
        displayName: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password),
    }),
}

module.exports = {
    loginSchema,
    logoutSchema,
    registerSchema,
}
