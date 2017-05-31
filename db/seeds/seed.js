const fs = require('fs');
const knex = require('knex');
const randomName = require('node-random-name');
const randomWords = require('random-words');
const loremIpsum = require('lorem-ipsum')
let recipeObj;

fs.readFile('./jsonfile.json', 'utf8', function readFileCallBack(err, data) {
    if (err) {
        console.log(err); // lazy error handling
    } else {
        recipeObj = JSON.parse(data).body.recipes;
    }
});

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
        .then(() => {
          let recipeArr = [];
          for (i = 0; i < recipeObj.length; i++) {
            recipeArr.push(
              knex('recipes').insert([{ id: i+1,
              name: recipeObj[i].title,
              imageUrl: recipeObj[i].image,
              cookingTimeInMinutes: recipeObj[i].cookingMinutes,
              preparationTimeInMinutes: recipeObj[i].preparationMinutes,
              readyTimeInMinutes: recipeObj[i].readyInMinutes,
              cuisine: recipeObj[i].cuisines.length > 0 ? recipeObj[i].cuisines[recipeObj[i].cuisines.length-1] : "not available from API",
              cookingSteps: recipeObj[i].instructions.slice(0,255)
              }]))
          }
          return Promise.all(recipeArr);
        })
        .then(() => {
          const getIngredients = function(recipeObj) {
            return recipeObj.extendedIngredients.map(x => {return {
              name: x.name,
              amount: x.amount,
              measuringUnit: x.unit
            } ;})
          }
          let tmp = recipeObj.map(getIngredients).map((x) => {return x.map((y)=>{return y.name})})
          tmp = [].concat.apply([], tmp)
          let uniqueElements = []
          tmp.forEach((x) => {
            if (uniqueElements.indexOf(x) === -1) uniqueElements.push(x);
          })
          let ingredientsArr = [];
          for (i = 0; i < uniqueElements.length; i++) {
            ingredientsArr.push(
              knex('ingredients').insert([{ id: i+1,
              name: uniqueElements[i]}])
              )
          }
          return Promise.all(ingredientsArr);
        })
        .then(() => {
          let chefsArr = []
          for (i = 0; i < 50; i++) {
            // last  = randomName({last: true});
            let obj = { id: i+1,
                firstName: randomName({random: Math.random, first: true}),
                lastName: randomName({random: Math.random, last: true}),
                // description: randomWords({ min: 10, max: 30 }).join(" "),
                description: loremIpsum({ count: 1, units: 'sentences' }),
                phoneNumber: Math.round(Math.random()*1e10),
                hourlyRateInCents: Math.round(Math.random()*1e4)
            }
            obj.email = obj.firstName + obj.lastName + '@gmail.com';
            obj.password = obj.firstName + obj.lastName;
            obj.imageUrl = obj.firstName + obj.lastName + '.jpg';
            chefsArr.push(obj)
          }
          return chefsArr;
        })
        .then((res) => {
          return knex('chefs').insert(res);
        })
        .then(() => {
          let usersArr = []
          for (i = 0; i < 50; i++) {
            // last  = randomName({last: true});
            let obj = { id: i+1,
                firstName: randomName({random: Math.random, first: true}),
                lastName: randomName({random: Math.random, last: true}),
                phoneNumber: Math.round(Math.random()*1e10),
                address: loremIpsum({ count: 1, units: 'sentences' }),
                stripeToken: null
            }
            obj.email = obj.firstName + obj.lastName + '@gmail.com';
            obj.password = obj.firstName + obj.lastName;
            obj.imageUrl = obj.firstName + obj.lastName + '.jpg';
            usersArr.push(obj)
          }
          return usersArr;
        })
        .then((res) => {
          return knex('users').insert(res);
        })
        .then(() => {
          let recipe_ingredientsArr = [];
          for (i = 0; i < recipeObj.length; i++) {
            for (j = 0; j < recipeObj[i].extendedIngredients.length; j++) {
              recipe_ingredientsArr.push(
                knex('recipe_ingredients').insert([{
                recipeID: knex.select("id").from("recipes").where("name",recipeObj[i].title),
                ingredientID: knex.select("id").from("ingredients").where("name",recipeObj[i].extendedIngredients[j].name),
                amount: recipeObj[i].extendedIngredients[j].amount,
                measuringUnit: recipeObj[i].extendedIngredients[j].unitLong
              }])
              )
            }
          }
          return Promise.all(recipe_ingredientsArr);
        })
        .then(() => {
          let recipe_intolerancesArr = [];
          for (i = 0; i < recipeObj.length; i++) {
            if (recipeObj[i].glutenFree) {
              recipe_intolerancesArr.push(
                knex('recipe_intolerances').insert([{
                recipeID: knex.select("id").from("recipes").where("name",recipeObj[i].title),
                intolerance: "glutenFree",
              }])
              )}
            if (recipeObj[i].dairyFree) {
              recipe_intolerancesArr.push(
                knex('recipe_intolerances').insert([{
                recipeID: knex.select("id").from("recipes").where("name",recipeObj[i].title),
                intolerance: "dairyFree",
              }])
              )}
            }
          return Promise.all(recipe_intolerancesArr);
        })
        .then(() => {
          let recipe_dietaryRestrictionsArr = [];
          for (i = 0; i < recipeObj.length; i++) {
            if (recipeObj[i].vegetarian) {
              recipe_dietaryRestrictionsArr.push(
                knex('recipe_dietaryrestrictions').insert([{
                recipeID: knex.select("id").from("recipes").where("name",recipeObj[i].title),
                dietaryRestriction: "vegetarian",
              }])
              )}
            if (recipeObj[i].vegan) {
              recipe_dietaryRestrictionsArr.push(
                knex('recipe_dietaryrestrictions').insert([{
                recipeID: knex.select("id").from("recipes").where("name",recipeObj[i].title),
                dietaryRestriction: "vegan",
              }])
              )}
            }
          return Promise.all(recipe_dietaryRestrictionsArr);
        })
        .then(() => {
          let chef_recipesArr = [];
          counter = 0;
          for (i = 0; i < 50; i++) {
            for (j = 0; j < 25; j++) {
              chef_recipesArr.push(
                knex('chef_recipes').insert([{
                chefID: i + 1,
                recipeID: counter % 45 + 1
              }])
              )
              counter += 1
            }
          }
          return Promise.all(chef_recipesArr);
        })
        .then(() => {
          let orderArr = [];
          counter = 0;
          for (i = 0; i < 50; i++) {
            for (j = 0; j < 25; j++) {
              orderArr.push(
                knex('orders').insert([{
                  beginningDateTime: knex.fn.now(),
                  endingDateTime: knex.fn.now(),
                  ratingOrder: Math.round(Math.random()*5),
                  comment: loremIpsum({ count: 1, units: 'sentences' }),
                  userID: i + 1,
                  chefID: counter % 50 + 1,
                  orderTotal: Math.round(Math.random()*1e4),
              }])
              )
              counter += 1
            }
          }
          return Promise.all(orderArr);
        })
        .then(() => {
          let orderRecipesArr = [];
          counter = 0;
          for (i = 0; i < 50; i++) {
            for (j = 0; j < 2; j++) {
              orderRecipesArr.push(
                knex('order_recipes').insert([{
                  ratingRecipe: Math.round(Math.random()*5),
                  comment: loremIpsum({ count: 1, units: 'sentences' }),
                  orderID: i + 1,
                  recipeID: counter % 45 + 1,
              }])
              )
              counter += 1
            }
          }
          return Promise.all(orderRecipesArr);
        })
        .catch((err) => console.error(err));
};