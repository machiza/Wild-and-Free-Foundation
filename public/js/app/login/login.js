$(function(){

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
      window.location.href = "/";
    } else {
      console.log('not logged in');
    }
  });
});