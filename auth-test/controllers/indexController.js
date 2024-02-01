const asyncHandler = require("express-async-handler");
const Note = require('../models/Note');
const User = require('../models/User');
const formattedDate = require('../utils/formattedDate')

exports.index = asyncHandler(async (req, res, next) => {
  const [
    notes,
    friends,
  ] = await Promise.all([
    Note.find({}).populate('author').exec(),
    User.find({ _id: req.user }, 'friends').exec(),
  ]);
  res.render('index', { 
    title: 'Chat.app', 
    user: req.user, 
    notes: notes,
    friends: friends,
    formatDate: formattedDate,
  });
});
