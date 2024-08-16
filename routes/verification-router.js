const express = require ("express");
const router = express.Router();

const {
    
    forgotController,
    forgotPageController,
    passwordResetController,
    passwordResetpostController,

 } = require("../controllers/verification-controller");


router.get ("/forgot-password", forgotController);
router.get ("/reset-password/:token", passwordResetController);

router.post ("/forgot-password", forgotPageController);
router.post ("/reset-password/:token", passwordResetpostController);

module.exports = router; 