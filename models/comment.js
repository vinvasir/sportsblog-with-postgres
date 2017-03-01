const bookshelf = require('../app.js').bookshelf;
bookshelf.plugin('registry');

const Article = require('./article.js');

const Comment = bookshelf.Model.extend({
	tableName: 'comments',
	hasTimeStamps: true,
	article: function() {
		return this.belongsTo('Article', 'article_id');
	}
});

module.exports = bookshelf.model('Comment', Comment);