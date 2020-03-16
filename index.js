const express 		= require('express'),
 		app 		= express(),
 		bodyParser 	= require('body-parser'),
 		mongoose 	= require('mongoose'),
 		passport    = require("passport"),
    	LocalStrategy = require("passport-local"),
    	methodOverride = require('method-override'),
    	flash 		= require('connect-flash');
    	Campground  = require("./models/campground"),
 		Comment 	= require('./models/comment'),
 		User 		= require('./models/user'),
 		seedDB 		= require('./seed');

// Required routes
const indexRoutes 	= require('./routes/index'),
 	  campingRoutes = require('./routes/campground'),
 	  commentRoutes = require('./routes/comment');

mongoose.connect("mongodb://localhost:27017/campsite", {useNewUrlParser:true,  useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

//seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "ANSODANSIDONASIAINSDA",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use("/", indexRoutes);
app.use("/campings", campingRoutes);
app.use("/campings/:id/comments", commentRoutes);

app.listen(3000, function(){
	console.log("CampSite is running...");
});