const controller = {};
const models = require("../../models");

controller.show = async (req, res) => {
    res.render("PHCB-Quan/profile", {layout: "PHCB-Quan/layout"});
};

controller.settingAccount = async (req, res) => {
    let {id, username, fullName, email, mobile, dob} = req.body;
    try {
        await models.User.update(
            {username, fullName, email, mobile, dob},
            {where: {id}}
        );
        res.send("Đã cập nhật thông tin!");
    } catch (error) {
    res.send("Không thể cập nhật thông tin!");
    console.error(error);
    }
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

module.exports = controller;