var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware'); //index.js is always required automatically when we require the directory, containing it

var nodeGeocoder = require ('node-geocoder');

var options = {
	provider: process.env.GEOCODER_PROVIDER,
	httpAdapter: 'https',
	apiKey: process.env.GEOCODER_API_KEY,
	formatter: null
}

var geocoder = nodeGeocoder(options);

//INDEX - show all
router.get('/', (req, res)=>{
	 Campground.find({}, (err, allCampgrounds) => {
		 if(err) {
			 console.log(err);
		 } else {
			 res.render('campgrounds/index', {campgrounds: allCampgrounds}); //name: data
		 }
	 });
});

//CREATE - add new campground to DB
router.post('/', middleware.isLoggedIn, (req, res) =>{
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description; //name attribute was set to
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	geocoder.geocode(req.body.location, function(err, data) {
		if (err || !data.length){
			req.flash('error', 'Invalid address');
			return res.redirect('back');
		}
		var lat = data[0].latitude;
		var lng = data[0].longitude;
		var location = data[0].formattedAddress;
		var newCampground = {name: name, image: image, description: desc, author: author, location: location, lat: lat, lng: lng};
		Campground.create(newCampground, (err, newlyCreated) => {
			if (err) {
				console.log(err);
			} else {
				console.log(newlyCreated);
				res.redirect('/campgrounds');
			}
		});
	});
		// .then(function(res) {
		// 	// res is the http response, including: status, headers and entity properties
		// 	var data = res.entity; // data is the geocoding result as parsed JSON
		//   })
		//   .catch(function(err) {
		// 	// handle errors
		//   });

	//campgrounds.push(ne wCampground);
})

//NEW - show the form
router.get('/new', middleware.isLoggedIn, (req, res)=>{
	res.render('campgrounds/new');
})

//SHOW - shows more info about one campground 
router.get('/:id', (req, res) =>{
	Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

//EDIT CAMPGROUND ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err,foundCampground){
		if (err){
			req.flash('error', 'Campground is not found');
			res.redirect('/campgrounds/' + req.params.id);
		}
		res.render('campgrounds/edit', {campground: foundCampground});
	});
});

//UPDATE CAMPGROUND ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
	geocoder.geocode(req.body.location, function(err, data) {
		if (err || !data.length){
			req.flash('error', 'Invalid address');
			return res.redirect('back');
		}
		req.body.campground.lat = data[0].latitude;
		req.body.campground.lng = data[0].longitude;
		req.body.campground.location = data[0].formattedAddress;
		
		Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
			if(err){
				req.flash('error', err.message);
				res.redirect('back');
			} else {
				req.flash('success', 'Successfully Updated!');
				res.redirect('/campgrounds/' + req.params.id);
			}
		})
	})
})

//DESTROY CAMPGROUND ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res)=>{
	Campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved)=>{
		if(err){
			console.log(err);
		} else {
			Comment.deleteMany( {_id: { $in: campgroundRemoved.comments} }, (err)=>{
				if (err) {
					console.log(err);
				} else {
					res.redirect('/campgrounds');
				};
			});
		};
	});
});

module.exports = router; 