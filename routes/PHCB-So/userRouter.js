const express = require("express");
const router = express.Router();
const controller = require("../../controllers/PHCB-So/userController");

router.get("/", controller.isLoggedIn, controller.show);
router.post("/", controller.addUser);
// router.put("/", controller.editUser);
router.delete("/:id", controller.deleteUser);
router.get("/checkUsernameWhenAddAccount", controller.checkUsername);
router.get("/wardsByDistrict", controller.wardsByDistrict);

module.exports = router;
