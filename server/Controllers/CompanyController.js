const Company = require("../Models/CompanyModel");
const jwt = require("jsonwebtoken");

exports.createCompany = async (req, res, next) => {
  const token = req.headers["token"];
  console.log("hello ");
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decoded.id;
    console.log(userId);
    const { name, place } = req.body;

    const company = new Company({ user: userId, name, place });
    await company.save();
    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
