// This is middleware for restricting routes a user is not allowed to visit if not logged in
module.exports = function(req, res, next) {
  // If the user is logged in, continue with the request to the restricted route
  if (req.user) { // Checks if the user object is created once passport.initialize middleware is used or invoked by the app.
    return next(); // If user object has been created i.e. it means the user has been verified in database and is valid. Thereafter, this block code is executed. The normal program flow is executed. 
  }

  // If the user isn't logged in, redirect them to the login page
  return res.redirect("/"); // Redirects to home page i.e. login page
};

