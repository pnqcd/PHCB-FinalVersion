const controller={};

controller.show=(req,res)=>{
    res.render("PHCB-Phuong/changePassword", {layout: "PHCB-Quan/layout"});
};
controller.isLoggedIn = async (req, res, next) => {
    if (req.user) {
        res.locals.user = req.user;
        next();
    } else {
        res.redirect(`/login?reqUrl=${req.originalUrl}`);
    }
  }
module.exports=controller;