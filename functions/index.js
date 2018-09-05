const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const moment = require('moment');

admin.initializeApp({
    credential: admin.credential.cert({
        "type": "service_account",
        "project_id": "wild-and-free-foundation",
        "private_key_id": "e7a15b54df898e40e92b04214215e6ef34114918",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCq/yKrR6LDT1ZL\ns8VmFUQPL+AmajSwHbxLnK87U5OSUnMcdHQ7wvx1nVxVch064wMVdLduRMCkJfun\nzLr7pgG2tWLfRTNnrC51eSVpq6GNXucrM9xfqfNe8iGg9rR56n78R2Mo8bIpDTII\nS93rd8NebOaTHt/R7UEwTGSzTPx0D9bVN3HIRDlafk62ZyIQWfoCUXYTuhoKHnKh\n1JW9Oup8XnET+qPOHbu9Y63Lt2vv7ZHCyvDJmZu/wJoQvA26SRlvYOyE6cGz2VC3\nfKuSPvq0mK5ELIENnve5CQHm6006gCBzqlYPiI0Kk0LUgNuiuHz29KPivtRmKXqy\nnoylwMcRAgMBAAECggEAAzyWEujlt02yo/cwptiDM8hjtUZwXd8KN+Is3PIdinj+\nDc1Uf+cWcUF7xHBHBlzSq57MdA1gGhtP8qKo7Wd8g9FWIETGjtFPBdE3uJLTmYHw\n3Tv7kWH9pc/ufAX/b4lVQwA068r7ZNSHnGmXN0RKkeh8ys8cTHRxtfDUPSKZarb0\nGzGcNIOA67rio1dBqMqhcymGC832GRkxqs7mFRGKnUq5JXRF/1ebM2H7WXIp330F\nztzHWHgOnEBdlqdEUoCaHgEpScE8umcj5NRKBgAc5Q5mJsF/D1/uLENHqNthLyNF\n2h7yXw2WJVpTYHVVxgcjj9qTNXtbHNOaZB2jef360wKBgQDcRSpCWfxUHM+4/cbW\nmh94eSnWwYKnC7oGLw05yb7FIUC59OBrYyL2MR+zGCe/Otght7zwBbe3IarEiH5O\ncxxwau7k0CAaAjSAomuK6n1OrSMcZD0Wb66cPDI3EUtXh5wweLAB/Mchi0wh3Fby\n31tptwShSAYqGYna12Ro3e8qZwKBgQDGu9wxknSWdpOT6570Dg5LGOVVyUolSJ/n\n9ZpKUDjVAoOsj2ImVjfZDU+xw9yVkA/oYTITFLIaNar343xikCQsqI3UVnjdhvPk\n1CBTdyDuwSFUI32KAvVM5hi+N76zPpxUZomMuK836uei0dax5b3yVeMzz76hY0eQ\nOvnWQyIHxwKBgAevxjTAjSSmSL1s5bZxdG2w1Lvwzs1jhF9Y3v5IQwcADREwMXCt\n6fdraW7HhgOPWyF6FvbNTEbwvtPS641zSOfHY4TKmoQt1YUzpcsYOb04H4SLHvKc\nfRxooVv4l4d7bQDoBURcfNp30PVRihs5nigHQfsa11Q6xevEHnXmYMU7AoGASdFH\nxeYHhkf/IyeXAEIkTwKtVMMS1mx2cPuKVuYbZgusCzGrHGBUGDxYiMgerDM5pXBM\n4EeErDWZDsCh2B6AQVJOdDu2Y1qYRzv/0eDjC6wTDCSuoc/de7XQJP+hxwSPns4D\nc5C6DMQlTBYzcBrNBjGe1gTpYxr0Xv95A3wmLMsCgYEAog84/mTvVD5BZgwvf9Fp\nrXEkoYjvHaOpGfzTQRGBJ+isJhxxiw5YRmqEpOICfwq4EVQUni67/Vs/9wB15Rf6\nYBhZ4laOesOjv6HoUcK3C2xabxxsVZK3NUedzvA8d3/5FypmQZ7ww3/zvr3Zd7KD\nTdpIy7KkWqPdA6O5503KykY=\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-9qbkt@wild-and-free-foundation.iam.gserviceaccount.com",
        "client_id": "117141206420193806486",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://accounts.google.com/o/oauth2/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-9qbkt%40wild-and-free-foundation.iam.gserviceaccount.com"
      }),
    databaseURL: "https://wild-and-free-foundation.firebaseio.com"
});

