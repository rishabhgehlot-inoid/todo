const { createCompany } = require("../Controllers/CompanyController");
const { userVerification } = require("../Middlewares/AuthMiddleware");
const router = require("express").Router();
// router.post("/", userVerification);
router.post("/", createCompany);

module.exports = router;
