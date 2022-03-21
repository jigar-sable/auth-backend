const catchAsync = require('../middlewares/catchAsync');
const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const sendCookie = require('../utils/sendCookie');

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