const db = admin.firestore();
db.settings({timestampsInSnapshots: true});

const app = express();

exphbs.create({
    helpers: {
        posicao: function(index) { return index + 1; },
        reforco: function(ref) { if(ref==='false'){ return false}else{ return true } }
    }
});

app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('views', './views');
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/login', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    res.render('login/index', { layout: false });
});

app.get('/admin', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    res.render('admin/index');
});

app.get('/', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    var equipeRef = db.collection('equipes').orderBy('classificacao.pontos', 'desc');
    var equipes = []; var equipes2 = [];
    db.runTransaction(t => {
        return t.get(equipeRef)
            .then(snapshot => {
                snapshot.forEach(doc => {
                    equipes.push({
                        id: doc.id,
                        classificacao: doc.data().classificacao,
                        delegado: doc.data().delegado,
                        emblema: doc.data().emblema,
                        jogadores: doc.data().jogadores,
                        nome: doc.data().nome,
                        sigla: doc.data().sigla
                    });
                });
                var idJornada = 1+equipes[0].classificacao.jornadas+'° Jornada'
                var jornadaRef = db.collection('jornadas').doc(idJornada);
                for (var i =0; i<equipes.length/2; i++) {
                    equipes2.push(equipes[i]);
                }
                db.runTransaction(tr => {
                    return tr.get(jornadaRef)
                        .then(doc => {
                            res.render('index', { layout: false, helpers: { posicao: function(index) { return index + 1; } }, equipes2, jornada: doc.data(), idJornada });
                        });
                });
                
                
            });
    });
});

// index
app.get('/utilizador', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    var users = [];
    admin.auth().listUsers().then(function(listUsersResult) {
        listUsersResult.users.forEach(function(userRecord) {
            users.push({
                uid: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord.displayName,
                disabled: userRecord.disabled
            });
        });
        res.render('utilizador/index', { users });
    });
});

// save
app.get('/utilizador/adicionar', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    res.render('utilizador/create');
});

// store
app.post('/utilizador', (req, res) => {
    admin.auth().createUser({
        email: req.body.email,
        emailVerified: false,
        phoneNumber: "+258"+req.body.telemovel,
        password: req.body.password,
        displayName: req.body.utilizador,
        photoURL: req.body.photo,
        disabled: false
      })
        .then(function(userRecord) {
          // See the UserRecord reference doc for the contents of userRecord.
          console.log("Successfully created new user:", userRecord.uid);
        })
        .catch(function(error) {
          console.log("Error creating new user:", error);
        });
        res.end('successfully');
});

// ------------------ equipe ---------------------

// index
app.get('/equipe', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    var equipes = [];
    db.collection('equipes').get().then(snapshot => {
        snapshot.forEach(doc => {
            equipes.push({
                id: doc.id,
                nome: doc.data().nome,
                sigla: doc.data().sigla,
                delegado: doc.data().delegado,
                emblema: doc.data().emblema,
                data: doc.data().data
            });
        });
        res.render('equipe/index', { equipes });
    });
});

// save
app.get('/equipe/adicionar', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    res.render('equipe/create');
});

// store
app.post('/equipe', (req, res) => {
    db.collection('equipes').add({
        nome: req.body.nome,
        sigla: req.body.sigla,
        delegado: req.body.delegado,
        emblema: req.body.emblema,
        data: new Date()
    });
    res.end('successfully');
});

// edit
app.get('/equipe/:id', (req, res) => {

});

