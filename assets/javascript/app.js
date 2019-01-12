
// Initialize firebase
var config = {
  apiKey: "AIzaSyDMQKoXzxho2wVMf6eGMQRctvUAuo5I31A",
  authDomain: "socialpantry-29e0d.firebaseapp.com",
  databaseURL: "https://socialpantry-29e0d.firebaseio.com",
  projectId: "socialpantry-29e0d",
  storageBucket: "socialpantry-29e0d.appspot.com",
  messagingSenderId: "329527149006"
 };

firebase.initializeApp(config);

var database = firebase.database();

function addToFavorites(element) {
  console.log(element.id);
}

function hash(s) {
  /* Simple hash function. */
  s = s.toString();
  var a = 1,
    c = 0,
    h,
    o;
  if (s) {
    a = 0;
    /*jshint plusplus:false bitwise:false*/
    for (h = s.length - 1; h >= 0; h--) {
      o = s.charCodeAt(h);
      a = ((a << 6) & 268435455) + o + (o << 14);
      c = a & 266338304;
      a = c !== 0 ? a ^ (c >> 21) : a;
    }
  }
  return String(a);
}


//on click to perform the initial receipe search 
$(document).on("click", "#submitButton", function() {
  event.preventDefault();


  //clear dom for new search results

  $("#ingredHere").html("");

  //turn search terms into parameters for passing into the query URL
  var params = $("#params")
    .val()
    .trim()
    .replace(/ /g, "+");
  console.log(params);

  //yummly query URL for initial recipe search

  var queryURL =
    "https://api.yummly.com/v1/api/recipes?_app_id=30ea9a46&_app_key=3d03668731b2112fff8aac21cb03c4ca&q=" +
    params +
    "&requirePictures=true&maxResult=9"; // Add pagination '&start=###'

  console.log(queryURL);


  //initial ajax call to get search results

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);


    //loop that iterates over responses to add recipe IDs as an attribute 

    for (var i = 0; i < response.matches.length; i++) {
      var recipeKey = response.matches[i].id;
      recipeIndex = hash(recipeKey);

      //secondary api URL that returns individual recipe results using recipe key as identifier

      var idURL =
        "https://api.yummly.com/v1/api/recipe/" +
        recipeKey +
        "?_app_id=30ea9a46&_app_key=3d03668731b2112fff8aac21cb03c4ca";


      //secondary AJAX call to return the individual results 
      $.ajax({
        url: idURL,
        method: "GET"
      }).then(function(result) {

        

        //variables assigning JSON elements from API call

        var resultImgs = result.images[0].hostedMediumUrl;
        var recipeURL = result.source.sourceRecipeUrl;
        var recipeName = result.name;
        var ingredientsRaw = result.ingredientLines;


        //variables to build recipe cards
        var recipeLink = $("<a href='" + recipeURL + "' target='_blank'>");
        var card = $("<div class='card border-danger bg-light pt-4'>");
        var cardBody = $("<div class ='card-body'>");
        var cardTitle = $("<h4 class='card-title'></h4>");
        var cardText = $("<p class='card-text'></p>");
        var cardTextSmall = $("<small class='text-muted'></small>");
        var ingredImg = $("<img class='card-image-top' alt='card Image Cap'>");
        var favorite = $('<button class="btn btn-danger" id=" '+ result.id +'" onclick="addToFavorites(this)">♥</button>')

        //add links to returned images
        $(ingredImg).attr("src", resultImgs);

        //build cards to house results
        recipeLink.append(ingredImg);
        card.append(cardBody);
        cardTitle.text(recipeName);
        recipeLink.append("<hr>");
        recipeLink.append(cardTitle);
        cardBody.append(recipeLink);
        cardBody.append(cardText);
        cardText.append(cardTextSmall);
        cardTextSmall.text(ingredientsRaw);
        cardBody.append(favorite);

    
        //add ingredients to DOM 
        $("#ingredHere").prepend(card);

        fetch("https://zestful-upenn-1.herokuapp.com/parseIngredients", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ingredients: ingredientsRaw
          })
        }).then(function(response) {
          // Check for successful response from Zestful server.
          if (response.status !== 200) {
            console.log("Error talking to Zestful server: " + response.status);
            return;
          }

          // Process the response from Zestful.
          response.json().then(function(data) {
            // Check for application-level errors.
            if (data.error) {
              console.log(`Failed to process ingredients: ${data.error}`);
              return;
            }

            // Iterate through each ingredient result.
            data.results.forEach(function(result) {
              // Check if Zestful processed this ingredient successfully.
              if (result.error) {
                console.log(
                  `Error processing ingredient ${result.ingredientRaw}: ${
                    result.error
                  }`
                );
                return;
              }

              // if (result.ingredientParsed.product != null) {
              //   // TODO: Handle ingredient result
              //   console.log(result.ingredientParsed.product);
              // }
            });
          });
        });
      });
    }

  });


});

