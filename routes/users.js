module.exports = function(passport) {
	const express = require('express');
	const router = express.Router();

	router.get('/new', (req, res) => {
		res.render('users/new', {title: 'Sign up'});
	});

	return router;
}