const asyncHandler = require("express-async-handler");
const User = require('../models/User');
const Note = require('../models/Note');
const timeAgo = require('../utils/formattedDate')

exports.showProfile = asyncHandler(async (req, res, next) => {
  const userID = req.params.userID;
  console.log(userID);
  const [
    userData,
    notes
  ] = await Promise.all([
    User.findOne({ _id: userID }).exec(),
    Note.find({ author: userID }).populate('author').sort({datePosted: 'desc'}).exec(),
    ]);
  res.render('profile', { 
    user: req.user, 
    userData: userData,
    notes: notes,
    formatDate: timeAgo,
  });
});
