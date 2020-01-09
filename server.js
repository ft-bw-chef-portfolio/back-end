const express = require('express');

// const authenticate = require('./auth/authenticate-middleware.js');
const authRouter = require('./auth/auth-router.js');
const recipesRouter = require('./recipes/recipes_router.js');

const server = express();

server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api', recipesRouter);

server.get('/', (req, res) => {
  res.status(200).json({ api: "up", dbenv: process.env.DB_ENV });
});

module.exports = server;