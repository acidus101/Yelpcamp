let Campground = require("../models/campground");
let Comment = require("../models/comment");

// al the middleware goes here
let midldewareObj = {};

midldewareObj.checkCampgroundOwnership = (req, res, next) => {

    // is logged in
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundcampground) => {
            if(err) {
                req.flash("error", "Campground not found.");
                res.redirect("back");
            } else {
                // this checks if the campground exists and if it does not throw an error and send us back
                if(!foundcampground) {
                    req.flash("error", "Campground not found");
                    return res.redirect("back");
                }
                // does user own the campground post?
                if(foundcampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        })
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
}

midldewareObj.checkCommentOwnership = (req, res, next) => {

    // is logged in
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundcomment) => {
            if(err) {
                res.redirect("back");
            } else {
                // this checks if the campground exists and if it does not throw an error and send us back
                if(!foundcomment) {
                    req.flash("error", "Comment not found");
                    return res.redirect("back");
                }
                // does user own the comment post?
                if(foundcomment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permisssion to do that");
                    res.redirect("back");
                }
            }
        })
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
}

midldewareObj.isLoggedIn = (req, res, next) => {
    
    if(req.isAuthenticated()){
        return next();
    }else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("/login");
    }
}

module.exports = midldewareObj;