const express = require('express');
const router = express.Router();

const Article = require('../models/article.js');

router.get('/', (req, res, next) => {
	Article
	.fetchAll()
	.then(articles => {
		res.render('index', {
			title: 'Welcome to my Sports Blog',
			articles: articles.toJSON()
		});
	})
	.catch(err => {
		console.error(err, err.stack);
		res.status(500).json({message: err})
	});	
})

module.exports = router;