const controller = {};
const models = require("../../models");
const cloudinary=require('../../middlewares/cloudinary');

controller.show = async (req, res) => {
    res.render("PHCB-Phuong/profile", {layout: "PHCB-Phuong/layout"});
};

controller.settingAccount = async (req, res) => {
    let {id, username, fullName, email, mobile, dob, publicImageId} = req.body;
    let result ={};
    try {
        if (req.file && req.file.path) {
            result = await cloudinary.uploader.upload(req.file.path, {
              folder: 'avatars'
            });
          }
          const updateData={username, fullName, email, mobile, dob};
          if (result.secure_url) {
            updateData.imagePath = result.secure_url;
            updateData.publicImageId = result.public_id;
          }
        await models.User.update(updateData,{where: {id}});
        if (publicImageId && result.secure_url) {
            await cloudinary.uploader.destroy(publicImageId);
          }
        res.send("Đã cập nhật thông tin!");
    } catch (error) {
        if (result.public_id) {
            await cloudinary.uploader.destroy(result.public_id);
          }
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