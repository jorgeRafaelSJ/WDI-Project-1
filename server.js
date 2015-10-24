//requires
var express = require('express');
var app = express();
// set var db to require models index
var ejs = require('ejs');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var db = require('./models/index.js');

//uses and sets

//API ENV setup
require('dotenv').load();
var gMaps = process.env.G_API_KEY;

// need to set express-session

app.use(cookieParser());

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ 
    extended: true
}));


//route req-res

app.get ('/barmarks', function(req, res) {
	res.render('index', {gMaps: gMaps});
});

app.post ('/api/marks', function(req, res) {
	
	var newMark = req.body;
	db.Mark.create(newMark, function(err, mark) {
		
		if(err) { console.log(err); }

		console.log(mark);
		res.json(mark);
	});


});



















app.listen(3000, function () {
  console.log("UP AND RUNNING");
});