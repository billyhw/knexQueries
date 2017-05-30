var getInfo = require("./extractValuesFromRecipeObjects");

var addRecipe = function(recipeObj) {
    for (i = 0; i < recipeObj.length; i++) {
        knex('recipes').insert([{ id: i+1, name: recipeObj[i].title, imageUrl: recipeObj[i].image, cookingTimeInMinutes: recipeObj[i].cookingMinutes + recipeObj[i].preparationMinutes, cuisine: recipeObj[i].cuisine[recipeObj[i].cuisine.length - 1]}])
    }
}

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('chef_recipes').del()
    .then(() => { return knex('recipe_dietaryrestrictions').del() })
    .then(() => { return knex('recipe_intolerances').del() })
    .then(() => { return knex('order_recipes').del() })
    .then(() => { return knex('orders').del() })
    .then(() => { return knex('recipe_ingredients').del() })
    .then(() => { return knex('recipe_equipments').del() })
      .then(() => { return knex('ingredients').del() })
      .then(() => { return knex('recipes').del() })
      .then(() => { return knex('chefs').del() })
      .then(() => { return knex('users').del() })
        .then(function () {
          return Promise.all([
            addRecipe(recipeObj);
          ]);
        })
};