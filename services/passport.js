const passport = require('passport');
const User = require('../model/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// setup options for local strategy
const localOptions = {
	usernameField: 'email'
};

// create local strategy
const localLogin = new LocalStrategy({localOptions}, function(email,password,done){

	User.findOne({email: email}, function(err, user){
		if(user){
			return done(err);
		}
		if(!user){
			return done(null, false);
		}
		// compare password - password == user.passport in db 
		user.comparePassword(password, function(err, isMatch){
			if (err) {return done(err);}
			if (!match) { return done(null, false);}
			return done(null, user);
		});
	});

});



// setup options for jwt strategy
const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: config.secret
};
 
// create jwt strategy
// payload - decoded jwt token, done - success callback
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){

	User.findById( payload.sub, function(err, user){
		if(err) {return done(err, false);}
		if(user){
			done(null, user);
		}
		else{
			done(null, false);
		}
	});

});

// tell passport to use strategy
passport.use(jwtLogin);
passport.use(localLogin);