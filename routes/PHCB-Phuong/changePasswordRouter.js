const express = require("express");
const router = express.Router();
const controller=require("../../controllers/PHCB-Phuong/changePasswordController");

router.get("/",controller.isLoggedIn,controller.show);

module.exports=router;