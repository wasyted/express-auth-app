const asyncHandler = require("express-async-handler");
const express = require('express');
const Note = require('../models/Note');
const User = require('../models/User');
const timeAgo = require('../utils/formattedDate');
const interaction = require('../api/interaction');

exports.createNoteForm = asyncHandler(async (req, res, next) => {
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
    comments: [],
    likes: [],
    favorites: [],
  });
  const privateNote = new Note({
    author: req.user._id, // Assuming the user's ID is stored in _id
    title: req.body.title,
    body: req.body.body,
    datePosted: now,
    public: req.body.public,
    addressee: req.body.addressee,
    comments: [],
    likes: [],
    favorites: [],
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

exports.viewNote = asyncHandler(async (req, res, next) => {
  const noteID = req.params.noteID;
  console.log(noteID)
  if (!req.isAuthenticated()) {
    return res.status(401).redirect('../');
  }
  const [ note ] = await Promise.all([Note.findById({ _id: noteID }).populate('author').exec()]);
  res.render('view-note', { user: req.user , note: note , formatDate: timeAgo , likeNote: interaction.likeNote });
});

exports.commentNote = asyncHandler(async (req, res, next) => {
  const noteId = req.params.noteID;
  const userId = req.user._id;
  console.log(noteId)
  console.log(userId)
  console.log(req.body.body)
  const [ newComment ] = await Promise.all([
    Note.findByIdAndUpdate(
      noteId,{ 
        $push: {
          comments: { 
            author: userId, 
            body: req.body.body,
          } 
        } 
      },
      { new: true }
    ).populate('comments.author')
  ]);
  res.redirect('back')
});