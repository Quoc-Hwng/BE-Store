const httpStatus = require('http-status')
const catchAsync = require('../../../utils/catch-async')
const { brandService } = require('../../services')
const { Brand } = require('../../models')

const addBrand = catchAsync(async (req, res, next) => {
    const product = await brandService.createBrand(req.body)
    res.status(httpStatus.CREATED).json({
        success: true,
        product: product
    });
})
const listBrand = catchAsync(async (req, res, next) => {
    const list = await brandService.view()
    res.status(httpStatus.OK).json({
        success: true,
        brands: list
    });
})
const search = catchAsync(async (req, res, next) => {
    const key = new RegExp(req.params.key)
    const list = await brandService.search(key)
    res.status(httpStatus.OK).json({
        success: true,
        brands: list
    });
})
const viewBrand = catchAsync(async (req, res, next) => {
    const brand = await Brand.findById(req.params.id)

        if(!brand){
            return res.status(500).json({
                success: false,
                message: 'No brands existed'
            });
        }
        res.json({
            success: true,
            brand: brand
        });
})
const exitBrand = catchAsync(async (req, res, next) => {
    const id = req.params.id
    const brand = await  brandService.updateBrand(id,req.body)
    res.status(httpStatus.OK).json({
        success: true,
        brand: brand
    });

})
const deleteBrand = catchAsync(async (req, res, next) => {
    Brand.findByIdAndRemove(req.params.id).then(brand=>{
        if(brand){
            return res.status(200).json({
                success: true,
                message: 'The brands is deleted!'
            });
        }else{
            return res.status(404).json({
                success: false,
                message: 'brands not Found'
            });
        }
    }).catch(error=>{
        return res.status(500).json({
            success: false,
            error: error
        });
    })
})
module.exports = {
    addBrand,
    listBrand,
    viewBrand,
    exitBrand,
    deleteBrand,
    search
}
