const express = require("express");
const router = express.Router();
const controller = require("../../controllers/PHCB-Quan/showmapController");


router.get("/",controller.isLoggedIn, controller.show);
router.get("/get-place", controller.getPlace);
router.get("/get-ad-details/:id", controller.getAdDetails);


module.exports = router;
