const express = require('express')
const router = express.Router()
const controller = require('../controllers/authController')

router.get("/", controller.isLoggedIn, controller.showIndex);

router.get("/login", controller.showLogin);

router.get("/forget-password", controller.showForgetPassword);
router.post("/forgetPassword", controller.forgetPassword );

router.get("/verify-otp", controller.showVerifyOTP);
router.post("/verifyOTP", controller.verifyOTP);

router.get("/reset-password", controller.showResetPassword);
router.put("/reset-password", controller.resetPassword);

router.get("/logout", controller.logout);

router.post("/login", controller.login);

module.exports = router