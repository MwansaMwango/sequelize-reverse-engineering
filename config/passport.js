var passport = require("passport"); // import passport dependency library

// Save new class called LocalStrategy from passport library.
// 'Strategy' is a passport library term used to refer to type of authentication to be used to sign in. e.g. 
// Local strategy uses username and password by default or you could sign in with google or facebook. 
var LocalStrategy = require("passport-local").Strategy; 

var db = require("../models"); // import all database models or files as 'db'. This makes all models in the models folder
// available this module

// Telling passport we want to use a Local Strategy. In other words, we want login with a username/email and password
passport.use(new LocalStrategy(
  // Our user will sign in using an email, rather than a "username"
  // Username is used by default but can be changed by setting the usernameField to something else, in this case 'email'
  {
    usernameField: "email"
  },
  function(email, password, done) { // function takes in email and password parameters by default
    // When a user tries to sign in this code runs
    db.User.findOne({  // query db object with contains User model /table where the email field equals the parameter email
      where: {
        email: email
      }
    }).then(function(dbUser) { // returned promise object called dbUser that is the query result i.e. user with matching email
      // If there's no user with the given email
      if (!dbUser) {
        return done(null, false, { // first parameter is null - refers to no errors, second parameter is false - refers to no result in query
          // i.e. no email match found in User database
          message: "Incorrect email." // Flash message to provide feedback to the user
        });
      }
      // If there is a user with the given email, but the password the user gives us is incorrect
      else if (!dbUser.validPassword(password)) { // validPassword is a method imported from User model that checks validity of password and
        // returns true or false. This checking is done externally in the user.js model using bcrpypt library
        return done(null, false, { //if password not valid display message other return done and resolve promise
          message: "Incorrect password." // Flash message to provide feedback to the user
        });
      }
      // If none of the above, return the user
      return done(null, dbUser); // return done and resolve promise
    });
  }
));

// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
// Just consider this part boilerplate needed to make it all work
passport.serializeUser(function(user, cb) { // 'serializing' a user means storing identification details of user so that all requests made can
// be attrituted to that unique user instance. This is a way of associating a user to session. 
// In this case, the user object is stored / added as a probpert to request session object.
// The user object is attached to the req.session.passport.user
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) { //'deserializing' a user means retrieving identification details of user so that all requests made can
// be attrituted to that unique user instance. This is a way of associating a user to session.
// In this case, the object is used as a key to retrieve a user from the request session object property. 
// The fetched object is attached to the request object as req.user
  cb(null, obj);
});

// Exporting our configured passport
module.exports = passport; // used as middleware in the server.js 
