const express = require('express');
const router = express.Router();

const Category = require('../models/category.js');

router.get('/', (req, res, next) => {
	Category
	.fetchAll()
	.then(categories => {
		res.render('categories/index', {title: 'Categories', categories: categories.toJSON()})
	})
	.catch(err => res.status(500).json({message: err}));
});

router.post('/', (req, res, next) => {
	req.checkBody('title', 'Title is required').notEmpty();
	let errors = req.validationErrors();

	if(errors){
		res.render('manage/add_category', {
			errors: errors,
			title: 'Create Category'
		})
	} else {
		let category = new Category(req.body);
		category
		.save()
		.then(category => {
			console.log("Created category: " + category.toJSON().title);
			res.redirect('/manage/categories');
		})
		.catch(err => res.status(500).json({message: err}));
		}
});

router.post('/edit/:id', (req, res, next) => {
	req.checkBody('title', 'Title is required').notEmpty();
	let errors = req.validationErrors();

	if(errors){
		Category
		.forge({id: req.params.id})
		.fetch()
		.then(category => {
			res.render('manage/edit_category', {
				errors: errors,
				title: 'Edit Category',
				category: category.toJSON()
			})
		})
		.catch(err => res.status(500).json({message: err}));
	} else {
		Category
		.forge({id: req.params.id})
		.save({
			id: req.params.id,
			title: req.body.title,
			description: req.body.description
		}, {patch: true})
		.then(category => {
			console.log("Successfully edited category " + category.toJSON().title);
			res.redirect('/manage/categories');
		})
		.catch(err => res.status(500).json({message: err}));
	}
});

router.delete('/delete/:id', (req, res, next) => {
	Category
	.forge({id: req.params.id})
	.destroy()
	.then(cat => {
		console.log("Deleted category " + cat.toJSON().title);
		res.status(200);
	})
	.catch(err => res.status(500).json({message: err}));
});

module.exports = router;