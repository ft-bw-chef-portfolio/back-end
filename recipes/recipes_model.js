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
  removeRecipe,
  updateRecipe
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

function getRecipesById(id) {
  return db("recipes as r")
  .where('r.id', id);
}

function getIngredientsByRecipeId(id) {
  return db("ingredients as ing")
  .select('ing.id', 'ing.name')
  .where('ing.recipe_id', id);
}

function getRecipesByChefId(id) {
  return db("recipes as r")
  .where('r.chef_id', id);
}

function getInstructionsByRecipeId(id) {
  return db("instructions as ins")
  .select('ins.id', 'ins.position', 'ins.description')
  .where('ins.recipe_id', id);
}

function updateRecipe(changes, id) {
  return db("recipes")
  .where({id})
  .update(changes)
  .then(recipe => {
    return recipe
  })
}

function removeRecipe(id) {
  return db("recipes")
  .where({id})
  .delete()
  .then(recipe => {
    return null
  })
}