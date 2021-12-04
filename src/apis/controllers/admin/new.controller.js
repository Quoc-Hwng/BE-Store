const httpStatus = require('http-status')
const catchAsync = require('../../../utils/catch-async')
const { newService } = require('../../services')
const { New } = require('../../models')

const addNew = catchAsync(async (req, res) => {
    const news = await newService.createNew(req.body)
    res.status(httpStatus.CREATED).json({
        success: true,
        news: news
    });
})
const listNew = catchAsync(async (req, res) => {
    const list = await newService.view()
    res.status(httpStatus.OK).json({
        success: true,
        news: list
    });
})
const search = catchAsync(async (req, res, next) => {
    const key = new RegExp(req.params.key)
    const List = await newService.search(key)
    res.status(httpStatus.OK).json({
        success: true,
        news: List
    });
})
const viewNew = catchAsync(async (req, res, next) => {
    const news = await New.findById(req.params.id)

        if(!news){
            return res.status(500).json({
                success: false,
                message: 'No brands existed'
            });
        }
        res.json({
            success: true,
            news: news
        });
})

const exitNew = catchAsync(async (req, res) => {
    const id = req.params.id
    const news = await  newService.updateNew(id,req.body)
    res.status(httpStatus.OK).json({
        success: true,
        news: news
    });

})
const deleteNew = catchAsync(async (req, res, next) => {
    New.findByIdAndRemove(req.params.id).then(news=>{
        if(news){
            return res.status(200).json({
                success: true,
                message: 'The news is deleted!'
            });
        }else{
            return res.status(404).json({
                success: false,
                message: 'news not Found'
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
    addNew,
    listNew,
    viewNew,
    exitNew,
    deleteNew,
    search
}
