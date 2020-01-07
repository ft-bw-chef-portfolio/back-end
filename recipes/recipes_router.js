const express = require('express');

const db = require("../data/db-config.js");
const Recipes = require('./recipes_model.js');
const authenticate = require('../auth/authenticate-middleware')

const router = express.Router();

router.post('/recipes', authenticate, (req, res) => {
  // const newRecipe = req.body;
  const newRecipe = {
    chef_id: Number(req.token.subject),
    meal_type_id: req.body.meal_type_id,
    title: req.body.title,
    image: req.body.image
  };
  
  Recipes.addRecipe(newRecipe)
  .then(recipe => {
    console.log('chef id', req.token.subject)
    res.json(recipe);
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to add recipes 456' });
  });
});

router.get('/recipes', (req, res) => {
  Recipes.getRecipes()
  .then(recipes => {
    res.json(recipes);
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get recipes' });
  });
});

router.get('/chefs', (req, res) => {
  Recipes.getChefs()
  .then(chefs => {
    res.json(chefs);
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get chefs' });
  });
});

router.get('/meal_types', (req, res) => {
  Recipes.getMealTypes()
  .then(mealtypes => {
    res.json(mealtypes);
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get meal types' });
  });
});

router.get('/recipes/:id', async (req, res) => {
  const { id } = req.params;
  
  const recipe = await Recipes.getRecipesById(id)
  const ingredients = await Recipes.getIngredientsByRecipeId(id)
  const instructions = await Recipes.getInstructionsByRecipeId(id)

  try{
    const mapIngredientsToRecipe = {
      id: recipe.map(r => r.id)[0],
      title: recipe.map(r => r.title)[0],
      image: recipe.map(r => r.image)[0],
      ingredients: ingredients.map(ing => ing.name),
      instructions: instructions.map(ins => ins.description)
    }
    if (recipe && ingredients) {
      res.status(200).json(mapIngredientsToRecipe);
    } else {
        res.status(404).json({ message: 'Could not find recipe with given id.' })
      } 

  } catch(err) {
    res.status(500).json({ message: 'Failed to get recipes' });
  }


  // .then(recipe => {
  //   if (recipe) {
  //     res.json(recipe);
  //   } else {
  //     res.status(404).json({ message: 'Could not find recipe with given id.' })
  //   }
  // })
  // .catch(err => {
  //   res.status(500).json({ message: 'Failed to get recipes' });
  // });
});


router.get('/recipes/:id/ingredients', (req, res) => {
  const { id } = req.params;

  Recipes.getIngredientsByRecipeId(id)
  .then(ing => {
    if (ing) {
      res.json(ing);
    } else {
      res.status(404).json({ message: 'Could not find recipe with given id.' })
    }
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get recipes' });
  });
});

module.exports = router;