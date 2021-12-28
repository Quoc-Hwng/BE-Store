const httpStatus = require('http-status')
const catchAsync = require('../../../utils/catch-async')
const { cartService } = require('../../services')
const { Cart } = require('../../models')
const Email = require('../../../utils/email');
const APIFeatures = require('../../../utils/api-feature')
const paypal = require('paypal-rest-sdk')
const axios = require('axios')

const addCart = catchAsync(async (req, res, next) => {
    try {
        const cart = await cartService.createCart(req.body)

        const url = `http://localhost:4200/tracking`;
        await new Email(cart, url).sendCartInfo();  //cart: id, user(id), phone, address, total, displayName, email, products[]

        res.status(httpStatus.CREATED).json({
            success: true,
            cart: cart
        });
    } catch (err) {
        console.log(err);
    }
})

let convertedTotalPrice;
let cart = {};
paypal.configure({
    mode: 'sandbox',
    client_id:
        'AUwNSEfoyT3YmqhkANrcL9D_nJSh1I5ffjgTuG2mXBKdXOmSZcEFipOOJ9kBiC2Kwr7eU_TkiAyyzvYm',
    client_secret:
        'EE1fT0tZdKbdeszbMkCktS1IzsyuzDnM_nKdANNVlfJSRkiUid0c0A6WynGf_opw070XuJQLc3MbiZyO',
});
const addCartPayPal = catchAsync(async (req, res, next) => {
    try {
        cart = {};                                                      //đóng tạm thời
        cart = req.body;                                                //đóng tạm thời
        console.log('cart', cart);

        // Chuyển VND sang USD
        const exchangeUrl =
            'https://openexchangerates.org/api/latest.json?app_id=1660c56ea4cc47039bcd5513b6c43f1a';
        const asyncGetRates = async () => {
            const data = await axios.get(exchangeUrl);
            console.log(data.data.rates.VND);
            return data.data.rates.VND;
        };
        const exchangeRate = await asyncGetRates();
        console.log('check exchangeRate: ', exchangeRate);

        let items = [];
        for await (const prod of cart.products) {
            let product = await Product.findById(prod.product);
            items.push({
                name: product.productName,
                sku: product.id,
                price: Math.round(product.priceSale / exchangeRate),
                currency: 'USD',
                quantity: prod.quantity
            })
        }

        //items = [...productsInCart];
        console.log('items: ', items);

        convertedTotalPrice = 0;
        for (i = 0; i < items.length; i++) {
            convertedTotalPrice += parseFloat(items[i].price) * items[i].quantity;
        }
        console.log('convertedTotalPrice: ', convertedTotalPrice);

        // 4) tạo biến mẫu paypal để giao dịch có items, total là convertedItems, convertedTotalPrice đã tính ở trên
        var create_payment_json = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal',
            },
            redirect_urls: {
                return_url: `${req.protocol}://${req.get('host')}/api/v1/pay/success`,
                cancel_url: `${req.protocol}://${req.get('host')}/api/v1/pay/cancel`,
                // return_url: "https://desolate-dusk-27866.herokuapp.com/api/v1/cart/success",
                // cancel_url: "https://desolate-dusk-27866.herokuapp.com/api/v1/cart/cancel",
            },
            transactions: [
                {
                    item_list: {
                        items
                    },
                    amount: {
                        currency: "USD",
                        total: convertedTotalPrice,
                    },
                    description: 'Thanh toan don hang bang Papal o shop ban giay',
                },
            ],
        };

        // 5) chuyển đến trang giao dịch;
        paypal.payment.create(create_payment_json, (error, payment) => {
            console.log('check payment: ', payment);
            if (error) {
                console.log(error.response.details);
                //return next(new AppError('Something went wrong while paying', 400));
                return
                // res.render('cancel');
            } else {
                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === 'approval_url') {
                        // res.redirect(payment.links[i].href);    //

                        res.json({
                            forwardLink: payment.links[i].href,      //bỏ cmt
                        });
                    }
                }
                console.log('show payment: ', payment);
            }
        });

    } catch (err) {
        //console.log(err);
    }
})

const getSuccess = catchAsync(async (req, res) => {
    try {
        console.log('convertedTotalPrice (success): ', convertedTotalPrice);

        // 1) lấy thông tin thanh toán
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;

        const execute_payment_json = {
            payer_id: payerId,
            transactions: [
                {
                    amount: {
                        currency: 'USD',
                        total: convertedTotalPrice,
                    },
                },
            ],
        };

        // 2) thanh toán !
        paypal.payment.execute(
            paymentId,
            execute_payment_json,
            async function (error, payment) {
                if (error) {
                    res.render('cancel');
                } else {
                    console.log('Get payment response: ');
                    console.log(JSON.stringify(payment));

                    await cartUserService.createCart(cart, { method: 'paypal' })

                    res.render('success');
                }
            }
        );
    } catch (error) {
        console.log(error);
    }
})

const getCancel = catchAsync(async (req, res) => {
    res.send('Cancelled payment');
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
        const lengthOrigin = (await Cart.find()).length;

        //executing query
        const features = new APIFeatures(
            Cart.find(),
            req.query,
            lengthOrigin
        ).sort();
        // const docs = await features.mongooseQuery.explain();
        const docs = await features.mongooseQuery;
        // const product = await cartService.viewAllCart();

        // if (!product) {
        //     return res.status(404).json({
        //         success: false,
        //         message: 'No cart existed'
        //     });
        // }

        // res.json({
        //     success: true,
        //     carts: product,
        // });
        res.status(200).json({
            status: 'success',
            results: docs.length,
            carts: docs,
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
    addCartPayPal,
    getSuccess,
    getCancel,
    viewCart,
    viewAllCart,
    updateCart,
    deleteCart,
}
