module.exports = function(passport) {
	const express = require('express');
	const router = express.Router();

	const Category = require('../models/category.js');
	const Article = require('../models/article.js');
	const Comment = require('../models/comment.js');

	router.get('/', (req, res, next) => {
		Article
		.fetchAll()
		.then(articles => {
			res.render('articles/index', {
				title: 'All articles',
				articles: articles.toJSON()
			});
		})
		.catch(err => res.status(500).json({message: err}));
	});

	router.post('/', (req, res, next) => {
		req.checkBody('title', 'Title is required').notEmpty();
		req.checkBody('author', 'Author is required').notEmpty();
		req.checkBody('category_id', 'Category is required').notEmpty();
		req.checkBody('body', 'Body is required').notEmpty();

		let errors = req.validationErrors();

		if(errors){
			Category
			.fetchAll()
			.then(categories => {
				res.render('manage/add_article', {
					title: 'Create article',
					errors: errors,
					categories: categories.toJSON()
				});
			})
			.catch(err => res.status(500).json({message: err}));
		} else {
			req.body.category_id = parseInt(req.body.category_id);
			console.log(req.body);

			let article = new Article(req.body);
			console.log(article);

			article	
			.save()
			.then(() => {
				req.flash('success', 'Article added');
				res.redirect('/manage/articles');
			})
			.catch(err => res.status(500).json({message: err}));
		}
	});

	router.get('/:id', (req, res, next) => {
		new Article({'id': req.params.id})
		.fetch({withRelated: ['category', 'comments']})
		.then(article => {
			let readable_article = JSON.stringify(article.toJSON());
			console.log(readable_article);
			res.render('articles/show', {
				title: 'Article',
				article: article.toJSON(),
				category: article.related('category').toJSON(),
				comments: article.related('comments').toJSON()
			});
		})
		.catch(err => {
			console.error(err, err.stack);
			res.status(500).json({message: err})
		});
	});

	router.post('/edit/:id', (req, res, next) => {
		req.checkBody('title', 'Title is required').notEmpty();
		req.checkBody('author', 'Author is required').notEmpty();
		req.checkBody('category_id', 'Category is required').notEmpty();
		req.checkBody('body', 'Body is required').notEmpty();

		let errors = req.validationErrors();

		if(errors){
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
						categories: cats.toJSON(),
						errors: errors
					})
				})
				.catch(err => res.status(500).json({message: err}));
			})
			.catch(err => res.status(500).json({message: err}));
		} else {
			req.body.id = req.params.id;
			req.body.category_id = parseInt(req.body.category_id);

			let article = new Article(req.params.id)
			article
			.save(req.body, {patch: true})
			.then(article => {
				console.log("Successfully updated article: " + JSON.stringify(article.toJSON()));
				req.flash('success', 'Articled updated');
				res.redirect('/manage/articles');
			})
			.catch(err => {
				console.error(err, err.stack);
				res.status(500).json({message: err})
			});
		}
	});

	router.delete('/delete/:id', (req, res, next) => {
		Article
		.forge({id: req.params.id})
		.destroy()
		.then(() => {
			res.redirect('/manage/articles');
		})
		.catch(err => {
			console.error(err, err.stack);
			res.status(500).json({message: err})
		});
	});

	router.get('/category/:category_id', (req, res, next) => {
		Category	
		.forge({id: req.params.category_id})
		.fetch({withRelated: ['articles']})
		.then(category => {
			res.render('articles/index', {
				title: `Articles about ${category.toJSON().title}`,
				articles: category.related('articles').toJSON()
			});
		})
		.catch(err => res.status(500).json({message: err}));
	});

	router.post('/comments/:article_id', (req, res, next) => {
		req.checkBody('subject', 'Subject is required').notEmpty();
		req.checkBody('author', 'Author is required').notEmpty();
		req.checkBody('body', 'Body is required').notEmpty();

		let errors = req.validationErrors();

		if(errors){
			Article
			.forge({id: req.params.article_id})
			.fetch({withRelated: ['category', 'comments']})
			.then(article => {
				res.render('articles/show', {
					title: 'Article',
					article: article.toJSON(),
					category: article.related('category').toJSON(),
					comments: article.related('comments').toJSON(),
					errors: errors
				})
			})
		} else {
			let comment = new Comment({
				subject: req.body.subject,
				article_id: parseInt(req.params.article_id),
				author: req.body.author,
				email: req.body.email,
				body: req.body.body
			})
			console.log(JSON.stringify(comment.toJSON()));

			comment
			.save()
			.then(comment => {
				console.log("Created comment " + JSON.stringify(comment.toJSON()).body);
				res.redirect("/articles/" + req.params.article_id);
			})
			.catch(err => {
				console.error(err, err.stack);
				res.status(500).json({message: err})
			});	
		}
	});

	return router;
}