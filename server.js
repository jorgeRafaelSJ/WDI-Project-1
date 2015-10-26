//requires
var express = require('express');
var app = express();
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

mongoose.connect(
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/barmarks' 
);

//ROUTES

//main page GET

app.get ('/barmarks', function (req, res) {

		res.render('index', {gMaps: gMaps});
	
});

//marks API GET

app.get ('/api/marks', function (req, res) {
	db.Mark.find({}, function (err, marks) {
		res.json(marks);
	});
});

//marks POST

app.post ('/api/marks', function (req, res) {
	
	var newMark = req.body;
	db.Mark.create(newMark, function (err, mark) {
		
		if(err) { console.log(err); }

		res.json(mark);
	});
});

//Sign Up POST

app.post ('/api/users', function (req, res) {
	
	var newUser = req.body;
	db.User.createSecure(newUser.username, newUser.email, newUser.password, function (err, user) {
	  res.json(user);
	});
});





















app.listen( process.env.PORT || 3000, function () {
  console.log("UP AND RUNNING");
});