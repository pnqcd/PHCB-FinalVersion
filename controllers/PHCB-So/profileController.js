const controller = {};

controller.show = async (req, res) => {
    res.render("PHCB-So/profile", {layout: "PHCB-So/layout"});
};

// route middleware to ensure user is logged in 
controller.isLoggedIn = async (req, res, next) => {
    if (req.user) {
        res.locals.user = req.user;
        next();
    } else {
        res.redirect(`/login?reqUrl=${req.originalUrl}`);
    }
}

module.exports = controller;