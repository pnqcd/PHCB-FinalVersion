const express = require('express')
const router = express.Router()
const controller = require('../controllers/authController')

router.get("/", controller.isLoggedIn, controller.showIndex);

router.get("/login", controller.showLogin);
router.get("/logout", controller.logout);

router.post("/login", controller.login);

module.exports = router