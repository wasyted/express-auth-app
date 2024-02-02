var express = require('express')
var router = express.Router();
const noteController = require('../controllers/noteController');

router.get('/', noteController.index);
router.post('/', noteController.createNote);

module.exports = router