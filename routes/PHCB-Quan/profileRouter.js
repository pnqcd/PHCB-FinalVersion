const express = require("express");
const router = express.Router();
const controller=require("../../controllers/PHCB-Quan/profileController");

router.get("/", controller.isLoggedIn, controller.show);
router.put("/", controller.settingAccount);

module.exports=router;