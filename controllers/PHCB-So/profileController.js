const controller = {};

controller.show = async (req, res) => {
    res.render("PHCB-So/profile", {layout: "PHCB-So/layout"});
};

module.exports = controller;