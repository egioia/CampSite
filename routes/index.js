const express  = require('express'),
      passport = require('passport');
	  User     = require('../models/user');

const router = express.Router();

router.get("/", function(req, res){
	res.render("home");
});

router.get("/register", function(req, res){
	res.render("register");
});

router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", "Error al registrarte");
			res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Te has registrado con exito!");
			res.redirect("/campings");
		})
	});
});

router.get("/login", function(req, res){
	res.render("login");
});

router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/campings",
		failureRedirect: "/login"
	}), function(req, res){});

router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Has cerrado sesion con exito!");
	res.redirect("/login");
});

module.exports = router;