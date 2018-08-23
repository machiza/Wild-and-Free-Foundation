$(function() {
    $('.active').removeClass('active');
    $('#definicoes').addClass('active');

    var photoTemp = '';
    var equipe = $('#equipe').val();

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
                    if(photoTemp==='avatar_default.jpg') {
                        photoTemp = 'https://firebasestorage.googleapis.com/v0/b/wild-and-free-foundation.appspot.com/o/foto-perfil%2Favatar_default.jpg?alt=media&token=aa5205f5-9bea-48c0-af3f-156a7bbf57a6';
                        $('#loading').show();
                        $('#loading').html("Profile picture successfully updated");
                        setTimeout(function () {
                            $('#loading').hide();
                            $('#change-profile').modal('hide');
                        }, 2000);
                    } else {
                        var task = firebase.storage().ref('photo/'+equipe+'/' + photoTemp)
                        .put(file);

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
                    }
    
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



    $('#btnAdicionar').click(function() {
        var route = '/plantel';
        var idEquipe = $('#idEquipe').val();
        var bi = $('#bi').val();
        var nome = $('#nome').val();
        var numero = $('.spinner-input').val();
        var posicao = $('#posicao').val();
        var posicaoEx =$('#posicao :selected').text();
        var ref = $('#reforco :selected').text();
        var categoria = '';
        var foto = photoTemp;

        if ((posicao === 'DE') || (posicao === 'DC') || (posicao === 'DD')) {
            categoria = 'Defesa';
        } else if ((posicao === 'MDF') || (posicao === 'MC') || (posicao === 'MO') || (posicao === 'MD') || (posicao === 'ME')) {
            categoria = 'Medio';
        } else if ((posicao === 'AC') || (posicao === 'AE') || (posicao === 'AD') || (posicao === 'SA')){
            categoria = 'Avancado';
        } else {
            categoria = 'Guardaredes'
        }
        
        if(ref === 'Local') {
            var jogador = { bi, nome, numero, posicao, posicaoEx, categoria, foto }
        } else {
            var jogador = { bi, nome, numero, posicao, posicaoEx, categoria, reforco: true, foto }
        }
        

        $.ajax({
            type: 'POST',
            url: route,
            data: { jogador, idEquipe },
            success: function(data) {
                alert(data);
            }
        })
    });
})