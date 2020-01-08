const express = require('express');

const db = require("../data/db-config.js");
const Recipes = require('./recipes_model.js');
const authenticate = require('../auth/authenticate-middleware')

const router = express.Router();

// CREATE NAEKD RECIPES
// router.post('/recipes', authenticate, (req, res) => {
//   // const newRecipe = req.body;
//   const newRecipe = {
//     chef_id: Number(req.token.subject),
//     meal_type_id: req.body.meal_type_id,
//     title: req.body.title,
//     image: req.body.image,
//     ingredients: req.body.ingredients
//   };
  
//   Recipes.addRecipe(newRecipe)
//   .then(recipe => {
//     console.log('recipe', recipe)
//     res.json({id: recipe[0]});
//   })
//   .catch(err => {
//     res.status(500).json({ message: 'Failed to add recipes' });
//   });
// });


// CREATE RECIPE WITH INGREDIENTS AND INSTRUCTIONS
router.post('/recipes', authenticate, (req, res) => {
  db.transaction(function(trx) {

    const newRecipe = {
      chef_id: Number(req.token.subject),
      meal_type_id: req.body.meal_type_id,
      title: req.body.title,
      image: req.body.image
    };

    const ingredients = req.body.ingredients;
    const instructions = req.body.instructions;
  
    return trx
      .insert(newRecipe, 'id')
      .into('recipes')
      .then(function(ids) {
        if (ingredients) {
          ingredients.forEach((ingredient) => ingredient.recipe_id = ids[0]);
          return trx('ingredients').insert(ingredients);
        } 
        if (instructions) {
          instructions.forEach((instruction) => instruction.recipe_id = ids2[0]);
          return trx('instructions').insert(instructions);          
        }
      })
  })
  .then(function(inserts) {
    console.log(inserts.length + ' new ingredients saved.');
    res.json({message: 'new recipe created'});
  })
  .catch(function(error) {
    // If we get here, that means that neither the 'Old ingredients' recipes insert,
    // nor any of the ingredients inserts will have taken place.
    console.error(error);
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
  const chef = await Recipes.getChefs(id)
  const meal_type = await Recipes.getMealTypes(id)
  const ingredients = await Recipes.getIngredientsByRecipeId(id)
  const instructions = await Recipes.getInstructionsByRecipeId(id)

  console.log('test', meal_type.find(mt => (recipe.map(r => r.meal_type_id)[0] === mt.id)))

  try{
    const mapIngredientsToRecipe = {
      id: recipe.map(r => r.id)[0],
      title: recipe.map(r => r.title)[0],
      chef: chef.find(ch => (recipe.map(r => r.chef_id)[0] === ch.id)),
      meal_type: meal_type.find(mt => (recipe.map(r => r.meal_type_id)[0] === mt.id)).name,
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

router.get('/recipes/:id/instructions', (req, res) => {
  const { id } = req.params;

  Recipes.getInstructionsByRecipeId(id)
  .then(ins => {
    if (ins) {
      res.json(ins);
    } else {
      res.status(404).json({ message: 'Could not find recipe with given id.' })
    }
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get recipes' });
  });
});

module.exports = router;