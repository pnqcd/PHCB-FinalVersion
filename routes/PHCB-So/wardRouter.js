const express = require("express");
const router = express.Router();
const controller = require("../../controllers/PHCB-So/wardController");
const upload = require("../../middlewares/multer");

router.get("/", controller.isLoggedIn, controller.show);

router.post("/wards",upload.single('ImageUrl'), controller.addWard);
router.put("/wards",upload.single('ImageUrl'), controller.editWard);
router.delete("/wards/:id", controller.deleteWard);

router.post("/places",upload.single('ImageUrl'), controller.addPlace);
router.put("/places",upload.single('ImageUrl'), controller.editPlace);
router.delete("/places/:id", controller.deletePlace);

router.post("/ads", controller.addAds);
router.put("/ads", controller.editAds);
router.delete("/ads/:id", controller.deleteAds);

router.post("/adstype", controller.addAdstype);
router.put("/adstype", controller.editAdstype);
router.delete("/adstype/:id", controller.deleteAdstype);

router.post("/reporttype", controller.addReporttype);
router.put("/reporttype", controller.editReporttype);
router.delete("/reporttype/:id", controller.deleteReporttype);

module.exports = router;
