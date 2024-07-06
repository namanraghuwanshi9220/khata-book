const express = require ("express");
const router = express.Router();
const { landingPageController } = require ("../controllers/index-controller")

router.get ("/",  landingPageController );

module.exports = router; 