const express = require("express");
const router = express.Router();
const controller = require("../../controllers/PHCB-So/statisticController");

router.get("/", controller.show);
router.get("/all-reports", controller.getAllReports);

module.exports = router;