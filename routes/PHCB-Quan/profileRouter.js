const express = require("express");
const router = express.Router();
const controller=require("../../controllers/PHCB-Quan/profileController");
const upload = require("../../middlewares/multer");

router.get("/", controller.isLoggedIn, controller.show);
router.put("/",upload.single('ImageUrl'), controller.settingAccount);

module.exports=router;