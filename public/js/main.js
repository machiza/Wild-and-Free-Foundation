$(function(){
    $('#btnLogout').click(function() {
        firebase.auth().signOut();
    });
})