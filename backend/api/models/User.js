const bcrypt = require('bcrypt-nodejs');
	module.exports = {
	tableName: 'user',
  	primaryKey: 'id',
	attributes: {
		user_id: {
			type: 'string',
			//unique: true
		},
		username: {
		  type: 'string',
		  required: true,
		  unique: true
		},
		email: {
		  type: 'string',
		  required: true,
		  unique: true
		},
		token: {
         type: 'string'
        },
		provider:{
		   type: 'string',
		},
		password: {
		  type: 'string',
		//  required: true
		}
	  },
	  
	  customToJSON: function() {
		 return _.omit(this, ['password'])
	  },
	  toJSON: function () {
		var obj = this.toObject();
		delete obj.password;
	//	delete obj.socialProfiles;
		return obj;
	},
	findByUserName: function(req, res, next) {
		var user = User.findOne({
            username : req
          });
          if (!user) {return true;
          }return false;
	  },
	findByEmail: function(req, res, next) {
		var user = User.findOne({
		  email : req
		});
		if (!user) return true
		return false;
	  },
	  beforeCreate: function(user, cb){
		bcrypt.genSalt(10, function(err, salt){
		  bcrypt.hash(user.password, salt, null, function(err, hash){
			if(err) return cb(err);
			user.password = hash;
			return cb();
		  });
		});
	  }
	};