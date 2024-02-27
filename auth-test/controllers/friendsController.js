const asyncHandler = require("express-async-handler");
const timeAgo = require('../utils/timeAgo')
const Note = require('../models/Note')
const User = require('../models/User')

exports.index = asyncHandler(async (req, res, next) => {
  const currentUrl = '/friends';
  const notes = [];
  const users = [];
  res.render('my-friends', { 
    user: req.user ,
    currentUrl: currentUrl,
    notifications: req.notifications,
    clearNotifications: req.clearNotifications,
    formatDate: timeAgo,
    searchResults: { notes, users }, // Pass the search results to the view
})});

exports.search = asyncHandler(async (req, res, next) => {
  const currentUrl = '/friends';
  const searchBody = req.body.searchBody; // Retrieve the search term from the request body

  const [
    notes,
    users,
  ] = await Promise.all([
    Note.find({ 'author.username': searchBody }) // Corrected query syntax
      .populate('author')
      .sort({ datePosted: -1 }) // Corrected sorting syntax
      .exec(),
    User.find({ username: searchBody })
      .sort({ notesPosted: -1 }) // Corrected sorting syntax
      .exec()
  ]);

  res.render('my-friends', { // Render your view with the search results
    user: req.user,
    currentUrl: currentUrl,
    notifications: req.notifications,
    clearNotifications: req.clearNotifications,
    formatDate: timeAgo,
    searchResults: { notes, users }, // Pass the search results to the view
  }).status(200);
});
