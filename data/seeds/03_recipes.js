
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('recipes').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('recipes').insert([
        {id: 1, title: 'French Toast', chef_id: 1, meal_type_id: 1, image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1547&q=80' },
        {id: 2, title: 'Glass of Water', chef_id: 1, meal_type_id: 4, image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=635&q=80' },
      ]);
    });
};
