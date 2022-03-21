const express = require('express');
const { registerUser, loginUser, logoutUser, getAccountDetails } = require('../controllers/userController');
const { isAuthenticated } = require('../middlewares/auth');

const router = express();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/me").get(isAuthenticated, getAccountDetails);

module.exports = router;