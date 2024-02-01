const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const formattedDate = require('../utils/formattedDate')


router.get('/', function(req, res, next) {
  res.render('create-note-form', { user: req.user });
});

router.post('/', async (req, res, next) => {
  try {
    // Check if the user is authenticated
    if (!req.isAuthenticated()) {
      return res.status(401).send('Unauthorized');
    }

    // Get user information from the session
    const authenticatedUser = req.user;
    
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
      title: req.body.title,
      body: req.body.body,
      author: authenticatedUser._id, // Assuming the user's ID is stored in _id
      datePosted: now,
      public: req.body.public,
      addressee: req.body.addressee,
    });
    
    // Save the new note to the database
    if(req.body.public === true){
      const savedNote = await publicNote.save();
    } else{
      const savedNote = await privateNote.save();
    }

    // Redirigir después de almacenar en la base de datos
      res.redirect("/");

    // Handle the response, redirect, or send a success message
    res.status(201).json(savedNote);
  } catch (error) {
    // Handle any errors that occur during note creation
    next(error);
  }
});

module.exports = router;
