
exports.up = function(knex, Promise) {
  return Promise.all([
  	knex.schema.createTable('articles', tbl => {
      tbl.increments('id').primary();
  		tbl.string('title');
  		tbl.string('subtitle');
  		tbl.integer('category_id')
          .unsigned()
          .references('id')
          .inTable('categories');
  		tbl.string('body');
  		tbl.string('author');
  		tbl.timestamps();
  	})
	]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
  	knex.schema.dropTable('articles')
	]);
};
