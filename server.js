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



app.use(cookieParser());

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ 
    extended: true
}));

app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: 'SuperSecretCookie',
  cookie: { maxAge: 3 * 60 * 1000 } 
}));



//ROUTES

//main page GET

app.get('/current_user', function (req, res) {
	res.json({user: req.session.user});
});

app.get ('/', function (req, res) {

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
	  req.session.userId = user._id;
	  req.session.user = user;
	  res.json(user);
	});
});


// Login POST

app.post('/login', function (req, res) {
  // call authenticate function to check if password user entered is correct
  db.User.authenticate(req.body.email, req.body.password, function (err, user) {
  	if(err) { 
  		console.log(err); 
  	} else if(user) {
  	req.session.userId = user._id;
  	req.session.user = user;
    res.json(user);
	} else {
		console.log("WHAT THE HELL?");
	}
  });
});

//Logout GET

app.get('/logout', function (req, res) {
  // remove the session user id
 	req.session.userId = null;
 	req.session.user = null;
 	res.render('index', {gMaps: gMaps});	
});




//PORT LISTENER
app.listen( process.env.PORT || 3000, function () {
  console.log("UP AND RUNNING");
});