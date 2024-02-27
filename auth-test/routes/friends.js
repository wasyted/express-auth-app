var express = require('express')
var router = express.Router();
const friendsController = require('../controllers/friendsController')

router.get('/', friendsController.index);
router.post('/search', friendsController.search);

module.exports = router;
