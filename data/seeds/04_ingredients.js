
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('ingredients').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('ingredients').insert([
        {id: 1, recipe_id: 2, name: '1 cup of water'},
        {id: 2, recipe_id: 1, name: '6 thick slices bread'},
        {id: 3, recipe_id: 1, name: '2 eggs'},
        {id: 4, recipe_id: 1, name: '2/3 cup milk'},
        {id: 5, recipe_id: 1, name: '1/4 teaspoon ground cinnamon'},
        {id: 6, recipe_id: 1, name: '1/4 teaspoon ground nutmeg'},
        {id: 7, recipe_id: 1, name: '1 teaspoon vanilla extract'},
        {id: 8, recipe_id: 1, name: 'salt to taste'}
      ]);
    });
};
