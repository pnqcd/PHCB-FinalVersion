const express = require("express");
const router = express.Router();
const controller=require("../../controllers/PHCB-Quan/adsAddressController");
const upload = require("../../middlewares/multer");

router.get("/", controller.isLoggedIn, controller.show);
router.post("/editplace",upload.single('ImageUrl'), controller.requestEditPlace);
router.put("/editplacerequest",upload.single('ImageUrl'), controller.continueEditRequest);


module.exports=router;