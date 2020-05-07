if (process.env.NODE_ENV !== 'production')
	{ 
		require('dotenv').config(); // hide the geocode api 
	}; 

var express = require('express'),
	request = require('request'),
	bodyParser = require('body-parser'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	methodOverride = require('method-override'),
	app = express(),
	flash = require('connect-flash'),
	mongoose = require("mongoose"),
	Campground = require("./models/campground"),
	Comment = require('./models/comment'),
	User = require('./models/user'),
	seedDB = require("./seeds")

//requiring routes
var commentRoutes = require('./routes/comments'),
	campgroundRoutes =  require('./routes/campgrounds'),
	indexRoutes = require('./routes/index')

var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp_v12";
mongoose.connect (url, 
{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false
	}).then(() => {
		console.log('Connected to DB!');
	}).catch(err => {
		console.log('ERROR:', err.message);
});

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'))
app.use(methodOverride('_method'));
app.use(flash());
// seedDB(); //seed the database

//PASSPORT CONFIGURATION
app.use(require('express-session')({
	secret: "No",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

var port = process.env.PORT || 3000
app.listen(port, ()=>{
	console.log('YelpCamp Server Has Started!');
	})
