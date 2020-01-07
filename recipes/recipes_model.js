const db = require("../data/db-config.js");

module.exports = {
  addRecipe,
  getRecipes,
  getChefs,
  getMealTypes,
  getRecipesById,
  getIngredientsByRecipeId,
  getInstructionsByRecipeId,
  // getIngredients,
  // getInstructions,
  // getShoppingList,
  // getInstructions
}

function addRecipe(recipe) {
  return db('recipes').insert(recipe)
};


function getRecipes() {
  return db("recipes")
}

function getChefs() {
  return db("chefs");
}

function getMealTypes() {
  return db("meal_types");
}

// function getIngredients() {
//   return db("ingredients");
// }

// function getInstructions() {
//   return db("instructions");
// }

// function getRecipes() {
//   return db("recipes");
// }

// function getRecipes() {
//   return db("recipes");
// }

function getRecipesById(id) {
  return db("recipes as r")
  // .join('ingredients as ing', 'r.id', 'ing.recipe_id' )
  // .select('ing.name')
  .where('r.id', id);
}

function getIngredientsByRecipeId(id) {
  return db("ingredients as ing")
  // .join('ingredients as ing', 'r.id', 'ing.recipe_id' )
  .select('ing.name')
  .where('ing.recipe_id', id);
}

function getInstructionsByRecipeId(id) {
  return db("instructions as ins")
  .select('ins.description')
  .where('ins.recipe_id', id);
}

// function getShoppingList(recipe_id) {
//   return db("recipe_ingredients").where({recipe_id}).first();
// }

// function getInstructions(recipe_id) {
//   return db("instructions").where({recipe_id}).first();
// }
