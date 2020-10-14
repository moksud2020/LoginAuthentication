var jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  //console.log(req.header('authorization'))
  var bearerToken =  req.header('authorization').split('Bearer ')[1];
  
  if (!bearerToken){
    
		return res.status(403).send({ 
			auth: false, message: 'No token provided.' 
		});
  }
  bearerToken = bearerToken.replace('"', '');
  
  if (typeof bearerToken !== 'undefined') {    
   
    // on vérifie si le token est bon
   jwt.verify(bearerToken, sails.config.jwtSettings.secret, function(err, decoded) {
      if (err) {
        sails.log("verification error", err);
        if (err.name === "TokenExpiredError")
          return res.forbidden("Session timed out, please login again");
        else
          return res.forbidden("Error authenticating, please login again");
      }
      

      User.findOne(decoded.id).exec(function callback(error, user) {
        if (error) return res.serverError(err);
        if (!user) return res.serverError("User not found");
        req.user = user;
        next();
      });

    });

  } else {
    
    return res.forbidden("No token provided");
  }
};