// update
app.post('/equipe/update', (req, res) => {

});

// delete
app.get('/equipe/delete/:id', (req, res) => {
    db.collection('equipes').doc(req.params.id).delete();
    res.redirect('/equipe');
});

// ------------------ plantel -------------------
// index
app.get('/plantel/:id', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    var jogadores = [];
    var defesas = []; var medios = []; var avancados = []; var guardaredes = [];
    db.collection('equipes').doc(req.params.id).get().then(doc => {
        if (doc.exists) {
            plantel = doc.data().jogadores;
            
            if(plantel) {
                plantel.forEach(function(jogador) {
                    if (jogador.categoria==='Defesa') {
                        defesas.push(jogador);
                    } else if (jogador.categoria==='Medio') {
                        medios.push(jogador);
                    } else if (jogador.categoria==='Avancado') {
                        avancados.push(jogador);
                    } else {
                        guardaredes.push(jogador);
                    }
                });
                res.render('equipe/plantel', { id: req.params.id, equipe: doc.data().nome, guardaredes, defesas, medios, avancados });
            }else {
                res.render('equipe/plantel', { equipe: doc.data().nome});
            }
            
        }
    });
    
    // db.collection('equipes').doc(req.params.id).get().
});

// store
app.post('/plantel', (req, res) => {
    var equipeRef = db.collection('equipes').doc(req.body.idEquipe);
    db.runTransaction(transaction => {
        return transaction.get(equipeRef).then(snapshot => {
            const largerArray = snapshot.get('jogadores');
            largerArray.push(req.body.jogador);
            transaction.update(equipeRef, 'jogadores', largerArray);
        });
    });
    res.end('successfully');
});

// ------------------ campeonato--------------------

// ------------------ Resultado ---------------------

// index
app.get('/campeonato/calendario', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    var jornadas = [];
    db.collection('jornadas').orderBy('chave').get().then(snapshot => {
        snapshot.forEach(doc => {
            jornadas.push({
                numero: doc.id,
                jogos: doc.data().jogos,
            });
        });
        res.render('campeonato/calendario', { jornadas });
    });
});

// gerar segunda volta
app.post('/segundavolta', (req, res) => {
    var jornadas = [];
    var jornadasAux = [];
    var jogos = [];
    // Get a new write batch
    var batch = db.batch();
    db.collection('jornadas').orderBy('chave', 'asc').get().then(snapshot => {
        snapshot.forEach(doc => {
            jornadas.push(doc.data());
        });
        var k = 12;
        for (var i=0; i<jornadas.length; i++) {
            for (var j=0; j<6; j++) {
                var fora = jornadas[i].jogos[j].casa;
                var casa = jornadas[i].jogos[j].fora;
                var data = jornadas[i].jogos[j].data;
                jogos.push({ casa, fora, data, jornada: k, feito: false});
            }
            var jornada = k+'° Jornada';
            // jornadasAux.push({ chave: k, jogos });
            var nycRef = db.collection('jornadas').doc(jornada);
            batch.set(nycRef, { chave: k, jogos });
            jogos = [];
            k++;
        }

        // Commit the batch
        return batch.commit().then(function () {
            // ...
        });
        
        res.end('successfully');
    });
});

