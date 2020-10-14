/**
 * AuthController
 * @description :: Server-side logic for manage user's authorization
 */
var passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');

/**
 * Triggers when user authenticates via passport
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Object} error Error object
 * @param {Object} user User profile
 * @param {Object} info Info if some error occurs
 * @private
 */
function _onPassportAuth(req, res, error, user, info) {
  if (error) return res.serverError(error);
  if (!user) return res.unauthorized(null, info && info.code, info && info.message);
  return res.ok({
      token: CipherService.createToken(user),
      expiresIn : '7d',
      status: 200  
  });
}
	module.exports = {
    login: function (req, res) {
      passport.authenticate('local', 
        _onPassportAuth.bind(this, req, res))(req, res);
    },

    googleAuth: async function(req, res, next) {
      console.log(req)
      passport.authenticate('google-token', { scope: ['email']},function(err, user){
        if(!user) {
              return res.send(401, 'User not authenticated');
          }
         
          sails.log('User '+ user.id +' has logged in.');  
          res.ok({
            token: CipherService.createToken(user),
            expiresIn : '7d',
            status: 200
          });
       })(req, res, next)
    },  

    facebookAuth: async function(req, res, next) {
      passport.authenticate('facebookToken', { scope: ['email']},function(err, user){
        if(!user) {
              return res.send(401, 'User not authenticated');
          }
          sails.log('User '+ user.id +' has logged in.');  
          req.token = CipherService.createToken(user),
          res.ok({
            token: CipherService.createToken(user),
            expiresIn : '7d',
            status: 200
          });
       })(req, res, next)
    },  
    fbCurrentUser: async function(req, res, next) {
      var user = await User.findOne({
        email : req.user.email
      });
      if (!user) {
        return res.serverError({
          success: false,
          message: 'Server Error'
        });
      }
      return res.ok({
        success: true,
        user: user
      });
    },
    googleCurrentUser: async function(req, res, next) {
      var user = await User.findOne({
        email : req.user.email
      });
      if (!user) {
        return res.serverError({
          success: false,
          message: 'Server Error'
        });
      }
      return res.ok({
        success: true,
        user: user
      });
    },
     /**
   * Sign up in system
   * @param {Object} req Request object
   * @param {Object} res Response object
   */
  register: function (req, res) {
    User
      .create(_.omit(req.allParams(), 'id'))
      .then(function (user) {
        return {
          // TODO: replace with new type of cipher service
          token: CipherService.createToken(user),
          user: user
        };
      })
      .then(res.created)
      .catch(res.serverError);
  }, 
  register2: function(req, res){
     data = {
				username: req.body.username,
				email: req.body.email,
        password: req.body.password,
        provider: 'local',
			//	description: req.body.description
      }
     var findCriteria = { username: req.body.username, email: req.body.email };
      
     User.findOrCreate(findCriteria, data)
          .exec(async(err, user, wasCreated)=> {
            if (err && err.code === 'E_UNIQUE') {
              return res.sendStatus(409);
            }
            if (err) return res.serverError(err);
            if (!user) return res.unauthorized(null, info && info.code, info && info.message);

            req.login(user, function(err){
                if (err) return res.serverError(err);;
                sails.log('User '+ user.id +' has logged in.');
               /* return res.ok({
                              token: jwToken.issue({ id: user.id }),
                              user: user,
                              expiresIn: '1h',
                              status: 200
                          });*/
               // check password
                bcrypt.compare(req.param('password'), user.password, function(error, matched) {
                  if (error) return res.serverError(error);
                  if (!matched) return res.serverError("Invalid password.");

                  var signedToken = jwt.sign(user.toJSON(), "votre clé secrète ici", {
                    expiresIn: '7d'
                  });
                  return {
                    token: "Bearer " + signedToken,
                    user: user,
                    expiresIn: '1h',
                  }
                });
    
                  })
            
          });
    },
       /**
     * Accept JSON Web Token and updates with new one
     * @param {Object} req Request object
     * @param {Object} res Response object
     */
    refresh_token: function (req, res) {
        // TODO: implement refreshing tokens
        res.badRequest(null, null, 'Not implemented yet');
    }
            
};
