const {
  Signup,
  Login,
  Logout,
  UpdateUser,
  getUser,
} = require("../Controllers/AuthController");
const { userVerification } = require("../Middlewares/AuthMiddleware");
const router = require("express").Router();
router.post("/", userVerification);
router.post("/signup", Signup);
router.post("/login", Login);
router.get("/logout", Logout);
router.put("/update", UpdateUser);
router.get("/user", getUser);

module.exports = router;