app.post('/campeonato/calendario', (req, res) => {
var index = req.body.index;
var docRef = db.collection('jornadas').doc(req.body.jornada);
var equipeCasaRef = db.collection('equipes').doc(req.body.casa);
var equipeForaRef = db.collection('equipes').doc(req.body.fora);

    db.runTransaction(transaction => {
        return transaction.get(docRef).then(snapshot => {
          const largerArray = snapshot.get('jogos');
          largerArray[index].casa.golos = parseInt(req.body.casaGol);
          largerArray[index].fora.golos = parseInt(req.body.foraGol);
          largerArray[index].feito = true;
          transaction.update(docRef, 'jogos', largerArray);

        });
      });
      
    db.runTransaction(t => {
    return t.get(equipeCasaRef)
        .then(doc => {
            // Add one person to the city population
            var newPontos = doc.data().classificacao.pontos + parseInt(req.body.casaPontos);
            var newJornadas = doc.data().classificacao.jornadas + 1;
            var newVitorias = doc.data().classificacao.vitorias + parseInt(req.body.casaVitorias);
            var newEmpates = doc.data().classificacao.empates + parseInt(req.body.casaEmpates);
            var newDerrotas = doc.data().classificacao.derrotas + parseInt(req.body.casaDerrotas);
            var newGm = doc.data().classificacao.gm + parseInt(req.body.casaGol);
            var newGs = doc.data().classificacao.gs + parseInt(req.body.foraGol);
            var newSg = newGm - newGs;
            t.update(equipeCasaRef, { 
                classificacao :{ pontos: newPontos, jornadas: newJornadas, vitorias: newVitorias, empates: newEmpates,
                derrotas: newDerrotas, gm: newGm, gs: newGs, sg: newSg }
            });
        });
    });

    db.runTransaction(t => {
        return t.get(equipeForaRef)
            .then(doc => {
                // Add one person to the city population
                var newPntos = doc.data().classificacao.pontos + parseInt(req.body.foraPontos);
                var newJornadas = doc.data().classificacao.jornadas + 1;
                var newVitorias = doc.data().classificacao.vitorias + parseInt(req.body.foraVitorias);
                var newEmpates = doc.data().classificacao.empates + parseInt(req.body.foraEmpates);
                var newDerrotas = doc.data().classificacao.derrotas + parseInt(req.body.foraDerrotas);
                var newGm = doc.data().classificacao.gm + parseInt(req.body.foraGol);
                var newGs = doc.data().classificacao.gs + parseInt(req.body.casaGol);
                var newSg = newGm - newGs;
                t.update(equipeForaRef, { 
                    classificacao: { pontos: newPntos, jornadas: newJornadas, vitorias: newVitorias, empates: newEmpates,
                    derrotas: newDerrotas, gm: newGm, gs: newGs, sg: newSg}
                });
            });
        });

    res.end('successfully');
})

