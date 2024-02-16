const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  const currentUrl = '/friends';
  res.render('my-friends', { 
    user: req.user ,
    currentUrl: currentUrl,
    notifications: req.notifications,
})});
