const User = require('../models/User');

const notificationMiddleware = async (req, res, next) => {
  try {
    if (req.user) {
      const userNotifications = await User.findById( req.user )
        .populate( 'notifications notifications.user' )
        .sort({ 'notifications.dateNotified': 1 }) // Sort notifications from newer to older
        .exec();
      req.notifications = userNotifications ? userNotifications.notifications : [];
    } else {
      req.notifications = [];
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = notificationMiddleware;