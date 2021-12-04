const { number } = require('joi')
const mongoose = require('mongoose')
const validator = require('validator')

const { toJSON, paginate } = require('./plugins')

const brandSchema = mongoose.Schema(
    {
        codeBrand: {
            type: String,
            required: true,
            trim: true,
        },
        nameBrand: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        imgs: {
            type: String,
            required: true,
            trim: true
        },
        state: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true,
    }
)

brandSchema.plugin(toJSON)
brandSchema.plugin(paginate)
brandSchema.index({'$**': 'text'});

/**
 * Check if brand is taken
 * @param {string} codeBrand
 * @param {ObjectId} [excludeBrandId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
 brandSchema.statics.isCodeTaken = async function (codeBrand, excludeBrandId) {
    const brand = await this.findOne({ codeBrand, _id: { $ne: excludeBrandId } })
    return !!brand
}
/**
 * @typedef Brand
 */
const Brand = mongoose.model('Brand', brandSchema)

module.exports = Brand
