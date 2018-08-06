$(function() {
    $('.active').removeClass('active');
    $('#operacoes').addClass('active');

    // Get elements
    $('#fileButton').change(function(e) {
        // Get file
        var file = e.target.files[0];

        // Create a storage ref
        var storageRef = firebase.storage().ref('foto-perfil/' + file.name); 

        // Upload file
        var task = storageRef.put(file);

        // Update progress bar
        task.on('state_changed',

            function progress(snapshot) {
                var percentage = (snapshot.bytesTransferred /
                snapshot.totalBytes) * 100;
                $('#uploader').val(percentage);
            },

            function error(err) {

            },

            function complete() {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    $('#photo').val(downloadURL);
                });
            }

    );
});

    $('#btnSalvar').click(function() {
        var route = '/utilizador';
        var utilizador = $('#utilizador').val();
        var email = $('#email').val();
        var password = $('#pwd').val();
        var idPrev = $('#prev').val();
        var nomePrev = $('#prev :selected').text();
        var photo = $('#photo').val();

        $.ajax({
            type: 'POST',
            url: route,
            data: { utilizador, email, password, idPrev, nomePrev, photo },
            success: function(data) {
                alert(data);
                window.location.href = '/utilizador';
            }
        });

    });
});