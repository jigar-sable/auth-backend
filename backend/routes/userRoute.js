const express = require('express');
const { registerUser, loginUser, logoutUser, getAccountDetails, forgotPassword, resetPassword } = require('../controllers/userController');
const { isAuthenticated } = require('../middlewares/auth');

const router = express();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/me").get(isAuthenticated, getAccountDetails);

router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);

module.exports = router;