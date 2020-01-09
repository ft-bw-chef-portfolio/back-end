const db = require("../data/db-config.js");

module.exports = {
  addRecipe,
  getRecipes,
  getChefs,
  getMealTypes,
  getRecipesById,
  getRecipesByChefId,
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
  .where('r.id', id);
}

function getIngredientsByRecipeId(id) {
  return db("ingredients as ing")
  .select('ing.id', 'ing.name')
  .where('ing.recipe_id', id);
}
getRecipesByChefId

function getRecipesByChefId(id) {
  return db("recipes as r")
  // .select(*)
  .where('r.chef_id', id);
}

function getInstructionsByRecipeId(id) {
  return db("instructions as ins")
  .select('ins.id', 'ins.position', 'ins.description')
  .where('ins.recipe_id', id);
}
