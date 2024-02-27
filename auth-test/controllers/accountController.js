const asyncHandler = require("express-async-handler");
const express = require('express');
const User = require('../models/User')
const router = express.Router();
const passport = require("passport");

exports.loginForm = asyncHandler(async (req, res, next) => {
  const currentUrl = '/login-form';
  res.render('login-form', { 
    user: req.user ,
    currentUrl: currentUrl,
    req: req,
    invalidLogin: false,
})});

// exports.login = asyncHandler(async (req, res, next) => {
//   router.post(
//     '/',
//     passport.authenticate('local', {
//       successRedirect: '/',
//       failureRedirect: '/log-in?invalidLogin=true',
//     })
//   )
// });

exports.invalidLogin = asyncHandler(async (req, res, next) => {
  res.render('login-form', { 
    user: req.user ,
    currentUrl: currentUrl,
    req: req,
    invalidLogin: true,
})});

exports.clearNotifications = asyncHandler(async (req, res, next) => {
  try{
    if (req.user) {
      const [
        notifiedUser,
      ] = await Promise.all([
        User.findByIdAndUpdate(
          req.user,
          { notifications: [] }, // Set notifications array to an empty array
          { new: true }
        )
      ]);
      res.sendStatus(200); // Success response
    } else {
      res.sendStatus(401); // Unauthorized response
    }
  } catch (error) {
    console.error('Error marking all notifications as seen:', error);
    res.sendStatus(500); // Internal server error response
  }
});