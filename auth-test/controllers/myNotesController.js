const asyncHandler = require("express-async-handler");
const Note = require('../models/Note');
const timeAgo = require('../utils/timeAgo')

exports.index = asyncHandler(async (req, res, next) => {
  const [
    notes,
  ] = await Promise.all([
    Note.find({author: req.user }).populate('author').exec(),
  ]);
  res.render('my-notes', { 
    user: req.user, 
    notes: notes,
    formatDate: timeAgo,
  });
});