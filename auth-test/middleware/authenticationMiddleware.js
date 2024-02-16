function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated() || req.originalUrl === '/log-in' || req.originalUrl === '/sign-up') {
    return next(); // User is authenticated or accessing the login route, proceed to the next middleware
  } else {
    req.invalidLogin = true;
    res.redirect('/log-in'); // Redirect to the login form if not authenticated
  }
}

module.exports = ensureAuthenticated;