var express = require('express')
var router = express.Router();
const noteController = require('../controllers/noteController');

router.get('/create-form', noteController.createNoteForm);
router.get('/:noteID', noteController.viewNote);
router.post('/:noteID/comment', noteController.commentNote);
router.post('/:noteID/like', noteController.likeNote);
router.post('/create', noteController.createNote);
router.get('/:noteID/edit', noteController.editNoteForm);
router.post('/:noteID/edit', noteController.editNote);
router.get('/:noteID/delete', noteController.deleteNoteForm);
router.post('/:noteID/delete', noteController.deleteNote);

module.exports = router