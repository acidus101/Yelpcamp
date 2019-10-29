let express = require("express");
let router = express.Router();
let passport = require("passport");
let User = require("../models/user");
let middleware = require("../middleware");

// Root route
router.get("/", (req, res) => {
    
    res.render("landing");
});

// ==========================
// Auth routes
// ==========================

// SIGNUP page roue
router.get("/register", (req, res) => {

    res.render("register");
})

router.post("/register", (req, res) => {

    // handles register logic
    let newUser = new User({username: req.body.username});
    let password = req.body.password;

    User.register(newUser, password, (err, user) => {
        if(err) {
            req.flash("error", err.message);
            return res.redirect("register");
            // or use
            // res.render("register", {error: req.flash("error")});
        } else {
            passport.authenticate("local")(req, res, () =>{
                req.flash("success", "Welcome to yelpcamp " + user.username);
                res.redirect("/campgrounds");
            })
        }
    })
})


// LOGIN page route
router.get("/login", (req, res) => {

    res.render("login");
});

router.post("/login", passport.authenticate("local", 
{
    // handles the login logic
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) => {
    
});

// LOGOUT
router.get("/logout", (req, res)=> {

    req.logout();
    req.flash("success", "Logged you out.");
    res.redirect("/campgrounds");
});

module.exports = router;