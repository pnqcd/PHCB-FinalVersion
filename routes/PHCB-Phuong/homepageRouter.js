const express = require("express");
const router = express.Router();
const controller=require("../../controllers/PHCB-Phuong/homepageController");

router.get("/", controller.isLoggedIn, controller.show);
router.get("/get-place", controller.getPlace);

module.exports=router;