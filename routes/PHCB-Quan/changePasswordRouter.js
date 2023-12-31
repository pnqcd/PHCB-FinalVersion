const express = require("express");
const router = express.Router();
const controller=require("../../controllers/PHCB-Quan/changePasswordController");

router.get("/", controller.isLoggedIn, controller.show);
router.get("/checkCurrentPassword", controller.checkCurrentPassword);
router.put("/", controller.changePassword);

module.exports=router;