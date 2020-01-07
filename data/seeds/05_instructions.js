
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('instructions').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('instructions').insert([
        {id: 1, recipe_id: 1, position: 1, description: 'Beat together egg, milk, salt, desired spices and vanilla.'},
        {id: 2, recipe_id: 1, position: 2, description: 'Heat a lightly oiled griddle or skillet over medium-high heat.'},
        {id: 3, recipe_id: 1, position: 3, description: 'Dunk each slice of bread in egg mixture, soaking both sides. Place in pan, and cook on both sides until golden. Serve hot.'},
        {id: 4, recipe_id: 2, position: 1, description: 'Pour water into glass'},
        {id: 5, recipe_id: 2, position: 2, description: 'Enjoy'}
      ]);
    });
};
