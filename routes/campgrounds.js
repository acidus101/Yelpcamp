let express = require("express");
let router = express.Router();
let Campground = require("../models/campground");
let Comment = require("../models/comment");
let middleware = require("../middleware");

// INDEX - list all the items in the database
router.get("/", (req, res) => {
    // get all campgrounds from database
    Campground.find({}, (err, campgrounds) => {
        
        if(err){
            console.log(err);
        }else {
            res.render("campgrounds/index", {campgrounds: campgrounds});
        }
    })
});

// CREATE- create a new item in the database
router.post("/", middleware.isLoggedIn,   (req, res) => {

    // get data from form
    let name = req.body.name;
    let price = req.body.price;
    let image = req.body.image;
    let desc = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newCampground = {name: name, price: price, image: image, description: desc, author:author};
    
    Campground.create(newCampground, (err, newcampground) => {
        if(err){
            console.log(err);
        }else{
            // redirect to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

// NEW - shows form to create a new campground
router.get("/new", middleware.isLoggedIn,   (req, res) => {

    res.render("campgrounds/new");
});

 
// SHOW - shows particular information about a campground
router.get("/:id", (req, res) => {

    //  find the campgrounds with provide id
    Campground.findById(req.params.id).populate("comments").exec((err, foundcampground) => {
        if(err){
            console.log(err);
        }else {
            // show the page of element with id
            res.render("campgrounds/show", {campground: foundcampground});
        }
    });
});

// EDIT route
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundcampground) => {
        res.render("campgrounds/edit", {campground: foundcampground});
    })
});

// UPDATE route
router.put("/:id" , middleware.checkCampgroundOwnership,  (req, res) => {
    // find and update the correct campground
    // console.log(req);
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedcampground) => {
        if(err) {
            console.log(err);
            req.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    } ); 
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id" , middleware.checkCampgroundOwnership,  (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved) => {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.deleteMany({_id: { $in: campgroundRemoved.comments}}, (err) => {
                if(err){
                    console.log(err);
                }else {
                    res.redirect("/campgrounds"); 
                }
            });
        }
    });
});

module.exports = router;