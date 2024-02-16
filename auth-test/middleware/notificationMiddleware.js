const User = require('../models/User');
const express = require('express');
const router = express.Router();

const notificationMiddleware = async (req, res, next) => {
  try {
    if (req.user) {
      const userNotifications = await User.findById( req.user )
        .populate( 'notifications notifications.user' )
        .sort({ 'notifications.dateNotified': 1 }) // Sort notifications from newer to older
        .exec();
      req.notifications = userNotifications ? userNotifications.notifications : [];
      req.clearNotifications = async function(){
        console.log('xd hi')
        await User.findByIdAndUpdate(
          req.user,
          { notifications: [] }, // Set notifications array to an empty array
          { new: true }
        );
      };
    } else {
      req.notifications = [];
    };
    next();
  } catch (err) {
    next(err);
  }
};


module.exports = notificationMiddleware;
