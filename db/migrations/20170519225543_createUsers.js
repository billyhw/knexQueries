exports.up = function(knex, Promise) {
    return createUserTable()
    .then(createChefsTable)
    .then(createOrdersTable)
    .then(createRecipesTable)
    .then(createIngredientsTable)
    .then(createRecipeIngredientsTable)
    .then(createOrderRecipesTable)
    .then(createChefRecipesTable)
    .then(createRecipeIntolerancesTable)
    .then(createRecipeEquipmentsTable)
    .then(createRecipeDietaryRestrictionsTable);

    function createUserTable () {
        return knex.schema.createTable('users', function (table) {
            table.increments('id');
            table.string('firstName').notNullable();
            table.string('lastName').notNullable();
            table.string('email').notNullable().unique();
            table.string('password').notNullable();
            table.string('imageUrl');
            table.string('address').notNullable();
            table.string('stripeToken');
            table.bigInteger('phoneNumber').notNullable();
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());;
        });
    }

    function createChefsTable () {
        return knex.schema.createTable('chefs', function (table) {
            table.increments('id');
            table.string('firstName').notNullable();
            table.string('lastName').notNullable();
            table.string('email').notNullable().unique();
            table.string('password').notNullable();
            table.string('imageUrl').notNullable();
            table.string('description').notNullable();
            table.bigInteger('phoneNumber').notNullable();
            table.integer('hourlyRateInCents').notNullable();
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());;
        });
    }

    function createOrdersTable () {
        return knex.schema.createTable('orders', function (table) {
            table.increments('id');
            table.dateTime('beginningDateTime');
            table.dateTime('endingDateTime');
            table.integer('ratingOrder');
            table.string('comment');
            table.integer('userID');
            table.integer('chefID');
            table.integer('orderTotal');
            table.foreign('userID').references('users.id');
            table.foreign('chefID').references('chefs.id');
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());;
        });
    }

    function createRecipesTable () {
        return knex.schema.createTable('recipes', function (table) {
            table.increments('id');
            table.string('name').notNullable();
            table.integer('cookingTimeInMinutes');
            table.integer('preparationTimeInMinutes');
            table.integer('readyTimeInMinutes').notNullable();
            table.string('imageUrl').notNullable();
            table.string('cuisine').notNullable();
            table.string('cookingSteps');
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());;
        });
    }

    function createIngredientsTable () {
        return knex.schema.createTable('ingredients', function (table) {
            table.increments('id');
            table.string('name');
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());;
        });
    }

    function createRecipeIngredientsTable () {
        return knex.schema.createTable('recipe_ingredients', function (table) {
            table.float('amount');
            table.integer('ingredientID');
            table.integer('recipeID');
            table.string('measuringUnit');
            table.foreign('ingredientID').references('ingredients.id');
            table.foreign('recipeID').references('recipes.id');
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());;
        });
    }

    function createOrderRecipesTable () {
        return knex.schema.createTable('order_recipes', function (table) {
            table.integer('ratingRecipe');
            table.string('comment');
            table.integer('orderID');
            table.integer('recipeID');
            table.foreign('orderID').references('orders.id');
            table.foreign('recipeID').references('recipes.id');
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());;
        });
    }

    function createChefRecipesTable () {
        return knex.schema.createTable('chef_recipes', function(table) {
            table.integer('chefID');
            table.integer('recipeID');
            table.foreign('chefID').references('chefs.id');
            table.foreign('recipeID').references('recipes.id');
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());;
        });
    }

    function createRecipeIntolerancesTable () {
        return knex.schema.createTable('recipe_intolerances', function(table) {
            table.string('intolerance');
            table.integer('recipeID');
            table.foreign('recipeID').references('recipes.id');
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());;
        });
    }

    function createRecipeEquipmentsTable () {
        return knex.schema.createTable('recipe_equipments', function(table) {
            table.string('equipment');
            table.integer('recipeID');
            table.foreign('recipeID').references('recipes.id');
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());;
        });
    }

    function createRecipeDietaryRestrictionsTable () {
        return knex.schema.createTable('recipe_dietaryrestrictions', function(table) {
            table.string('dietaryRestriction');
            table.integer('recipeID');
            table.foreign('recipeID').references('recipes.id');
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());;
        });
    }

};

exports.down = function(knex, Promise) {
    return dropRecipeDietaryRestrictionsTable()
    .then(dropRecipeEquipmentsTable)
    .then(dropRecipeIntolerancesTable)
    .then(dropChefRecipes)
    .then(dropOrderRecipes)
    .then(dropRecipeInredients)
    .then(dropIngredients)
    .then(dropRecipes)
    .then(dropOrders)
    .then(dropChefs)
    .then(dropUsers);


    function dropUsers () {
        return knex.schema.dropTableIfExists('users')
    }

    function dropChefs () {
        return knex.schema.dropTableIfExists('chefs')
    }

    function dropOrders () {
        return knex.schema.dropTableIfExists('orders')
    }

    function dropRecipes () {
        return knex.schema.dropTableIfExists('recipes')
    }

    function dropIngredients () {
        return knex.schema.dropTableIfExists('ingredients')
    }

    function dropRecipeInredients () {
        return knex.schema.dropTableIfExists('recipe_ingredients')
    }

    function dropOrderRecipes () {
        return knex.schema.dropTableIfExists('order_recipes')
    }

    function dropChefRecipes () {
        return knex.schema.dropTableIfExists('chef_recipes')
    }

    function dropRecipeIntolerancesTable () {
        return knex.schema.dropTableIfExists('recipe_intolerances')
    }

    function dropRecipeEquipmentsTable () {
        return knex.schema.dropTableIfExists('recipe_equipments')
    }
    function dropRecipeDietaryRestrictionsTable () {
        return knex.schema.dropTableIfExists('recipe_dietaryrestrictions')
    }

};
