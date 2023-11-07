var express = require('express');
var app = express();
var md5 = require('md5');
var request = require('request');
var queryString = require('query-string');

app.set('views', './views');
app.set('view engine', 'pug');

var puk = '6601e17021b86d601652cda2f434a3bc';
var prk = '92e08b314cf2bb7f6a2c8af9c58d1bd59eb0cd6d';
var urlBase = 'https://gateway.marvel.com';

var requisicao = function(tipo, info, cb){
    var ts = new Date().getTime();
    var hash = md5(ts+prk+puk);

    var params = {
        'ts': ts,
        'hash': hash,
        'apikey': puk
    };
    var paramsString = queryString.stringify(params);
    var utl;
    if(tipo == 'listagem'){
        url = urlBase+'/v1/public/characters?'+paramsString+'&limit=50';
    }
    else{
        url = urlBase+'/v1/public/characters/'+info+'?'+paramsString;
    }
    request(
        url,
        function(a1, a2, a3){
            cb(JSON.parse(a3));
        }
    );
}

app.get('/', function(req, res){
    requisicao('listagem', null, function(r){
        res.render('index', {personagens: r.data.results});
    });
});

app.get('/personagem/:id', function(req, res){
    var id = req.params.id;
    requisicao('personagem', id, function(r){
        res.render('personagem', {personagem: r.data.results[0]});
    });
});

app.listen(process.env.PORT || 3000);
