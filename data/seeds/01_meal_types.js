
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('meal_types').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('meal_types').insert([
        {id: 1, name: 'Breakfast', position: 1 },
        {id: 2, name: 'Lunch', position: 2 },
        {id: 3, name: 'Dinner', position: 3 },
        {id: 4, name: 'Snack', position: 4 },
        {id: 5, name: 'Dessert', position: 5 }
      ]);
    });
};