// update
app.post('/campeonato/editar', (req, res) => {
    var index = req.body.index;
    var docRef = db.collection('jornadas').doc(req.body.jornada);
    var equipeCasaRef = db.collection('equipes').doc(req.body.casa);
    var equipeForaRef = db.collection('equipes').doc(req.body.fora);

    var pontosCasa = 0; var golosCasa = 0; var golosCasaMenos = 0; var sofridosCasaMenos = 0; var vitoriasCasa = 0; var empatesCasa = 0; var derrotasCasa = 0;
    var pontosFora = 0; var golosFora = 0; var golosForaMenos = 0; var sofridosForaMenos = 0; var vitoriasFora = 0; var empatesFora = 0; var derrotasFora = 0;

        db.runTransaction(transaction => {
            return transaction.get(docRef).then(snapshot => {
              const largerArray = snapshot.get('jogos');
              if(largerArray[index].casa.golos > largerArray[index].fora.golos) {
                  if(parseInt(req.body.casaVitorias) > 0) {
                    golosCasa = parseInt(req.body.casaGol);
                    golosCasaMenos = largerArray[index].casa.golos;
                    sofridosCasaMenos = largerArray[index].fora.golos;
                    golosFora = parseInt(req.body.foraGol);
                    golosForaMenos = largerArray[index].fora.golos;
                    sofridosForaMenos = largerArray[index].casa.golos;

                    largerArray[index].casa.golos = parseInt(req.body.casaGol);
                    largerArray[index].fora.golos = parseInt(req.body.foraGol);
                    largerArray[index].feito = true;
                    transaction.update(docRef, 'jogos', largerArray);
                  } else if (parseInt(req.body.casaDerrotas) > 0) {
                    golosCasa = parseInt(req.body.casaGol);
                    golosCasaMenos = largerArray[index].casa.golos;
                    sofridosCasaMenos = largerArray[index].fora.golos;
                    derrotasCasa = 1;
                    vitoriasCasa = -1;
                    pontosCasa = -3;
                    golosFora = parseInt(req.body.foraGol);
                    golosForaMenos = largerArray[index].fora.golos;
                    sofridosForaMenos = largerArray[index].casa.golos;
                    derrotasFora = -1;
                    vitoriasFora = 1;
                    pontosFora = 3;


                    largerArray[index].casa.golos = parseInt(req.body.casaGol);
                    largerArray[index].fora.golos = parseInt(req.body.foraGol);
                    largerArray[index].feito = true;
                    transaction.update(docRef, 'jogos', largerArray);
                  } else if (parseInt(req.body.casaEmpates) > 0) {
                    golosCasa = parseInt(req.body.casaGol);
                    golosCasaMenos = largerArray[index].casa.golos;
                    sofridosCasaMenos = largerArray[index].fora.golos;
                    empatesCasa = 1;
                    vitoriasCasa = -1;
                    pontosCasa = -2;
                    golosFora = parseInt(req.body.foraGol);
                    golosForaMenos = largerArray[index].fora.golos;
                    sofridosForaMenos = largerArray[index].casa.golos;
                    empatesFora = 1;
                    derrotasFora = -1;
                    pontosFora = 1;

                    largerArray[index].casa.golos = parseInt(req.body.casaGol);
                    largerArray[index].fora.golos = parseInt(req.body.foraGol);
                    largerArray[index].feito = true;
                    transaction.update(docRef, 'jogos', largerArray);
                  }
              } else if (largerArray[index].casa.golos < largerArray[index].fora.golos) {
                if(parseInt(req.body.foraVitorias) > 0) {
                    golosFora = parseInt(req.body.foraGol);
                    golosForaMenos = largerArray[index].fora.golos;
                    sofridosForaMenos = largerArray[index].casa.golos;
                    golosCasa = parseInt(req.body.casaGol);
                    golosCasaMenos = largerArray[index].casa.golos;
                    sofridosCasaMenos = largerArray[index].fora.golos;

                    largerArray[index].casa.golos = parseInt(req.body.casaGol);
                    largerArray[index].fora.golos = parseInt(req.body.foraGol);
                    largerArray[index].feito = true;
                    transaction.update(docRef, 'jogos', largerArray);
                  } else if (parseInt(req.body.foraDerrotas) > 0) {
                    golosFora = parseInt(req.body.foraGol);
                    golosForaMenos = largerArray[index].fora.golos;
                    sofridosForaMenos = largerArray[index].casa.golos;
                    derrotasFora = 1;
                    vitoriasFora = -1;
                    pontosFora = -3;
                    golosCasa = parseInt(req.body.casaGol);
                    golosCasaMenos = largerArray[index].casa.golos;
                    sofridosCasaMenos = largerArray[index].fora.golos;
                    derrotasCasa = -1;
                    vitoriasCasa = 1;
                    pontosCasa = 3;

                    largerArray[index].casa.golos = parseInt(req.body.casaGol);
                    largerArray[index].fora.golos = parseInt(req.body.foraGol);
                    largerArray[index].feito = true;
                    transaction.update(docRef, 'jogos', largerArray);

                  } else if (parseInt(req.body.foraEmpates) > 0) {
                    golosFora = parseInt(req.body.foraGol);
                    golosForaMenos = largerArray[index].fora.golos;
                    sofridosForaMenos = largerArray[index].casa.golos;
                    empatesFora = 1;
                    vitoriasFora = -1;
                    pontosFora = -2;
                    golosCasa = parseInt(req.body.casaGol);
                    golosCasaMenos = largerArray[index].casa.golos;
                    sofridosCasaMenos = largerArray[index].fora.golos;
                    empatesCasa = 1;
                    derrotasCasa = -1;
                    pontosCasa = 1;

                    largerArray[index].casa.golos = parseInt(req.body.casaGol);
                    largerArray[index].fora.golos = parseInt(req.body.foraGol);
                    largerArray[index].feito = true;
                    transaction.update(docRef, 'jogos', largerArray);
                  }
              } else if (largerArray[index].casa.golos === largerArray[index].fora.golos) {
                if(parseInt(req.body.casaVitorias) > 0) {
                    golosCasa = parseInt(req.body.casaGol);
                    golosCasaMenos = largerArray[index].casa.golos;
                    sofridosCasaMenos = largerArray[index].fora.golos;
                    empatesCasa = -1;
                    vitoriasCasa = 1;
                    pontosCasa = 2;
                    golosFora = parseInt(req.body.foraGol);
                    golosForaMenos = largerArray[index].fora.golos;
                    sofridosForaMenos = largerArray[index].casa.golos;
                    empatesFora = -1;
                    derrotasFora = 1;
                    pontosFora = -1;

                    largerArray[index].casa.golos = parseInt(req.body.casaGol);
                    largerArray[index].fora.golos = parseInt(req.body.foraGol);
                    largerArray[index].feito = true;
                    transaction.update(docRef, 'jogos', largerArray);
                  } else if (parseInt(req.body.casaDerrotas) > 0) {
                    golosCasa = parseInt(req.body.casaGol);
                    golosCasaMenos = largerArray[index].casa.golos;
                    sofridosCasaMenos = largerArray[index].fora.golos;
                    empatesCasa = -1;
                    derrotasCasa = 1;
                    pontosCasa = -1;
                    golosFora = parseInt(req.body.foraGol);
                    golosForaMenos = largerArray[index].fora.golos;
                    sofridosForaMenos = largerArray[index].casa.golos;
                    empatesFora = -1;
                    vitoriasFora = 1;
                    pontosFora = 2;

                    largerArray[index].casa.golos = parseInt(req.body.casaGol);
                    largerArray[index].fora.golos = parseInt(req.body.foraGol);
                    largerArray[index].feito = true;
                    transaction.update(docRef, 'jogos', largerArray);
                  } else if (parseInt(req.body.casaEmpates) > 0) {
                    golosCasa = parseInt(req.body.casaGol);
                    golosCasaMenos = largerArray[index].casa.golos;
                    sofridosCasaMenos = largerArray[index].fora.golos;
                    golosFora = parseInt(req.body.foraGol);
                    golosForaMenos = largerArray[index].fora.golos;
                    sofridosForaMenos = largerArray[index].casa.golos;

                    largerArray[index].casa.golos = parseInt(req.body.casaGol);
                    largerArray[index].fora.golos = parseInt(req.body.foraGol);
                    largerArray[index].feito = true;
                    transaction.update(docRef, 'jogos', largerArray);
                  }
              }
            });
          });
          
        db.runTransaction(t => {
        return t.get(equipeCasaRef)
            .then(doc => {
                // Add one person to the city population
                var newPontos = doc.data().classificacao.pontos + pontosCasa;
                var newJornadas = doc.data().classificacao.jornadas + 0;
                var newVitorias = doc.data().classificacao.vitorias + vitoriasCasa;
                var newEmpates = doc.data().classificacao.empates + empatesCasa;
                var newDerrotas = doc.data().classificacao.derrotas + derrotasCasa;
                var newGm = (doc.data().classificacao.gm - golosCasaMenos) + golosCasa;
                var newGs = (doc.data().classificacao.gs - sofridosCasaMenos) + golosFora;
                var newSg = newGm - newGs;
                t.update(equipeCasaRef, { 
                    classificacao :{ pontos: newPontos, jornadas: newJornadas, vitorias: newVitorias, empates: newEmpates,
                    derrotas: newDerrotas, gm: newGm, gs: newGs, sg: newSg }
                });
            });
        });
    
        db.runTransaction(t => {
            return t.get(equipeForaRef)
                .then(doc => {
                    // Add one person to the city population
                    var newPntos = doc.data().classificacao.pontos + pontosFora;
                    var newJornadas = doc.data().classificacao.jornadas + 0;
                    var newVitorias = doc.data().classificacao.vitorias + vitoriasFora;
                    var newEmpates = doc.data().classificacao.empates + empatesFora;
                    var newDerrotas = doc.data().classificacao.derrotas + derrotasFora;
                    var newGm = (doc.data().classificacao.gm - golosForaMenos) + golosFora;
                    var newGs = (doc.data().classificacao.gs - sofridosForaMenos) + golosCasa;
                    var newSg = newGm - newGs;
                    t.update(equipeForaRef, { 
                        classificacao: { pontos: newPntos, jornadas: newJornadas, vitorias: newVitorias, empates: newEmpates,
                        derrotas: newDerrotas, gm: newGm, gs: newGs, sg: newSg}
                    });
                });
            });
    
        res.end('successfully');
    })

