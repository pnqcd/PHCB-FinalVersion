const express = require("express");
const router = express.Router();
const controller=require("../../controllers/PHCB-Phuong/homepageController");

router.get("/", controller.isLoggedIn, controller.show);
router.get("/get-place", controller.getPlace);
router.get("/get-ad-details", controller.getAdDetails);

module.exports=router;