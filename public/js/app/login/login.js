$(function(){
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAOVX_8q5S-2nV_E5aN1_pp1MMUQjOibHQ",
    authDomain: "msolution-90e6e.firebaseapp.com",
    databaseURL: "https://msolution-90e6e.firebaseio.com",
    projectId: "msolution-90e6e",
    storageBucket: "msolution-90e6e.appspot.com",
    messagingSenderId: "746401686761"
  };
  firebase.initializeApp(config);

  $('#btnLogin').click(function() {
    const email = $('#txtEmail').val();
    const pass = $('#inputPassword').val();

    // Sign in
    firebase.auth().signInWithEmailAndPassword(email, pass)
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
          alert('password Incorrecta.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });
  });

  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      window.location.href = "/admin";
    } else {
      console.log('not logged in');
    }
  });
});