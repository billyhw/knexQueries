// required modules
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

require('dotenv').config();

const ENV         = process.env.ENV || "development";
const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const knexLogger  = require('knex-logger');

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/", (req, res) => {
    res.render("index");
  });

app.post("/ingredients", (req, res) => {
  // select count(name) as count, name from recipes join recipe_ingredients on (id = "recipeID") where "ingredientID" IN (1 , 2, 3, 4, 5) group by "id" having count >= 3;
  let query = req.body.search.split(',').map((x) => { return x.trim(); });
  console.log(query)
  knex
    .select("id")
    .from("ingredients")
    .whereIn("name", query)
    .then((result) => {
      return result.map(x => {return x.id});
      // console.log("query:",result)
    })
    .then((result) => {
      console.log("result:", result)
      knex
        .count("name")
        .select("name")
        .from("recipes")
        .join("recipe_ingredients", 'id', 'recipeID')
        .whereIn("ingredientID", result)
        .groupBy("name")
        .having(knex.raw("count(name)"), "=", result.length)
        .then((result) => {
          console.log("res:", res)
          res.send(`<html><body> ${JSON.stringify(result)} </body></html>`);
        })
      })
      .catch((err) => { console.error(err); });
});

app.post("/recipe", (req, res) => {
  // select count(name) as count, name from recipes join recipe_ingredients on (id = "recipeID") where "ingredientID" IN (1 , 2, 3, 4, 5) group by "id" having count >= 3;
    let query = req.body.search.split(',');
    console.log(query)
    knex
      .select("id")
      .from("recipes")
      .whereIn("name", query)
      .then((result) => {
        return result.map(x => {return x.id});
        // console.log("query:",result)
      })
      .then((result) => {
        console.log("result:", result)
        knex
          .count("email")
          .select("email")
          .from("chefs")
          .join("chef_recipes", 'id', 'chefID')
          .whereIn("recipeID", result)
          .groupBy("email")
          .having(knex.raw("count(email)"), "=", result.length)
          .then((result) => {
            console.log("res:", res)
            res.send(`<html><body> ${result.map((x) => {return x.email})} </body></html>`);
          })
        })
        .catch((err) => { console.error(err); });
  });

app.post("/recipe_search", (req, res) => {
  let query = req.body.search;
  query = query.split(" ").filter((x) => { return x !== ""; }).join(" ");
  console.log(query);
  knex
    .select("recipes.name as recipeName", "recipes.imageUrl", "recipes.cuisine", "recipes.cookingTimeInMinutes", "ingredients.name as ingredientName")
    .from("recipes")
    .join("recipe_ingredients", "recipes.id", "recipe_ingredients.recipeID")
    .join("ingredients", "ingredients.id", "recipe_ingredients.ingredientID")
    .where("recipes.name", "~*", `.*${query}.*`)
    .then((result) => {
      // console.log("recipe search result:",result)
      res.send(`<html><body> ${JSON.stringify(result)} </body></html>`);
    })
    .catch((err) => { console.error(err); });
});

// app.post("/recipe", (req, res) => {
//   let query = req.body.search;
//   console.log(query);
//   knex
//     .select("recipes.name as recipeName", "recipes.imageUrl", "recipes.cuisine", "recipes.cookingTimeInMinutes", "ingredients.name as ingredientName")
//     .from("recipes")
//     .join("recipe_ingredients", "recipes.id", "recipe_ingredients.recipeID")
//     .join("ingredients", "ingredients.id", "recipe_ingredients.ingredientID")
//     .where("recipes.name", query)
//     .then((result) => {
//       console.log("recipe search result:", result)
//       res.send(`<html><body> ${JSON.stringify(result)} </body></html>`);
//     })
//     .then(() => {

//     })
//     .catch((err) => { console.error(err); });
// });

// app.post("/chef", (req, res) => {
//   // select count(name) as count, name from recipes join recipe_ingredients on (id = "recipeID") where "ingredientID" IN (1 , 2, 3, 4, 5) group by "id" having count >= 3;
//     let query = req.body.search;
//     console.log(query)
//     knex
//       .select("chefs.firstName", "chefs.lastName", "chefs.email", "chefs.phoneNumber", "chefs.hourlyRateInCents", "chefs.description", "orders.id as orderID", "orders.orderTotal", "users.firstName as usersFirstName", "users.lastName as usersLastName", "recipes.name as recipeName" )
//       .from("chefs")
//       .join("orders", "chefs.id", "orders.chefID")
//       .join("users", "orders.userID", "users.id")
//       .join("order_recipes", "orders.id", "order_recipes.orderID")
//       .join("recipes", "order_recipes.recipeID", "recipes.id")
//       .whereIn("chefs.email", query)
//       .then((result) => {
//         console.log("chefs result:",result)
//         res.send(`<html><body> ${JSON.stringify(result)} </body></html>`);
//       })
//       .catch((err) => { console.error(err); });
//   });

app.post("/chef", (req, res) => {
  // select count(name) as count, name from recipes join recipe_ingredients on (id = "recipeID") where "ingredientID" IN (1 , 2, 3, 4, 5) group by "id" having count >= 3;
    let query = req.body.search;
    console.log(query);
    let resultObj = {};
    knex
      .select("chefs.firstName", "chefs.lastName", "chefs.email", "chefs.phoneNumber", "chefs.hourlyRateInCents", "chefs.description")
      .from("chefs")
      .whereIn("chefs.email", query)
      .then((result) => {
        resultObj = result[0];
        console.log("users result:",resultObj)
      })
      .then(() => {
        knex
          .select("orders.id as orderID", "orders.orderTotal", "users.firstName as usersFirstName", "users.lastName as usersLastName", "recipes.name as recipeName")
          .from("chefs")
          .join("orders", "chefs.id", "orders.chefID")
          .join("users", "orders.userID", "users.id")
          .join("order_recipes", "orders.id", "order_recipes.orderID")
          .join("recipes", "order_recipes.recipeID", "recipes.id")
          .whereIn("chefs.email", query)
          .then((result) => {
            resultObj.orderHistory = result;
            console.log("users result:",result);
            res.send(`<html><body> ${JSON.stringify(resultObj)} </body></html>`);
          })
          .catch((err) => { console.error(err); });
      });
  });

app.post("/user", (req, res) => {
  // select count(name) as count, name from recipes join recipe_ingredients on (id = "recipeID") where "ingredientID" IN (1 , 2, 3, 4, 5) group by "id" having count >= 3;
    let query = req.body.search;
    console.log(query);
    let resultObj = {};
    // let resultObj
    knex
      .select("users.firstName", "users.lastName", "users.email", "users.phoneNumber", "users.imageUrl", "users.address")
      .from("users")
      .whereIn("users.email", query)
      .then((result) => {
        resultObj = result[0];
        console.log("users result:",resultObj)
        // res.send(`<html><body> ${JSON.stringify(result)} </body></html>`);
      })
      .then(() => {
        knex
          .select("orders.id as orderID", "orders.orderTotal", "chefs.firstName as chefFirstName", "chefs.lastName as chefLastName", "recipes.name as recipeName" )
          .from("users")
          .join("orders", "users.id", "orders.userID")
          .join("chefs", "orders.chefID", "chefs.id")
          .join("order_recipes", "orders.id", "order_recipes.orderID")
          .join("recipes", "order_recipes.recipeID", "recipes.id")
          .whereIn("users.email", query)
          .then((result) => {
            resultObj.orderHistory = result;
            console.log("users result:",resultObj);
            res.send(`<html><body> ${JSON.stringify(resultObj)} </body></html>`);
          })
          .catch((err) => { console.error(err); });
      })
    });
