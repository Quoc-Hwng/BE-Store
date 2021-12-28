const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.model');
const catchAsync = require('../../../utils/catch-async');
const AppError = require('../../../utils/api-error');
const Email = require('../../../utils/email')

//create token for user signed up or logged in
const signToken = (id) => {
    return jwt.sign({ id }, process.env.PASSPORT_JWT, {
        expiresIn: process.env.PASSPORT_JWT_ACCESS_EXPIRED,
    });
};

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
}
//create send token
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    //hide password from output
    res.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    //const newUser = await User.create(req.body);
    //Use this to prevent users try to register as a admin in role
    try {

        const newUser = await User.create(req.body);

        const url = `Den trang chu ngay nhe!`;
        await new Email(newUser, url).sendWelcome();

        createSendToken(newUser, 201, res);
    } catch (err) {
        console.log(err);
    }
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    //1) check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    //2) check if user is exist and password is correct
    const user = await User.findOne({ email }).select('+password');
    //console.log(user);
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    //3) if exists, send jwt token back to the client
    createSendToken(user, 200, res);
});

exports.viewProfile = catchAsync(async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(500).json({
                success: false,
                message: 'employee not found'
            });
        }
        res.json({
            success: true,
            user: user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'employee not found',
            error: error
        })
    }
})
exports.protect = catchAsync(async (req, res, next) => {
    try {
        let token;
        //1) getting token and check of it's there
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(
                new AppError("You're not log in! Please log in to get access", 401)
            );
        }

        //2) verification token
        const jwtDecoded = await promisify(jwt.verify)(
            token,
            process.env.PASSPORT_JWT
        );

        //3) check if user exists
        const currentUser = await User.findById(jwtDecoded.id);
        if (!currentUser) {
            return next(
                new AppError(
                    'The user does no longer exists. Please log in again',
                    401
                )
            );
        }

        //4) check if user has changed password after token was issued
        // if (currentUser.changedPasswordAfter(jwtDecoded.iat)) {
        //     return next(
        //         new AppError('Password has recently changed! Please try agian', 401)
        //     );
        // }

        //grant access to protected routes
        req.user = currentUser;
        //console.log(currentUser);
        next();
    } catch (err) {
        console.log(err);
    }
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError('You have no permission to perform this task!')
            );
        }

        next();
    };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new AppError('There is no user with this email', 404));
    }

    // 2) generate the random reset token
    const resetToken = user.createResetPasswordToken();
    //await user.save({ validateBeforeSave: false });
    await user.save();

    // 3) send it to user's email
    try {
        //const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/user/resetPassword/${resetToken}`;
        const resetURL = `https://cnpmm-nhom11.herokuapp.com/resetpassword/${resetToken}`;
        await new Email(user, resetURL).sendPasswordReset();

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email',
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        console.log(err);

        return next(
            new AppError('There was and error sending the email. Try again!'),
            500
        );
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) get the user via reset token
    const hashToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    // 2) check if token hasn't expired yet and user exists, then do the reset password functionality
    if (!user) {
        return next(
            new AppError('There is invalid token or token is expired', 400)
        );
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) update passwordChangedAt property for that user
    // already done in 'pre' method in userModel

    // 4) log user in, send jwt
    createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1) get user info from collection
    const user = await User.findById(req.user.id).select('+password');
    // 2) compare the POSTed password with the actual one in db
    if (
        //!(await user.correctPassword(req.body.passwordCurrent, user.password))
        !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
        return next(new AppError('Incorrect password', 401));
    }
    // 3) if so, do the update password via POSTed body
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // 4) logging user in again, send back jwt
    createSendToken(user, 200, res);
});
exports.updateMe = catchAsync(async (req, res, next) => {

    // 1) Filtered out unwanted fields names that are not allowed to be updated
    try {
        const filteredBody = filterObj(req.body, 'displayName', 'phone', 'address');

        // 2) Update user document
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            filteredBody,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            status: 'success',
            data: {
                user: updatedUser,
            },
        });
    } catch (err) {
        console.error(err);
    }
});
