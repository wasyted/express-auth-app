var express = require('express')
var router = express.Router();
const noteController = require('../controllers/noteController');

router.get('/create-form', noteController.createNoteForm);
router.get('/:noteID', noteController.viewNote);
router.post('/:noteID/comment', noteController.commentNote);
router.post('/:noteID/like', noteController.likeNote);
router.post('/create', noteController.createNote);

module.exports = router