// edit
app.get('/campeonato/editar', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    var jornadas = [];
    db.collection('jornadas').orderBy('chave').get().then(snapshot => {
        snapshot.forEach(doc => {
            jornadas.push({
                numero: doc.id,
                jogos: doc.data().jogos,
            });
        });
        res.render('campeonato/editar', { jornadas });
    });
});

// ------------------ classificacao --------------------
// index
app.get('/campeonato/classificacao', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    var equipes = [];
    db.collection('equipes').orderBy('classificacao.pontos', 'desc').get().then(snapshot => {
        snapshot.forEach(doc => {
            equipes.push(doc.data());
        });
        res.render('campeonato/classificacao', { equipes, helpers: { posicao: function(index) { return index + 1; } } });
    });
});


// -------------- Cliente Campeonato ----------------------
app.get('/campeonato', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    var equipes = [];
    var jornadas = [];
    db.collection('equipes').orderBy('classificacao.pontos', 'desc').get().then(snapshot => {
        snapshot.forEach(doc => {
            equipes.push({
                id: doc.id,
                classificacao: doc.data().classificacao,
                delegado: doc.data().delegado,
                emblema: doc.data().emblema,
                jogadores: doc.data().jogadores,
                nome: doc.data().nome,
                sigla: doc.data().sigla
            });
        });
        db.collection('jornadas').orderBy('chave').get().then(snapshot => {
            snapshot.forEach(doc => {
                jornadas.push({
                    numero: doc.id,
                    jogos: doc.data().jogos,
                });
            });
            res.render('cliente/campeonato', { layout: false, equipes, jornadas, helpers: { posicao: function(index) { return index + 1; } } });
        });
        // res.render('cliente/campeonato', { layout: false, equipes, helpers: { posicao: function(index) { return index + 1; } } });
    });
    // res.render('cliente/campeonato', { layout: false });
});

app.get('/clube/:id', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    var equipeRef = db.collection('equipes').doc(req.params.id);
    
    db.runTransaction(t => {
        return t.get(equipeRef)
            .then(doc => {
                var equipe = {
                    classificacao: doc.data().classificacao,
                    completo: doc.data().completo,
                    data: doc.data().data,
                    delegado: doc.data().delegado,
                    emblema: doc.data().emblema,
                    jogadores: doc.data().jogadores,
                    nome: doc.data().nome,
                    sigla: doc.data().sigla
                }
                equipe.jogadores.forEach(jogador => {
                    jogador.clubeId = doc.id;
                });
                res.render('cliente/equipe', { layout: false, equipe });
            });
    })
});

app.get('/jogador/:id', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    var equipeRef = db.collection('equipes').doc(req.params.id);
    
    db.runTransaction(t => {
        return t.get(equipeRef)
            .then(doc => {
                var equipe = {
                    emblema: doc.data().emblema,
                    jogadores: doc.data().jogadores,
                    nome: doc.data().nome,
                    sigla: doc.data().sigla
                }
                var jogador = equipe.jogadores[req.params.index];
                res.render('cliente/jogador', { layout: false, equipe, jogador });
            });
    });
});

exports.app = functions.https.onRequest(app);