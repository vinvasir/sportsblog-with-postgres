const bookshelf = require('../app.js').bookshelf;

const Article = require('./article.js');

const Comment = bookshelf.Model.extend({
	tableName: 'comments',
	hasTimeStamps: true,
	article: function() {
		return this.belongsTo(Article);
	}
});

module.exports = Comment;