const express = require("express");
const router = express.Router();
const controller=require("../../controllers/PHCB-Phuong/homepageController");

router.get("/", controller.isLoggedIn, controller.show);
router.get("/get-place", controller.getPlace);
router.get("/get-ad-details/:id", controller.getAdDetails);
router.get("/get-report", controller.getReport);

module.exports=router;