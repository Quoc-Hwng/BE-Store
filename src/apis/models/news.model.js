const { number, date } = require('joi')
const mongoose = require('mongoose')
const validator = require('validator')

const { toJSON, paginate } = require('./plugins')

const newSchema = mongoose.Schema(
    {
        codeTitle: {
            type: String,
            required: true,
            trim: true,
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        starDay: {
            type: Date,
            required: true,
            trim: true
        },
        endDay: {
            type: Date,
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

newSchema.plugin(toJSON)
newSchema.plugin(paginate)
newSchema.index({'$**': 'text'});

/**
 * Check if product is taken
 * @param {string} codeTitle
 * @param {ObjectId} [excludeNewId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
 newSchema.statics.isCodeTaken = async function (codeTitle, excludeNewId) {
    const news = await this.findOne({ codeTitle, _id: { $ne: excludeNewId } })
    return !!news
}

/**
 * @typedef New
 */
const New = mongoose.model('New', newSchema)

module.exports = New
