const bookshelf = require('../app.js').bookshelf;
bookshelf.plugin('registry');

const Category = require('./category.js');
const Comment = require('./comment.js');

const Article = bookshelf.Model.extend({
	tableName: 'articles',
	hasTimeStamps: true,
	category: function() {
		return this.belongsTo('Category', 'category_id');
	},
	comments: function() {
		return this.hasMany(Comment);
	}
});

module.exports = bookshelf.model('Article', Article);