 const userController = require("../controllers/user.controller");
 const jwtServices = require("../heplers/jwt_services");

const router = require("express").Router();

router.get("/", jwtServices.verifyToken, userController.getAllUsers);
router.delete("/:id", jwtServices.verifyTokenWithAdmin, userController.deleteUser);

module.exports = router;
