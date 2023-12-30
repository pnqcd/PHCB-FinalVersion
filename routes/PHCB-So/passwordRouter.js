const express = require("express");
const router = express.Router();
const controller = require("../../controllers/PHCB-So/passwordController");

router.get("/", controller.show);

module.exports=router;