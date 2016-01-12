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

// dotenv needs to be uncommented during development!
// require('dotenv').load();
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
  cookie: { maxAge: 30 * 60 * 1000 } 
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
		if(err) { 
			console.log(err); 
		}

		if(req.session.user) {
			db.User.findOne({_id:req.session.userId}, function (err, user) {
				user.marks.push(mark);
				user.save();
			});
		}
		res.json(mark);
	});
});

//Sign Up POST

app.post ('/api/users', function (req, res) {
	
	var newUser = req.body;
	db.User.createSecure(newUser.username, newUser.email, newUser.password, function (err, user) {
	  	if(err) {
	  		console.log(err);
	  	} else if(user) {
	  	req.session.userId = user._id;
	  	req.session.user = user;
	  	res.json(user);
		}
	});
});


// Login POST

app.post('/login', function (req, res) {
  // call authenticate function to check if password user entered is correct
  db.User.authenticate(req.body.email, req.body.password, function (err, user) {
  	if(err) { 
  		res.json({ msg: err }); 
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
 	res.redirect('/');	
});

//Profile GET

app.get('/profile', function (req, res) {
	db.User.findOne({ _id: req.session.userId}) 
		.populate('marks')
		.exec( function (err, user) {
		if (err) { 
			console.log(err);
		}
		console.log(user);
		res.render('profile', {gMaps: gMaps, user: user});
	});
});

// Mark DELETE

app.delete('/profile/:_id', function (req, res) {
			console.log("HELLLLOOOOOOO",req.params._id);

	db.Mark.findOne({_id: req.params._id}, function (err, mark) {
		if(err) console.log(err);
		console.log("WOOOOOOO");
		console.log(mark);
		mark.remove();
		res.json("Mark has been deleted!");
	});

});



//PORT LISTENER
app.listen( process.env.PORT || 3000, function () {
  console.log("UP AND RUNNING");
});