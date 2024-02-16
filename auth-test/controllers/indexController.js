const asyncHandler = require("express-async-handler");
const Note = require('../models/Note');
const User = require('../models/User');
const timeAgo = require('../utils/timeAgo')

exports.index = asyncHandler(async (req, res, next) => {
  const currentUrl = '/';
  const [
    notes,
    friends,
    recommendedUsers,
  ] = await Promise.all([
    Note.find().populate('author likes.author').sort({datePosted: 'desc'}).exec(),
    User.find({ _id: req.user }, 'friends').exec(),
    User.find({ _id: { $ne: req.user?._id } }).limit(4).sort({notesPosted: 'desc'}).exec(),
  ]);

  res.render('index', { 
    user: req.user,
    notes: notes,
    friends: friends,
    formatDate: timeAgo,
    currentUrl: currentUrl,
    recommendedUsers: recommendedUsers,
    req: req,
    notifications: req.notifications,
    clearNotifications: req.clearNotifications,
  });
});
