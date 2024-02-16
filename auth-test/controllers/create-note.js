const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const User = require('../models/User');


router.get('/', function(req, res, next) {
  res.render('create-note-form', { user: req.user , req: req});
});

router.post('/', async (req, res, next) => {
  try {
    // Check if the user is authenticated
    if (!req.isAuthenticated()) {
      return res.status(401).send('Unauthorized');
    }

    const date = Date.now();
    const now = new Date(date);

    // Create a new note with the authenticated user
    
    const publicNote = new Note({
      author: authenticatedUser._id, // Assuming the user's ID is stored in _id
      title: req.body.title,
      body: req.body.body,
      datePosted: now,
      public: true,
    });
    const privateNote = new Note({
      author: authenticatedUser._id, // Assuming the user's ID is stored in _id
      title: req.body.title,
      body: req.body.body,
      datePosted: now,
      public: req.body.public,
      addressee: req.body.addressee,
    });
    
    // Save the new note to the database
    if(req.body.public === true){
      await User.findByIdAndUpdate(
        authenticatedUser._id,
        { $push: { postedNotes: savedNote._id } },
        { new: true }
      );
      const savedNote = await publicNote.save();
    } else{
      await User.findByIdAndUpdate(
        req.user,
        { $push: { postedNotes: savedNote._id } },
        { new: true }
      );
      const savedNote = await privateNote.save();
    }

    // Handle the response, redirect, or send a success message
    res.status(201).json(savedNote);
  } catch (error) {
    // Handle any errors that occur during note creation
    next(error);
  }
  // Redirigir después de almacenar en la base de datos
  res.redirect("/");
});

module.exports = router;
