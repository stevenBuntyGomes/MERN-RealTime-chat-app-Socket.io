const express = require('express');

const router = express.Router();
const {isAuthenticated} = require('../middlewares/authentication');
const {
    registerUser,
    authUser,
    myProfile,
    allUsers,
    logoutUser,
} = require('../controller/userController');

router.route('/login').post(authUser);
router.route('/signup').post(registerUser);
router.route('/me').get(isAuthenticated, myProfile);
router.route('/').get(isAuthenticated, allUsers);
router.route('/logout').get(isAuthenticated, logoutUser);

module.exports = router;