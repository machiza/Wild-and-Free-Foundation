$(function() {
    $('.active').removeClass('active');
    $('#li-equipe').addClass('active');

    $('#btnSalvar').click(function() {
        var nome = $('#nome').val();
        var sigla = $('#sigla').val();
        var treiNome = $('#treinador').val();
        var treiCell = $('#treiCell').val();
        var capNome = $('#capitao').val();
        var capCell = $('#capCell').val();

        var route = '/equipe';

        $.ajax({
            type: 'POST',
            url: route,
            data: { nome, sigla, treinador: { treiNome, treiCell }, capitao: { capNome, capCell } },
            success: function(data) {
                alert(data);
            }
        });
    });
});