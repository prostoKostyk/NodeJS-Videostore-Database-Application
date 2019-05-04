var express = require('express');
var http = require('http');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');
function randomInteger(min, max) { var rand = min - 0.5 + Math.random() * (max - min + 1); rand = Math.round(rand); return rand;}
var schet=12312;
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true}));

var dateFormat = require('dateformat');
var now = new Date();

app.set('view engine', 'ejs');

app.use('/js', express.static(__dirname + '/node_modules/bootstraps/dist/js'));
app.use('/js', express.static(__dirname +  '/node_modules/tether/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstraps/dist/css'));

const con  = mysql.createConnection({
host: 'localhost',
user: 'root',
password:'',
database: 'videostore'
});

const siteTitle = "Фильмы";
const baseURL = "http://localhost:5000/";
app.get('/', function (req, res){
con.query('SELECT * FROM films', function (err, result){
res.render('pages/index',{
siteTitle : siteTitle,
pagesTitle : "Event list",
items : result
});
});
});

const MediumsSiteTitle = "Носители";
const MediumsURL = "http://localhost:5000/mediums";
app.get('/mediums', function (MediumsReq, MediumsRes){
con.query('SELECT *FROM mediums', function (MedioumsErr, MediumsResult){
MediumsRes.render('pages/mediums',{
MediumsSiteTitle : MediumsSiteTitle,
MediumsTitle : "Event list",
MediumsItems : MediumsResult
});
});
});

const filmsMediumsSiteTitle = "Фильмы на носителях";
const filmsMediumsURL = "http://localhost:5000/filmsMediums";
app.get('/filmsMediums', function (filmsMediumsReq, filmsMediumsRes){
con.query('SELECT * FROM `filmsMediums`, `mediums`, `films`', function (filmsMediumsErr, filmsMediumsResult){
filmsMediumsRes.render('pages/filmsMediums',{
filmsMediumsSiteTitle : filmsMediumsSiteTitle,
filmsMediumsTitle : "Event list",
filmsMediumsItems : filmsMediumsResult,
});
});
});
/*
Доавление нового элемента
*/

app.get('/element/add', function (req, res){
    res.render('pages/add-element.ejs',{
    siteTitle : siteTitle,
    pagesTitle : "Add new element",
    items : ''
        });
});
app.post('/element/add',function(req,res){
var query= "INSERT INTO `films` (IdFilm, NameFilm, GenreFilm) Values (";
query+= " '"+req.body.IdFilm+"',";
query+= " '"+req.body.NameFilm+"',";
query+= " '"+req.body.GenreFilm+"')";
con.query(query, function(err, result) {
    res.redirect(baseURL);
});
});

app.get('/element/edit/:IdFilm',function(req, res){
con.query("SELECT * FROM films WHERE IdFilm = '"+ req.params.IdFilm + "'",
function (err, result) {
    res.render('pages/edit-element',{
        siteTitle : siteTitle,
        pagesTitle : "Editing element : " + result[0].NameFilm,
        item : result
    });
});
});

app.post('/element/edit/:IdFilm',function(req,res){
    var query= "UPDATE `videostore`.`films` SET `NameFilm` = '"+req.body.NameFilm+"', `GenreFilm` ='"+req.body.GenreFilm+"' WHERE (`IdFilm` = '"+ req.params.IdFilm +"')";
    con.query(query, function(err, result) {
        if (result.affectedRows){
        res.redirect(baseURL);
        }
    });
    });

    app.get('/element/delete/:IdFilm',function(req, res){
        con.query("DELETE FROM `videostore`.`films` WHERE (`IdFilm` = '"+req.params.IdFilm+"');", function(err, result){
        if (result.affectedRows){
            res.redirect(baseURL);
            }
        });
        });
    

var server = app.listen(5000,function(){
console.log('Сервер находится на localhost:5000');
});

