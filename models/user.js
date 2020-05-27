// Requiring bcrypt for password hashing. Using the bcryptjs version as the regular bcrypt module sometimes causes errors on Windows machines
var bcrypt = require("bcryptjs");
// Creating our User model
module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define("User", {
    // sequelize define method to create new database table called 'Users'. sequelize automatically pluralises table name based on model name.
    // Additional feilds updatedAt and createdAt added by default.
    // The email cannot be null, and must be a proper email before creation
    email: {
      type: DataTypes.STRING, // email field has propoerty datatype set to string.
      allowNull: false, // prevents from having blank fields
      unique: true, // field must be unique with no email duplicates in dabase
      validate: {
        isEmail: true, // validate as email. Avoids regex strings
      },
    },
    // The password cannot be null
    password: {
      type: DataTypes.STRING, //field has propoerty datatype set to string.
      allowNull: false, // cannot be empty / blank
    },
  });
  // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
  User.prototype.validPassword = function (password) { // add validPassword method to User model / class
    return bcrypt.compareSync(password, this.password); // check if password entered matches hashed password stored in Users database using bcrypt library
  };
  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  User.addHook("beforeCreate", function (user) { // add 'addhook' method to User model / class. Important to hash password before it is stored in database for secuirty
    user.password = bcrypt.hashSync( // store user password as hashed password 
      user.password, // raw password to hash
      bcrypt.genSaltSync(10), // generate random characters referred to as 'salt' with 2 ^10 rounds of processing. This is used on the password to produce a hash.
      null
    ); 
  });
  return User;
};
