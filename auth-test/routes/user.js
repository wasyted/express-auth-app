const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Add a route for user profiles
router.get('/:userID', userController.showProfile);
router.post('/:friendID/request', userController.manageFriendRequest);
router.post('/:friendID/accept', userController.acceptFriendRequest);
router.post('/:friendID/remove-friend', userController.removeFriend);
router.post('/:friendID/cancel-request', userController.cancelFriendRequest);

module.exports = router;