const express = require ("express");
const router = express.Router();
const { 
    landingPageController,
     registerController,
     postRegisterController
     } = require("../controllers/index-controller");

router.get ("/", landingPageController);
router.get ("/register", registerController);
router.post ("/register", postRegisterController);


module.exports = router; 