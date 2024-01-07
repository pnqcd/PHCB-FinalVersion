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
    // console.log(req.query.reqUrl);
    let reqUrl = req.query.reqUrl ? req.query.reqUrl : "/";

    if (req.user) {
        return res.redirect(reqUrl);
    }

    res.render("login", {
        layout: "auth",
        reqUrl, 
    });
}

controller.showForgetPassword = (req, res) => {
    let reqUrl = req.query.reqUrl ? req.query.reqUrl : "/";

    if (req.user) {
        return res.redirect(reqUrl);
    }

    res.render("forgetPassword", {
        layout: "auth",
        reqUrl, 
    });
}

controller.login = (req, res, next) => { 
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.render("login", {
            layout: "auth",
            message: "Username hoặc mật khẩu không chính xác"
        });

        let reqUrl = req.query.reqUrl ? req.query.reqUrl : "/";
        req.login(user, (err) => {
            if (err) return next(err);
            
            return res.redirect(reqUrl);
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
        res.locals.user = req.user;
        next();
    } else {
        res.redirect(`/login?reqUrl=${req.originalUrl}`);
    }
}

module.exports = controller