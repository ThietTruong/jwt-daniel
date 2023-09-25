const authController = require("../controllers/auth.controller");
const jwtServices = require("../heplers/jwt_services");

const router = require("express").Router();
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post(
  "/refresh-token",
  jwtServices.verifyRefreshToken,
  authController.refreshToken
);

module.exports = router;
