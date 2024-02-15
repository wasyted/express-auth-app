const asyncHandler = require("express-async-handler");
const express = require('express');
const Note = require('../models/Note');
const User = require('../models/User');
const timeAgo = require('../utils/formattedDate');
const interaction = require('../api/interaction');

exports.createNoteForm = asyncHandler(async (req, res, next) => {
  const currentUrl = '/note/create-form';
  const [
    userData,
  ] = await Promise.all([
    User.findOne({ _id: req.user }).populate('friends.accepted.user').exec(),
  ]);
  res.render('create-note-form', { user: req.user , userData: userData , currentUrl: currentUrl });
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
    edited: false,
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
    edited: false,
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
  // TO DO: error handling.
  // Handle the response, redirect, or send a success message
  res.redirect('/');
});

exports.viewNote = asyncHandler(async (req, res, next) => {
  const noteID = req.params.noteID;
  const currentUrl = '';
  if (!req.isAuthenticated()) {
    return res.status(401).redirect('../');
  }
  const [ note ] = await Promise.all([Note.findById({ _id: noteID }).populate('author comments.author likes.author').exec()]);
  res.render('view-note', { user: req.user , note: note , formatDate: timeAgo , likeNote: interaction.likeNote , currentUrl: currentUrl });
});

exports.commentNote = asyncHandler(async (req, res, next) => {
  const noteId = req.params.noteID;
  const userId = req.user._id;
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

exports.likeNote = asyncHandler(async (req, res, next) => {
  const noteId = req.params.noteID;
  const userId = req.user._id;

  // Check if the user has already liked the note
  const note = await Note.findById(noteId);
  const userLiked = note.likes.some(like => like.author.equals(userId));
  let unliked = false;
  if (userLiked) {
    // User has already liked the note, remove their like
    await Note.findByIdAndUpdate(
      noteId,
      { $pull: { likes: { author: userId } } },
      { new: true }
    );
    unliked = true;
  } else {
    // User has not liked the note, add their like
    await Note.findByIdAndUpdate(
      noteId,
      { $push: { likes: { author: userId } } },
      { new: true }
    );
  }

  // Fetch the updated note after the like operation
  const updatedNote = await Note.findById(noteId);

  // Send a success response with the updated note data
  res.status(200).json({ success: true, unliked: unliked, likeAmount: updatedNote.likes.length});
});
