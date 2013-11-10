var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto');

var UserSchema = new Schema({
  username: {type: String, required: true, unique: true},
  salt: {type: String, required: true},
  hash: {type: String, requried: true}
});

UserSchema
	.virtual('password')
	.set(function(password) {
		//this._password = password;
		this.salt = this.makeSalt();
		this.hash = this.encryptPassword(password);
	});
	// .get(function() { return this._password; });

UserSchema.path('hash').validate(function (hash) {
	return hash.length;
}, 'Password cannot be blank');

UserSchema.path('username').validate(function (username) {
	return username.length;
}, 'Username cannot be blank');

UserSchema.path('username').validate(function (username, fn) {
	var User = mongoose.model('User');

	if (this.isNew || this.isModified('username')) {
		User.find({username: username}).exec(function (err, users) {
			fn(!err && users.length === 0);
		});
	}
	else {
		fn(true);
	}
}, 'Username already exists');

UserSchema.methods = {
	authenticate : function (plainText) {
		return this.encryptPassword(plainText) == this.hash;
	},

	makeSalt: function () {
		return Math.round((new Date().valueOf() * Math.random())) + '';
	},

	encryptPassword : function (password) {
		if (!password) return '';
		
		try {
			return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
		} catch (err) {
			return '';
		}
	}
};

module.exports = mongoose.model('User', UserSchema);