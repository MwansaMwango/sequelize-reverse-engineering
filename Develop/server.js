// Requiring necessary npm packages
var express = require("express");
var session = require("express-session"); // import express-session to manage user sessions
// Requiring passport as we've configured it
var passport = require("./config/passport"); // import passport for user authentication

// Setting up port and requiring models for syncing
var PORT = process.env.PORT || 8080;
var db = require("./models"); // import all models and functions including Sequelize

// Creating express app and configuring middleware needed for authentication
var app = express(); // initialize express server app
app.use(express.urlencoded({ extended: true })); // parses incoming requests url and allows values of any type instead of just strings.
app.use(express.json()); // parses requests into JSON
app.use(express.static("public")); // allows access to the static files in the public folder for client side.

// We need to use sessions to keep track of our user's login status
app.use(
  session({ 
    secret: "keyboard cat", //Secret used to sign the session ID cookie. Can be either a string for a single secret, or an array of multiple secrets.
    resave: true, //Forces the session to be saved back to the session store, even if the session was never modified during the request. Avoid the user resigning
    //in on every new page request.
    saveUninitialized: true // Forces a session that is “uninitialized” to be saved to the store. Saves a session even when user is not logged in.
  })
);

// Not recommended for secuity reasons should be
//saved elsewhere .env files.
app.use(passport.initialize()); // initializes an instance of passport
app.use(passport.session()); // middleware that changes the req object's 'user' value from session id into the deserialized i.e.
// 'authenticated' user object

// Requiring our routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(function () {
  // syncronizes database and established connection
  app.listen(PORT, function () {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});
