const asyncHandler = require("express-async-handler");
const Note = require('../models/Note');
const User = require('../models/User');
const timeAgo = require('../utils/timeAgo')

exports.index = asyncHandler(async (req, res, next) => {
  const [
    notes,
    friends,
  ] = await Promise.all([
    Note.find().populate('author').sort({datePosted: 'desc'}).exec(),
    User.find({ _id: req.user }, 'friends').exec(),
  ]);
  res.render('index', { 
    user: req.user,
    notes: notes,
    friends: friends,
    formatDate: timeAgo,
  });
});
