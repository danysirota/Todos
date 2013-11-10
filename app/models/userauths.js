var mongoose = require('mongoose'),
	bcrypt = require('bcrypt'),
	Schema = mongoose.Schema,
 	SALT_WORK_FACTOR = 10;

// var Users = mongoose.model('userauths', LocalUserSchema);
// // User schema
var userSchema = new Schema({
	username: { type: String, required: true, unique: true },
	firstName: { type: String, required: true},
	lastName: { type: String, required: true},
	password: { type: String, required: true},
});

// Bcrypt middleware
userSchema.pre('save', function(next) {
	var user = this;
	if(!user.isModified('password')) return next();
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
					if(err) return next(err);
					bcrypt.hash(user.password, salt, function(err, hash) {
									if(err) return next(err);
									user.password = hash;
									next();
					});
	});
});
// Password verification
userSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
					if(err) return cb(err);
					cb(null, isMatch);
	});
};

// // Export user model
var userModel = mongoose.model('userauths', userSchema);