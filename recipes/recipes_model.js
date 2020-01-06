const db = require("../data/db-config.js");

module.exports = {
  getRecipes,
  getRecipesById,
  getIngredients,
  getInstructions,
  getShoppingList,
  getInstructions
}

function getRecipes() {
  return db("recipes");
}

function getIngredients() {
  return db("ingredients");
}

function getInstructions() {
  return db("instructions");
}

// function getRecipes() {
//   return db("recipes");
// }

// function getRecipes() {
//   return db("recipes");
// }

function getRecipesById(id) {
  return db("recipes").where({id}).first();
}

function getShoppingList(recipe_id) {
  return db("recipe_ingredients").where({recipe_id}).first();
}

function getInstructions(recipe_id) {
  return db("instructions").where({recipe_id}).first();
}
