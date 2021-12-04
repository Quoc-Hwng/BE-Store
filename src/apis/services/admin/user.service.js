const httpStatus = require('http-status')

const ApiError = require('../../../utils/api-error')
const { User } = require('../../models')

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
    if (await User.isEmailTaken(userBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken')
    }
    return User.create(userBody)
}

const listuser = async (page,size) => {

    if(page){
        pages = parseInt(page);
        if(pages<1)
            pages = 1;

        sizes = parseInt(size);
        if(sizes<5)
            sizes = 5;
        var skips = (pages-1)*sizes;
        const listuser = await User.find({role:'customer'}).skip(skips).limit(sizes)
        return listuser
    }else{
        sizes = parseInt(size);
        if(sizes<5)
            sizes = 5;
        const listuser = await User.find({role:'customer'}).limit(sizes)
        return listuser
    }
}
const searchUser = async (key) => {
    const listUser = await User.find({$text: {$search: key } });
    return listUser
}

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
    return User.findOne({ email })
}

module.exports = {
    createUser,
    getUserByEmail,
    listuser,
    searchUser
}
