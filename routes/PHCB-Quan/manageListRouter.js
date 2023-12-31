const express = require("express");
const router = express.Router();
const controller = require("../../controllers/PHCB-Quan/manageListController");
const upload = require("../../middlewares/multer");


router.get("/", controller.isLoggedIn, controller.show);
// router.post("/wards", controller.addWard);
// router.put("/", controller.editWard);
// router.delete("/:id", controller.deleteWard);

router.post("/editplace",upload.single('ImageUrl'), controller.requestEditPlace);
router.post("/editads",upload.single('ImageUrl'), controller.requestEditAds);
router.put("/handle-report", controller.handleReport);



// router.post("/addrequest", controller.addRequest);
router.put("/editrequest",upload.single('ImageUrl'), controller.editRequest);
// router.delete("/deleterequest/:id", controller.deleteRequest);

module.exports = router;
