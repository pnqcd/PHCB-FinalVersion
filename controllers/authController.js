const controller = {}
const passport = require('passport');
const pool = require("../database/database");

controller.showIndex = (req, res) => {
    let navUrl;
    if (req.user.isWard) navUrl = "/PHCB-Phuong";
    else if (req.user.isDistrict) navUrl = "/PHCB-Quan";
    else navUrl = "/PHCB-So";

    res.redirect(navUrl);
}

controller.showLogin = (req, res) => {
    let reqUrl = req.query.reqUrl ? req.query.reqUrl : "/";

    if (req.user) {
        return res.redirect(reqUrl);
    }

    res.render("login", {
        layout: "auth",
        reqUrl, 
    });
}

controller.login = (req, res, next) => { 
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.redirect("/login");

        req.login(user, (err) => {
            if (err) return next(err);

            return res.redirect("/");
            // if (user.isWard) {
            //     return res.redirect("/PHCB-Phuong");
            // }
            // else if (user.isDistrict) {
            //     return res.redirect("/PHCB-Quan");
            // }
            // else return res.redirect("/PHCB-So");
        });
    }) (req, res, next);
}

controller.logout = (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
}

// route middleware to ensure user is logged in 
controller.isLoggedIn = async (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect(`/login?reqUrl=${req.originalUrl}`);
    }
}

module.exports = controller