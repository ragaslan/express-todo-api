const express = require("express");
const {register,login,showProfile,logout,imageUpload} = require("../controller/auth");
const {getAccessToRouter} = require("../middlewares/authorization/auth");
const profileImageUpload = require("../middlewares/libararies/profileImageUpload");
const router = express.Router();




router.post("/register",register);
router.post("/login",login);
router.get("/profile",getAccessToRouter,showProfile);
router.get("/logout",getAccessToRouter,logout);
router.post("/upload",[getAccessToRouter,profileImageUpload.single("profile_image")],imageUpload);

module.exports = router;