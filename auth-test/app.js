// This project was created in 2024 by Matías Wasyluk with express-generator.
// For documentation visit https://www.github.com/wasyted/notes-app/docs

var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const db = require('./api/connectDb');
const User = require('./models/User');
const Note = require('./models/Note');

mongoose.connection = db;

//imports routers
var indexRouter = require('./routes/index');
var signUpRouter = require('./controllers/sign-up-form');
var noteRouter = require('./routes/note');
var myNotesRouter = require('./routes/myNotes');
var friendsRouter = require('./routes/friends');
var userRouter = require('./routes/user');

//initializes express server
var app = express();

//sets ejs as server-side rendering engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//server serves static files (such as css and images) from /public folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

//use passport user autentication throughout the site
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

//define routers for each url req
app.use('/', indexRouter);
app.use('/sign-up', signUpRouter);
app.use('/create-note', noteRouter);
app.use('/my-notes', myNotesRouter);
app.use('/friends', friendsRouter);
app.use('/profile', userRouter);

//user autentication via LocalStrategy, bcrypt to compare hashed password and input password.
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      };
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" })
      }
      return done(null, user);
    } catch(err) {
      return done(err);
    };
  })
);

//some passport shenaningans
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch(err) {
    done(err);
  };
});

//to-do: redirect with message stating error to user
app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
  })
  );
  
//handles log-out, redirects to index and displays login form as there is no user authenticated.
app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
    return next(err);
  }
  res.redirect("/");
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
