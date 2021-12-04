const httpStatus = require('http-status')
const catchAsync = require('../../../utils/catch-async')
const { cartService } = require('../../services')
const { Cart } = require('../../models')
const Email = require('../../../utils/email')

const addCart = catchAsync(async (req, res, next) => {
    try {
        const cart = await cartService.createCart(req.body)

        const url = `Gio hang cua ban!`;
        await new Email(cart, url).sendCartInfo();  //cart: id, user(id), phone, address, total, displayName, email, products[]

        res.status(httpStatus.CREATED).json({
            success: true,
            cart: cart
        });
    } catch (err) {
        console.log(err);
    }
})

const viewCart = catchAsync(async (req, res, next) => {
    const product = await Cart.findById(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'No cart existed'
        });
    }
    res.json({
        success: true,
        cart: product,
    });
})

const viewAllCart = catchAsync(async (req, res, next) => {
    try {
        const product = await cartService.viewAllCart();

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'No cart existed'
            });
        }
        res.json({
            success: true,
            carts: product,
        });
    } catch (err) {
        console.log(err);
    }
})

const updateCart = catchAsync(async (req, res, next) => {
    const id = req.params.id
    const cart = await cartService.updateCart(id, req.body)
    res.status(httpStatus.OK).json({
        success: true,
        cart: cart
    });
})

const deleteCart = catchAsync(async (req, res) => {
    const id = req.params.id
    const product = await cartService.deleteCart(id)
    res.status(httpStatus.OK).json({
        success: true,
        message: 'Cart is delete'
    });
})

module.exports = {
    addCart,
    viewCart,
    viewAllCart,
    updateCart,
    deleteCart,
}
