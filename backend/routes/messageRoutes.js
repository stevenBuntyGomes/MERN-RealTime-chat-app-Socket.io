const express = require('express');
const router = express.Router();

const {
    sendMessage,
    allMessage,
} = require('../controller/messageController')
// authentication
const {isAuthenticated} = require('../middlewares/authentication');

router.route('/').post(isAuthenticated, sendMessage);
router.route('/:chatId').get(isAuthenticated, allMessage);




module.exports = router;