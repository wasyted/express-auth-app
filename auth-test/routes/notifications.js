const express = require('express');
const accountController = require('../controllers/accountController');

const router = express.Router();

router.post('/', accountController.clearNotifications);

module.exports = router;