const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuthMiddleware");
const { userAccess } = require("../service/userAccessService");
const {
  register,
  registerOTP,
  resentOtp,
  loginUser,
  forgotPasswordEmail,
  forgotPassword,
  getUser,
  userSearch,
  loginAuth,
 
  addCoverImage,
  addProfileImg,
  allUsers,
  addFollow,
  removeFollowers,
  updateUser,
  userProfile,
  working,
  checkOldPassword,
  editPassword,
} = require("../controllers/userController");

router.get("/working", working);
router.get("/userAccessCheck", userAccess);
router.post("/login", loginUser);
router.post("/email/forgotPassword", forgotPasswordEmail);
router.patch("/password/forgotPassword", forgotPassword);
router.post("/register", register);
router.post("/register/otp", registerOTP);
router.post("/otp/resent", resentOtp);
router.get("/loginAuth", userAuth, loginAuth);
router.get("/userSearch/:data", userSearch);
router.post("/addCoverImg", userAuth, addCoverImage);
router.post("/addProfileImg", userAuth, addProfileImg);
router.get("/", userAuth, getUser);
router.get("/users", userAuth, allUsers);
router.post("/addFollow", userAuth, addFollow);
router.post("/follwers/remove", userAuth, removeFollowers);
router.put("/user/update", updateUser);
router.get("/user/profile/:id", userProfile);
router.patch("/oldPassword/:id", checkOldPassword);
router.patch("/password/editPassword/:id", editPassword);

module.exports = router;
