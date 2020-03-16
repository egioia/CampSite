const express 		= require('express'),
	  Comment 		= require('../models/comment'),
	  Campground 	= require('../models/campground');
const middleware = require('../middleware');
const router = express.Router({mergeParams: true});

router.get("/new", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, camping){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {camping:camping});
		}
	});
});

router.post("/", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function (err, camping){
		if(err){
			console.log(err);
		} else{
			Comment.create(req.body.comment, function(err, comment){
	           if(err){
	               console.log(err);
	           } else {
	           	   comment.author.id = req.user._id;
 				   comment.author.username = req.user.username;
 				   comment.save();
	               camping.comments.push(comment);
	               camping.save();
	               req.flash("success", "Comentario creado!");
	               res.redirect('/campings/' + camping._id);
	           }
	        });
		}
	});
});

router.get("/:comment_id/edit", middleware.checkCommmentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		res.render("comments/edit", {comment: foundComment, camping_id: req.params.id});
	});
});

router.put("/:comment_id", middleware.checkCommmentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else {
			req.flash("success", "Comentario modificado!");
			res.redirect("/campings/" + req.params.id);
		}
	});
});

router.delete("/:comment_id", middleware.checkCommmentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			req.flash("success", "Comentario eliminado!");
			res.redirect("/campings/" + req.params.id);
		}
	});
});

module.exports = router;