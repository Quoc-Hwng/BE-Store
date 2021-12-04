const httpStatus = require('http-status')

const ApiError = require('../../../utils/api-error')
const { Product } = require('../../models')

/**
 * Create a product
 *@param {string} id
 * @param {Object} productBody
 * @returns {Promise<Product>}
 *
 */

const createProduct = async (productBody) => {
    if (await Product.isCodeTaken(productBody.productCode)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Product already taken')
    }
    return Product.create(productBody)
}
const listProduct = async (page,size) => {

    if(page){
        pages = parseInt(page);
        if(pages<1)
            pages = 1;

        sizes = parseInt(size);
        if(sizes<5)
            sizes = 5;
        var skips = (pages-1)*sizes;
        const listproduct = await Product.find().skip(skips).limit(sizes)
        return listproduct
    }else{
        sizes = parseInt(size);
        if(sizes<5)
            sizes = 5;
        const listproduct = await Product.find().limit(sizes)
        return listproduct
    }


}
const searchProduct = async (key) => {
    const listproduct = await Product.find({$text: {$search: key } });
    return listproduct
}
const filterPrice = async (min,max) => {
    const listPrice = await Product.find({price: { $gte: min, $lte: max }});
    return listPrice
}
const filterColor = async (min,max) => {
    const listPrice = await Product.find({price: { $gte: min, $lte: max } });
    return listPrice
}
const updateProduct = async (id,productBody) => {
    const product = await Product.findById(id);
    return product.update(productBody)
}
const deleteProduct = async (id,productBody) => {
    const product = await Product.findById(id);
    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'No Product deleted')
    }
    return product.remove(productBody)
}



module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    listProduct,
    searchProduct,
    filterPrice
}
