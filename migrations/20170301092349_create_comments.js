
exports.up = function(knex, Promise) {
  return Promise.all([
  	knex.schema.createTable('comments', tbl => {
      tbl.increments('id').primary();
  		tbl.string('subject');
  		tbl.string('body');
  		tbl.integer('article_id')
          .unsigned()
          .references('id')
          .inTable('articles');
  		tbl.string('author');
  		tbl.string('email');
  		tbl.timestamps();
  	})
	]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
  	knex.schema.dropTable('comments')
	]);  
};
