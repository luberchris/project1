var queryURL = "https://www.food2fork.com/api/get?key=f3f1b9a787e9efdbd4749be34123d9b5&rId=8c0314"

    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
          
          console.log(JSON.parse(response));

         var recipeResponse = JSON.parse(response);
         console.log(recipeResponse.recipe.f2f_url);

         $("#ingredhere").html(recipeResponse.recipe.f2f_url);

     

  // Initialize Firebase
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

    var rUrl = recipeResponse.recipe.f2f_url;

    database.ref().push({
        rUrl: rUrl,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
    
    });
