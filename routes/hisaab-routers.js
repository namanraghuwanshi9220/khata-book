const express = require("express");
const router = express.Router();   
const { createHisaabController,  
    hisaabPageController, 
    viewHisaabController, 
     viewIdHisaabController,
    deleteHisaabController,
    editHisaabController,
    editHisaabPostController,
    verifyController,
 } = require("../controllers/hisaab-controller");
const {
    isLoggedIn,
} = require("../middlewares/auth-middlewares");


router.get("/create", isLoggedIn , hisaabPageController);
router.get("/view/:id", isLoggedIn, viewHisaabController);
router.get("/:id", isLoggedIn, viewIdHisaabController);
router.get("/delete/:id", isLoggedIn, deleteHisaabController);
router.get("/edit/:id", isLoggedIn, editHisaabController);
router.post("/verify/:id", isLoggedIn, verifyController);

router.post("/create", isLoggedIn , createHisaabController);
router.post("/edit/:id", isLoggedIn, editHisaabPostController);


module.exports = router;