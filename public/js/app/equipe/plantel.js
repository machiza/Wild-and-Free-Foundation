$(function() {
    $('.active').removeClass('active');
    $('#definicoes').addClass('active');

    $('#btnAdicionar').click(function() {
        var route = '/plantel';
        var idEquipe = $('#idEquipe').val();
        var nome = $('#nome').val();
        var numero = $('.spinner-input').val();
        var posicao = $('#posicao').val();
        var posicaoEx =$('#posicao :selected').text();
        var categoria = '';

        if ((posicao === 'DE') || (posicao === 'DC') || (posicao === 'DD')) {
            categoria = 'Defesa';
        } else if ((posicao === 'MDF') || (posicao === 'MC') || (posicao === 'MO') || (posicao === 'MD') || (posicao === 'ME')) {
            categoria = 'Medio';
        } else if ((posicao === 'AC') || (posicao === 'AE') || (posicao === 'AD')){
            categoria = 'Avancado';
        } else {
            categoria = 'Guardaredes'
        }
        
        var jogador = { nome, numero, posicao, posicaoEx, categoria }

        $.ajax({
            type: 'POST',
            url: route,
            data: { jogador, idEquipe },
            success: function(data) {
                alert(data);
            }
        })
    });

    var i, j, x = [ "Time 1", "Time 2", "Time 3", "Time 4" ],
    combinations = [];
    for(i = 0; i < x.length; ++i) {
        for(j = i + 1; j < x.length; ++j) {
            combinations.push([ x[i], x[j] ]);
        }
    }

    combinations.forEach(function(jogo) {
        console.log(jogo);
    });
})