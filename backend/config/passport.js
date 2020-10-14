/**
 * Passport configuration file where you should configure strategies
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
const facebookTokenStrategy = require('passport-facebook-token');
const GoogleTokenStrategy = require('passport-google-token').Strategy;

var EXPIRES_IN_MINUTES = 60 * 24;
var SECRET = "4ukI0uIVnB3iI1yxj646fVXSE3ZVk4doZgz6fTbNg7jO41EAtl20J5F7Trtwe7OM";
var ALGORITHM = "HS256";
var ISSUER = "nozus.com";
var AUDIENCE = "nozus.com";
 
/**
 * Configuration object for local strategy
 */
var LOCAL_STRATEGY_CONFIG = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: false
};
 
/**
 * Configuration object for JWT strategy
 */
var JWT_STRATEGY_CONFIG = {
  secretOrKey: SECRET,
  issuer : ISSUER,
  audience: AUDIENCE,
  passReqToCallback: false
};
 
/**
 * Triggers when user authenticates via local strategy
 */
function _onLocalStrategyAuth(email, password, next) {
  User.findOne({email: email})
    .exec(function (error, user) {
      if (error) return next(error, false, {});
 
      if (!user) return next(null, false, {
        code: 'E_USER_NOT_FOUND',
        message: email + ' is not found'
      });
     
      // TODO: replace with new cipher service type
      if (!CipherService.comparePassword(password, user))
        return next(null, false, {
          code: 'E_WRONG_PASSWORD',
          message: 'Password is wrong'
        });
      return next(null, user, {});
    });
}
 
/**
 * Triggers when user authenticates via JWT strategy
 */
function _onJwtStrategyAuth(payload, next) {
  var user = payload.user;
  return next(null, user, {});
}


passport.use(
  new LocalStrategy(LOCAL_STRATEGY_CONFIG, _onLocalStrategyAuth));
//passport.use(
 // new JwtStrategy(opts, _onJwtStrategyAuth));
 var opts = {}
 opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
 opts.secretOrKey = SECRET;
 opts.issuer = ISSUER;
 opts.audience = AUDIENCE;
 passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
   
     User.findOne({id: jwt_payload.sub}, function(err, user) {
         if (err) {
             return done(err, false);
         }
         if (user) {
             return done(null, user);
         } else {
             return done(null, false);
             // or you could create a new account
         }
     });
 })); 

 passport.use('facebookToken', new facebookTokenStrategy({
  clientID: '',//process.env.FACEBOOK_APP_ID,
  clientSecret: ''//process.env.FACEBOOK_APP_SECRET
}, async (accessToken, refreshToken, profile, done) => {
  try {
      data = {
        user_id: profile.id,
        username: profile.displayName,
        email: profile.emails[0].value,
        provider: profile.provider,
        token: accessToken
      }
      
     var findCriteria = { user_id: profile.id, email: profile.emails[0].value };

      await User.findOrCreate(findCriteria, data)
      .exec(async(err, user, wasCreated)=> {
      if (user)
            done(null, user);
      });

  } catch(err) {
      done(err, false);
  }
}));


passport.use(new GoogleTokenStrategy({
  clientID: '',
  clientSecret: ''
},
 function(accessToken, refreshToken, profile, done) {
  
  try {
    data = {
      user_id: profile.id,
      username: profile.displayName,
      email: profile.emails[0].value,
      provider: profile.provider,
    }
    
   var findCriteria = { user_id: profile.id, email: profile.emails[0].value };

     User.findOrCreate(findCriteria, data)
    .exec(async(err, user, wasCreated)=> {
    if (user)
          done(null, user);
    });

} catch(err) {
    done(err, false);
}
}
));

module.exports.jwtSettings = {
  expiresInMinutes: EXPIRES_IN_MINUTES,
  secret: SECRET,
  algorithm : ALGORITHM,
  issuer : ISSUER,
  audience : AUDIENCE
};