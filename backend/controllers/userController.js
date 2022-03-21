const catchAsync = require('../middlewares/catchAsync');
const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const sendCookie = require('../utils/sendCookie');
const sendEmail = require('../utils/sendMail');
const crypto = require('crypto');

// Register User
exports.registerUser = catchAsync(async (req, res, next) => {

    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password
    });

    sendCookie(user, 201, res);
});

// Login User
exports.loginUser = catchAsync(async (req, res, next) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("User doesn't exist", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Password doesn't match", 401));
    }

    sendCookie(user, 200, res);
});

// Logout User
exports.logoutUser = catchAsync(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
});

// Get User Details --Logged In User
exports.getAccountDetails = catchAsync(async (req, res, next) => {

    const user = await User.findById(req.user._id);

    res.status(200).json({
        success: true,
        user,
    });
});

// Forgot Password
exports.forgotPassword = catchAsync(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User Not Found", 404));
    }

    const resetPasswordToken = await user.getResetPasswordToken()

    await user.save();

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetPasswordToken}`;

    const message = `Your password reset token is : \n\n ${resetPasswordUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Reset Password",
            message
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`,
        });

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500))
    }
});

// Reset Password
exports.resetPassword = catchAsync(async (req, res, next) => {

    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpiry: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorHandler("User Not Found", 404));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendCookie(user, 200, res);
});
