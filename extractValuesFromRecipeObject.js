const fs = require('fs');

fs.readFile('./jsonfile.json', 'utf8', function readFileCallBack(err, data) {
    if (err) {
        console.log(err); // lazy error handling
    } else {
        recipeObj = JSON.parse(data).body.recipes;
    }
});

// Get ingredients
const getIngredients = function(recipeObj) {
    return recipeObj.extendedIngredients.map(x => {return {
        name: x.name,
        amount: x.amount,
        measuringUnit: x.unit
        } ;})
}

var tmp = recipeObj.map(getIngredients).map((x) => {return x.map((y)=>{return y.name})})
tmp = [].concat.apply([], tmp)
var uniqueElements = []
tmp.forEach((x) => {
    if (uniqueElements.indexOf(x) === -1) uniqueElements.push(x);
})

// Get intolerances
const getIntolerance = function(recipeObj) {
    intolerances = [];
    if (recipeObj.glutenFree) dietaryRestrictions.push("glutenFree");
    if (recipeObj.dairyFree) dietaryRestrictions.push("dairyFree");
    return dietaryRestrictions
};

// Get equipments
// const getEquipments = function(recipeObj) {
//     arr = recipeObj.analyzedInstructions[0].steps.map(x => {return x.equipment.map( x => { return x.name } ) } );
//     arr = [].concat.apply([], arr);
//     uniqueElements = [arr[0]];
//     arr.forEach( x => { if (uniqueElements.indexOf(x) === -1) {
//             uniqueElemnts.push(x)
//         }
//     })
//     return uniqueElements
// };

// Get dietary restrictions
const getDietaryRestrictions = function(recipeObj) {
    dietaryRestrictions = [];
    if (recipeObj.vegetarian) intolerances.push("vegetarian");
    if (recipeObj.vegan) intolerances.push("vegan");
    return intolerances
};

// Get cooking time
const getCookingTime = function(recipeObj) {
    return recipeObj.cookingMinutes
}

// Get image
const getImage = function(recipeObj) {
    return recipeObj.image
}

// Get instruction (note this returns Analyzed instructions, an array)
const getInstruction = function(recipeObj) {
    return recipeObj.analyzedInstructions
}

// Get cuisines
const getCuisines = function(recipeObj) {
    return recipeObj.cuisines
}

// Get Title
const getTitle = function(recipeObj) {
    return recipeObj.title
}