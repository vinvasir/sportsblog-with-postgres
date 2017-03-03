module.exports = function(passport) {
	const express = require('express');
	const router = express.Router();

	const User = require('../models/user.js');

	// Registration form
	router.get('/new', (req, res) => {
		res.render('users/new', {title: 'Sign up'});
	});

	// Process registration
	router.post('/', (req, res) => {
		const name = req.body.name;
		const username = req.body.username;
		const email = req.body.email;
		const password = req.body.password;
		const password2 = req.body.password2;

		const newUser = new User({
			name: name,
			username: username,
			email: email,
			password: password
		})

		newUser
		.save()
		.then(user => {
			console.log("Created user: " + JSON.stringify(user.toJSON()).name);
			res.redirect('/manage/categories');
		})
		.catch(err => {
			console.error(err, err.stack);
			res.status(500).json({message: err})
		});		
	});

	// Login form
	router.get('/login', (req, res) => {
		res.render('users/login', {title: 'Please log in'});
	});

	// Process login

	router.post('/login', (req, res, next) => {
		passport.authenticate('local', {
			successRedirect: '/',
			failureRedirect: '/login',
			failureFlash: true
		})(req, res, next);
	});	

	return router;
}