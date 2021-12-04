const httpStatus = require('http-status')
const { date } = require('joi')
const { isDate } = require('moment')

const ApiError = require('../../../utils/api-error')
const { New } = require('../../models')

/**
 * Create a new
 * *@param {string} id
 * @param {Object} newBody
 * @returns {Promise<New>}
 */
const createNew = async (newBody) => {
    if (await New.isCodeTaken(newBody.codeTitle)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'News already taken')
    }
    return New.create(newBody)
}
const view = async () => {
    const listNew = await New.find({state: ["cho","dang"]});
    if (listNew==0) {
        throw new ApiError(httpStatus.NOT_FOUND, 'No News')
    }
    return listNew
}
const search = async (key) => {
    const listsearch = await New.find({$text: {$search: key}});
    if (listsearch==0) {
        throw new ApiError(httpStatus.NOT_FOUND, 'No News')
    }
    return listsearch
}
const updateNew = async (id,newBody) => {
    const news = await New.findById(id);
    if (!news) {
        throw new ApiError(httpStatus.NOT_FOUND, 'No news existed')
    }
    return news.update(newBody)
}
const deleteNew = async (id) => {
    const news = await New.findById(id);
    if (!news) {
        throw new ApiError(httpStatus.NOT_FOUND, 'No news existed')
    }
    return news.remove(newBody)
}


module.exports = {
    createNew,
    updateNew,
    deleteNew,
    view,
    search
}
