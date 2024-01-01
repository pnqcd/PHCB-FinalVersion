const express = require("express");
const router = express.Router();
const controller = require("../../controllers/PHCB-Phuong/reportsController");

router.get("/",controller.isLoggedIn, controller.show);
router.put("/handle-report", controller.handleReport);



module.exports = router;
