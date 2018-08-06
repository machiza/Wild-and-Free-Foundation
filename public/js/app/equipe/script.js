$(function() {
    $('.active').removeClass('active');
    $('#definicoes').addClass('active');

    $('#btnSalvar').click(function() {
        var nome = $('#nome').val();
        var sigla = $('#sigla').val();
        var delegado = { nome: $('#delegado').val(), telemovel: $('#delCell').val() };
        var emblema = 'https://firebasestorage.googleapis.com/v0/b/wild-and-free-foundation.appspot.com/o/emblemas%2Fshield.jpg?alt=media&token=d366c51e-c9e5-4506-81dd-60548b425e66';
    
        var route = '/equipe';

        $.ajax({
            type: 'POST',
            url: route,
            data: { nome, sigla, delegado, emblema },
            success: function(data) {
                alert(data);
            }
        });
    });
})