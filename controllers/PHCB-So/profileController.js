const controller = {};

controller.show = async (req, res) => {
    res.render("profile");
};

module.exports = controller;