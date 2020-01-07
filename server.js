const express = require('express');

const RecipesRouter = require('./recipes/recipes_router.js');

const server = express();

server.use(express.json());
server.use('/api', RecipesRouter);

module.exports = server;