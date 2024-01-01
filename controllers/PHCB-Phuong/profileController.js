const controller={};

controller.show=(req,res)=>{
    res.render("PHCB-Phuong/profile",{layout:"PHCB-Phuong/layout"});
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