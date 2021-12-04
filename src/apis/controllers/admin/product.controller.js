const httpStatus = require('http-status')
const catchAsync = require('../../../utils/catch-async')
const { productService } = require('../../services')
const { Product } = require('../../models')
const { string } = require('joi')
const APIFeatures = require('../../../utils/api-feature')

const addProduct = catchAsync(async (req, res, next) => {
    const product = await productService.createProduct(req.body)
    res.status(httpStatus.CREATED).json({
        success: true,
        product: product
    });
})
const listProduct = catchAsync(async (req, res, next) => {
     const lengthOrigin = (await Product.find()).length;

    //executing query
		const features = new APIFeatures(
			Product.find(),
			req.query,
			lengthOrigin
		).filter()
			.paginate();
		// const docs = await features.mongooseQuery.explain();
		const docs = await features.mongooseQuery;

		//Send response
		res.status(200).json({
			status: 'success',
			results: docs.length,
			data: {
				data: docs,
			},
		});
})
const searchProduct = catchAsync(async (req, res, next) => {
    const key = new RegExp(req.params.key)
    const productList = await productService.searchProduct(key)
    res.status(httpStatus.OK).json({
        success: true,
        product: productList
    });
})
const filterPrice = catchAsync(async (req, res, next) => {
    const min = req.params.min
    const max = req.params.max
    const List = await productService.filterPrice(min,max)
    res.status(httpStatus.OK).json({
        success: true,
        product: List
    });
})
const viewProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    const productsSize = await Product.find({ productName: product.productName }).select('size');
    console.log('productsSize: ', productsSize)
    // let sizes = [];
    // productsSize.forEach(p => sizes.push(p.size));
        if(!product){
            return res.status(500).json({
                success: false,
                message: 'No product existed'
            });
        }
        res.json({
            success: true,
            product: product,
            productsSize: productsSize,
        });
})
const exitProduct = catchAsync(async (req, res, next) => {
    const id = req.params.id
    const product = await  productService.updateProduct(id,req.body)
    res.status(httpStatus.OK).json({
        success: true,
        product: product
    });
})
const deleteProduct = catchAsync(async (req, res) => {
    const id = req.params.id
    const product = await  productService.deleteProduct(id)
    res.status(httpStatus.OK).json({
        success: true,
        message: 'Product is delete'
    });
})
module.exports = {
    addProduct,
    listProduct,
    viewProduct,
    exitProduct,
    deleteProduct,
    searchProduct,
    filterPrice
}
