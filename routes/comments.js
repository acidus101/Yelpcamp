let express = require("express");
let router = express.Router({mergeParams: true});
let Campground = require("../models/campground");
let Comment = require("../models/comment");
let middleware = require("../middleware");

// NEW route
router.get("/new", middleware.isLoggedIn, (req, res) => {

    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    })
});

//  CREATE route
router.post("/", middleware.isLoggedIn,  (req, res) => {

    // loockup campgrounds using ID
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
           console.log(err);
           res.redirect("/campgrounds"); 
        } else {
            // create new comment
            Comment.create(req.body.comments, (err, comment) => {
                if(err){
                    req.flash("error", "Something went wrong.");
                    console.log(err);
                }else {
                    // add username and id to the comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save the comment
                    comment.save();
                   campground.comments.push(comment);
                   campground.save();
                   req.flash("success", "successfully added comment.");
                   res.redirect("/campgrounds/" + campground._id); 
                }
            });
        }
    });
});

// EDIT COMMENTS
router.get("/:comment_id/edit", middleware.checkCommentOwnership,  (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundcomment) => {
       if(err){
           res.redirect("back");
       } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundcomment});
       }
    })
});

// UPDATE COMMENTS
router.put("/:comment_id", middleware.checkCommentOwnership,  (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comments, (err) => {
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment updated.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})
// COMMENTS  DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership,  (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

module.exports = router;