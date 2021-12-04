const express = require('express')

const authRoute = require('../routes/v1/auth.route')
const userRoute = require('../routes/v1/user.route')
const projectRoute = require('../routes/v1/product.route')
const brandRoute = require('../routes/v1/brand.route')
const newRoute = require('../routes/v1/new.route')
const cartRoute = require('../routes/v1/cart.route')

const router = express.Router()

const defaultRoutes = [
    {
        path: '/v1/auth',
        route: authRoute,
    },
    {
        path: '/v1/users',
        route: userRoute,
    },
    {
        path: '/v1/admin/product',
        route: projectRoute,
    },
    {
        path: '/v1/admin/brand',
        route: brandRoute,
    },
    {
        path: '/v1/admin/new',
        route: newRoute,
    },
    {
        path: '/v1/user/product',
        route: projectRoute,
    },
    {
        path: '/v1/cart',
        route: cartRoute,
    },
]

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route)

})

module.exports = router
