"use strict";
// This index.js file is auto generated sequelize is initialised / run sequelize init. This creates the models and config folders automatically

var fs = require("fs"); // import file system library for filestem manipulation incl. read, write, delete and update operations
var path = require("path"); // import path library used for joining and manipulating file path names
var Sequelize = require("sequelize"); // import sequelize ORM library used to create databse models and perform CRUD on SQL databases
var basename = path.basename(module.filename); // basename property extracts the filename from the file location path
var env = process.env.NODE_ENV || "development"; // sets env to either the node env (production) or developement as per the config.json file
var config = require(__dirname + "/../config/config.json")[env]; // return and set config to the value of of key variable 'env'
var db = {}; // initialise new object called db that will store all database models for use in other modules in the app

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]); // creates a sequelize object database connection instance based on production environment using credentials in config.json
} else {
  var sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  ); // creates a sequelize object databse connection instance based on local or development environment using credentials in config.json
}

fs.readdirSync(__dirname) // synchronously reads filnames in a given directory (../models) and returns an array
  .filter(function (file) {
    // search for file in array with conditions
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
    // return files where condition = file name does not start with '.' AND file name is not is not the 'index' i.e. basename (this file) name AND the file ARE javascript files
  })
  .forEach(function (file) {
    // repeat for each of the files in models folder
    var model = sequelize["import"](path.join(__dirname, file)); // create sequelize model instance required/imported for each return file.
    db[model.name] = model; // store newly created sequelize model object in db object using the file name
  });

Object.keys(db).forEach(function (modelName) {
  // loop through each of the keys in db i.e. model names
  if (db[modelName].associate) {
    // check if model name exists in
    db[modelName].associate(db); // associate the set sequelize model with db
  }
});

db.sequelize = sequelize; // attach the sequelize instance properties created herein to the db object as a property
db.Sequelize = Sequelize; // attach the Sequelize library functions/properties to the db object as a property

module.exports = db; //this means that importing db, inherently makes models, Sequelize and sequelize function/methods available for other files.
