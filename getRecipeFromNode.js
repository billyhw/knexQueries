// These code snippets use an open-source library. http://unirest.io/nodejs

const unirest = require('unirest');
const fs = require('fs');

// These code snippets use an open-source library. http://unirest.io/nodejs
// unirest.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/479101/information?includeNutrition=false")
//         .header("X-Mashape-Key", "2HS3QW2ddJmshmp1P69T5wIg21Wap1bULZxjsnMxKtafayYhn1")
//         .header("Accept", "application/json")
//         .end(function (result) {
//             const json = JSON.stringify(result);
//             fs.writeFile('jsonfile.json', json)
//         });

// unirest.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/random?limitLicense=false&number=50")
//     .header("X-Mashape-Key", "2HS3QW2ddJmshmp1P69T5wIg21Wap1bULZxjsnMxKtafayYhn1")
//     .header("Accept", "application/json")
//     .end(function (result) {
//       fs.writeFile('jsonfile05312017.json', JSON.stringify(result))
//     });



unirest.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/random?limitLicense=false&number=50")
    .header("X-Mashape-Key", "rvDRHtqfpxmsh3Vrk3SdZRPd6aUop1lXt5fjsnNrDvbdJnVPhU")
    .header("Accept", "application/json")
    .end(function (result) {
      fs.writeFile('jsonfile05312017FromKen.json', JSON.stringify(result))
    });
