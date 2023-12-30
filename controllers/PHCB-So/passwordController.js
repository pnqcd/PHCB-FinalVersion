const controller = {};

controller.show = (req, res)=>{
    res.render("PHCB-So/changePassword", {layout: "PHCB-So/layout"});
};

module.exports=controller;