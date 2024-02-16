function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // User is authenticated, proceed to the next middleware
  } else {
    console.log('not authenticated')
    res.redirect('/'); // Redirect to the login form if not authenticated
  }
}

module.exports = ensureAuthenticated;