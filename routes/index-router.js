const express = require ("express");
const router = express.Router();
const { 
    landingPageController,
     registerController,
     registerPageController,
     loginController,
     logoutController,
     profileController,
     passcodeController,
     verificationController,
     signupSuccessController,
     } = require("../controllers/index-controller");

const {isLoggedIn,  redirectIfLoggedIn} = require("../middlewares/auth-middlewares");

router.get ("/", redirectIfLoggedIn, landingPageController);
router.get ("/register", registerPageController);
router.get ("/logout", logoutController);
router.get ("/profile", isLoggedIn, profileController);
router.get ("/verification/:token", verificationController);
router.get ("/signup-success", signupSuccessController);

router.post ("/passcode", isLoggedIn, passcodeController);
router.post ("/register", registerController);
router.post ("/login", loginController);



module.exports = router; 