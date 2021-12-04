const { number, string } = require('joi')
const mongoose = require('mongoose')
const validator = require('validator')

const { toJSON, paginate } = require('./plugins')

const productSchema = mongoose.Schema(
    {
        productName: {
            type: String,
            required: true,
            trim: true,
        },
        productCode: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        brand: {
            type: String,
            required: true,
            trim: true
        },
        size: {
            type: Number,
            required: true,
            trim: true
        },
        amount: {
            type: Number,
            required: true,
            trim: true
        },
        productImg1:
            {
                type: Array,
                trim: true
            }
        ,
        productImg2: {
            type: String,
            trim: true
        },
        productImg3: {
            type: String,
            trim: true
        },
        status: {
            type: String,
            required: true,
            trim: true
        },
        selling: {
            type: String,
            required: true,
            trim: true
        },
        colour: {
            type: String,
            required: true,
            trim: true
        },
        gender: {
            type: String,
            required: true,
            trim: true
        },
        price: {
            type: Number,
            required: true,
            trim: true
        },
        priceSale: {
            type: Number,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true,
    }
)

productSchema.plugin(toJSON)
productSchema.plugin(paginate)
productSchema.index({'$**': 'text'});

/**
 * Check if product is taken
 * @param {string} productCode
 * @param {ObjectId} [excludeProductId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
 productSchema.statics.isCodeTaken = async function (productCode, excludeProductId) {
    const product = await this.findOne({ productCode, _id: { $ne: excludeProductId } })
    return !!product
}

/**
 * @typedef Product
 */
const Product = mongoose.model('Product', productSchema)

module.exports = Product
