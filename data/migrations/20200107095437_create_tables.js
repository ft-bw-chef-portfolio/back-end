
exports.up = function(knex) {
  return knex.schema
  .createTable('chefs', tbl => {
    tbl.increments();
    tbl.string('username', 128).notNullable().unique();
    tbl.string('password', 128).notNullable();
    tbl.string('email', 128).notNullable().unique();
    tbl.string('name', 128).notNullable();
    tbl.string('location', 128).notNullable();
    tbl.string('website', 128);
    tbl.string('phone', 128);
  })
  .createTable('meal_types', tbl => {
    tbl.increments();
    tbl.string('name', 128).notNullable().unique();
    tbl.string('position', 128);
  })
  .createTable('recipes', tbl => {
    tbl.increments();
    tbl.string('title', 128).notNullable();
    tbl.string('image', 128);
    tbl.integer('chef_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('chefs')
      .onUpdate('CASCADE')
      .onDelete('RESTRICT')
    tbl.integer('meal_type_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('meal_types')
      .onUpdate('CASCADE')
      .onDelete('RESTRICT')
  })
  .createTable('ingredients', tbl => {
    tbl.increments();
    tbl.string('name', 128).notNullable();
    tbl.integer('recipe_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('recipes')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
  })  
  .createTable('instructions', tbl => {
    tbl.increments();
    tbl.integer('position').notNullable();
    tbl.text('description', 500).notNullable();
    tbl.integer('recipe_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('recipes')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
  })
};

exports.down = function(knex) {
  
};
