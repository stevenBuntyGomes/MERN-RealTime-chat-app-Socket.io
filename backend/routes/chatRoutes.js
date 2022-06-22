const express = require('express');
const router = express.Router();
// controller
const {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup,
} = require('../controller/chatController')
// authentication
const {isAuthenticated} = require('../middlewares/authentication');

router.route('/').post(isAuthenticated, accessChat).get(isAuthenticated, fetchChats);
router.route('/group').post(isAuthenticated, createGroupChat);
router.route('/rename').put(isAuthenticated, renameGroup);
router.route('/groupremove').put(isAuthenticated, removeFromGroup);
router.route('/groupadd').put(isAuthenticated, addToGroup);




module.exports = router;