/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var jwt = require("jsonwebtoken");
//var bcrypt = require("bcryptjs");
const bcrypt = require('bcrypt-nodejs');

module.exports = {
  login: function(req, res) {
  //  console.log(req);
    if (!req.param('email') || !req.param('password')) {
      return res.serverError("No field should be empty.");
    }
    User.findOne({
      email: req.param('email')
    }).exec(function callback(err, user) {
      if (err) return res.serverError(err);
      if (!user) return res.serverError("User not found, please sign up.");

      // check password
      bcrypt.compare(req.param('password'), user.password, function(error, matched) {
        if (error) return res.serverError(error);
        if (!matched) return res.serverError("Invalid password.");

        user.token = jwt.sign(user.toJSON(), "votre clé secrète ici", {
          expiresIn: '7d'
        });
        console.log(user.token.expiresIn);
        res.ok(user);
      });

    });
  },

  token: function(req, res) {
    User.findOne(req.user.id).exec(function callback(error, user) {
      if (error) return res.serverError(error);
      if (!user) return res.serverError("User not found");

      user.token = jwt.sign(user.toJSON(), "votre clé secrète ici", {
        expiresIn: '7d'
      });
      res.ok(user);
    });
  },

  // Verifies token on a request
  verify(token, callback) {
    return jwt.verify(
      token, // The token to be verified
      tokenSecret, // Same token we used to sign
      {}, // No Option, for more see https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
      callback //Pass errors or decoded token to callback
    );
  },

  getUsers: async (req, res) => {
        User.find((err, user) => {
          if (err) {
            return res.serverError({
              success: false,
              message: 'Server Error'
            });
          }
          return res.ok({
            success: true,
            user: user
          });
        });
      },


      getInitialValue: async (req, res) => {
        //  VwAJournal.query('SELECT * from vw_a_journal where account = $1', [  req.param('name') ] ,function(err, rawResult) {
        //    if (err) { return res.serverError(err); }
            // Build our SQL query template.
            var NAMES_OF_PETS_SQL = `SELECT * from get_uesr_info($1)`;

            // Send it to the database.
            var rawResult = await sails.sendNativeQuery(NAMES_OF_PETS_SQL, [ req.param('username') ]);

            sails.log(rawResult);
            // (result format depends on the SQL query that was passed in, and the adapter/dialect you're using)

            // Then parse the raw result and do whatever you like with it.

          //  return exits.success();


          return res.ok({
            success: true,
            user: rawResult.rows
          });
        //});
      },

};
