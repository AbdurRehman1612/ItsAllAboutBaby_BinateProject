const express = require("express");
const router = express.Router();
const { upload } = require("../utils/utils");
const {
  signUp,
  signIn,
  verifyAccount,
  resendOTP,
  userProfile,
  profileUpdate,
  updatePassword,
  forgetPassword,
  newPassword,
  signOut,
  socialLogin,
  likes_dislikes,
  mydislikes,
} = require("../controller/userController");
const requireToken = require("../auth/auth");

router.post("/signup", upload.single("photo"), signUp);

router.post("/signin", signIn);

router.post("/verifyaccount", verifyAccount);

router.post("/resendotp", resendOTP);

router.post("/forgetpassword", forgetPassword);

router.post("/resetpassword", newPassword);

router.post("/signout", requireToken, signOut);

router.post("/sociallogin", socialLogin);

router.get("/profile", requireToken, userProfile);

router.post(
  "/profileupdate",
  upload.single("photo"),
  requireToken,
  profileUpdate
);

router.post("/changepassword", requireToken, updatePassword);

router.post("/api/priorities", likes_dislikes);

router.get("/api/mydislikes", requireToken, mydislikes);

module.exports = router;
