const express = require("express");
const router = express.Router();   

const {
    isLoggedIn,
    redirectIfLoggedIn,
} = require("../middlewares/auth-middlewares");
const { landingPageController } = require("../controllers/index-controller");

router.get("/create", redirectIfLoggedIn , landingPageController);

module.exports = router;