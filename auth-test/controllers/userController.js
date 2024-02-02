const asyncHandler = require("express-async-handler");
const User = require('../models/User');
const timeAgo = require('../utils/formattedDate')

exports.showProfile = asyncHandler(async (req, res, next) => {
  const userID = req.params.userID;
  console.log(userID);
  const [
    userData,
  ] = await Promise.all([
    User.findOne({ _id: userID })
      .populate({
        path: 'postedNotes',
        populate: {
          path: 'author',
          model: 'User' 
        }
      })
      .exec()
    ]);
  res.render('profile', { 
    user: req.user, 
    userData: userData,
    formatDate: timeAgo,
  });
});
