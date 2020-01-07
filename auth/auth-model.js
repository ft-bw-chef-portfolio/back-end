const db = require('../data/db-config');
const jwt = require('jsonwebtoken');

module.exports = {
  // all,
  create,
  findBy,
  signToken
};

// function all() {
//   return db('users')
// };

function create(chef) {
  return db('chefs').insert(chef)
};

function findBy(filter) {
  return db('chefs').where(filter)
};

function signToken(chef) {
  const payload = {
    subject: chef.id
  };
  const secret = process.env.JWT_SECRET || "senorita potatito del peru";
  const options = {
    expiresIn: '1h'
  }

  return jwt.sign(payload, secret, options)
}