const asyncHandler = require("express-async-handler");
const Note = require('../models/Note');

exports.index = asyncHandler(async (req, res, next) => {
  const [
    notes,
  ] = await Promise.all([
    Note.find({author: req.user }).exec(),
  ]);
  res.render('my-notes', { 
    title: 'Chat.app', 
    user: req.user, 
    notes: notes,
  });
});