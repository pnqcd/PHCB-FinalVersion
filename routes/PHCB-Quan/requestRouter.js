const express = require("express");
const router = express.Router();
const controller = require("../../controllers/PHCB-Quan/requestController");
const upload = require("../../middlewares/multer");


router.get("/", controller.isLoggedIn, controller.show);
router.post("/addrequest",upload.single('ImageUrl'), controller.addRequest);
router.put("/editrequest",upload.single('ImageUrl'), controller.editRequest);
router.delete("/deleterequest/:id", controller.deleteRequest);
router.post("/editads",upload.single('ImageUrl'), controller.requestEditAds);


// router.put("/request",controller.editRequest);
// router.delete("/request/:id", controller.deleteRequest);

module.exports = router;
