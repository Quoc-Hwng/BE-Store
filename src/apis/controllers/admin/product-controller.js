const httpStatus = require('http-status')
const catchAsync = require('../../../utils/catch-async')
const { productService } = require('../../services/admin/product.service')
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

    // const productList = await Product.find()
    //     if(productList.length==0){
    //         return res.status(500).json({
    //             success: false,
    //             message: 'No employee existed'
    //         });
    //     }
    //     res.json({
    //         success: true,
    //         products: productList
    //     });
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
const deleteProduct = catchAsync(async (req, res, next) => {
    Product.findByIdAndRemove(req.params.id).then(product=>{
        if(product){
            return res.status(200).json({
                success: true,
                message: 'The product is deleted!'
            });
        }else{
            return res.status(404).json({
                success: false,
                message: 'product not Found'
            });
        }
    }).catch(error=>{
        return res.status(500).json({
            success: false,
            error: error
        });
    })
})

const filterProduct = catchAsync(async (req, res, next) => {
    console.log(req.body);
    productService.filterProduct(req.body.category, req.body.brand, req.body.priceMin, req.body.priceMax).then(products => {
        if(products){
            return res.status(200).json({
                success: true,
                message: 'The product is filtered',
                product: products
            });
        }else{
            return res.status(404).json({
                success: false,
                message: 'product not Found'
            });
        }
    }).catch(error=>{
        return res.status(500).json({
            success: false,
            error: error
        });
   
})
})

const searchProduct = catchAsync(async (req, res, next) => {
    productService.searchProduct(req.body.productName).then(products => {
        if (products) {
            return res.status(200).json({
                success: true,
                message: 'The product is searched',
                product: products
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'product not Found'
            });
        }
    }).catch(error => {
        return res.status(500).json({
            success: false,
            error: error
        });
    });
})
module.exports = {
    addProduct,
    listProduct,
    viewProduct,
    exitProduct,
    deleteProduct,
    filterProduct,
    searchProduct
}
