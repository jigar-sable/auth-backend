const catchAsync = require('../middlewares/catchAsync');
const User = require('../models/userModel');
const sendCookie = require('../utils/sendCookie');

exports.registerUser = catchAsync(async (req, res, next) => {

    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password
    });

    sendCookie(user, 201, res);
});