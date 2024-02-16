const express = require('express');
const accountController = require('../controllers/accountController');

const router = express.Router();

router.get('/', accountController.loginForm);
router.get('/log-in?invalidLogin=true', accountController.invalidLogin);
// router.post('/', accountController.login);

module.exports = router;
