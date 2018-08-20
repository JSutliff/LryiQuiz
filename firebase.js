    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAuQ0fr-1h-rskTuGynwUWxxptp-HfI0K8",
        authDomain: "bootcamp-project1-4325b.firebaseapp.com",
        databaseURL: "https://bootcamp-project1-4325b.firebaseio.com",
        projectId: "bootcamp-project1-4325b",
        storageBucket: "bootcamp-project1-4325b.appspot.com",
        messagingSenderId: "396935707440"
    };
    firebase.initializeApp(config);
    var database = firebase.database();
    var userRef = database.ref("/users");
    var uid;

    var provider = new firebase.auth.GoogleAuthProvider();

    $("#signin").on("click", function(e){
        console.log("click!");
        firebase.auth().signInWithRedirect(provider);
    })

    $("body").on("click", "#createUsername", function (e) {
        e.preventDefault();
        var username = $("#username").val();

        var query = database.ref("users").orderByKey();
        query.once("value")
            .then(function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    // childData will be the actual contents of the child
                    var childData = childSnapshot.val();
                    if(childData.username != username){
                        console.log(username);
                        database.ref("/users/" + uid).set({
                            username: username
                        })
                        $("#usernameForm").remove();
                        var displayUsername = $("<h2>").text("Username: " + username);
                        $("body").append(displayUsername);
                    }
                    else{
                        $("body").append("username taken");
                    }
                });
            });



    })

    firebase.auth().getRedirectResult().then(function(result) {
        if (result.credential) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          console.log(token);
          // ...
          var user = result.user;
          console.log(user.displayName);
          $("#signin").remove();
          var displayWelcome = $("<h1>").text("Hello " + user.displayName)
          $("body").append(displayWelcome);
          console.log(user);
          uid = user.uid;

          userRef.child(user.uid).once('value', function(snap){
              if(snap.val() == null){
                var usernameForm = $("<form>").attr("id", "usernameForm");
                var usernameLabel = $("<label>").attr("for", "username").text("Enter a username");
                var usernameInput = $("<input>").attr("type", "text").attr("id", "username");
                var usernameSubmit = $("<button>").attr("type", "submit").attr("id", "createUsername").text("create username");
                usernameForm.append(usernameLabel);
                usernameForm.append(usernameInput);
                usernameForm.append(usernameSubmit);
                $("body").append(usernameForm);
              }
              else{
                  console.log(snap.val().username);
                  var displayUsername = $("<h2>").text("Username: " + snap.val().username);
                  $("body").append(displayUsername);
              }
          })

        }
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
