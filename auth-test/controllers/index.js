var express = require('express');
var router = express.Router();
const Note = require('../models/Note');

router.get('/', async function(req, res, next) {
  try {
    let notes = await Note.find().populate('author').exec();
    res.render('index', { title: 'Chat.app' , user: req.user , notes: notes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