$(document).on("click", "#loginButton", function() {
  console.log("login clicked");
  $('#myModal').modal('show')
//document.modal.style.display='block';
});
      var access_key = '6b78fa23cc5f74ceb6bd5d5b42e5a455';
      var email = '';

      // This function handles events where one button is clicked
      $("#add-email").on("click", function(event) {
        // Preventing the buttons default behavior when clicked (which is submitting a form)
        event.preventDefault();
        // This line grabs the input from the textbox
        var email = $("#email-input").val().trim();
        var password = $("#password-input").val().trim();
        var username = $("#username-input").val().trim();
         // verify email address via AJAX call
        $.ajax({
        url: 'http://apilayer.net/api/check?access_key=' + access_key + '&email=' + email,   
        dataType: 'jsonp',
        success: function(json) {

        // Access and use your preferred validation result objects
        console.log(json.format_valid);
        console.log(json.smtp_check);
        console.log(json.score);

        // if email score is sufficient, we redirect user to our actual app homepage
        if (json.score > .7 && json.format_valid == true && json.smtp_check == true && password.length > 5 && username.length > 5) {
          $("#myModal").modal("hide");
          console.log(email);
          console.log(password);
          console.log(password.length);
          console.log(username);
 
       var userData = {
         email: email,
         password: password,
         savedRecipes: [],
         dateAdded: firebase.database.ServerValue.TIMESTAMP,
       }
       
     //push user's email to firebase
      database.ref('users/' + username).set(userData);
           // $(location).attr('href', 'https://luberchris.github.io/project1/index.html');
        }
        // otherwise print error message to the dom
        else {
            $("#email-invalid").empty();
            $("#email-invalid").text("Invalid email and/or too short of a password , please enter again");
        }
  
       //database.ref('users/' + username).update(updates);

      //var updates = {
         // savedRecipes: ["cheese", "onions", "bacon"]
      //  }

       database.ref('users/' + "woatthbewruoigtuso").once('value').then(function(snapshot){
        console.log(snapshot.val().email);
        console.log(snapshot.val().savedRecipes);
      })
     }
    
   })


});



fetch("https://zestful-upenn-1.herokuapp.com/parseIngredients", {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    ingredients: ingredientRaw
  })
}).then(function(response) {
  // Check for successful response from Zestful server.
  if (response.status !== 200) {
    console.log("Error talking to Zestful server: " + response.status);
    return;
  }

  // Process the response from Zestful.
  response.json().then(function(data) {
    // Check for application-level errors.
    if (data.error) {
      console.log(`Failed to process ingredients: ${data.error}`);
      return;
    }

    // Iterate through each ingredient result.
    data.results.forEach(function(result) {
      // Check if Zestful processed this ingredient successfully.
      if (result.error) {
        console.log(
          `Error processing ingredient ${result.ingredientRaw}: ${result.error}`
        );
        return;
      }

      // TODO: Handle ingredient result
      console.log(result.ingredientParsed);
    });
  });
});

var shoppinglist = [];

$(document).on("click", ".favoriteButton", function() {
  event.preventDefault();
  console.log("Favorited: " + this.id);

  var yummlyURL =
    "https://api.yummly.com/v1/api/recipe/" +
    this.id.trim() +
    "?_app_id=30ea9a46&_app_key=3d03668731b2112fff8aac21cb03c4ca";

  $.ajax({
    url: yummlyURL,
    method: "GET"
  }).then(function(result) {
    fetch("https://zestful-upenn-1.herokuapp.com/parseIngredients", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ingredients: result.ingredientLines
      })
    }).then(function(response) {
      // Check for successful response from Zestful server.
      if (response.status !== 200) {
        console.log("Error talking to Zestful server: " + response.status);
        return;
      }

      // Process the response from Zestful.
      response.json().then(function(data) {
        // Check for application-level errors.
        if (data.error) {
          console.log(`Failed to process ingredients: ${data.error}`);
          return;
        }

        total = 0;
        // Iterate through each ingredient result.
        data.results.forEach(function(result) {
          total += 1;
          // Check if Zestful processed this ingredient successfully.
          if (result.error) {
            console.log(
              `Error processing ingredient ${result.ingredientRaw}: ${
                result.error
              }`
            );
            return;
          }

          if (result.ingredientParsed.product != null) {
            // TODO: Handle ingredient result
            console.log(
              total + ": " + result.ingredientParsed.product.toLowerCase()
            );
            if (
              !shoppinglist.includes(
                result.ingredientParsed.product.toLowerCase()
              )
            ) {
              shoppinglist.push(result.ingredientParsed.product.toLowerCase());
            }
          }
        });
      });
    });
  });
});
