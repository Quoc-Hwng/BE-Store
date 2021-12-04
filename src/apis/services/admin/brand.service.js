const httpStatus = require('http-status')

const ApiError = require('../../../utils/api-error')
const { Brand } = require('../../models')

/**
 * Create a brand
 * *@param {string} id
 * @param {Object} brandBody
 * @returns {Promise<Brand>}
 */
const createBrand = async (brandBody) => {
    if (await Brand.isCodeTaken(brandBody.nameBrand)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Brand already taken')
    }
    return Brand.create(brandBody)
}
const view = async () => {
    const list = await Brand.find({state:"Đang kinh doanh"});
    if (list==0) {
        throw new ApiError(httpStatus.NOT_FOUND, 'No Brand')
    }
    return list
}
const search = async (key) => {
    const list = await Brand.find({$text: {$search: key}});
    if (list==0) {
        throw new ApiError(httpStatus.NOT_FOUND, 'No Brand')
    }
    return list
}
const updateBrand = async (id,productBody) => {
    const brand = await Brand.findById(id);
    if (!brand) {
        throw new ApiError(httpStatus.NOT_FOUND, 'No brand existed')
    }
    return brand.update(productBody)
}


module.exports = {
    createBrand,
    updateBrand,
    search,
    view

}
