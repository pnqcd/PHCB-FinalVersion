const express = require("express");
const router = express.Router();
const controller = require("../../controllers/PHCB-Quan/adsManageController");
const upload = require("../../middlewares/multer");


router.get("/",controller.isLoggedIn, controller.show);
router.post("/editads",upload.single('ImageUrl'), controller.requestEditAds);
router.put("/editadsrequest",upload.single('ImageUrl'), controller.continueRequestEditAds);

module.exports = router;
