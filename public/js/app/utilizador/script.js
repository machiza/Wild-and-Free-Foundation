$(function() {
    $('.active').removeClass('active');
    $('#operacoes').addClass('active');
    
    var photoTemp = '';

    // Get elements
//     $('#fileButton').change(function(e) {
//         // Get file
//         var file = e.target.files[0];

//         // Create a storage ref
//         var storageRef = firebase.storage().ref('foto-perfil/' + file.name); 

//         // Upload file
//         var task = storageRef.put(file);

//         // Update progress bar
//         task.on('state_changed',

//             function progress(snapshot) {
//                 var percentage = (snapshot.bytesTransferred /
//                 snapshot.totalBytes) * 100;
//                 $('#uploader').val(percentage);
//             },

//             function error(err) {

//             },

//             function complete() {
//                 // Handle successful uploads on complete
//                 // For instance, get the download URL: https://firebasestorage.googleapis.com/...
//                 task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
//                     $('#photo').val(downloadURL);
//                 });
//             }

//     );
// });


    $('#profile-file-input').change(function (event) {

        var output = document.getElementById('change-profile-pic');
        var file = event.target.files[0];
        output.src = URL.createObjectURL(file);
        $('#change-profile-pic').cropper("destroy");

        var $previews = $('.preview');
        $('#change-profile-pic').cropper({
            ready: function () {
                var $clone = $(this).clone().removeClass('cropper-hidden');
                $clone.css({
                    display: 'block',
                    width: '100%',
                    minWidth: 0,
                    minHeight: 0,
                    maxWidth: 'none',
                    maxHeight: 'none'
                });
                $previews.css({
                    width: '100%',
                    overflow: 'hidden'
                }).html($clone);
            },
            crop: function (e) {

                var imageData = $(this).cropper('getImageData');
                var croppedCanvas = $(this).cropper('getCroppedCanvas');
                $('#profile-result').html('<img src="' + croppedCanvas.toDataURL() + '" class="thumb-lg img-circle" style="width:100px; heigth:100px;">');

                $('#save-profile').click(function () {
                    photoTemp = file.name;
                    var task = firebase.storage().ref('foto-perfil/' + photoTemp)
                        .putString(croppedCanvas.toDataURL(), 'data_url');

                    task.on('state_changed', function(snapshot) {
                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log('Upload is ' + progress + '% done');
                            switch (snapshot.state) {
                            case firebase.storage.TaskState.PAUSED: // or 'paused'
                                console.log('Upload is paused');
                                break;
                            case firebase.storage.TaskState.RUNNING: // or 'running'
                                console.log('Upload is running');
                                break;
                            }
                        },

                        function(err) {
                            console.log(err);
                        },

                        function() {
                            // Handle successful uploads on complete
                            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                            task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                                // $('#photo').val(downloadURL);
                                console.log('File available at', downloadURL);
                                photoTemp = downloadURL;
                                $('#loading').show();
                                $('#loading').html("Profile picture successfully updated");
                                setTimeout(function () {
                                    $('#loading').hide();
                                    $('#change-profile').modal('hide');
                                }, 2000);
                            });
                        });

                    
                });

                var previewAspectRatio = e.width / e.height;
                $previews.each(function () {
                    var $preview = $(this);
                    var previewWidth = $preview.width();
                    var previewHeight = previewWidth / previewAspectRatio;
                    var imageScaledRatio = e.width / previewWidth;
                    $preview.height(previewHeight).find('img').css({
                        width: imageData.naturalWidth / imageScaledRatio,
                        height: imageData.naturalHeight / imageScaledRatio,
                        marginLeft: -e.x / imageScaledRatio,
                        marginTop: -e.y / imageScaledRatio
                    });
                });

            }

        });

    });


    $('#btnSalvar').click(function() {
        var route = '/utilizador';
        var utilizador = $('#utilizador').val();
        var email = $('#email').val();
        var password = $('#pwd').val();
        var telemovel = $('#telemovel').val();
        var photo = photoTemp;
        
        $.ajax({
            type: 'POST',
            url: route,
            data: { utilizador, email, password, telemovel, photo },
            success: function(data) {
                alert(data);
                window.location.href = '/utilizador';
            }
        });

    });

    var i, j, x = [ "Time 1", "Time 2", "Time 3", "Time 4" ],
    combinations = [];
    for(i = 0; i < x.length; ++i) {
        for(j = i + 1; j < x.length; ++j) {
            var jornada = i+1+"° Jornada";
            combinations.push({ jornada});
        }
    }

    combinations.forEach(function(jogo) {
        console.log(jogo);
    });
});