const User = require('../models/User');
const express = require('express');
const router = express.Router();

const notificationMiddleware = async (req, res, next) => {
  try {
    if (req.user) {
      const userNotifications = await User.findById(req.user)
        .select('notifications') // Only include notifications field
        .populate({
          path: 'notifications',
          populate: { path: 'user' }, // Populate notifications.user
        })
        .exec();
      req.notifications = userNotifications ? userNotifications.notifications : [];
      req.clearNotifications = async function () {
        await User.findByIdAndUpdate(
          req.user,
          { notifications: [] }, // Set notifications array to an empty array
          { new: true }
        );
      };
    } else {
      req.notifications = [];
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = notificationMiddleware;
