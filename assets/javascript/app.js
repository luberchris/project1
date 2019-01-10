//
//
//

function addToFavorites(element){
  console.log(element.id);
}

$(document).on("click", "#submitButton", function() {
  event.preventDefault();
  
  $("#ingredHere").html("");

  var params = $("#params")
    .val()
    .trim()
    .replace(/ /g, "+");
  console.log(params);

  var queryURL =
    "https://api.yummly.com/v1/api/recipes?_app_id=30ea9a46&_app_key=3d03668731b2112fff8aac21cb03c4ca&q=" +
    params +
    "&requirePictures=true&maxResult=9"; // Add pagination '&start=###'

  console.log(queryURL);

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);

    for (var i = 0; i < response.matches.length; i++) {
      var recipeKey = response.matches[i].id;

      

      var idURL =
        "https://api.yummly.com/v1/api/recipe/" +
        recipeKey +
        "?_app_id=30ea9a46&_app_key=3d03668731b2112fff8aac21cb03c4ca";

      $.ajax({
        url: idURL,
        method: "GET"
      }).then(function(result) {
        console.log(result);

        var resultImgs = result.images[0].hostedMediumUrl;
        var recipeURL = result.source.sourceRecipeUrl;
        var recipeName = result.name;
        var ingredients = result.ingredientLines;
        var recipeLink = $("<a href='" + recipeURL + "' target='_blank'>");
        var card = $("<div class='card border-danger bg-light pt-4'>");

        
        var ingredImg = $("<img class='card-image-top' alt='card Image Cap'>");

        $(ingredImg).attr("src", resultImgs);

        recipeLink.append(ingredImg);

        var cardBody = $("<div class ='card-body'>");

        card.append(cardBody);

        var cardTitle = $("<h4 class='card-title'></h4>");

        cardTitle.text(recipeName);
        recipeLink.append("<hr>");
        recipeLink.append(cardTitle);

        cardBody.append(recipeLink);

        var cardText = $("<p class='card-text'></p>");

        cardBody.append(cardText);

        var cardTextSmall = $(
          "<small class='text-muted'></small>"
        );

        cardText.append(cardTextSmall);

        cardTextSmall.text(ingredients);

        var favorite = $('<button class="btn btn-danger" id=" '+ result.id +'" onclick="addToFavorites(this)">♥</button>')

        cardBody.append(favorite);

        $("#ingredHere").prepend(card);
      });
    }

    //  var recipeResponse = JSON.parse(response);
    //  console.log(recipeResponse.recipe.f2f_url);

    //  $("#ingredhere").html(recipeResponse.recipe.f2f_url);
    //   console.log(response);

    //  var recipeResponse = JSON.parse(response);
    //  console.log(recipeResponse.recipe.f2f_url);

    //  $("#ingredhere").html(recipeResponse.recipe.f2f_url);

    // Initialize Firebase
    // var config = {
    //     apiKey: "AIzaSyDMQKoXzxho2wVMf6eGMQRctvUAuo5I31A",
    //     authDomain: "socialpantry-29e0d.firebaseapp.com",
    //     databaseURL: "https://socialpantry-29e0d.firebaseio.com",
    //     projectId: "socialpantry-29e0d",
    //     storageBucket: "socialpantry-29e0d.appspot.com",
    //     messagingSenderId: "329527149006"
    // };
    // firebase.initializeApp(config);

    // var database = firebase.database();

    // var rUrl = recipeResponse.recipe.f2f_url;

    // database.ref().push({
    //     rUrl: rUrl,
    //     dateAdded: firebase.database.ServerValue.TIMESTAMP
    //   });
  });

  
});
