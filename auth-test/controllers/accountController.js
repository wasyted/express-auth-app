const asyncHandler = require("express-async-handler");
const express = require('express');
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