var express = require('express')
var router = express.Router();
const indexController = require('../controllers/indexController')

router.get('/', indexController.index);
router.get('/home', indexController.index);

module.exports = router;
