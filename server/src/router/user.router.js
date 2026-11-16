const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const { userRegister, userLogin, getUserProfile, userLogout } = require("../controllers/user.controller");

//register route
router.post("/register", userRegister);

//login route
router.post("/login", userLogin);

// Protected profile route
router.get("/profile", authMiddleware, getUserProfile);

//logout route
router.post("/logout", userLogout);

module.exports = router;