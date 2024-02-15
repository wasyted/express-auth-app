const asyncHandler = require("express-async-handler");
const User = require('../models/User');
const Note = require('../models/Note');
const timeAgo = require('../utils/formattedDate')

exports.showProfile = asyncHandler(async (req, res, next) => {
  const currentUrl = false;
  const userID = req.params.userID;
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
    currentUrl: currentUrl,
  });
});

// Function to handle friend requests
exports.manageFriendRequest = asyncHandler(async (req, res, next) => {
  const friendId = req.params.friendID;
  const userId = req.user._id;

  try {
    // Check if the user is trying to add themselves as a friend
    if (userId.equals(friendId)) {
      return res.status(400).json({ success: false, error: "Cannot add yourself as a friend" });
    }

    // Check if the friend request already exists
    const friend = await User.findById(friendId);

    if (friend.friends.requested.some(req => req.user.equals(userdId))) {
      return res.status(400).json({ success: false, error: "Friend request already sent" });
    }

    // Add friend request to the user's document
    await User.findByIdAndUpdate(
      friendId,
      { $push: { 'friends.requested': { user: userId } } },
      { new: true }
    );

    res.json({ success: true, message: "Friend request sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Function to accept friend requests
exports.acceptFriendRequest = asyncHandler(async (req, res, next) => {
  const friendId = req.params.friendID;
  const userId = req.user._id;

  // Check if the user is already accepted
  const user = await User.findById(userId);
  
  if (user.friends.accepted.some(req => req.user.equals(friendId))) {
    return res.status(400).json({ success: false, error: "Friend request already accepted" });
  }

  try {
    // Remove friend request from user's document and add to accepted friends
    await User.findByIdAndUpdate(
      userId,
      { 
        $pull: { 'friends.requested': { user: friendId } },
        $push: { 'friends.accepted': { user: friendId } }
      },
      { new: true }
    );

    // Update friend's document to add the user to accepted friends
    await User.findByIdAndUpdate(
      friendId,
      { $push: { 'friends.accepted': { user: userId } } },
      { new: true }
    );

    res.json({ success: true, message: "Friend request accepted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

exports.cancelFriendRequest = asyncHandler(async (req, res, next) => {
  const friendId = req.params.friendID;
  const userId = req.user._id;

  // Check if the the user is in friend's requested
  const friend = await User.findById(friendId);
  
  if (!friend.friends.requested.some(req => req.user.equals(userId))) {
    return res.status(400).json({ success: false, error: "Friend not found" });
  }

  try {
    // Update friend's document to remove the user from requested friends
    await User.findByIdAndUpdate(
      friendId,
      { 
        $pull: { 'friends.requested': { user: userId } },
      },
      { new: true }
    );

    res.json({ success: true, message: "Friend request cancelled" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

exports.removeFriend = asyncHandler(async (req, res, next) => {
  const friendId = req.params.friendID;
  const userId = req.user._id;

  // Check if the user is already accepted
  const user = await User.findById(userId);
  
  if (!user.friends.accepted.some(req => req.user.equals(friendId))) {
    return res.status(400).json({ success: false, error: "Friend not found" });
  }

  try {
    // Remove friend request from user's document and removed from accepted friends
    await User.findByIdAndUpdate(
      userId,
      { 
        $pull: { 'friends.accepted': { user: friendId } }
      },
      { new: true }
    );

    // Update friend's document to remove the user from accepted friends
    await User.findByIdAndUpdate(
      friendId,
      { 
        $pull: { 'friends.accepted': { user: userId } },
      },
      { new: true }
    );

    res.json({ success: true, message: "Friend removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});