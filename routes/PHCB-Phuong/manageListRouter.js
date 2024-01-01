const express = require("express");
const router = express.Router();
const controller=require("../../controllers/PHCB-Phuong/manageListController");
const upload = require("../../middlewares/multer");


router.get("/",controller.isLoggedIn,controller.show);
router.post("/editplace",upload.single('ImageUrl'), controller.requestEditPlace);
router.post("/editads",upload.single('ImageUrl'), controller.requestEditAds);
module.exports=router;