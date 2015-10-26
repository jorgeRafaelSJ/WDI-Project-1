var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var UserSchema = mongoose.Schema({
	username: String,
	email: String,
	passwordDigest: String,
	marks: [{type: Schema.Types.ObjectId, ref: 'Mark'}]
});

UserSchema.statics.createSecure = function (username, email, password, callback) {


var UserModel = this;


  bcrypt.genSalt(function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {

      UserModel.create({
      	username: username,
        email: email,
        passwordDigest: hash
      }, callback);
    });
  });
};

var User = mongoose.model('User', UserSchema);



module.exports = User;