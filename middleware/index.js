const Comment    = require('../models/comment'),
	  Campground = require('../models/campground');
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Debes iniciar sesion");
	res.redirect("/login");
}

middlewareObj.checkCommmentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				req.flash("error", "Hubo algun error en la aplicacion");
				res.redirect("back");
			} else {
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "No estas habilitado para realizar esta operacion");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "Debes iniciar sesion");
		res.redirect("back");
	}
}

middlewareObj.checkCampOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCamping){
			if(err){
				res.redirect("back");
			} else {
				if(foundCamping.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "No estas habilitado para realizar esta operacion");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "Debes iniciar sesion");
		res.redirect("back");
	}
}

module.exports = middlewareObj;