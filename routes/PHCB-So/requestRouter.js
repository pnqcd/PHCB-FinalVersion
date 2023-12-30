const express = require("express");
const router = express.Router();
const controller = require("../../controllers/PHCB-So/requestController");

router.get("/", controller.isLoggedIn, controller.show);

router.put("/request-edit-ads", controller.requestEditAds);
router.get("/showOriginAdsDetail", controller.showOriginAdsDetail);

router.put("/request-edit-place", controller.requestEditPlace);
router.get("/showOriginPlaceDetail", controller.showOriginPlaceDetail);

router.post("/approve-ads", controller.approveAds);
router.put("/not-approve-ads", controller.notApproveAds);


module.exports = router;
