const asyncHandler = require("express-async-handler");
const express = require('express');
const Note = require('../models/Note');
const User = require('../models/User');
const timeAgo = require('../utils/timeAgo');
const interaction = require('../api/interaction');

exports.createNoteForm = asyncHandler(async (req, res, next) => {
  const currentUrl = '/note/create-form';
  const [
    userData,
  ] = await Promise.all([
    User.findOne({ _id: req.user }).populate('friends.accepted.user').exec(),
  ]);
  res.render('create-note-form', { 
    user: req.user , 
    userData: userData , 
    currentUrl: currentUrl , 
    notifications: req.notifications,
    clearNotifications: req.clearNotifications,
    formatDate: timeAgo,
  });
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
  res.redirect('/');
});

exports.viewNote = asyncHandler(async (req, res, next) => {
  const noteID = req.params.noteID;
  const currentUrl = '';
  if (!req.isAuthenticated()) {
    return res.status(401).redirect('../');
  }
  const [ note ] = await Promise.all([Note.findById({ _id: noteID }).populate('author comments.author likes.author').exec()]);
  res.render('view-note', { 
    user: req.user, 
    note: note, 
    formatDate: timeAgo, 
    likeNote: interaction.likeNote, 
    currentUrl: currentUrl,
    notifications: req.notifications,
    clearNotifications: req.clearNotifications,
  });
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

  //Send notification to note.author
  const note = await Note.findById(noteId);
  const noteAuthorId = note.author;

  if(noteAuthorId != req.user){
    const notification = {
      user: userId,
      action: 'commented on your note',
      note: noteId
    };
    await User.findByIdAndUpdate(
      noteAuthorId,
      { $push: {
        'notifications': { $each: [notification], $position: 0 } // Adds notification at start of array
        }
      },
      { new: true }
    );
  };

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
    const noteAuthorId = note.author;
    if(noteAuthorId != req.user){
      const notification = {
        user: userId,
        action: 'liked your note',
        note: noteId
      };
      await User.findByIdAndUpdate(
        noteAuthorId,
        { $pull: { notifications: notification } },
        { new: true }
      );
    };
    unliked = true;
  } else {
    // User has not liked the note, add their like
    await Note.findByIdAndUpdate(
      noteId,
      { $push: { likes: { author: userId } } },
      { new: true }
    );
    const noteAuthorId = note.author;
    if(noteAuthorId != req.user){
      const notification = {
        user: userId,
        action: 'liked your note',
        note: noteId
      };
      await User.findByIdAndUpdate(
        noteAuthorId,
        { $push: {
          'notifications': { $each: [notification], $position: 0 } // Adds notification at start of array
          }
        },
        { new: true }
      );
    };
  }

  // Create a notification for the note author

  // Fetch the updated note after the like operation
  const updatedNote = await Note.findById(noteId);

  // Send a success response with the updated note data
  res.status(200).json({ success: true, unliked: unliked, likeAmount: updatedNote.likes.length});
});

exports.editNoteForm = asyncHandler(async (req, res, next) => {
  const [
    userData,
  ] = await Promise.all([
    User.findOne({ _id: req.user }).populate('friends.accepted.user').exec(),
  ]);
  res.render('edit-note', { 
    user: req.user , 
    userData: userData , 
    notifications: req.notifications,
    clearNotifications: req.clearNotifications,
    formatDate: timeAgo,
    currentUrl: ''
  });
});

exports.editNote = asyncHandler(async (req, res, next) => {
  const noteId = req.params.noteID;
  const userId = req.user._id;
  const editedBody = req.body.body;

  if (!req.isAuthenticated()) {
    return res.status(401).redirect('../');
  }

  let note = await Note.findById(noteId).populate('author');

  if (!note) {
    return res.status(404).json({ success: false, message: 'Note not found' });
  }

  if (note.author._id.toString() !== userId.toString()) {
    return res.status(403).json({ success: false, message: 'Unauthorized to edit this note' });
  }

  note.body = editedBody;

  note = await note.save();

  res.status(200).redirect(`/note/${noteId}`);
});

exports.deleteNoteForm = asyncHandler(async (req, res, next) => {
  const [
    userData,
  ] = await Promise.all([
    User.findOne({ _id: req.user }).populate('friends.accepted.user').exec(),
  ]);
  res.render('delete-note', { 
    user: req.user , 
    userData: userData , 
    notifications: req.notifications,
    clearNotifications: req.clearNotifications,
    formatDate: timeAgo,
    currentUrl: ''
  });
});

exports.deleteNote = asyncHandler(async (req, res, next) => {
  const noteId = req.params.noteID;
  const userId = req.user._id;

  if (!req.isAuthenticated()) {
    return res.status(401).redirect('/');
  }

  let note = await Note.findById(noteId).populate('author');

  if (!note) {
    return res.status(404).json({ success: false, message: 'Note not found' });
  }

  if (String(note.author._id) !== String(userId)) {
    return res.status(403).json({ success: false, message: 'Unauthorized to edit this note' });
  }

  // Delete the note
  await note.deleteOne();

  res.status(200).redirect(`/`);
});