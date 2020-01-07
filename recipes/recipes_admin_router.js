const express = require('express');

const db = require("../data/db-config.js");
const Recipes = require('./recipes_model.js');

const router = express.Router();

router.post('/recipes', (req, res) => {
  const newRecipe = {
    chef_id: Number(req.headers.id),
    meal_type_id: req.body.meal_type_id,
    title: req.body.title,
    image: req.body.image
  };
  
  Recipes.addRecipe(newRecipe)
  .then(recipe => {
    res.json(recipe);
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to add recipes 123' });
  });
});

module.exports = router;