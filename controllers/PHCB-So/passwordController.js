const controller = {};

controller.show = (req, res)=>{
    res.render("PHCB-So/changePassword", {layout: "PHCB-So/layout"});
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

module.exports=controller;