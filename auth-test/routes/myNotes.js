var express = require('express')
var router = express.Router();
const myNotesController = require('../controllers/myNotesController')

router.get('/', myNotesController.index);

module.exports = router;
