const jwt = require('jwt-simple');
const User = require('../model/user');
const config = require('../config');



function tokenForUser(user){
	const timeStamp = new Date().getTime();
	return jwt.encode({ sub: user.id, iat: timeStamp }, config.secret);
}

exports.signup = function(req, res, next){

	const email = req.body.email;
	const password = req.body.password;

	if(!email || !password){
		res.status(422).send({email: 'you must provide email & password'}); 
	}

	// check if user exists
	User.findOne({email: email}, function(err, existingUser){
		if(err){
			return next(err);
		}

		// if yes, return error
		if(existingUser){
			return res.status(422).send({email: 'is in use'});
		}

		// if no, create & save user , and respond
		const user = new User({
			email: email,
			password: password
		});

		user.save(function(err){
			if(err){
				return next(err);
			}
			res.send({ token: tokenForUser(user) });
		});

	});
}	


exports.signin = function(req, res, next){
	// at this point user had already email & pass auth'd
	// just need to give them token
	res.send({ token: tokenForUser(req.user) });
}