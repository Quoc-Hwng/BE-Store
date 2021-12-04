const httpStatus = require('http-status')
const catchAsync = require('../../../utils/catch-async')
const { userService } = require('../../services')


const listUser = catchAsync(async (req, res, next) => {
    const page = req.query.page
    const size = req.query.size
    const listUser = await userService.listuser(page,size)
    res.status(httpStatus.OK).json({
        success: true,
        employee: listUser
    });
})
const search = catchAsync(async (req, res, next) => {
    const key = new RegExp(req.params.key)
    const List = await userService.searchUser(key)
    res.status(httpStatus.OK).json({
        success: true,
        employee: List
    });
})
module.exports = {
    listUser,
    search
}
