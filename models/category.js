const bookshelf = require('../app.js').bookshelf;
bookshelf.plugin('registry');

const Article = require('./article.js');

const Category = bookshelf.Model.extend({
	tableName: 'categories',
	hasTimeStamps: true,
	articles: function() {
		return this.hasMany('Article');
	}
});

module.exports = bookshelf.model('Category', Category);