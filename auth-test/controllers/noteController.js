const asyncHandler = require("express-async-handler");
const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const User = require('../models/User');

exports.index = asyncHandler(async (req, res, next) => {
  res.render('create-note-form', { user: req.user });
});

exports.createNote = asyncHandler(async (req, res, next) => {

  // Check if the user is authenticated
  if (!req.isAuthenticated()) {
    return res.status(401).send('Unauthorized').redirect('../');
  }

  const date = Date.now();
  const now = new Date(date);
  
  // Create a new note with the authenticated user
  const publicNote = new Note({
    author: req.user._id, // Assuming the user's ID is stored in _id
    title: req.body.title,
    body: req.body.body,
    datePosted: now,
    public: true,
  });
  const privateNote = new Note({
    author: req.user._id, // Assuming the user's ID is stored in _id
    title: req.body.title,
    body: req.body.body,
    datePosted: now,
    public: req.body.public,
    addressee: req.body.addressee,
  });

  // Save the new note to the database
  if(req.body.public === true){
    const savedNote = await publicNote.save();
    const [ userAuthor ] = await Promise.all([
      User.findByIdAndUpdate(
        req.user,
        { $push: { postedNotes: savedNote._id } },
        { new: true }
      )
    ]);
  } else {
    const savedNote = await privateNote.save();
    const [ userAuthor ] = await Promise.all([
      User.findByIdAndUpdate(
        req.user,
        { $push: { postedNotes: savedNote._id } },
        { new: true }
      )
    ]);
  }

  // Handle the response, redirect, or send a success message
  res.redirect(201,'../');
});
