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
        } else if (instructions) {
          instructions.forEach((instruction) => instruction.recipe_id = ids[0]);
          return trx('instructions').insert(instructions);              
        }
      })
      .then(function(ids) {
        if (instructions && ingredients) {
          instructions.forEach((instruction) => instruction.recipe_id = ingredients.map(ing => ing.recipe_id)[0]);
          return trx('instructions').insert(instructions);              
        }
      })
  })
  .then(function(inserts) {
    res.json({message: 'new recipe created'});
  })
  .catch(function(error) {
    console.error(error);
  });
});

// GET RECIPE LIST
router.get('/recipes', (req, res) => {
  Recipes.getRecipes()
  .then(recipes => {
    res.json(recipes);
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get recipes' });
  });
});

// DELETE RECIPE
router.delete('/recipes/:id', authenticate, (req, res) => {
  const { id } = req.params;
  Recipes.removeRecipe(id)
  .then(deleted => {
    if (deleted) {
      res.json({ removed: deleted });
    } else {
      res.status(404).json({ message: 'Could not find recipe with given id' });
    }
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to delete recipe' });
  });
});

// UPDATE RECIPE
router.put('/recipes/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  Recipes.getRecipesById(id)
  .then(recipe => {
    if (recipe) {
      Recipes.updateRecipe(changes, id)
      .then(updatedRecipe => {
        res.json(updatedRecipe);
      });
    } else {
      res.status(404).json({ message: 'Could not find recipe with given id' });
    }
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to update recipe' });
  });
});

// // DELETE INGREDIENT
// router.delete('/recipes/:id', (req, res) => {
//   const { id } = req.params;
//   Recipes.removeRecipe(id)
//   .then(deleted => {
//     if (deleted) {
//       res.json({ removed: deleted });
//     } else {
//       res.status(404).json({ message: 'Could not find recipe with given id' });
//     }
//   })
//   .catch(err => {
//     res.status(500).json({ message: 'Failed to delete recipe' });
//   });
// });



// GET CHEFS
router.get('/chefs', (req, res) => {
  Recipes.getChefs()
  .then(chefs => {
    res.json(chefs);
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get chefs' });
  });
});

// GET RECIPE LIST BY CHEF
router.get('/chefs/:id/recipes', (req, res) => {
  const { id } = req.params;

  Recipes.getRecipesByChefId(id)
  .then(recipes => {
    if (recipes) {
      res.json(recipes);
    } else {
      res.status(404).json({ message: 'Could not find recipe with given id.' })
    }
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get recipes' });
  });
});

// GET MEAL TYPES
router.get('/meal_types', (req, res) => {
  Recipes.getMealTypes()
  .then(mealtypes => {
    res.json(mealtypes);
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get meal types' });
  });
});

