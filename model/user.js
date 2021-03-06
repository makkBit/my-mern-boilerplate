const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


// define our user model
const userSchema = new Schema({
	email: { type:String, unique: true, lowerCase: true },
	password: String
});

// on save hook, encrypt password
userSchema.pre('save', function(next){
	const user = this;

	bcrypt.genSalt(10, function(err, salt){

		if(err){return next(err)};
		bcrypt.hash(user.password, salt, null, function(err, hash){
			if(err) return next(err);
			user.password = hash;
			next();
		});

	});
});


userSchema.methods.comparePassword = function(candidatePassword, callback){
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
		if (err) {return callback(err);}
		callback(null, isMatch);
	});
}


// create model class
const ModelClass = mongoose.model('User', userSchema);

// export the model
module.exports = ModelClass;













