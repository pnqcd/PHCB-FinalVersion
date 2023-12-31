const express = require("express");
const router = express.Router();
const controller = require("../../controllers/PHCB-Quan/reportController");

router.get("/", controller.isLoggedIn, controller.show);
router.put("/handle-report", controller.handleReport);

// router.post("/wards", controller.addWard);
// router.put("/", controller.editWard);
// router.delete("/:id", controller.deleteWard);

module.exports = router;
