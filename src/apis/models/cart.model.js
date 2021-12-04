const { number, string } = require('joi')
const mongoose = require('mongoose')
const validator = require('validator')

const { toJSON, paginate } = require('./plugins')

const cartSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: false,
        },
        state: {
            type: String,
            default: 'unconfirmed',
            required: true,
        },
        products: [{
            product: {
                type: mongoose.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            }
        }],

        total: {
            type: Number,
            required: true,
        },
        displayName: {
            type: String,
        },
        email: {
            type: String
        },
        phone: {
            type: Number
        },
        address: {
            type: String
        },
        timeOrder: {
            type: Date,
            default: Date.now()
        }
    },
    {
        timestamps: true,
    }
)

cartSchema.plugin(toJSON)
cartSchema.index({ '$**': 'text' });

/**
 * @typedef Product
 */
const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart
