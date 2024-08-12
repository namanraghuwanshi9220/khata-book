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
     
     } = require("../controllers/index-controller");

const {isLoggedIn,  redirectIfLoggedIn} = require("../middlewares/auth-middlewares");

router.get ("/", redirectIfLoggedIn, landingPageController);
router.get ("/register", registerPageController);
router.get ("/logout", logoutController);
router.get ("/profile", isLoggedIn, profileController);
router.post ("/passcode", isLoggedIn, passcodeController);

router.post ("/register", registerController);
router.post ("/login", loginController);



module.exports = router; 