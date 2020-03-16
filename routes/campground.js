const express 	 = require('express'),
	  Campground = require('../models/campground');
const middleware = require('../middleware');
const router = express.Router();

router.get("/", function(req, res){
	Campground.find({},function(err,campings){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campings: campings});
		}
	});
});

router.post("/", middleware.isLoggedIn, function(req, res){
	const newData = req.body.camping;
	const author = {id:req.user._id, username:req.user.username};
	const newCamp = { name: newData.name, image: newData.image, description: newData.description, author: author};
	Campground.create(newCamp, function(err, camp){
		if(err){
			console.log(err);
		} else {
			req.flash("success", "Camping agregado con exito!");
			res.redirect("/campings");
		}
	});
});

router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, camping){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/show", { camping: camping });
		}
	});
});

router.get("/:id/edit", middleware.checkCampOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCamping){
		if(err){
			res.redirect("back");
		} else {
			res.render("campgrounds/edit", {camping : foundCamping});
		}
	});
});

router.put("/:id", middleware.checkCampOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.camping, function(err, updatedCamp){
		if(err){
			res.redirect("/campings");
		} else {
			req.flash("success", "Camping modificado con exito!");
			res.redirect("/campings/" + req.params.id);
		}
	});
});

router.delete("/:id", middleware.checkCampOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campings");
		} else {
			req.flash("success", "Camping eliminado!");
			res.redirect("/campings");
		}
	});
});

module.exports = router;