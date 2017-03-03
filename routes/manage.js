module.exports = function(passport) {
	const express = require('express');
	const router = express.Router();

	const Category = require('../models/category.js');
	const Article = require('../models/article.js');
	const Comment = require('../models/comment.js');

	router.get('/articles', (req, res, next) => {
		Article
		.fetchAll()
		.then(articles => {
			res.render('manage/manage_articles', {
				title: 'Manage all articles',
				articles: articles.toJSON()
			});
		})
		.catch(err => res.status(500).json({message: err}));
		
	});

	router.get('/articles/add', (req, res, next) => {
		Category
		.fetchAll()
		.then(categories => {
			res.render('manage/add_article', {
				title: 'Add an article',
				categories: categories.toJSON()
			});		
		})
		.catch(err => res.status(500).json({message: err}));
	});

	router.get('/categories', (req, res, next) => {
		Category
		.fetchAll()
		.then(categories => {
			res.render('manage/manage_categories', {
				title: 'Manage Categories', 
				categories: categories.toJSON()
			});
		})
		.catch(err => res.status(500).json({message: err}));
	});

	router.get('/categories/add', (req, res, next) => {
		res.render('manage/add_category', {title: 'Add a category'});
	});

	router.get('/articles/edit/:id', (req, res, next) => {
		Article
		.forge({id: req.params.id})
		.fetch()
		.then(article => {
			Category
			.fetchAll()
			.then(cats => {
				res.render('manage/edit_article', {
					title: `Edit article ${req.params.id}`,
					article: article.toJSON(),
					categories: cats.toJSON()
				})
			})
			.catch(err => res.status(500).json({message: err}));
		})
		.catch(err => {
			console.error(err, err.stack);
			res.status(500).json({message: err})
		});	
	});

	router.get('/categories/edit/:id', (req, res, next) => {
		Category
		.forge({id: req.params.id})
		.fetch()
		.then(category => {
			res.render('manage/edit_category', {
				title: `Edit ${category.toJSON().title}`,
				category: category.toJSON()
			})		
		})
		.catch(err => res.status(500).json({message: err}));
	});

	return router;
}