// GET RECIPE DETAILS
router.get('/recipes/:id', async (req, res) => {
  const { id } = req.params;
  const recipe = await Recipes.getRecipesById(id)
  const chef = await Recipes.getChefs(id)
  const meal_type = await Recipes.getMealTypes(id)
  const ingredients = await Recipes.getIngredientsByRecipeId(id)
  const instructions = await Recipes.getInstructionsByRecipeId(id)

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

// GET INGREDIENTS FROM RECIPE
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


// GET INGREDIENT DETAIL FROM RECIPE
router.get('/recipes/:recipe_id/ingredients/:ing_id', (req, res) => {
  const recipe_id = req.params.recipe_id;
  const ing_id = req.params.ing_id;

  Recipes.getIngredientByIdByRecipeId(recipe_id, ing_id)
  .then(ing => {
    if (ing) {
      res.json(ing);
    } else {
      res.status(404).json({ message: `Could not find ingredient ${ing_id} in recipe ${recipe_id}.` })
    }
  })
  .catch(err => {
    res.status(500).json({ message: `Failed to get this ingredient ${ing_id} in recipe ${recipe_id}` });
  });
});

// UPDATE INGREDIENT FROM RECIPE
router.put('/recipes/:recipe_id/ingredients/:ing_id', authenticate, (req, res) => {
  const recipe_id = req.params.recipe_id;
  const ing_id = req.params.ing_id;
  const changes = req.body;

  Recipes.getIngredientByIdByRecipeId(recipe_id, ing_id)
  .then(ing => {
    if (ing) {
      Recipes.updateIngredient(changes, ing_id)
      .then(updatedIng => {
        res.json(updatedIng);
      });
    } else {
      res.status(404).json({ message: `Could not update ingredient ${ing_id} in recipe ${recipe_id}.` })
    }
  })
  .catch(err => {
    res.status(500).json({ message: `Failed to update this ingredient ${ing_id} in recipe ${recipe_id}` });
  });
});

// DELETE INGREDIENT FROM RECIPE
router.put('/recipes/:recipe_id/ingredients/:ing_id', authenticate,  (req, res) => {
  const recipe_id = req.params.recipe_id;
  const ing_id = req.params.ing_id;

  Recipes.getIngredientByIdByRecipeId(recipe_id, ing_id)
  .then(ing => {
    if (ing) {
      Recipes.removeIngredient(ing_id)
      .then(deletedIng => {
        res.json(deletedIng);
      });
    } else {
      res.status(404).json({ message: `Could not delete ingredient ${ing_id} in recipe ${recipe_id}.` })
    }
  })
  .catch(err => {
    res.status(500).json({ message: `Failed to delete this ingredient ${ing_id} in recipe ${recipe_id}` });
  });
});

// GET INSTRUCTION DETAIL FROM RECIPE
router.get('/recipes/:recipe_id/instructions/:ins_id', (req, res) => {
  const recipe_id = req.params.recipe_id;
  const ins_id = req.params.ins_id;

  Recipes.getInstructionByIdByRecipeId(recipe_id, ins_id)
  .then(ins => {
    if (ins) {
      res.json(ins);
    } else {
      res.status(404).json({ message: `Could not find instruction ${ins_id} in recipe ${recipe_id}.` })
    }
  })
  .catch(err => {
    res.status(500).json({ message: `Failed to get this instruction ${ins_id} in recipe ${recipe_id}` });
  });
});

// UPDATE INSTRUCTION FROM RECIPE
router.put('/recipes/:recipe_id/instructions/:ins_id', authenticate,  (req, res) => {
  const recipe_id = req.params.recipe_id;
  const ins_id = req.params.ins_id;
  const changes = req.body;

  Recipes.getInstructionByIdByRecipeId(recipe_id, ins_id)
  .then(ins => {
    if (ins) {
      Recipes.updateInstruction(changes, ins_id)
      .then(updatedIng => {
        res.json(updatedIng);
      });
    } else {
      res.status(404).json({ message: `Could not update instruction ${ins_id} in recipe ${recipe_id}.` })
    }
  })
  .catch(err => {
    res.status(500).json({ message: `Failed to update this instruction ${ins_id} in recipe ${recipe_id}` });
  });
});

// DELETE INSTRUCTION FROM RECIPE
router.put('/recipes/:recipe_id/instructions/:ins_id', authenticate,  (req, res) => {
  const recipe_id = req.params.recipe_id;
  const ins_id = req.params.ins_id;

  Recipes.getInstructionByIdByRecipeId(recipe_id, ins_id)
  .then(ins => {
    if (ins) {
      Recipes.removeInstruction(ins_id)
      .then(deletedIng => {
        res.json(deletedIng);
      });
    } else {
      res.status(404).json({ message: `Could not delete instruction ${ins_id} in recipe ${recipe_id}.` })
    }
  })
  .catch(err => {
    res.status(500).json({ message: `Failed to delete this instruction ${ins_id} in recipe ${recipe_id}` });
  });
});

// GET INSTRUCTIONS FROM RECIPE
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