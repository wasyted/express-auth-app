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

exports.manageFriendRequest = asyncHandler(async (req, res, next) => {
  const friendId = req.params.friendId;
  const userId = req.user._id;

  // Check if the user is already friends with the target user
  const user = await User.findById(userId);
  const isFriend = user.friends.some(friend => friend.friend.equals(friendId));
  let actionTaken = '';

  if (isFriend) {
    // User is already friends with the target user, remove them as a friend
    await User.findByIdAndUpdate(
      userId,
      { $pull: { friends: { requested: {user: friendId} } } },
      { new: true }
    );
    actionTaken = 'removed';
  } else {
    // User is not friends with the target user, add them as a friend
    await User.findByIdAndUpdate(
      userId,
      { $pull: { friends: { requested: {user: friendId} } } },
      { new: true }
    );
    actionTaken = 'added';
  }

  res.json({ success: true, action: actionTaken });
});

exports.manageFriendResponse = asyncHandler(async (req, res, next) => {
  const friendId = req.params.friendId;
  const userId = req.user._id;

  // Check if the user is already friends with the target user
  const user = await User.findById(userId);
  const isFriend = user.friends.requested.some(friend => friend.friends.requested.equals(friendId));
  let actionTaken = '';

  if (isFriend) {
    // User is already friends with the target user, remove them as a friend
    await User.findByIdAndUpdate(
      userId,
      { $pull: { friends: { accepted: {user: friendId} } } },
      { new: true }
    );
    actionTaken = 'removed';
  } else {
    // User is not friends with the target user, add them as a friend
    await User.findByIdAndUpdate(
      userId,
      { $pull: { friends: { requested: {user: friendId} } } },
      { new: true }
    );
    await User.findByIdAndUpdate(
      userId,
      { $pull: { friends: { accepted: {user: friendId} } } },
      { new: true }
    );
    actionTaken = 'added';
  }

  res.json({ success: true, action: actionTaken });
});
