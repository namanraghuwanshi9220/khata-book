const express = require("express");
const router = express.Router();   
const { createHisaabController,  hisaabPageController, viewHisaabController,  viewIdHisaabController  } = require("../controllers/hisaab-controller");
const {
    isLoggedIn,
    redirectIfLoggedIn,
} = require("../middlewares/auth-middlewares");


router.get("/create", isLoggedIn , hisaabPageController);
router.get("/view/:id", isLoggedIn, viewHisaabController);
router.get("/:id", isLoggedIn, viewIdHisaabController);

router.post("/create", isLoggedIn , createHisaabController);


module.exports = router;