
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('chefs').truncate()
    .then(function () {
      // Inserts seed entries
      // return knex('chefs').insert([
      //   {id: 1, username: 'ignaciosm', password: 'test1234', email: 'ignaciosm@gmail.com', name: 'Ignacio San Martin', location: 'Lima, Peru', website: 'www.ignaciosm.com', phone: '(51)993575330'},
      //   {id: 2, username: 'jamieoliver', password: 'test1234', email: 'jamie@oliver.com', name: 'Jamie Oliver', location: 'London, UK', website: 'www.jamieoliver.com', phone: '987654321'}
      // ]);
    });
};
