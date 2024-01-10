const express = require("express");
const router = express.Router();
const controller = require("../../controllers/PHCB-Phuong/manageAdsController");
const upload = require("../../middlewares/multer");


router.get("/",controller.isLoggedIn, controller.show);
router.post("/editads",upload.single('ImageUrl'), controller.requestEditAds);

module.exports = router;