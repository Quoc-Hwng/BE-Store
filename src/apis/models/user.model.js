const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const crypto = require('crypto')

const { toJSON, paginate } = require('./plugins')

const userSchema = mongoose.Schema(
    {
        displayName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid email')
                }
            },
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 6,
            validate(value) {
                if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                    throw new Error('Password must contain at least one letter and one number')
                }
            },
            private: true,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
           role: {
            type: String,
            enum: ['admin', 'customer'],
            default: 'customer'
        },
         phone: {
            type: Number,
            min: [9, 'Password must be valid']
        },
        address: {
            type: String,
            trim: true
        },
        passwordResetToken: String,
		passwordResetExpires: Date,
    },
    {
        timestamps: true,
    }
)

userSchema.plugin(toJSON)
userSchema.plugin(paginate)
userSchema.index({'$**': 'text'});

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } })
    return !!user
}

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
    const user = this
    return bcrypt.compare(password, user.password)
}

userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

//method to create reset password token
userSchema.methods.createResetPasswordToken = function () {
	const resetToken = crypto.randomBytes(32).toString('hex');

	this.passwordResetToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10)
    }
    next()
})

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema)

module.exports = User
