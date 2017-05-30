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

app.post("/", (req, res) => {
  // select count(name) as count, name from recipes join recipe_ingredients on (id = "recipeID") where "ingredientID" IN (1 , 2, 3, 4, 5) group by "id" having count >= 3;
    let query = req.body.search.split(',');
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
            res.send(`<html><body> ${result.map((x) => {return x.name})} </body></html>`);
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

app.post("/chef", (req, res) => {
  // select count(name) as count, name from recipes join recipe_ingredients on (id = "recipeID") where "ingredientID" IN (1 , 2, 3, 4, 5) group by "id" having count >= 3;
    let query = req.body.search.split(',');
    console.log(query)
    knex
      .select("id")
      .from("chefs")
      .whereIn("email", query)
      .then((result) => {
        return result.map(x => {return x.id});
        // console.log("query:",result)
      })
      .then((result) => {
        console.log("result:", result)
        knex
          .select("name")
          .from("recipes")
          .join("chef_recipes", 'id', 'recipeID')
          .where("chefID", "=", result[0])
          .then((result) => {
            console.log("res:", res)
            res.send(`<html><body> ${result.map((x) => {return x.name})} </body></html>`);
          })
        })
        .catch((err) => { console.error(err); });
  });
