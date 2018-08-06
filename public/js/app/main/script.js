$(function() {
    $('#btnLogout').click(function() {
        firebase.auth().signOut();
        window.location.href = "/";
    });
});