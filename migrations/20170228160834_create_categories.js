
exports.up = function(knex, Promise) {
  return Promise.all([
  	knex.schema.createTable('categories', table => {
  		table.increments('id').primary();
  		table.timestamps();
  		table.string('title');
  		table.text('description');
  	})
	]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
  	knex.schema.dropTable('categories')
	])
};
