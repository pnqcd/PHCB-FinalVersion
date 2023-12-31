const controller = {};
const models = require("../../models");
const bcrypt = require("bcrypt");

controller.show = (req, res)=>{
    res.render("PHCB-Quan/changePassword", {layout: "PHCB-Quan/layout"});
};

controller.checkCurrentPassword = async (req, res) => {
    const { id, password } = req.query;
    try {
        const user = await models.User.findOne({ where: { id } });
        // console.log(password, user.password);
        const isMatch = await bcrypt.compare(password, user.password);
        // console.log(isMatch);
        if (user && isMatch) {
            res.json({ exists: true });
        } else {
            res.json({ exists: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

controller.changePassword = async (req, res) => {
    let {id, oldPassword, newPassword} = req.body;

    const user = await models.User.findOne({ where: {id} });
    if (user && !bcrypt.compare(oldPassword, user.password)) {
        return res.json({ error: true, message: 'Mật khẩu hiện tại không đúng!' });
    }

    let hashedPassword = await bcrypt.hash(newPassword, 10);
    try {
        await models.User.update(
            {password: hashedPassword},
            {where: {id}}
        );
        res.send("Đã cập nhật mat khau!");
    } catch (error) {
    res.send("Không thể cập nhật mat khau!");
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

module.exports=controller;