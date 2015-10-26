var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var UserSchema = mongoose.Schema({
	username: {	type: String,
				required: true,
				unique: true },
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

UserSchema.statics.authenticate = function (email, password, callback) {
 // find user by email entered at log in
 this.findOne({email: email}, function (err, foundUser) {
   console.log(foundUser);

   // throw error if can't find user
   if (!foundUser) {
     console.log('No user with email ' + email);
     callback("Error: no user found", null);  // better error structures are available, but a string is good enough for now
   // if we found a user, check if password is correct
   } else if (foundUser.checkPassword(password)) {
     callback(null, foundUser);
   } else {
     callback("Error: incorrect password", null);
   }
 });
};





UserSchema.methods.checkPassword = function (password) {
  // run hashing algorithm (with salt) on password user enters in order to compare with `passwordDigest`
  return bcrypt.compareSync(password, this.passwordDigest);
};


var User = mongoose.model('User', UserSchema);

module.exports = User;